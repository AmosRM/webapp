import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { WorkbenchClient } from "./workbench-client";
import { items, type WorkbenchItem } from "./items";

export const metadata: Metadata = {
  title: "Workbench | Lumino AI",
  description: "Unlisted project archive for Lumino AI work in progress.",
  robots: {
    index: false,
    follow: false,
  },
};

/* A local href is either a file (/x/y.html) or a directory served by its
   index (/CINET). Check both, or a short URL silently drops its card.   */
function filesFor(item: WorkbenchItem) {
  const stripped = item.href.replace(/^\//, "");
  if (stripped.endsWith(".html")) {
    return [stripped];
  }
  return [`${stripped}.html`, path.join(stripped, "index.html")];
}

export default function WorkbenchPage() {
  const publicDir = path.join(process.cwd(), "public");
  const present = items.filter((it) => {
    if (it.href.startsWith("http") || it.href.startsWith("#")) {
      return true;
    }

    return filesFor(it).some((f) => existsSync(path.join(publicDir, f)));
  });

  return <WorkbenchClient items={present} />;
}
