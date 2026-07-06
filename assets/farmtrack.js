/* ================================================================
   FarmTrack shared runtime — theme, app shell, data store, charts
   ================================================================ */
(function () {
  "use strict";
  const FT = (window.FT = {});
  const root = document.documentElement;
  const SVGNS = "http://www.w3.org/2000/svg";

  const LS = {
    theme: "farmtrack-theme",
    sales: "farmtrack-sales",
    expenses: "farmtrack-expenses",
    inv: "farmtrack-inventory",
    profile: "farmtrack-profile",
    lang: "farmtrack-lang",
  };
  FT.LS = LS;

  /* ---------------- Theme ---------------- */
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  function currentDark() {
    const t = root.getAttribute("data-theme");
    return t ? t === "dark" : systemDark.matches;
  }
  FT.currentDark = currentDark;
  FT.setTheme = function (mode) {  /* 'light' | 'dark' | 'system' */
    if (mode === "system") {
      root.removeAttribute("data-theme");
      localStorage.removeItem(LS.theme);
    } else {
      root.setAttribute("data-theme", mode);
      localStorage.setItem(LS.theme, mode);
    }
    paintToggles();
    window.dispatchEvent(new CustomEvent("ft:theme"));
  };
  function paintToggles() {
    document.querySelectorAll(".theme-toggle").forEach((b) => {
      b.textContent = currentDark() ? "☀️ Light" : "🌙 Dark";
    });
  }
  FT.initTheme = function () {
    document.querySelectorAll(".theme-toggle").forEach((b) => {
      b.addEventListener("click", () => FT.setTheme(currentDark() ? "light" : "dark"));
    });
    systemDark.addEventListener("change", () => {
      paintToggles();
      window.dispatchEvent(new CustomEvent("ft:theme"));
    });
    paintToggles();
  };

  /* ---------------- Formatting ---------------- */
  FT.NGN = (n) => "₦" + Math.round(Number(n)).toLocaleString("en-NG");
  FT.NGNk = (n) => "₦" + Math.round(n / 1000) + "k";
  FT.NGNshort = (n) => n >= 1e6 ? "₦" + (n / 1e6).toFixed(2) + "m" : "₦" + Math.round(n / 1000) + "k";
  FT.MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  FT.MONTHS_ALL = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  FT.fmtDate = function (d) {
    const [, m, day] = d.split("-").map(Number);
    return Number(day) + " " + FT.MONTHS_ALL[m - 1];
  };

  /* ---------------- Seed data (2026 wet season demo farm) ---------------- */
  const seedSales = [
    { d: "2026-06-30", item: "Maize",    emoji: "🌽", qty: 8,  unit: "bags",    buyer: "Dawanau Market, Kano", amt: 336000 },
    { d: "2026-06-27", item: "Broilers", emoji: "🐔", qty: 30, unit: "birds",   buyer: "Farm gate",            amt: 225000 },
    { d: "2026-06-24", item: "Tomatoes", emoji: "🍅", qty: 4,  unit: "crates",  buyer: "Mile 12, Lagos",       amt: 74000 },
    { d: "2026-06-12", item: "Cassava",  emoji: "🫓", qty: 1,  unit: "cart",    buyer: "Garri processor, Ogun",amt: 30000 },
    { d: "2026-05-28", item: "Rice paddy",emoji: "🌾", qty: 6, unit: "bags",    buyer: "Miller, Kebbi",        amt: 240000 },
    { d: "2026-05-20", item: "Maize",    emoji: "🌽", qty: 4,  unit: "bags",    buyer: "Bodija Market, Ibadan",amt: 172000 },
    { d: "2026-05-14", item: "Tomatoes", emoji: "🍅", qty: 6,  unit: "crates",  buyer: "Mile 12, Lagos",       amt: 110000 },
    { d: "2026-05-06", item: "Yam",      emoji: "🍠", qty: 30, unit: "tubers",  buyer: "Farm gate",            amt: 68000 },
    { d: "2026-04-25", item: "Maize",    emoji: "🌽", qty: 5,  unit: "bags",    buyer: "Dawanau Market, Kano", amt: 215000 },
    { d: "2026-04-16", item: "Tomatoes", emoji: "🍅", qty: 8,  unit: "crates",  buyer: "Kara Market, Abuja",   amt: 148000 },
    { d: "2026-04-08", item: "Broilers", emoji: "🐔", qty: 15, unit: "birds",   buyer: "Restaurant, Kaduna",   amt: 102000 },
    { d: "2026-03-27", item: "Rice paddy",emoji: "🌾", qty: 4, unit: "bags",    buyer: "Miller, Kebbi",        amt: 150000 },
    { d: "2026-03-18", item: "Yam",      emoji: "🍠", qty: 50, unit: "tubers",  buyer: "Bodija Market, Ibadan",amt: 90000 },
    { d: "2026-03-05", item: "Cassava",  emoji: "🫓", qty: 2,  unit: "carts",   buyer: "Garri processor, Ogun",amt: 80000 },
    { d: "2026-02-21", item: "Maize",    emoji: "🌽", qty: 3,  unit: "bags",    buyer: "Dawanau Market, Kano", amt: 135000 },
    { d: "2026-02-10", item: "Tomatoes", emoji: "🍅", qty: 6,  unit: "crates",  buyer: "Mile 12, Lagos",       amt: 105000 },
    { d: "2026-01-24", item: "Broilers", emoji: "🐔", qty: 12, unit: "birds",   buyer: "Farm gate",            amt: 96000 },
    { d: "2026-01-15", item: "Maize",    emoji: "🌽", qty: 2,  unit: "bags",    buyer: "Neighbour co-op",      amt: 84000 },
  ];

  const seedExpenses = [
    { d: "2026-06-26", cat: "Feed",       desc: "Broiler finisher × 10 bags", vendor: "Feed mill, Kaduna",   amt: 110000 },
    { d: "2026-06-15", cat: "Fertiliser", desc: "NPK 20:10:10 × 4 bags",      vendor: "Agro-dealer, Zaria",  amt: 56000 },
    { d: "2026-06-04", cat: "Transport",  desc: "Truck to Dawanau",           vendor: "Haulage",             amt: 49000 },
    { d: "2026-05-22", cat: "Labour",     desc: "Weeding gang · 5 days",      vendor: "Day workers",         amt: 125000 },
    { d: "2026-05-09", cat: "Fuel",       desc: "Diesel for water pump",      vendor: "Filling station",     amt: 80000 },
    { d: "2026-04-28", cat: "Feed",       desc: "Broiler starter × 12 bags",  vendor: "Feed mill, Kaduna",   amt: 119000 },
    { d: "2026-04-17", cat: "Transport",  desc: "Crates to Mile 12",          vendor: "Haulage",             amt: 70000 },
    { d: "2026-04-05", cat: "Fertiliser", desc: "NPK 20:10:10 × 4 bags",      vendor: "Agro-dealer, Zaria",  amt: 56000 },
    { d: "2026-03-24", cat: "Labour",     desc: "Planting gang · 6 days",     vendor: "Day workers",         amt: 120000 },
    { d: "2026-03-11", cat: "Fuel",       desc: "Diesel + tractor hire",      vendor: "Tractor union",       amt: 90000 },
    { d: "2026-02-19", cat: "Fertiliser", desc: "Urea × 5 bags",              vendor: "Agro-dealer, Zaria",  amt: 95000 },
    { d: "2026-02-07", cat: "Transport",  desc: "Seedlings from nursery",     vendor: "Pickup hire",         amt: 60000 },
    { d: "2026-01-20", cat: "Labour",     desc: "Land clearing · 4 days",     vendor: "Day workers",         amt: 80000 },
    { d: "2026-01-08", cat: "Seeds",      desc: "SAMMAZ 15 maize seed",       vendor: "IAR seed shop",       amt: 60000 },
  ];

  const seedInventory = [
    { emoji: "🌽", name: "Maize",          cat: "Grains",    unit: "bag (100kg)", qty: 42,  price: 42000 },
    { emoji: "🍅", name: "Tomatoes",       cat: "Vegetables",unit: "crate",       qty: 6,   price: 18500 },
    { emoji: "🌾", name: "Rice paddy",     cat: "Grains",    unit: "bag (75kg)",  qty: 15,  price: 39000 },
    { emoji: "🍠", name: "Yam",            cat: "Tubers",    unit: "tuber ×100",  qty: 3,   price: 85000 },
    { emoji: "🫘", name: "Soybeans",       cat: "Grains",    unit: "bag (100kg)", qty: 0,   price: 55000 },
    { emoji: "🐔", name: "Broilers",       cat: "Livestock", unit: "bird",        qty: 120, price: 7500 },
    { emoji: "🧪", name: "NPK fertiliser", cat: "Inputs",    unit: "bag (50kg)",  qty: 4,   price: 14000 },
  ];

  /* ---------------- Store ---------------- */
  function read(key) {
    try { return JSON.parse(localStorage.getItem(key) || "[]"); }
    catch { return []; }
  }
  function write(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  FT.getSales = () => read(LS.sales).concat(seedSales);
  FT.addSale = function (e) {
    const mine = read(LS.sales);
    mine.unshift(e);
    write(LS.sales, mine.slice(0, 200));
    return e;
  };
  FT.getExpenses = () => read(LS.expenses).concat(seedExpenses);
  FT.addExpense = function (e) {
    const mine = read(LS.expenses);
    mine.unshift(e);
    write(LS.expenses, mine.slice(0, 200));
    return e;
  };
  FT.getInventory = function () {
    const stored = localStorage.getItem(LS.inv);
    if (stored) { try { return JSON.parse(stored); } catch { /* fall through */ } }
    return seedInventory.map((i) => ({ ...i }));
  };
  FT.saveInventory = (arr) => write(LS.inv, arr);
  FT.resetData = function () {
    Object.values(LS).forEach((k) => { if (k !== LS.theme) localStorage.removeItem(k); });
  };

  /* Sum records into Jan–Jun buckets (₦). */
  FT.monthlyTotals = function (records) {
    const out = [0, 0, 0, 0, 0, 0];
    records.forEach((r) => {
      const m = Number(r.d.split("-")[1]) - 1;
      if (m >= 0 && m < 6) out[m] += r.amt;
    });
    return out;
  };
  FT.sumBy = function (records, key) {
    const map = new Map();
    records.forEach((r) => map.set(r[key], (map.get(r[key]) || 0) + r.amt));
    return [...map.entries()]
      .map(([label, val]) => ({ label, val }))
      .sort((a, b) => b.val - a.val);
  };
  FT.today = () => "2026-07-06"; /* demo clock: season under review */

  /* ---------------- App shell (sidebar) ---------------- */
  FT.shell = function (active) {
    const aside = document.querySelector(".sidebar");
    if (!aside) return;
    const items = [
      ["dashboard", "index.html",     "📊", "Dashboard"],
      ["inventory", "inventory.html", "🧺", "Inventory"],
      ["sales",     "sales.html",     "🧾", "Sales & expenses"],
      ["reports",   "reports.html",   "📈", "Reports"],
      ["settings",  "settings.html",  "⚙️", "Settings"],
    ];
    const prof = JSON.parse(localStorage.getItem(LS.profile) || "null") ||
      { owner: "Mallam Ibrahim", farm: "Gidan Noma Farm, Kano" };
    const initials = prof.owner.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
    aside.innerHTML =
      '<a class="logo" href="../index.html">' +
      '<span class="logo-mark"><svg width="20" height="20" viewBox="0 0 24 24" fill="none">' +
      '<path d="M12 21c0-6 2-10 8-13-1 7-3 11-8 13Z" fill="#123d22"/>' +
      '<path d="M12 21c0-6-2-10-8-13 1 7 3 11 8 13Z" fill="#1f8a4c"/>' +
      '<path d="M12 21V9" stroke="#123d22" stroke-width="1.6" stroke-linecap="round"/></svg></span>' +
      "<span>FarmTrack</span></a>" +
      '<nav class="side-nav">' +
      items.map(([id, href, ico, label]) =>
        `<a class="nav-item${id === active ? " active" : ""}" href="${href}">` +
        `<span class="nav-ico">${ico}</span><span>${label}</span></a>`).join("") +
      "</nav>" +
      '<div class="side-user">' +
      `<span class="avatar">${initials}</span>` +
      `<span><span class="u-name">${prof.owner}</span><br><span class="u-farm">${prof.farm}</span></span>` +
      "</div>";
  };

  /* ---------------- Toast ---------------- */
  let toastTimer;
  FT.toast = function (msg) {
    let t = document.querySelector(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
  };

  /* ---------------- Chart helpers ---------------- */
  const cssVar = (name) => getComputedStyle(root).getPropertyValue(name).trim();
  function el(tag, attrs) {
    const node = document.createElementNS(SVGNS, tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }
  function tooltipFor(wrap) {
    let tip = wrap.querySelector(".tooltip");
    if (!tip) { tip = document.createElement("div"); tip.className = "tooltip"; wrap.appendChild(tip); }
    return tip;
  }
  function niceMax(v) {
    const raw = v * 1.08;
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    for (const m of [1, 2, 2.5, 4, 5, 8, 10]) if (m * mag >= raw) return m * mag;
    return raw;
  }

  /* Multi-series line chart. series: [{name, colorVar, data(₦)}] */
  FT.lineChart = function (wrap, cfg) {
    wrap.querySelectorAll("svg").forEach((s) => s.remove());
    const labels = cfg.labels, series = cfg.series;
    const W = 640, H = 300, m = { t: 22, r: 86, b: 34, l: 46 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const maxY = niceMax(Math.max(...series.flatMap((s) => s.data)) / 1000);
    const x = (i) => m.l + (i / (labels.length - 1)) * iw;
    const y = (vK) => m.t + ih - (vK / maxY) * ih;

    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": cfg.ariaLabel || "Line chart" });
    for (let k = 0; k <= 4; k++) {
      const t = (maxY / 4) * k;
      svg.appendChild(el("line", { x1: m.l, x2: W - m.r, y1: y(t), y2: y(t), stroke: cssVar("--grid-line"), "stroke-width": 1 }));
      const lbl = el("text", { x: m.l - 9, y: y(t) + 4, "text-anchor": "end", "font-size": 11, fill: cssVar("--ink-muted") });
      lbl.textContent = Math.round(t);
      svg.appendChild(lbl);
    }
    svg.appendChild(el("line", { x1: m.l, x2: W - m.r, y1: y(0), y2: y(0), stroke: cssVar("--baseline"), "stroke-width": 1.4 }));
    labels.forEach((mo, i) => {
      const lbl = el("text", { x: x(i), y: H - 10, "text-anchor": "middle", "font-size": 11.5, fill: cssVar("--ink-muted") });
      lbl.textContent = mo;
      svg.appendChild(lbl);
    });

    series.forEach((s) => {
      const color = cssVar(s.colorVar);
      const pts = s.data.map((v, i) => `${x(i)},${y(v / 1000)}`).join(" ");
      if (s.fill) {
        svg.appendChild(el("polygon", {
          points: `${m.l},${y(0)} ${pts} ${x(labels.length - 1)},${y(0)}`,
          fill: color, opacity: 0.09,
        }));
      }
      svg.appendChild(el("polyline", { points: pts, fill: "none", stroke: color, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }));
      const li = s.data.length - 1;
      const endLbl = el("text", { x: x(li) + 10, y: y(s.data[li] / 1000) + 4, "font-size": 12, "font-weight": 700, fill: cssVar("--ink-secondary") });
      endLbl.textContent = s.name;
      svg.appendChild(endLbl);
    });

    const cross = el("line", { y1: m.t, y2: m.t + ih, stroke: cssVar("--baseline"), "stroke-width": 1, "stroke-dasharray": "3 3", opacity: 0 });
    svg.appendChild(cross);
    const dots = series.map((s) => {
      const d = el("circle", { r: 4.5, fill: cssVar(s.colorVar), stroke: cssVar("--surface-1"), "stroke-width": 2, opacity: 0 });
      svg.appendChild(d);
      return d;
    });
    const tip = tooltipFor(wrap);
    const hit = el("rect", { x: m.l, y: m.t, width: iw, height: ih, fill: "transparent" });
    hit.style.cursor = "crosshair";
    hit.addEventListener("mousemove", (ev) => {
      const box = svg.getBoundingClientRect();
      const sx = (ev.clientX - box.left) * (W / box.width);
      const i = Math.max(0, Math.min(labels.length - 1, Math.round(((sx - m.l) / iw) * (labels.length - 1))));
      cross.setAttribute("x1", x(i)); cross.setAttribute("x2", x(i)); cross.setAttribute("opacity", 1);
      series.forEach((s, k) => {
        dots[k].setAttribute("cx", x(i)); dots[k].setAttribute("cy", y(s.data[i] / 1000)); dots[k].setAttribute("opacity", 1);
      });
      tip.innerHTML = `<div class="tt-title">${labels[i]} 2026</div>` +
        series.map((s) => `<div class="tt-row"><span class="swatch" style="background:${cssVar(s.colorVar)}"></span>${s.name}: ${FT.NGN(s.data[i])}</div>`).join("");
      tip.style.left = (x(i) / W * 100) + "%";
      tip.style.top = (Math.min(...series.map((s) => y(s.data[i] / 1000))) / H * 100) + "%";
      tip.style.opacity = 1;
    });
    hit.addEventListener("mouseleave", () => {
      tip.style.opacity = 0; cross.setAttribute("opacity", 0);
      dots.forEach((d) => d.setAttribute("opacity", 0));
    });
    svg.appendChild(hit);
    wrap.appendChild(svg);
  };

  /* Horizontal bars. rows: [{label, val(₦)}] */
  FT.hbars = function (wrap, rows, cfg) {
    cfg = cfg || {};
    wrap.querySelectorAll("svg").forEach((s) => s.remove());
    const W = 420, H = Math.max(150, rows.length * 52 + 24);
    const m = { t: 14, r: 84, b: 10, l: 96 };
    const iw = W - m.l - m.r;
    const rowH = (H - m.t - m.b) / rows.length;
    const maxV = niceMax(Math.max(...rows.map((r) => r.val)));
    const color = cssVar(cfg.colorVar || "--series-1");
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": cfg.ariaLabel || "Bar chart" });
    const tip = tooltipFor(wrap);

    rows.forEach((r, i) => {
      const yMid = m.t + rowH * i + rowH / 2;
      const w = Math.max(2, (r.val / maxV) * iw);
      const lbl = el("text", { x: m.l - 12, y: yMid + 4.5, "text-anchor": "end", "font-size": 13, "font-weight": 600, fill: cssVar("--ink-secondary") });
      lbl.textContent = r.label;
      svg.appendChild(lbl);
      const bar = el("rect", { x: m.l, y: yMid - 10, width: w, height: 20, rx: 4, fill: color });
      bar.style.cursor = "pointer";
      bar.addEventListener("mousemove", (ev) => {
        const box = svg.getBoundingClientRect();
        tip.innerHTML = `<div class="tt-title">${r.label}</div><div class="tt-row">${FT.NGN(r.val)}</div>`;
        tip.style.left = ((ev.clientX - box.left) / box.width * 100) + "%";
        tip.style.top = ((yMid - 12) / H * 100) + "%";
        tip.style.opacity = 1;
      });
      bar.addEventListener("mouseleave", () => { tip.style.opacity = 0; });
      svg.appendChild(bar);
      const val = el("text", { x: m.l + w + 10, y: yMid + 4.5, "font-size": 12.5, "font-weight": 700, fill: cssVar("--ink-primary") });
      val.textContent = FT.NGNk(r.val);
      svg.appendChild(val);
    });
    svg.appendChild(el("line", { x1: m.l, x2: m.l, y1: m.t - 4, y2: H - m.b, stroke: cssVar("--baseline"), "stroke-width": 1.4 }));
    wrap.appendChild(svg);
  };

  /* Vertical columns (monthly). data: ₦ values, labels: months */
  FT.vbars = function (wrap, cfg) {
    wrap.querySelectorAll("svg").forEach((s) => s.remove());
    const labels = cfg.labels, data = cfg.data;
    const W = 640, H = 280, m = { t: 30, r: 16, b: 34, l: 46 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const maxY = niceMax(Math.max(...data) / 1000);
    const y = (vK) => m.t + ih - (vK / maxY) * ih;
    const slot = iw / data.length, barW = Math.min(46, slot * 0.55);
    const color = cssVar(cfg.colorVar || "--series-1");
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": cfg.ariaLabel || "Column chart" });
    const tip = tooltipFor(wrap);

    for (let k = 0; k <= 4; k++) {
      const t = (maxY / 4) * k;
      svg.appendChild(el("line", { x1: m.l, x2: W - m.r, y1: y(t), y2: y(t), stroke: cssVar("--grid-line"), "stroke-width": 1 }));
      const lbl = el("text", { x: m.l - 9, y: y(t) + 4, "text-anchor": "end", "font-size": 11, fill: cssVar("--ink-muted") });
      lbl.textContent = Math.round(t);
      svg.appendChild(lbl);
    }
    const best = data.indexOf(Math.max(...data));
    data.forEach((v, i) => {
      const cx = m.l + slot * i + slot / 2;
      const bar = el("rect", { x: cx - barW / 2, y: y(v / 1000), width: barW, height: Math.max(2, ih - (y(v / 1000) - m.t)), rx: 4, fill: color, opacity: i === best ? 1 : 0.75 });
      bar.style.cursor = "pointer";
      bar.addEventListener("mousemove", () => {
        tip.innerHTML = `<div class="tt-title">${labels[i]} 2026</div><div class="tt-row">${FT.NGN(v)}</div>`;
        tip.style.left = (cx / W * 100) + "%";
        tip.style.top = (y(v / 1000) / H * 100) + "%";
        tip.style.opacity = 1;
      });
      bar.addEventListener("mouseleave", () => { tip.style.opacity = 0; });
      svg.appendChild(bar);
      const lbl = el("text", { x: cx, y: H - 10, "text-anchor": "middle", "font-size": 11.5, fill: cssVar("--ink-muted") });
      lbl.textContent = labels[i];
      svg.appendChild(lbl);
      if (i === best || i === data.length - 1) {
        const vLbl = el("text", { x: cx, y: y(v / 1000) - 8, "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: cssVar("--ink-primary") });
        vLbl.textContent = FT.NGNk(v);
        svg.appendChild(vLbl);
      }
    });
    svg.appendChild(el("line", { x1: m.l, x2: W - m.r, y1: y(0), y2: y(0), stroke: cssVar("--baseline"), "stroke-width": 1.4 }));
    wrap.appendChild(svg);
  };
})();
