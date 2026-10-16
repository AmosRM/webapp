import { createHash, timingSafeEqual } from "node:crypto";

// Stores Heather's review of the Mahjong practice puzzles (public/mahjong-review). One Redis hash holds
// one field per puzzle or question, each a JSON mark. The page sends the key from its link in the
// x-review-key header; only the key's SHA-256 is kept here, so this file can be public.
const KEY_SHA256 = "26f97d7d06cc8241c1633dbe891effb56e34e113161707b1eac6773c30b78dfd";
const HASH = "mahjong-review:heather";

// Set by the Upstash for Redis integration on Vercel, under either naming.
const REDIS_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export const dynamic = "force-dynamic";

type Mark = { verdict: "agree" | "disagree" | null; note: string; answer: string; at: string };

function authorized(request: Request) {
  const key = request.headers.get("x-review-key") ?? "";
  const given = createHash("sha256").update(key).digest();
  return timingSafeEqual(given, Buffer.from(KEY_SHA256, "hex"));
}

async function redis(command: (string | number)[]) {
  const response = await fetch(REDIS_URL!, {
    method: "POST",
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Redis ${response.status}`);
  return (await response.json()).result;
}

function refuse(status: number, error: string) {
  return Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

function parseMark(body: unknown): { id: string; mark: Mark } | null {
  if (!body || typeof body !== "object") return null;
  const { id, verdict, note, answer, at } = body as Record<string, unknown>;
  if (typeof id !== "string" || !/^(?:[dw]\d{3}|q\d)$/.test(id)) return null;
  if (verdict !== null && verdict !== "agree" && verdict !== "disagree") return null;
  if (typeof note !== "string" || note.length > 4000) return null;
  if (typeof answer !== "string" || answer.length > 400) return null;
  if (typeof at !== "string" || Number.isNaN(Date.parse(at))) return null;
  return { id, mark: { verdict, note, answer, at } };
}

export async function GET(request: Request) {
  if (!authorized(request)) return refuse(401, "bad-key");
  if (!REDIS_URL || !REDIS_TOKEN) return refuse(503, "storage-not-configured");
  const flat: string[] = (await redis(["HGETALL", HASH])) ?? [];
  const entries: Record<string, Mark> = {};
  for (let i = 0; i < flat.length; i += 2) entries[flat[i]] = JSON.parse(flat[i + 1]);
  return Response.json({ entries }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: Request) {
  if (!authorized(request)) return refuse(401, "bad-key");
  if (!REDIS_URL || !REDIS_TOKEN) return refuse(503, "storage-not-configured");
  const parsed = parseMark(await request.json().catch(() => null));
  if (!parsed) return refuse(400, "bad-mark");
  await redis(["HSET", HASH, parsed.id, JSON.stringify(parsed.mark)]);
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
