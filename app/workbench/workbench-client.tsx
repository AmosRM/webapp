"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText, Layers3 } from "lucide-react";
import type { WorkbenchItem, WorkbenchKind } from "./items";

type FilterKey = "all" | WorkbenchKind;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Everything" },
  { key: "tools", label: "Tools" },
  { key: "presentations", label: "Presentations" },
  { key: "mobile", label: "Mobile" },
  { key: "vibe-code", label: "Vibe Code" },
];

const palette = {
  bg: "#fbf6ec",
  fg: "#1a1610",
  muted: "#857a66",
  subtle: "#4a4337",
  cardBg: "#fffdf8",
  hairline: "rgba(60,40,15,0.08)",
  cardShadow:
    "0 1px 2px rgba(80,55,15,0.05), 0 18px 50px rgba(120,80,20,0.07)",
  cardShadowHover:
    "0 1px 2px rgba(80,55,15,0.06), 0 28px 70px rgba(120,80,20,0.12)",
  wash:
    "radial-gradient(1100px 720px at 12% -10%, rgba(255,210,160,0.55), transparent 60%), radial-gradient(800px 520px at 92% -5%, rgba(255,225,185,0.45), transparent 65%)",
};

const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "long", year: "numeric" });

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });

export function WorkbenchClient({ items }: { items: WorkbenchItem[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((it) => it.kind === filter)),
    [items, filter],
  );

  return (
    <main
      className="min-h-screen"
      style={{
        background: palette.bg,
        color: palette.fg,
        fontFamily:
          "var(--font-sans), 'Inter', -apple-system, system-ui, sans-serif",
        letterSpacing: "-0.005em",
      }}
    >
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(60,40,15,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(60,40,15,0.06) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-48"
          style={{
            background: `linear-gradient(to bottom, ${palette.bg}, transparent)`,
          }}
        />
      </div>

      <div className="relative" style={{ background: palette.wash, minHeight: "100%" }}>
        <section className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-12 pt-20 pb-10 sm:pt-[120px] sm:pb-14">
          <div
            className="mb-9 flex items-center gap-4 text-[11px] font-medium uppercase"
            style={{
              color: palette.muted,
              letterSpacing: "0.2em",
            }}
          >
            <div
              className="h-px w-7"
              style={{ background: palette.muted, opacity: 0.5 }}
            />
            Workbench
            <span style={{ opacity: 0.5 }}>·</span>
            <span
              className="font-mono"
              style={{ letterSpacing: "0.1em" }}
            >
              {String(items.length).padStart(2, "0")} entries
            </span>
          </div>

          <h1
            className="m-0"
            style={{
              fontSize: "clamp(64px, 10vw, 104px)",
              lineHeight: 0.92,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              textWrap: "balance",
            }}
          >
            Things I&rsquo;ve made.
          </h1>
        </section>

        <section
          className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-5 sm:px-8 lg:px-12 pt-3 pb-6"
          style={{ borderBottom: `1px solid ${palette.hairline}` }}
        >
          <div className="flex flex-wrap gap-1 text-[13px]" role="tablist" aria-label="Workbench sections">
            {FILTERS.map(({ key, label }) => {
              const active = filter === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  role="tab"
                  aria-selected={active}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border-0 px-4 py-2 text-[13px] font-medium"
                  style={{
                    background: active ? palette.fg : "transparent",
                    color: active ? palette.bg : palette.subtle,
                    fontFamily: "inherit",
                    transition: "background 160ms, color 160ms",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div
            className="font-mono text-[11px] uppercase"
            style={{
              color: palette.muted,
              letterSpacing: "0.08em",
            }}
          >
            Showing {filtered.length}
          </div>
        </section>

        <section className="mx-auto grid max-w-[1180px] grid-cols-1 gap-5 px-5 pt-9 pb-20 sm:grid-cols-2 sm:gap-6 sm:px-8 lg:grid-cols-3 lg:gap-7 lg:px-12">
          {filtered.map((it) => (
            <PromptCard key={it.href} item={it} />
          ))}
        </section>

        <footer
          className="mx-auto flex max-w-[1180px] items-center justify-between px-5 sm:px-8 lg:px-12 pt-6 pb-14 font-mono text-[11px] uppercase"
          style={{
            color: palette.muted,
            letterSpacing: "0.08em",
            borderTop: `1px solid ${palette.hairline}`,
          }}
        >
          <span>
            {items.length} items · updated {longDate(items[0].date)}
          </span>
          <span>lumino.ai / workbench</span>
        </footer>
      </div>
    </main>
  );
}

function PromptCard({
  item,
}: {
  item: WorkbenchItem;
}) {
  const [hover, setHover] = useState(false);
  const isExternal = item.href.startsWith("http");

  return (
    <Link
      href={item.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative flex flex-col no-underline"
      style={{
        background: palette.cardBg,
        borderRadius: 20,
        padding: 14,
        color: "inherit",
        boxShadow: hover ? palette.cardShadowHover : palette.cardShadow,
        gap: 14,
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        transition:
          "transform 240ms cubic-bezier(.2,.7,.2,1), box-shadow 240ms",
        border: `1px solid ${palette.hairline}`,
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "4 / 3",
          borderRadius: 12,
          background: kindBg(item.kind),
        }}
      >
        <Preview item={item} />
      </div>

      <div className="flex flex-col" style={{ padding: "6px 8px 10px" }}>
        <div
          className="flex items-start justify-between gap-3"
          style={{ marginBottom: 8 }}
        >
          <h3
            className="m-0"
            style={{
              fontSize: 19,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              textWrap: "balance",
            }}
          >
            {item.title}
          </h3>
          <div
            className="grid shrink-0 place-items-center"
            style={{
              width: 22,
              height: 22,
              color: hover ? palette.fg : palette.muted,
              transform: hover ? "translate(2px, -2px)" : "none",
              transition: "transform 240ms, color 160ms",
            }}
          >
            <ArrowUpRight size={14} strokeWidth={1.6} />
          </div>
        </div>

        <p
          className="m-0 overflow-hidden"
          style={{
            fontSize: 13.5,
            lineHeight: 1.55,
            color: palette.subtle,
            margin: "0 0 14px",
            textWrap: "pretty",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {item.description}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span
            className="font-mono text-[10px] font-medium uppercase"
            style={{
              color: "rgba(20,30,50,0.55)",
              letterSpacing: "0.1em",
            }}
          >
            {kindLabel(item.kind)}
          </span>

          <span
            className="font-mono text-[10px] uppercase"
            style={{
              color: palette.muted,
              letterSpacing: "0.08em",
            }}
          >
            {shortDate(item.date)}
          </span>
        </div>
      </div>
    </Link>
  );
}

function kindBg(kind: WorkbenchKind) {
  switch (kind) {
    case "tools":
      return "linear-gradient(135deg, #fad6b8 0%, #efb78d 100%)";
    case "presentations":
      return "linear-gradient(135deg, #f3e4cf 0%, #e1cba9 100%)";
    case "mobile":
      return "linear-gradient(135deg, #ecdcc4 0%, #d8c4a0 100%)";
    case "vibe-code":
      return "linear-gradient(135deg, #f5ead2 0%, #e6d5b0 100%)";
  }
}

function kindLabel(kind: WorkbenchKind) {
  switch (kind) {
    case "tools":
      return "Tools";
    case "presentations":
      return "Presentations";
    case "mobile":
      return "Mobile";
    case "vibe-code":
      return "Vibe Code";
  }
}

function Preview({ item }: { item: WorkbenchItem }) {
  if (item.previewImage) {
    return (
      <Image
        alt=""
        className="absolute inset-0 size-full object-cover"
        fill
        src={item.previewImage}
        sizes="(max-width: 768px) 100vw, 380px"
      />
    );
  }

  if (item.preview === "energy") {
    return (
      <>
        <video
          className="absolute inset-0 size-full object-cover opacity-90"
          src="/4EN/energynest-thermal-battery-hero.mp4"
          muted
          playsInline
          preload="metadata"
          autoPlay
          loop
        />
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/30 via-transparent to-blue-500/20" />
        <Image
          alt=""
          className="absolute right-3 bottom-3 h-7 w-auto rounded bg-white/85 p-1"
          height={28}
          src="/4EN/logo.png"
          width={84}
        />
      </>
    );
  }

  if (item.preview === "matti") {
    return (
      <>
        <Image
          alt=""
          className="absolute inset-0 size-full object-cover opacity-80"
          fill
          src="/AmosMatti/AR.jpeg"
          sizes="(max-width: 768px) 100vw, 380px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbf6ec]/90 via-[#fbf6ec]/55 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="h-3 w-24 rounded bg-[#1a1610]" />
          <div className="mt-3 h-2 w-32 rounded bg-[#857a66]" />
          <div className="mt-2 h-2 w-20 rounded bg-[#bdb09a]" />
        </div>
      </>
    );
  }

  if (item.preview === "optimizer") {
    return (
      <div className="absolute inset-0 bg-[#1a1610] p-5 text-[#f3ead7]">
        <div className="font-mono text-xs opacity-80">fn optimize()</div>
        <div className="mt-5 grid grid-cols-5 items-end gap-2">
          <div className="h-10 rounded bg-[#f3ead7]/35" />
          <div className="h-16 rounded bg-[#e07a1f]/55" />
          <div className="h-8 rounded bg-[#fad6b8]/70" />
          <div className="h-24 rounded bg-[#efb78d]" />
          <div className="h-14 rounded bg-[#f3ead7]/30" />
        </div>
        <div className="mt-5 h-px bg-[#f3ead7]/30" />
        <div className="mt-4 h-2 w-28 rounded bg-[#f3ead7]/55" />
      </div>
    );
  }

  // document
  return (
    <div className="absolute inset-0 p-5">
      <FileText className="mb-5 size-7 text-[#857a66]" />
      <div className="space-y-2">
        <div className="h-3 w-28 rounded bg-[#1a1610]" />
        <div className="h-2 w-full rounded bg-[#bdb09a]/70" />
        <div className="h-2 w-5/6 rounded bg-[#bdb09a]/70" />
        <div className="h-2 w-3/5 rounded bg-[#bdb09a]/70" />
      </div>
      <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-md border border-[#1a1610]/10 bg-[#fffdf8]/70 px-2 py-1 text-xs text-[#857a66]">
        <Layers3 className="size-3" />
        static
      </div>
    </div>
  );
}
