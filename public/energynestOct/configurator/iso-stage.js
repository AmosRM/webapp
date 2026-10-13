// Centre stage of configurator-v3.html: the isometric figure of the ThermalBattery plant, driven by the sizing result.
//
// The drawings come from the figure kit (figures/thermal-battery) through build_stage.mjs, one module per number of storage
// modules (stage-iso/oil-<n>.mjs). This file picks the drawing that follows the result, switches parts on and off, puts the
// configurator's own (already translated) labels on the parts, and runs the live look (flows, state, insulation).
// It carries no text of its own: every word comes in through update().
//
//   const stage = createStage(hostElement, { base: "stage-iso/" });
//   stage.update({ modules, heater, gas, bess, tes, labels, state, insulation, showLabels, notes })
//
// The figure is drawn inside a shadow root: the kit's stylesheet has short class names (.bar, .tip, .day ...) that must not
// meet the page's own.

const FIGURE_THEME = "energynest-light";
// What can be drawn, by number of modules (build_stage.mjs): one stack of 1-5, or two stacks of 3-6.
const DRAWN = [1, 2, 3, 4, 5, 6, 8, 10, 12];
export const drawnModules = (n) => DRAWN.reduce((best, d) => (d <= n ? d : best), DRAWN[0]);

const SHARE = 0.6;      // how warm the store is drawn (a look, not a number: nothing in the figure states it)
const PHASE_SPEED = 14; // flow dashes travel this far per second
const STATE_MODE = { idle: "idle", charging: "charge", discharging: "discharge" };

export function createStage(host, { base = "stage-iso/" } = {}) {
  host.classList.add("iso-host");
  host.innerHTML = `<div class="iso-layer" data-layer="a"></div><div class="iso-layer" data-layer="b"></div><svg class="iso-labels" role="presentation"></svg>`;
  const layers = [...host.querySelectorAll(".iso-layer")];
  const labelBox = host.querySelector(".iso-labels");
  const modules = new Map();     // key -> Promise<module>
  let cssText = null;
  let current = null;            // { layer, shadow, mod, fig, key, crop, parts }
  let wanted = null;             // the last update()
  let busy = false, again = false, freshDrawing = false;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ready = (async () => {
    if (!globalThis.anime) await new Promise((ok, fail) => { const s = document.createElement("script"); s.src = base + "anime.umd.min.js"; s.onload = ok; s.onerror = fail; document.head.append(s); });
    cssText = await (await fetch(base + "stage.css")).text();
  })();

  const load = (key) => { if (!modules.has(key)) modules.set(key, import(/* @vite-ignore */ new URL(`${base}oil-${key}.mjs`, document.baseURI).href)); return modules.get(key); };

  // ---- Parts that come and go (heater, gas boiler, the storage stack), by the kit's part names
  function sortParts(root, mod) {
    const parts = {};
    for (const [group, pattern] of Object.entries(mod.meta.groups)) {
      const re = new RegExp(pattern);
      parts[group] = [...root.querySelectorAll("[data-name]")].filter((el) => re.test(el.dataset.name));
    }
    return parts;
  }
  const show = (els, on) => els.forEach((el) => (el.style.display = on ? "" : "none"));

  // ---- Where the drawing sits: crop the view to the plant. Measured once per drawing with every part visible, in the
  // variants the page needs: the whole plant (plain), with the battery containers (withBess), the containers alone (only),
  // and for a plant without storage the heat plant alone, without the plate it stands on (heat, heatBess): then the heater and
  // the boiler fill the stage and the empty plate fades out at the edges instead of being the subject.
  function cropOf(svg, parts) {
    const g = svg.querySelector("[data-camera] > g");
    const bess = g.querySelector("[data-bess-group]");
    const plate = [...g.children].find((el) => el.getAttribute && el.getAttribute("data-stage") === "0");
    const measure = (pad = 18) => {
      const bb = g.getBBox();
      const m = /translate\(([-\d.]+) ([-\d.]+)\) scale\(([-\d.]+)\)/.exec(g.getAttribute("transform"));
      const [dx, dy, k] = [+m[1], +m[2], +m[3]];
      return { x: bb.x * k + dx - pad, y: bb.y * k + dy - pad, w: bb.width * k + 2 * pad, h: bb.height * k + 2 * pad };
    };
    const rest = [...g.children].filter((el) => el !== bess && el.tagName !== "defs");
    bess.style.display = "";
    const withBess = measure();
    rest.forEach((el) => (el.style.display = "none"));
    const only = measure();
    rest.forEach((el) => (el.style.display = ""));
    bess.style.display = "none";
    const plain = measure();
    plate.style.display = "none"; parts.stack.forEach((el) => (el.style.display = "none"));
    const heat = measure(46);
    bess.style.display = "";
    const heatBess = measure(46);
    plate.style.display = ""; parts.stack.forEach((el) => (el.style.display = "")); bess.style.display = "none";
    return { withBess, plain, only, heat, heatBess, rest };
  }
  const setView = (svg, v) => svg.setAttribute("viewBox", `${v.x.toFixed(1)} ${v.y.toFixed(1)} ${v.w.toFixed(1)} ${v.h.toFixed(1)}`);
  function viewTo(c, want, animate) {
    if (c.view && c.view === want) return;
    const from = c.shown || want;
    c.view = want;
    cancelAnimationFrame(c.viewRaf);
    if (!animate || reduced || from === want) { c.shown = want; setView(c.svg, want); return; }
    const t0 = performance.now(), dur = 420;
    const step = (t) => {
      const u = Math.min(1, (t - t0) / dur), e = 1 - (1 - u) ** 3;
      const v = {}; for (const k of ["x", "y", "w", "h"]) v[k] = from[k] + (want[k] - from[k]) * e;
      c.shown = u < 1 ? v : want; setView(c.svg, c.shown); c.crop = c.shown;
      if (c === current) placeLabels(c, wanted);
      if (u < 1) c.viewRaf = requestAnimationFrame(step);
    };
    c.viewRaf = requestAnimationFrame(step);
  }

  async function mountInto(layer, key) {
    const mod = await load(key);
    const shadow = layer.shadowRoot || layer.attachShadow({ mode: "open" });
    shadow.innerHTML = `<style>${cssText}
      :host{display:block}
      [data-mat="bess"]{--anatomy-paper:#cdebe5;--anatomy-shade-0:#8fc9bf;--anatomy-shade-1:#a8d7cf;--anatomy-shade-2:#cdebe5;--anatomy-shade-3:#e0f3ef;--anatomy-top:#f3fbf9}
      .iso.tbv{position:absolute;inset:0;background:none}
      .tbx,.iso-stage{position:absolute;inset:0}
      .iso-svg{width:100%;height:100%;display:block;overflow:visible}
      .flow,.flow[data-fluid]{filter:none!important}   /* the kit's drop-shadow glow on every moving dash is what software raster cannot afford */
      .flow.moving{animation:isodash .42s steps(11) infinite}
      @keyframes isodash{from{stroke-dashoffset:var(--a)}to{stroke-dashoffset:var(--b)}}
      .stage-veil{display:none}
      .callout,.fig-note{display:none}
      [data-view="element"]{display:none}
    </style><div class="iso tbv" data-theme="${FIGURE_THEME}">${mod.html}</div>`;
    const svg = shadow.querySelector("svg.iso-svg");
    const fig = mod.mount(shadow, { clock: "external", anime: globalThis.anime });
    const parts = sortParts(shadow, mod);
    const crops = cropOf(svg, parts);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    const c = { layer, shadow, svg, mod, fig, key, crops, crop: crops.plain, parts, bess: [...shadow.querySelectorAll("[data-bess]")], pads: [...shadow.querySelectorAll("[data-bess-pad]")], bessGroup: shadow.querySelector("[data-bess-group]"), rest: crops.rest };
    setView(svg, crops.plain);
    return c;
  }

  // ---- One frame of the figure from the wanted state
  function draw(c, w, build = 1) {
    const { fig, parts, mod } = c;
    show(parts.stack, w.tes);
    show(parts.heater, w.heater);
    show(parts.gas, w.gas);
    const nb = Math.min(w.bessUnits || 0, mod.meta.bessMax);
    c.bessGroup.style.display = nb ? "" : "none";
    c.bess.forEach((el, i) => (el.style.display = i < nb ? "" : "none"));
    c.pads.forEach((el) => (el.style.display = el.dataset.bessPad === String(nb <= 1 ? 1 : nb <= 2 ? 2 : 4) ? "" : "none"));
    const only = nb > 0 && !w.tes && !w.heater && !w.gas;   // batteries and nothing else: the heat plant is not drawn at all
    show(c.rest, !only);
    const heatOnly = !w.tes && !only;                        // no storage: the heat plant is the subject, not the empty plate
    viewTo(c, only ? c.crops.only : heatOnly ? (nb ? c.crops.heatBess : c.crops.heat) : nb ? c.crops.withBess : c.crops.plain, c.drawn);
    c.layer.classList.toggle("fade", heatOnly);
    c.drawn = true;
    // a store that is shown follows the state buttons; a plant without a store simply runs its heater into the line
    const mode = w.tes ? STATE_MODE[w.state] || "idle" : w.heater ? "charge" : "idle";
    const state = { ...fig.defaults, mode, share: w.tes ? SHARE : 0, flow: mode === "idle" ? 0 : 1, boiler: 0, build, existing: 1, live: 1, phase: 0, clad: w.tes && w.insulation ? 1 : 0 };
    const sig = `${mode}|${w.tes}|${w.heater}|${w.gas}|${build}`;
    fig.set(state);
    if (build >= 1 && c.flowSig !== sig) { c.flowSig = sig; armFlows(c, state); }
  }

  // The flow dashes move by a CSS animation of their dash offset, set up once per state: one extra draw at phase 1 tells which
  // way each line runs. Nothing is redrawn per frame (that was the cost: the whole figure state, 25 times a second).
  function armFlows(c, state) {
    const flows = [...c.shadow.querySelectorAll(".flow")].filter((el) => el.style.opacity);
    const off = () => flows.map((el) => parseFloat(el.style.strokeDashoffset) || 0);
    const d0 = off();
    c.fig.set({ ...state, phase: 1 });
    const d1 = off();
    c.fig.set({ ...state, phase: 0 });
    c.shadow.querySelectorAll(".flow.moving").forEach((el) => el.classList.remove("moving"));
    if (reduced) return;
    flows.forEach((el, i) => { el.style.setProperty("--a", d0[i]); el.style.setProperty("--b", d0[i] + (d1[i] - d0[i]) * 5.5); el.classList.add("moving"); });
  }

  // ---- Callouts, drawn like an engineering drawing (and like the labels of the client film): a ring on the part, one hairline
  // leader (a diagonal and a shelf), the name small and quiet above the shelf, the value large, the facts small. No box.
  // Every word comes from the configurator. Placement looks for clear space: it scores candidate positions against the
  // drawn parts (their screen rectangles) and against the callouts already placed, and keeps leaders from crossing.
  const hostBox = () => host.getBoundingClientRect();
  const NS = "http://www.w3.org/2000/svg";
  const mk = (tag, attrs = {}, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text !== undefined) e.textContent = text; return e; };
  function anchorPx(c, [x, y]) {
    const r = c.svg.getBoundingClientRect(), h = hostBox(), vb = c.shown || c.crop;
    const s = Math.min(r.width / vb.w, r.height / vb.h);
    const ox = r.left + (r.width - vb.w * s) / 2 - h.left, oy = r.top + (r.height - vb.h * s) / 2 - h.top;
    return [ox + (x - vb.x) * s, oy + (y - vb.y) * s];
  }
  const centreOf = (el, fy = 0.5) => { const r = el.getBoundingClientRect(), h = hostBox(); return [r.left + r.width / 2 - h.left, r.top + r.height * fy - h.top]; };
  const partRects = (c) => {
    const h = hostBox();
    return [...c.shadow.querySelectorAll("[data-name],[data-bess],[data-bess-pad]")].filter((el) => el.style.display !== "none" && !/^cladding/.test(el.dataset.name || ""))
      .map((el) => el.getBoundingClientRect()).filter((r) => r.width > 0).map((r) => ({ x: r.left - h.left, y: r.top - h.top, w: r.width, h: r.height }));
  };
  const overlap = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  const inside = (p, r) => p[0] >= r.x && p[0] <= r.x + r.w && p[1] >= r.y && p[1] <= r.y + r.h;
  const segHit = (a, b, c2, d) => { const o = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]); return o(a, b, c2) * o(a, b, d) < 0 && o(c2, d, a) * o(c2, d, b) < 0; };
  const segRect = (a, b, r) => [[r.x, r.y, r.x + r.w, r.y], [r.x, r.y + r.h, r.x + r.w, r.y + r.h], [r.x, r.y, r.x, r.y + r.h], [r.x + r.w, r.y, r.x + r.w, r.y + r.h]].some(([x1, y1, x2, y2]) => segHit(a, b, [x1, y1], [x2, y2])) || inside(a, r) || inside(b, r);

  // Where a draughtsman would put them: the text stands in clear stage background (never over a drawn part or the plate),
  // the leaders are 45-degree runs of about the same length, one callout in each corner region of the plant: the storage upper
  // left, the heater lower left, the gas boiler lower middle/right, the batteries right or below right.
  const WANT = { tes: [-1, true], eb: [-1, false], gas: [1, false], bess: [1, false] };
  function placeLabels(c, w, animate = false) {
    labelBox.replaceChildren();
    host.dataset.callouts = "";
    if (c.assembling || !w.showLabels) return;
    const nb = Math.min(w.bessUnits || 0, c.mod.meta.bessMax);
    const part = (name) => c.shadow.querySelector(`[data-name="${name}"]`);
    const items = [];
    if (w.tes) { const d = drawnModules(w.modules); items.push({ cls: "tes", at: anchorPx(c, c.mod.meta.anchors.roof), data: { ...w.labels.tes, note: d < w.modules ? w.text.modulesShown(d, w.modules) : "" } }); }
    if (w.heater) { const el = part("heater.shell"); items.push({ cls: "eb", at: el ? centreOf(el) : anchorPx(c, c.mod.meta.anchors.heater), data: w.labels.heater }); }
    if (w.gas) { const el = part("boiler.shell"); items.push({ cls: "gas", at: el ? centreOf(el) : anchorPx(c, c.mod.meta.anchors.boiler), data: w.labels.gas }); }
    if (nb) items.push({ cls: "bess", at: centreOf(c.bess[nb - 1], 0.3), data: { ...w.labels.bess, note: w.labels.bess.total > nb ? w.text.bessShown(nb, w.labels.bess.total) : "" } });
    if (!items.length) return;
    items.sort((a, b) => (a.cls === "bess" ? 0 : a.cls === "gas" ? 1 : 2) - (b.cls === "bess" ? 0 : b.cls === "gas" ? 1 : 2));   // the ones with least room choose first
    const hb = hostBox(), narrow = hb.width < 520;
    const B = { x: 10, y: narrow ? 62 : 60, w: hb.width - 20, h: hb.height - (narrow ? 62 : 60) - (narrow ? 62 : 72) };
    const rects = partRects(c);
    // the plate is a parallelogram: test it by its real outline, not by its bounding box
    const plateEl = c.shadow.querySelector('[data-stage="0"] .iso-fill');
    const plateOn = plateEl && !c.rest.some((el) => el.style.display === "none" && el.contains(plateEl));
    const inv = plateOn ? plateEl.getScreenCTM().inverse() : null;
    const origin = hostBox();
    const onPlate = (x, y) => { if (!inv) return false; const p = new DOMPoint(x + origin.left, y + origin.top).matrixTransform(inv); return plateEl.isPointInFill(p); };
    const taken = (x, y) => rects.some((r) => inside([x, y], r)) || onPlate(x, y);
    const placed = [];   // { box, segs }
    const LEN = narrow ? 50 : 84;
    items.forEach((it, index) => {
      const g = mk("g", { class: `co co-${it.cls}` });
      const d = it.data;
      const name = mk("text", { class: "co-name" }, d.label);
      const val = mk("text", { class: "co-val" });
      if (!narrow && d.val) { val.append(mk("tspan", { class: "co-num" }, d.val), mk("tspan", { class: "co-unit" }, " " + d.unit)); }
      const sec = !narrow && d.sec ? mk("text", { class: "co-sec" }, d.sec) : null;
      const note = !narrow && d.note ? mk("text", { class: "co-sec co-note" }, d.note) : null;
      g.append(name); if (!narrow && d.val) g.append(val); if (sec) g.append(sec); if (note) g.append(note);
      labelBox.append(g);
      const ws = [name, !narrow && d.val ? val : null, sec, note].filter(Boolean).map((t) => t.getComputedTextLength());
      const bw = Math.ceil(Math.max(...ws, 20)), rows = [{ el: name, h: 13 }, ...(!narrow && d.val ? [{ el: val, h: 24 }] : []), ...(sec ? [{ el: sec, h: 14 }] : []), ...(note ? [{ el: note, h: 14 }] : [])];
      const bh = rows.reduce((n, r) => n + r.h, 0);
      const [px, py] = it.at;
      let best = null;
      for (const side of [1, -1]) for (const up of [true, false]) for (const ratio of [0.75, 1, 1.4]) for (let dist = 28; dist <= 240; dist += 14) {
        const dx = side * dist * ratio, dy = up ? -dist : dist;
        const sx = px + dx, sy = py + dy, ex = sx + side * (bw + 8);
        const box = { x: Math.min(sx, ex), y: up ? sy - bh - 4 : sy + 4, w: bw + 8, h: bh };
        const all = { x: box.x, y: Math.min(box.y, sy), w: box.w, h: bh + 4 };
        if (all.x < B.x || all.x + all.w > B.x + B.w || all.y < B.y || all.y + all.h > B.y + B.h) continue;
        const segs = [[[px, py], [sx, sy]], [[sx, sy], [ex, sy]]];
        if (placed.some((q) => overlap(all, { x: q.box.x - 8, y: q.box.y - 8, w: q.box.w + 16, h: q.box.h + 16 }) > 0 || segs.some(([a, b]) => q.segs.some(([c2, d2]) => segHit(a, b, c2, d2)) || segRect(a, b, q.box)) || q.segs.some(([a, b]) => segRect(a, b, all)))) continue;
        let cost = Math.abs(dist - LEN) * 0.5 + Math.abs(ratio - 1) * 12;
        const [ws2, wu] = WANT[it.cls]; cost += (side === ws2 ? 0 : 45) + (up === wu ? 0 : 45);
        // text must stand in clear background: sample the block
        const nx = Math.ceil(bw / 12), ny = Math.ceil(bh / 8);
        for (let i = 0; i <= nx; i++) for (let j = 0; j <= ny; j++) if (taken(all.x + 2 + (all.w - 4) * i / nx, all.y + 2 + (all.h - 4) * j / ny)) cost += 400;
        for (let t = 0.2; t < 1; t += 0.1) { const x = px + dx * t, y = py + dy * t; if (rects.some((r) => inside([x, y], r))) cost += 3; }
        if (!best || cost < best.cost) best = { cost, side, up, sx, sy, ex, box, all, segs };
      }
      if (!best) { g.remove(); return; }
      const { side, sx, sy, ex, box } = best;
      placed.push({ box: best.all, segs: best.segs });
      host.dataset.callouts += `${it.cls}:${Math.round(best.cost)} `;   // a cost of 400 or more means some text samples stand on the drawing
      let y = box.y;
      const tx = side > 0 ? sx + 4 : sx - 4, anchor = side > 0 ? "start" : "end";
      for (const r of rows) { y += r.h; r.el.setAttribute("x", tx.toFixed(1)); r.el.setAttribute("y", (y - (r.el === val ? 4 : 3)).toFixed(1)); r.el.setAttribute("text-anchor", anchor); }
      const lead = mk("path", { class: "co-lead", d: `M${px.toFixed(1)} ${py.toFixed(1)}L${sx.toFixed(1)} ${sy.toFixed(1)}L${ex.toFixed(1)} ${sy.toFixed(1)}`, pathLength: 1 });
      const ring = mk("circle", { class: "co-ring", cx: px.toFixed(1), cy: py.toFixed(1), r: 3.6 });
      g.prepend(lead, ring);
      if (animate) { g.classList.add("pre"); void g.getBoundingClientRect(); setTimeout(() => g.classList.remove("pre"), 60 + index * 140); }
    });
  }

  // ---- Updating: one drawing at a time; if the result changed meanwhile, do the newest
  async function sync() {
    if (busy) { again = true; return; }
    busy = true;
    try {
      await ready;
      do {
        again = false;
        const w = wanted;
        if (!w) break;
        const key = w.tes ? drawnModules(w.modules) : 1;
        const first = !current;
        if (!current || current.key !== key) {
          const next = layers.find((l) => !current || l !== current.layer);
          const c = await mountInto(next, key);
          if (again) { /* a newer result arrived while loading: still show this drawing, then redraw */ }
          draw(c, w, first ? 0 : 1);
          const old = current;
          current = c;
          freshDrawing = !first;
          next.classList.add("on");
          if (old) old.layer.classList.remove("on");
          if (first) assemble(c);
        } else draw(current, w, current.assembling ? current.build : 1);
        placeLabels(current, w, freshDrawing);
        freshDrawing = false;
        host.dataset.ready = "1";
        host.dispatchEvent(new CustomEvent("iso:drawn", { detail: { drawn: key } }));
      } while (again);
    } finally { busy = false; }
  }

  // The first drawing is put together the way the kit's own story does it (plate, plinths, modules one by one, pipes, power)
  function assemble(c) {
    if (reduced) return;
    c.assembling = true; c.build = 0;
    const t0 = performance.now(), dur = 1900;
    const step = (t) => {
      const u = Math.min(1, (t - t0) / dur);
      c.build = 1 - (1 - u) ** 2;
      if (c === current && wanted) draw(c, wanted, c.build);
      if (u < 1 && c === current) requestAnimationFrame(step); else { c.assembling = false; if (c === current && wanted) { draw(c, wanted, 1); placeLabels(c, wanted, true); } }
    };
    requestAnimationFrame(step);
  }

  // The stage changes size (window, a column opening or collapsing): the drawing scales by itself (viewBox); the callouts step
  // aside while it moves and are placed again, without the draw-on, when it has settled.
  let settle = 0;
  new ResizeObserver(() => {
    if (!current || !wanted) return;
    labelBox.style.transition = "opacity .15s"; labelBox.style.opacity = "0";
    clearTimeout(settle);
    settle = setTimeout(() => { placeLabels(current, wanted); labelBox.style.opacity = "1"; }, 180);
  }).observe(host);

  return {
    update(w) { wanted = w; sync(); },
    get drawn() { return current ? current.key : null; },
  };
}
