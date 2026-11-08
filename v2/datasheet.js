(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const sleep = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const NS = "http://www.w3.org/2000/svg";
  const svgEl = (tag, attrs = {}, text) => {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    if (text != null) el.textContent = text;
    return el;
  };

  /* ================= 1. Brochage ================= */
  const PINS = [
    [1, "JAVA", "Java : le langage de mes cours, pour bien organiser un programme"],
    [2, "JS", "JavaScript : rendre une page web interactive"],
    [3, "NODE", "Créer des serveurs web (Node.js, Express)"],
    [4, "SQL", "Concevoir et interroger des bases de données"],
    [5, "RISCV", "Assembleur : parler directement au processeur"],
    [6, "LLM", "Brancher une IA (Gemini) dans une application"],
    [7, "RAG", "Faire répondre une IA avec des infos précises, sans qu'elle invente"],
    [8, "WEB", "HTML et CSS : construire des pages qui marchent aussi sur mobile"],
    [9, "MODE", "Perso : je dirige l'IA · Université : je code tout seul"],
    [10, "GND", "La base : rigueur, tests, vérification"],
    [11, "CLK", "Le rythme : mes sessions à l'UQAM"],
    [12, "GIT", "Sauvegarder et partager du code, travailler en équipe"],
    [13, "SHELL", "Utiliser Linux et la ligne de commande"],
    [14, "REGEX", "Rechercher du texte avec des motifs précis"],
    [15, "UML", "Dessiner le plan d'un logiciel avant de le coder"],
    [16, "IDE", "Mes outils : IntelliJ, WebStorm, VS Code"],
    [17, "VM", "Machines virtuelles : tester sans rien casser"],
    [18, "SEC", "Sécurité : bloquer les abus et vérifier ce qu'on reçoit"],
    [19, "UX", "Penser à l'utilisateur : design et facilité d'usage"],
    [20, "VCC", "L'alimentation : le café ☕"],
  ];
  const chip = $("#chip"), pinBody = $("#pinTable tbody");
  const BX = 200, BW = 160, BY = 20, BH = 400, PITCH = 38;
  chip.append(svgEl("rect", { class: "body", x: BX, y: BY, width: BW, height: BH, rx: 4 }));
  chip.append(svgEl("circle", { class: "notch", cx: BX + BW / 2, cy: BY, r: 13 }));
  chip.append(svgEl("circle", { class: "notch", cx: BX + 22, cy: BY + 24, r: 4 }));
  const mid = BX + BW / 2;
  chip.append(svgEl("text", { class: "body-t", x: mid, y: 205 }, "AM-26"));
  chip.append(svgEl("text", { class: "body-s", x: mid, y: 228 }, "MELIOUH · UQAM"));
  chip.append(svgEl("text", { class: "body-s", x: mid, y: 246 }, "2026 · RÉV 2.0"));

  const pinEls = new Map();
  PINS.forEach(([n, name, desc]) => {
    const left = n <= 10;
    const idx = left ? n - 1 : 20 - n;
    const cy = BY + 31 + idx * PITCH;
    const g = svgEl("g", { class: "pin", "data-pin": n, tabindex: 0, role: "button", "aria-label": `Broche ${n}, ${name} : ${desc}` });
    g.append(svgEl("rect", { x: left ? BX - 30 : BX + BW, y: cy - 7, width: 30, height: 14 }));
    g.append(svgEl("text", { class: "num", x: left ? BX + 10 : BX + BW - 10, y: cy + 4, "text-anchor": left ? "start" : "end" }, n));
    g.append(svgEl("text", { class: "lbl", x: left ? BX - 38 : BX + BW + 38, y: cy + 4.5, "text-anchor": left ? "end" : "start" }, name));
    chip.append(g);
    const tr = document.createElement("tr");
    tr.dataset.pin = n;
    tr.innerHTML = `<td>${n}</td><td>${esc(name)}</td><td>${esc(desc)}</td>`;
    pinBody.append(tr);
    pinEls.set(n, { g, tr });
  });
  function lightPin(n, scroll) {
    pinEls.forEach(({ g, tr }, k) => { g.classList.toggle("on", k === n); tr.classList.toggle("on", k === n); });
    if (scroll && n) { const tr = pinEls.get(n).tr; tr.parentElement.closest(".pin-info").scrollTo({ top: tr.offsetTop - 60, behavior: "smooth" }); }
  }
  pinEls.forEach(({ g, tr }, n) => {
    g.addEventListener("pointerenter", () => lightPin(n, true));
    g.addEventListener("focus", () => lightPin(n, true));
    g.addEventListener("click", () => lightPin(n, true));
    tr.addEventListener("pointerenter", () => lightPin(n, false));
  });
  lightPin(9, false);

  /* ================= 2. Interrupteur de mode ================= */
  const blockFig = $("#blockFig"), swState = $("#swState");
  $$(".sw").forEach((b) => b.addEventListener("click", () => {
    const uqam = b.dataset.mode === "uqam";
    $$(".sw").forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); });
    blockFig.classList.toggle("mode-uqam", uqam);
    swState.textContent = uqam ? "IA débranchée : j'écris 100 % du code" : "L'IA écrit le code, je dirige";
  }));

  /* ================= 4.1 Chatbot ================= */
  const SITE = [
    "Horaires : du mardi au samedi de 7h à 18h, le dimanche de 8h à 13h. Fermé le lundi.",
    "Gâteaux d'anniversaire sur commande : 6 parts 32 $, 10 parts 48 $, 48 h à l'avance.",
    "Contact : 514 555-0199, 120 rue Démo, Montréal.",
    "Notre histoire : boulangerie familiale, levain naturel depuis 2012.",
    "Viennoiseries du jour : croissants, pains au chocolat, chaussons.",
  ];
  const QA = [
    { q: "Quels sont vos horaires ?", s: [5, 0, 1, 0, 1], a: "Ouvert du mardi au samedi de 7h à 18h, le dimanche de 8h à 13h. Fermé le lundi." },
    { q: "Prix d'un gâteau d'anniversaire ?", s: [0, 6, 0, 1, 1], a: "32 $ pour 6 parts, 48 $ pour 10 parts. À commander 48 h à l'avance." },
    { q: "Vous livrez à Laval ?", s: [0, 0, 1, 0, 0], a: "Je n'ai pas cette information. Contactez la boulangerie au 514 555-0199." },
  ];
  const log = $("#chatLog"), steps = $$("#steps span"), btns = $$("#chatBtns button"), cache = new Set();
  const line = (cls, html) => { const d = document.createElement("div"); d.className = "ln " + cls; d.innerHTML = html; log.append(d); log.scrollTop = log.scrollHeight; return d; };
  const step = (n) => steps.forEach((s, i) => { s.classList.toggle("on", i === n); s.classList.toggle("done", i < n); });
  async function typeInto(el, text) {
    for (let i = 1; i <= text.length; i++) { el.innerHTML = esc(text.slice(0, i)) + '<span class="cursor"></span>'; log.scrollTop = log.scrollHeight; await sleep(14); }
    el.textContent = text;
  }
  btns.forEach((b) => b.addEventListener("click", async () => {
    const qa = QA[+b.dataset.q];
    btns.forEach((x) => (x.disabled = true));
    line("user", esc(qa.q));
    if (cache.has(qa.q)) {
      step(4); line("sys", "&gt; Déjà demandé : réponse instantanée, sans redemander à l'IA"); line("bot", esc(qa.a));
    } else {
      step(0); line("sys", "&gt; Je lis les 5 pages du site de la boulangerie…"); await sleep(450);
      step(1); line("sys", "&gt; Je découpe le texte en petits morceaux…"); await sleep(400);
      line("sys", "&gt; Je note chaque morceau selon son lien avec la question :");
      step(2);
      const max = Math.max(...qa.s);
      const ranked = SITE.map((c, i) => ({ c, s: qa.s[i] })).sort((x, y) => y.s - x.s);
      for (const r of ranked) {
        const fill = max ? Math.round((r.s / max) * 10) : 0;
        line("score", `<b>[${"█".repeat(fill)}${"·".repeat(10 - fill)}]</b> ${r.s}  ${esc(r.c.slice(0, 38))}…`);
        await sleep(120);
      }
      const kept = ranked.filter((r) => r.s > 0).slice(0, 4).length;
      line("sys", `&gt; J'envoie les ${kept} meilleur(s) morceau(x) à l'IA (Gemini)…`);
      step(3); await sleep(700);
      step(4);
      await typeInto(line("bot", ""), qa.a);
      cache.add(qa.q);
    }
    btns.forEach((x) => (x.disabled = false));
    setTimeout(() => step(-1), 1000);
  }));

  /* ================= 4.2 Tengwar ================= */
  const qIn = $("#quenya"), twBody = $("#twBody"), twOut = $("#twOut"), twBox = $(".tw-in");
  function renderTw() {
    const val = qIn.value.trim();
    twBody.innerHTML = ""; twOut.classList.remove("err"); twBox.classList.remove("err");
    if (!val) { twOut.textContent = "—"; return; }
    try {
      const words = Tengwar.quenyaVersTengwar(val);
      let i = 0, rows = "";
      words.forEach((w, wi) => {
        w.forEach((t) => {
          i++;
          rows += `<tr class="${t.lead ? "lead" : ""}"><td>${i}</td><td>${esc(t.classic || "∅")}</td><td>${esc(t.name)}</td><td>${esc(t.cmd)}</td></tr>`;
        });
        if (wi < words.length - 1) rows += `<tr class="sp"><td colspan="4"></td></tr>`;
      });
      twBody.innerHTML = rows;
      twOut.textContent = words.map((w) => w.map((t) => t.cmd).join("")).join(" ");
    } catch (e) {
      twBox.classList.add("err"); twOut.classList.add("err");
      twOut.textContent = "✗ " + e.message + "\n  La romanisation respecte la casse : essaie en majuscules.";
    }
  }
  qIn.addEventListener("input", renderTw);
  $$(".tw-ex button").forEach((b) => b.addEventListener("click", () => { qIn.value = b.textContent; renderTw(); }));
  renderTw();

  /* ================= 4.3 Hanoï ================= */
  const hSvg = $("#hanoi"), hLog = $("#hanoiLog"), nIn = $("#hanoiN"), nOut = $("#hanoiNv"), run = $("#hanoiRun"), spEl = $("#sp");
  const PEG_X = [60, 180, 300], BASE = 132, DH = 15;
  const SP0 = 0x7fffeff0;
  let towers, diskEls, running = false;
  const hex = (v) => "0x" + v.toString(16);
  function hLine(t) { const d = document.createElement("div"); d.textContent = t; hLog.append(d); while (hLog.children.length > 4) hLog.firstChild.remove(); }
  function place(d) {
    const p = towers.findIndex((t) => t.includes(d));
    const h = towers[p].indexOf(d);
    diskEls[d].style.transform = `translate(${PEG_X[p]}px, ${BASE - (h + 1) * DH}px)`;
  }
  function setup(n) {
    hSvg.innerHTML = "";
    hSvg.append(svgEl("rect", { class: "base", x: 10, y: BASE, width: 340, height: 4 }));
    PEG_X.forEach((x, i) => {
      hSvg.append(svgEl("rect", { class: "peg", x: x - 2, y: 40, width: 4, height: BASE - 40 }));
      hSvg.append(svgEl("text", { class: "lbl", x, y: 148 }, `tour ${i + 1}`));
    });
    towers = [[], [], []]; diskEls = {};
    for (let d = n; d >= 1; d--) {
      const w = 22 + d * 15;
      const r = svgEl("rect", { class: "disk", x: -w / 2, y: 0, width: w, height: DH - 2, fill: "#5b3fd6", "fill-opacity": (0.12 + 0.75 * (d / n)).toFixed(2) });
      r.style.transition = reduce ? "none" : "transform .22s ease";
      hSvg.append(r); diskEls[d] = r; towers[0].push(d);
    }
    for (let d = 1; d <= n; d++) place(d);
    hLog.innerHTML = ""; hLine(`# prêt · a0 = ${n} · a1 = 1 · a2 = 3 · a3 = 2`);
    spEl.textContent = hex(SP0);
  }
  function moves(n, a, b, c, depth = 1, out = []) {
    if (n <= 0) return out;
    moves(n - 1, a, c, b, depth + 1, out); out.push([a, b, depth]); moves(n - 1, c, b, a, depth + 1, out);
    return out;
  }
  nIn.addEventListener("input", () => { nOut.textContent = nIn.value; if (!running) setup(+nIn.value); });
  run.addEventListener("click", async () => {
    if (running) return;
    running = true; run.disabled = true; nIn.disabled = true;
    const n = +nIn.value; setup(n);
    const list = moves(n, 1, 3, 2), t = Math.max(70, 330 - n * 40);
    for (const [a, b, depth] of list) {
      spEl.textContent = hex(SP0 - depth * 40);
      const d = towers[a - 1].pop();
      const el = diskEls[d];
      el.style.transform = `translate(${PEG_X[a - 1]}px, 14px)`; await sleep(t);
      el.style.transform = `translate(${PEG_X[b - 1]}px, 14px)`; await sleep(t);
      towers[b - 1].push(d); place(d);
      hLine(`Deplacer le disque de ${a} vers ${b}.`);
      await sleep(t);
    }
    spEl.textContent = hex(SP0);
    hLine(`# ${list.length} coups = 2^${n} - 1 ✓ · retour à l'appelant (ret)`);
    running = false; run.disabled = false; nIn.disabled = false;
  });
  setup(+nIn.value);

  /* ================= 5. Chronogramme ================= */
  const T = $("#timing");
  const COLS = ["Été 2025", "Aut. 2025", "Hiver 2026", "Été 2026", "Aut. 2026"];
  const SIGS = [
    { name: "TEMPS", desc: "les sessions", clk: true },
    { name: "WEB", desc: "j'apprends le web", hi: [[0, 5]] },
    { name: "JAVA", desc: "cours Programmation II", hi: [[2, 3]] },
    { name: "CHATBOT", desc: "projet perso avec l'IA", hi: [[2, 5]], acc: true },
    { name: "LINUX", desc: "cours Systèmes", hi: [[4, 5]] },
    { name: "ASSEMBLEUR", desc: "cours RISC-V", hi: [[4, 5]] },
    { name: "DONNÉES", desc: "cours Bases de données", hi: [[4, 5]] },
  ];
  const X0 = 170, X1 = 745, CW = (X1 - X0) / COLS.length, Y0 = 46, RH = 36, LO = 26, HI = 8, SL = 5;
  COLS.forEach((c, i) => {
    T.append(svgEl("text", { class: "hdr", x: X0 + CW * i + CW / 2, y: 24 }, c));
    T.append(svgEl("line", { class: "grid", x1: X0 + CW * i, y1: 32, x2: X0 + CW * i, y2: Y0 + SIGS.length * RH }));
  });
  T.append(svgEl("line", { class: "grid", x1: X1, y1: 32, x2: X1, y2: Y0 + SIGS.length * RH }));
  SIGS.forEach((s, r) => {
    const y = Y0 + r * RH;
    T.append(svgEl("text", { class: "name", x: 10, y: y + 17 }, s.name));
    T.append(svgEl("text", { class: "desc", x: 10, y: y + 29 }, s.desc));
    let d;
    if (s.clk) {
      d = `M${X0} ${y + LO}`;
      const half = CW / 4;
      for (let x = X0; x < X1 - 1; x += half * 2) d += ` H${x + half} V${y + HI} H${x + half * 2} V${y + LO}`;
      T.append(svgEl("path", { class: "clk", d }));
      return;
    }
    d = `M${X0} ${y + LO}`;
    for (const [a, b] of s.hi) {
      const xa = X0 + a * CW, xb = X0 + b * CW;
      T.append(svgEl("rect", { class: "hi", x: xa + SL, y: y + HI, width: Math.max(0, xb - xa - SL * (b === COLS.length ? 1 : 2)), height: LO - HI }));
      d += ` H${xa} L${xa + SL} ${y + HI} H${b === COLS.length ? X1 : xb - SL} ${b === COLS.length ? "" : `L${xb} ${y + LO}`}`;
    }
    const last = s.hi[s.hi.length - 1][1];
    if (last !== COLS.length) d += ` H${X1}`;
    T.append(svgEl("path", { class: "wave" + (s.acc ? " acc" : ""), d }));
  });
  T.setAttribute("viewBox", `0 0 760 ${Y0 + SIGS.length * RH + 6}`);
})();
