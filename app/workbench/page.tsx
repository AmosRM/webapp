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

function fileFor(item: WorkbenchItem) {
  const stripped = item.href.replace(/^\//, "");
  return stripped.endsWith(".html") ? stripped : `${stripped}.html`;
}

export default function WorkbenchPage() {
  const publicDir = path.join(process.cwd(), "public");
  const present = items.filter((it) => {
    if (it.href.startsWith("http") || it.href.startsWith("#")) {
      return true;
    }

    return existsSync(path.join(publicDir, fileFor(it)));
  });

  return <WorkbenchClient items={present} />;
}
