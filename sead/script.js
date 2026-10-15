// SEAD project page: result charts, table views, and BibTeX copy.
(() => {
  const ATTACKS = ["Direct", "MTA", "STAC", "Intent Hijacking", "DART"];
  const RQ1 = {
    "GPT-5.6 Luna":     { semantic: [37.4, 27.8, 29.4, 27.2, 73.3], hard: [40.1, 21.4, 23.0, 19.3, 54.7] },
    "GPT-5.6 Terra":    { semantic: [37.4, 29.4, 24.6, 17.1, 62.5], hard: [33.2, 22.5, 18.7, 11.8, 51.1] },
    "Gemini 3.8 Flash": { semantic: [24.1, 25.1, 19.8, 10.2, 43.9], hard: [25.1, 19.8, 18.2, 8.6, 33.2] },
    "Claude Sonnet 5":  { semantic: [17.1, 16.0, 18.2, 13.4, 51.9], hard: [23.5, 13.4, 14.4, 10.7, 38.7] },
  };

  // Domain columns are success counts out of 25 / 20 / 15 / 15 tasks.
  const DOMAINS = ["Filesystem", "Terminal", "PostgreSQL", "Web"];
  const RQ3 = [
    { name: "No defense",        semantic: 65.3, hard: 48.0, d: { semantic: [16, 13, 10, 10], hard: [14, 13, 5, 4] } },
    { name: "Base Binary",       semantic: 38.7, hard: 29.3, d: { semantic: [10, 9, 8, 2],   hard: [7, 9, 5, 1] } },
    { name: "StepGuard",         semantic: 33.3, hard: 32.0, d: { semantic: [8, 9, 6, 2],    hard: [5, 9, 9, 1] } },
    { name: "TS-Guard",          semantic: 25.3, hard: 20.0, d: { semantic: [9, 8, 1, 1],    hard: [5, 9, 0, 1] } },
    { name: "Fine-tuned Binary", semantic: 58.7, hard: 48.0, d: { semantic: [10, 12, 11, 11], hard: [10, 11, 9, 6] } },
    { name: "SAGE",              semantic: 10.7, hard: 4.0,  d: { semantic: [4, 1, 0, 3],    hard: [1, 1, 0, 1] }, ours: true },
  ];

  const RQ3B = [
    { name: "MTA",              semantic: [25.3, 4.0],  hard: [16.0, 1.3] },
    { name: "STAC",             semantic: [32.0, 4.0],  hard: [25.3, 4.0] },
    { name: "Intent Hijacking", semantic: [21.3, 13.3], hard: [17.3, 6.7] },
    { name: "DART",             semantic: [65.3, 10.7], hard: [48.0, 4.0] },
  ];

  const state = { rq1: { metric: "semantic", view: "chart" }, rq3: { metric: "hard", view: "chart" } };
  const label = { semantic: "Semantic", hard: "Hard" };
  const fmt = (v) => v.toFixed(1) + "%";
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };

  // Tooltip
  const tip = document.getElementById("tip");
  const showTip = (e, html) => { tip.innerHTML = html; tip.hidden = false; moveTip(e); };
  const moveTip = (e) => {
    const r = tip.getBoundingClientRect();
    let x = e.clientX + 14, y = e.clientY + 14;
    if (x + r.width > innerWidth - 8) x = e.clientX - r.width - 14;
    if (y + r.height > innerHeight - 8) y = e.clientY - r.height - 14;
    tip.style.left = x + "px"; tip.style.top = y + "px";
  };
  const hideTip = () => { tip.hidden = true; };

  function barRow(name, value, max, fillCls, hl, tipHtml) {
    const row = el("div", "bar-row" + (hl ? " hl" : ""));
    row.tabIndex = 0;
    row.setAttribute("aria-label", `${name}: ${fmt(value)}`);
    row.append(el("span", "lbl", name));
    const track = el("div", "track");
    const fill = el("div", "fill " + (fillCls || ""));
    fill.style.width = (value / max * 100) + "%";
    fill.append(el("span", "val", fmt(value)));
    track.append(fill);
    row.append(track);
    row.addEventListener("mouseenter", (e) => showTip(e, tipHtml));
    row.addEventListener("mousemove", moveTip);
    row.addEventListener("mouseleave", hideTip);
    row.addEventListener("focus", () => { const b = row.getBoundingClientRect(); showTip({ clientX: b.right - 40, clientY: b.top }, tipHtml); });
    row.addEventListener("blur", hideTip);
    return row;
  }

  function axis(max, labelW) {
    const a = el("div", "axis");
    if (labelW) a.style.setProperty("--label-w", labelW);
    a.append(el("span"));
    const ticks = el("div");
    for (let i = 0; i <= 4; i++) ticks.append(el("span", null, String(max * i / 4)));
    a.append(ticks);
    return a;
  }

  function table(caption, head, rows) {
    const t = el("table", "data");
    t.innerHTML = `<caption class="visually-hidden">${caption}</caption>`
      + "<thead><tr>" + head.map((h) => `<th scope="col">${h}</th>`).join("") + "</tr></thead>";
    const tb = el("tbody");
    rows.forEach((r) => {
      const tr = el("tr", r.cls || "");
      tr.innerHTML = `<th scope="row">${r.cells[0]}</th>` + r.cells.slice(1).map((c) => `<td>${c}</td>`).join("");
      tb.append(tr);
    });
    t.append(tb);
    return t;
  }

  function renderRQ1() {
    const { metric, view } = state.rq1;
    const chart = document.getElementById("rq1-chart");
    const tableBox = document.getElementById("rq1-table");
    chart.hidden = view !== "chart"; tableBox.hidden = view !== "table";
    chart.innerHTML = ""; tableBox.innerHTML = "";
    const MAX = 80;
    Object.entries(RQ1).forEach(([model, vals]) => {
      const panel = el("div", "panel");
      panel.append(el("h4", null, model));
      const bars = el("div", "bars");
      const v = vals[metric];
      const bestBase = Math.max(...v.slice(0, 4));
      ATTACKS.forEach((a, i) => {
        const isDart = a === "DART";
        const extra = isDart ? `<br>+${(v[i] - bestBase).toFixed(1)} pp over best baseline` : "";
        bars.append(barRow(a, v[i], MAX, isDart ? "attack" : "", isDart, `<b>${a} → ${model}</b>${label[metric]} ASR ${fmt(v[i])}${extra}`));
      });
      panel.append(bars, axis(MAX));
      chart.append(panel);
    });
    const models = Object.keys(RQ1);
    const head = ["Attack", ...models.flatMap((m) => [`${m}<br><small>Semantic</small>`, `<small>Hard</small>`])];
    tableBox.append(table("RQ1: attack success rate (%) on 187 tasks, by attack method and target model", head, ATTACKS.map((a, i) => ({
      cls: a === "DART" ? "ours" : "",
      cells: [a, ...models.flatMap((m) => [RQ1[m].semantic[i].toFixed(1), RQ1[m].hard[i].toFixed(1)])],
    }))));
  }

  function renderRQ3() {
    const { metric, view } = state.rq3;
    const chart = document.getElementById("rq3-chart");
    const tableBox = document.getElementById("rq3-table");
    chart.hidden = view !== "chart"; tableBox.hidden = view !== "table";
    chart.innerHTML = ""; tableBox.innerHTML = "";
    const MAX = 80;
    const LW = "140px";
    const bars = el("div", "bars");
    bars.style.setProperty("--label-w", LW);
    RQ3.forEach((r) => {
      const dom = r.d[metric].map((c, i) => `${DOMAINS[i]} ${c}`).join(" · ");
      const row = barRow(r.name, r[metric], MAX, r.ours ? "state" : "", r.ours, `<b>${r.name}</b>${label[metric]} ASR ${fmt(r[metric])}<br>Successes: ${dom}`);
      row.style.setProperty("--label-w", LW);
      bars.append(row);
    });
    chart.append(bars, axis(MAX, LW));

    const head = ["Defender", ...DOMAINS.flatMap((d) => [`${d}<br><small>Sem.</small>`, `<small>Hard</small>`]), "Overall<br><small>Sem. %</small>", "<small>Hard %</small>"];
    tableBox.append(table("RQ3: online defense against DART on the 75-task subset, by defender and tool domain", head, RQ3.map((r) => ({
      cls: r.ours ? "ours" : "",
      cells: [r.name, ...r.d.semantic.flatMap((s, i) => [s, r.d.hard[i]]), r.semantic.toFixed(1), r.hard.toFixed(1)],
    }))));

    const b = document.getElementById("rq3b-chart");
    b.innerHTML = "";
    const wrap = el("div", "bars");
    RQ3B.forEach((r) => {
      const [none, sage] = r[metric];
      const pair = el("div", "pair");
      const t = `<b>${r.name}</b>${label[metric]} ASR: ${fmt(none)} → ${fmt(sage)} with SAGE`;
      const r1 = barRow(r.name, none, MAX, "", false, t);
      const r2 = barRow("+ SAGE", sage, MAX, "state", true, t);
      [r1, r2].forEach((x) => x.style.setProperty("--label-w", LW));
      pair.append(r1, r2);
      wrap.append(pair);
    });
    b.append(wrap, axis(MAX, LW));
  }

  const render = { rq1: renderRQ1, rq3: renderRQ3 };

  document.querySelectorAll(".seg").forEach((seg) => {
    seg.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const { chart, key } = seg.dataset;
      state[chart][key] = btn.dataset.value;
      seg.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === btn)));
      render[chart]();
    });
  });

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = document.querySelector(btn.dataset.copy).textContent;
      try { await navigator.clipboard.writeText(text); btn.textContent = "Copied"; }
      catch { btn.textContent = "Select & copy"; }
      setTimeout(() => { btn.textContent = "Copy"; }, 1600);
    });
  });

  renderRQ1();
  renderRQ3();
})();
