(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const sleep = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  $("#year").textContent = new Date().getFullYear();

  /* ---------- Starfield ---------- */
  const cv = $("#stars"), ctx = cv.getContext("2d");
  let stars = [], W = 0, H = 0;
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.round((W * H) / 9000) }, () => ({
      x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.2 + 0.2,
      s: Math.random() * 0.25 + 0.05, t: Math.random() * Math.PI * 2,
    }));
  }
  function drawStars() {
    ctx.clearRect(0, 0, W, H);
    for (const st of stars) {
      st.t += 0.02; st.y -= st.s; if (st.y < 0) st.y = H;
      ctx.globalAlpha = 0.35 + Math.sin(st.t) * 0.3;
      ctx.fillStyle = "#cfd0ff";
      ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill();
    }
    if (!reduce) requestAnimationFrame(drawStars);
  }
  resize(); drawStars(); addEventListener("resize", resize);

  /* ---------- Cursor glow, spotlight, nav ---------- */
  const glow = $(".cursor-glow");
  addEventListener("pointermove", (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  }, { passive: true });
  $$(".project, .spot").forEach((el) => el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }));
  const nav = $(".nav");
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 30), { passive: true });

  /* ---------- Tilt du terminal ---------- */
  const tilt = $(".tilt");
  if (tilt && !reduce && matchMedia("(pointer: fine)").matches) {
    tilt.addEventListener("pointermove", (e) => {
      const r = tilt.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    tilt.addEventListener("pointerleave", () => (tilt.style.transform = ""));
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: 0.12 });
  $$(".reveal").forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });

  /* ---------- Texte tapé ---------- */
  const phrases = ["parlent aux clients.", "comprennent les données.", "tournent au plus près du CPU.", "traduisent même l'elfique."];
  const typed = $("#typed");
  (async function loop() {
    let i = 0;
    for (;;) {
      const p = phrases[i++ % phrases.length];
      for (let k = 0; k <= p.length; k++) { typed.textContent = p.slice(0, k); await sleep(55); }
      await sleep(1800);
      for (let k = p.length; k >= 0; k--) { typed.textContent = p.slice(0, k); await sleep(28); }
      await sleep(300);
      if (reduce) { typed.textContent = phrases[0]; return; }
    }
  })();

  /* ---------- Terminal ---------- */
  const term = $("#term");
  const script = [
    ["cmd", "whoami"],
    ["out", '<span class="v">Amine Meliouh</span> — étudiant en informatique @ UQAM'],
    ["cmd", "cat stack.json"],
    ["out", '{\n  <span class="k">"web"</span>:  [<span class="v">"Node"</span>, <span class="v">"Express"</span>, <span class="v">"JS"</span>],\n  <span class="k">"code"</span>: [<span class="v">"Java"</span>, <span class="v">"SQL"</span>, <span class="v">"RISC-V"</span>],\n  <span class="k">"ia"</span>:   [<span class="v">"Gemini"</span>, <span class="v">"RAG"</span>]\n}'],
    ["cmd", "ls projets/"],
    ["out", 'chatbot-ia/  tengwar/  bd-residence/  riscv/'],
    ["cmd", "./status"],
    ["out", '<span class="p">●</span> ouvert aux stages et aux projets'],
  ];
  (async function runTerm() {
    let html = "";
    for (const [type, text] of script) {
      if (type === "cmd") {
        const pre = html + '<span class="p">➜</span> <span class="m">~</span> ';
        for (let k = 0; k <= text.length; k++) { term.innerHTML = pre + text.slice(0, k) + '<span class="caret">▋</span>'; await sleep(60); }
        html = pre + text + "\n"; await sleep(250);
      } else { html += text + "\n\n"; term.innerHTML = html; await sleep(650); }
    }
    term.innerHTML = html + '<span class="p">➜</span> <span class="m">~</span> <span class="caret">▋</span>';
  })();

  /* ---------- Démo chatbot ---------- */
  const SITE_CHUNKS = [
    "Horaires : du mardi au samedi de 7h à 18h, le dimanche de 8h à 13h. Fermé le lundi.",
    "Nos gâteaux d'anniversaire sur commande : 6 parts 32 $, 10 parts 48 $, commande 48 h à l'avance.",
    "Contact : 514 555-0199, ou passez nous voir au 120 rue Démo, Montréal.",
    "Notre histoire : une boulangerie familiale, levain naturel et farine locale depuis 2012.",
    "Viennoiseries du jour : croissants, pains au chocolat, chaussons aux pommes.",
  ];
  const QA = [
    { q: "Quels sont vos horaires ?", scores: [5, 0, 1, 0, 1],
      a: "Nous sommes ouverts du mardi au samedi de 7h à 18h, et le dimanche de 8h à 13h. Fermé le lundi 🙂" },
    { q: "Prix d'un gâteau d'anniversaire ?", scores: [0, 6, 0, 1, 1],
      a: "Un gâteau d'anniversaire coûte 32 $ pour 6 parts ou 48 $ pour 10 parts. Pensez à commander 48 h à l'avance !" },
    { q: "Vous livrez à Laval ?", scores: [0, 0, 1, 0, 0],
      a: "Je n'ai pas cette information. Le mieux est de contacter la boulangerie au 514 555-0199 📞" },
  ];
  const log = $("#chatLog"), chunksEl = $("#chunks"), steps = $$("#pipeline .step"), btns = $$("#chatSuggest button");
  const cache = new Map();
  function addMsg(cls, html) { const d = document.createElement("div"); d.className = `msg ${cls}`; d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; }
  function setStep(n) { steps.forEach((s, i) => { s.classList.toggle("on", i === n); s.classList.toggle("done", i < n); }); }
  btns.forEach((b) => b.addEventListener("click", async () => {
    const qa = QA[+b.dataset.q];
    btns.forEach((x) => (x.disabled = true));
    addMsg("user", esc(qa.q));
    if (cache.has(qa.q)) {
      setStep(4); await sleep(300); addMsg("bot", qa.a + ' <small style="opacity:.6">(cache ⚡)</small>');
    } else {
      setStep(0); await sleep(500);
      setStep(1); await sleep(450);
      setStep(2);
      const max = Math.max(...qa.scores);
      const ranked = SITE_CHUNKS.map((c, i) => ({ c, s: qa.scores[i] })).sort((a, b) => b.s - a.s);
      chunksEl.innerHTML = ranked.map((r, i) => `<div class="chunk ${i < 4 && r.s > 0 ? "top" : ""}"><em>${esc(r.c)}</em><span class="bar"><i data-w="${max ? (r.s / max) * 100 : 0}"></i></span><span>${r.s}</span></div>`).join("");
      chunksEl.classList.add("show");
      requestAnimationFrame(() => $$(".bar i", chunksEl).forEach((i) => (i.style.width = i.dataset.w + "%")));
      await sleep(1300);
      setStep(3);
      const t = addMsg("bot typing", "<span></span><span></span><span></span>");
      await sleep(1100);
      t.remove(); setStep(4);
      addMsg("bot", qa.a); cache.set(qa.q, true);
    }
    await sleep(400);
    chunksEl.classList.remove("show");
    btns.forEach((x) => (x.disabled = false));
    setTimeout(() => setStep(-1), 1200);
  }));

  /* ---------- Démo Tengwar ---------- */
  const qIn = $("#quenya"), tokEl = $("#tokens"), latexEl = $("#latex");
  function renderTengwar() {
    const val = qIn.value.trim();
    tokEl.innerHTML = ""; latexEl.classList.remove("err"); qIn.classList.remove("err");
    if (!val) { latexEl.textContent = ""; return; }
    try {
      const words = Tengwar.quenyaVersTengwar(val);
      let delay = 0;
      words.forEach((w, wi) => {
        w.forEach((t) => {
          const d = document.createElement("div");
          d.className = "tok" + (t.vowel ? " vowel" : "") + (t.lead ? " lead" : "");
          d.style.animationDelay = `${delay++ * 35}ms`;
          d.innerHTML = `<b>${esc(t.classic || "∅")}</b><small>${esc(t.name)}</small>`;
          tokEl.appendChild(d);
        });
        if (wi < words.length - 1) tokEl.appendChild(Object.assign(document.createElement("div"), { style: "width:12px" }));
      });
      latexEl.textContent = words.map((w) => w.map((t) => t.cmd).join("")).join(" ");
    } catch (e) {
      qIn.classList.add("err"); latexEl.classList.add("err");
      latexEl.textContent = "✗ " + e.message + "\n(la romanisation est sensible à la casse : essaie en majuscules)";
    }
  }
  qIn.addEventListener("input", renderTengwar);
  $$(".examples button").forEach((b) => b.addEventListener("click", () => { qIn.value = b.textContent; renderTengwar(); }));
  renderTengwar();

  /* ---------- Démo Hanoï ---------- */
  const pegs = $$("#hanoi .peg"), hLog = $("#hanoiLog"), nIn = $("#hanoiN"), nOut = $("#hanoiNv"), run = $("#hanoiRun");
  const colors = ["#ede9fe", "#ddd6fe", "#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed"];
  let running = false;
  function setupHanoi(n) {
    pegs.forEach((p) => (p.innerHTML = ""));
    for (let d = n; d >= 1; d--) {
      const el = document.createElement("div");
      el.className = "disk"; el.dataset.size = d;
      el.style.width = `${28 + d * 12}%`; el.style.background = colors[(d - 1) % colors.length];
      pegs[0].appendChild(el);
    }
    hLog.innerHTML = `<div>; prêt, a0 = ${n}</div>`;
  }
  function moves(n, from, to, via, out = []) {
    if (n <= 0) return out;
    moves(n - 1, from, via, to, out); out.push([from, to]); moves(n - 1, via, to, from, out);
    return out;
  }
  function logLine(t) { const d = document.createElement("div"); d.textContent = t; hLog.appendChild(d); while (hLog.children.length > 4) hLog.firstChild.remove(); }
  nIn.addEventListener("input", () => { nOut.textContent = nIn.value; if (!running) setupHanoi(+nIn.value); });
  run.addEventListener("click", async () => {
    if (running) return;
    running = true; run.disabled = true; nIn.disabled = true;
    const n = +nIn.value; setupHanoi(n);
    const list = moves(n, 1, 3, 2);
    const speed = Math.max(90, 520 - n * 70);
    for (const [a, b] of list) {
      const disk = pegs[a - 1].lastElementChild;
      disk.classList.add("lift"); await sleep(speed * 0.4);
      pegs[b - 1].appendChild(disk); disk.classList.remove("lift");
      logLine(`Deplacer le disque de ${a} vers ${b}.`);
      await sleep(speed * 0.6);
    }
    logLine(`; ${list.length} coups = 2^${n} - 1 ✓`);
    running = false; run.disabled = false; nIn.disabled = false;
  });
  setupHanoi(+nIn.value);
})();
