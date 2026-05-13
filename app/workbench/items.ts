export type WorkbenchKind = "tools" | "presentations" | "mobile" | "vibe-code";

export type WorkbenchItem = {
  title: string;
  href: string;
  kind: WorkbenchKind;
  date: string;
  description: string;
  tags: string[];
  preview?: "energy" | "matti" | "optimizer" | "document";
  previewImage?: string;
  previewImages?: string[];
};

export const items: WorkbenchItem[] = [
  {
    title: "ENERGYNEST visual",
    href: "/4EN/index.html",
    kind: "tools",
    date: "2026-04-12",
    description:
      "Energy storage landing page and visual direction for the ENERGYNEST work.",
    tags: ["Tool", "ENERGYNEST", "Energy"],
    previewImage: "/workbench/energynest-visual-preview.png",
  },
  {
    title: "ENERGYNEST Optimization",
    href: "https://v144-energynest.streamlit.app/",
    kind: "tools",
    date: "2026-05-11",
    description: "Thermal Storage Optimization System across markets.",
    tags: ["Tool", "ENERGYNEST", "Optimization"],
    previewImage: "/workbench/energynest-optimization-preview.png",
  },
  {
    title: "PeakWind",
    href: "/AmosMatti/index.html",
    kind: "presentations",
    date: "2026-02-22",
    description:
      "Project page and early AI studio framing for the PeakWind work.",
    tags: ["Presentation", "PeakWind", "AI"],
    previewImage: "/workbench/peakwind-first-page.png",
  },
  {
    title: "CINET presentation",
    href: "/CINET/index.html",
    kind: "presentations",
    date: "2026-04-09",
    description:
      "Presentation page for the CINET work, with image-led storytelling and working material.",
    tags: ["Presentation", "CINET", "Portfolio"],
    previewImage: "/workbench/cinet-first-page.png",
  },
  {
    title: "Cleanovo",
    href: "#todo-cleanovo-url",
    kind: "tools",
    date: "2026-04-09",
    description: "CINET project tool preview. Add the Vercel URL here.",
    tags: ["Tool", "CINET", "Cleanovo"],
    previewImage: "/CINET/images/Cleanovo.jpg",
  },
  {
    title: "Fornet",
    href: "#todo-fornet-url",
    kind: "tools",
    date: "2026-04-09",
    description: "CINET project tool preview. Add the Vercel URL here.",
    tags: ["Tool", "CINET", "Fornet"],
    previewImage: "/CINET/images/Fornet.jpg",
  },
  {
    title: "Londri",
    href: "#todo-londri-url",
    kind: "tools",
    date: "2026-04-09",
    description: "CINET project tool preview. Add the Vercel URL here.",
    tags: ["Tool", "CINET", "Londri"],
    previewImage: "/CINET/images/Londri.jpg",
  },
  {
    title: "Quickclean",
    href: "#todo-quickclean-url",
    kind: "tools",
    date: "2026-04-09",
    description: "CINET project tool preview. Add the Vercel URL here.",
    tags: ["Tool", "CINET", "Quickclean"],
    previewImage: "/CINET/images/Quickclean.jpg",
  },
  {
    title: "Synergy",
    href: "#todo-synergy-url",
    kind: "tools",
    date: "2026-04-09",
    description: "CINET project tool preview. Add the Vercel URL here.",
    tags: ["Tool", "CINET", "Synergy"],
    previewImage: "/CINET/images/Synergy.jpg",
  },
  {
    title: "TLC",
    href: "#todo-tlc-url",
    kind: "tools",
    date: "2026-04-09",
    description: "CINET project tool preview. Add the Vercel URL here.",
    tags: ["Tool", "CINET", "TLC"],
    previewImage: "/CINET/images/TLC.jpg",
  },
  {
    title: "Vendrig",
    href: "#todo-vendrig-url",
    kind: "tools",
    date: "2026-04-09",
    description: "CINET project tool preview. Add the Vercel URL here.",
    tags: ["Tool", "CINET", "Vendrig"],
    previewImage: "/CINET/images/Vendrig.jpeg",
  },
  {
    title: "PeakWind vibe code",
    href: "/AmosMatti/fowf-optimizer.html",
    kind: "vibe-code",
    date: "2026-02-08",
    description:
      "Vibe-coded optimizer experiment connected to the PeakWind direction.",
    tags: ["Vibe Code", "PeakWind", "Optimizer"],
    previewImage: "/workbench/peakwind-vibe-code-preview.png",
  },
  {
    title: "CardLine",
    href: "https://www.luminoaistudio.com/cardline",
    kind: "mobile",
    date: "2026-01-04",
    description:
      "Mobile app support and privacy material, with a screenshot preview to add later.",
    tags: ["Mobile", "CardLine", "App"],
    previewImages: [
      "/cardline/artifacts/sim2/1.png",
      "/cardline/artifacts/sim2/3.png",
      "/cardline/artifacts/sim2/4.png",
    ],
  },
];
