/* ============================================================
   PrabhatOS — the shell
   Power-on → POST → boot → lock → sign-in → desktop → shut down
   ============================================================ */

const OS = (() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const isTouch = () => window.matchMedia('(max-width: 760px)').matches;

  /* ---------- persisted config ---------- */
  const DEFAULTS = { theme: 'dark', accent: '#0078d4', wallpaper: 'mountain', fastBoot: false };
  let config = { ...DEFAULTS };
  try { Object.assign(config, JSON.parse(localStorage.getItem('prabhatos') || '{}')); } catch (e) { /* first run */ }

  function saveConfig() {
    try { localStorage.setItem('prabhatos', JSON.stringify(config)); } catch (e) { /* private mode */ }
  }
  function applyConfig() {
    document.body.dataset.theme = config.theme;
    document.documentElement.style.setProperty('--accent', config.accent);
    applyWallpaper();
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = config.theme === 'dark' ? '#202020' : '#f3f3f3';
  }

  /* Motion is a preference, and video is a download — honour both. */
  function skipMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    const net = navigator.connection;
    return !!(net && (net.saveData || /^(slow-)?2g$/.test(net.effectiveType || '')));
  }

  /* smaller cut on narrow screens; VP9 when the browser takes it */
  function pickWallpaperSrc(w) {
    const set = window.innerWidth <= 900 ? w.sources.small : w.sources.large;
    return document.createElement('video').canPlayType('video/webm; codecs="vp9"') ? set.webm : set.mp4;
  }

  let desktopReady = false;

  function applyWallpaper() {
    const w = WALLPAPERS.find((x) => x.id === config.wallpaper) || WALLPAPERS[0];
    const vid = $('#wallpaper-video');

    // the still is the backdrop everywhere the video does not run
    $('#desktop').style.background = w.css;
    $('#screen-lock').style.background = w.css;
    $('#screen-login').style.background = w.css;

    if (!vid) return;
    // hold the download back until the desktop is actually on screen
    if (!w.live || skipMotion() || !desktopReady) { stopWallpaperVideo(); return; }

    const src = pickWallpaperSrc(w);
    vid.classList.remove('hidden');
    if (vid.getAttribute('data-src') !== src) {
      vid.setAttribute('data-src', src);
      vid.poster = w.poster;
      vid.src = src;
    }
    // a refused autoplay just leaves the still showing, which is fine
    const play = vid.play();
    if (play && play.catch) play.catch(() => {});
  }

  function stopWallpaperVideo() {
    const vid = $('#wallpaper-video');
    if (!vid) return;
    vid.pause();
    if (vid.getAttribute('data-src')) {
      vid.removeAttribute('src');
      vid.removeAttribute('data-src');
      vid.load();               // release the decoder and stop buffering
    }
    vid.classList.add('hidden');
  }
  function setConfig(patch) { Object.assign(config, patch); saveConfig(); applyConfig(); }

  /* ============================================================
     Screens
     ============================================================ */
  const screens = ['off', 'bios', 'boot', 'lock', 'login', 'halt', 'sleep'];
  let state = 'off';

  function show(name) {
    state = name;
    screens.forEach((s) => $('#screen-' + s).classList.toggle('hidden', s !== name));
    $('#screens').classList.toggle('hidden', name === 'desktop');
    $('#desktop').classList.toggle('hidden', name !== 'desktop');
  }

  const BIOS_LINES = [
    ['PrabhatOS BIOS v2.0.2026 — Prabhat Thakur', 60],
    ['Copyright (C) 2026, Full-Stack Systems', 40],
    ['', 20],
    ['CPU        : Full-Stack Engineering Core @ 4.2 GHz', 90],
    ['Memory Test: 65536K  <span class="ok">OK</span>', 140],
    ['', 30],
    ['Detecting IDE drives ...', 120],
    ['  Primary   Master : <span class="ok">REACT-TYPESCRIPT-SSD</span>', 90],
    ['  Primary   Slave  : <span class="ok">NODE-EXPRESS-PRISMA</span>', 90],
    ['  Secondary Master : <span class="ok">FASTAPI-POSTGRES</span>', 90],
    ['  Secondary Slave  : <span class="ok">JAVA-SPRINGBOOT</span>', 90],
    ['', 30],
    ['Mounting AWS volumes (EC2 · S3 · IAM · CloudFront · Lambda) <span class="ok">OK</span>', 150],
    ['Loading projects .......... <span class="ok">4 found</span>', 140],
    ['Verifying JWT keyring ..... <span class="ok">OK</span>', 120],
    ['', 30],
    ['<span class="dim">Booting from PRABHAT-OS ...</span>', 200]
  ];

  async function runBios() {
    show('bios');
    const log = $('#bios-log');
    log.innerHTML = '';
    for (const [text, ms] of BIOS_LINES) {
      if (state !== 'bios') return;
      log.insertAdjacentHTML('beforeend', text + '\n');
      await wait(ms);
    }
    if (state === 'bios') runBoot();
  }

  async function runBoot() {
    show('boot');
    const bar = $('#boot-bar');
    bar.style.width = '0%';
    const steps = [18, 42, 61, 79, 93, 100];
    for (const s of steps) {
      if (state !== 'boot') return;
      await wait(280);
      bar.style.width = s + '%';
    }
    await wait(420);
    if (state === 'boot') goLock();
  }

  function goLock() {
    show('lock');
    $('#screen-lock').classList.remove('lifting');
    // reset the sign-in card so a second sign-in behaves like the first
    $('#login-form-wrap').classList.remove('hidden');
    $('#login-welcome').classList.add('hidden');
    const pin = $('#pin');
    if (pin) pin.value = '';
    tickClock();
  }

  function unlock() {
    if (state !== 'lock') return;
    $('#screen-lock').classList.add('lifting');
    setTimeout(() => { show('login'); setTimeout(() => $('#pin')?.focus(), 120); }, 380);
  }

  async function signIn() {
    if (state !== 'login') return;
    $('#login-form-wrap').classList.add('hidden');
    $('#login-welcome').classList.remove('hidden');
    await wait(1500);
    enterDesktop();
  }

  function enterDesktop() {
    show('desktop');
    desktopReady = true;
    applyWallpaper();
    $('#desktop').classList.add('booting');
    setTimeout(() => $('#desktop').classList.remove('booting'), 700);
    setTimeout(() => {
      toast('Welcome to PrabhatOS', 'Everything here is a real project. Open <b>Projects</b>, or try the <b>Terminal</b> — type <b>help</b>.', I.winMono);
    }, 1100);
  }

  /* ---------- power ---------- */
  async function power(kind) {
    closeAllFlyouts();
    desktopReady = false;
    stopWallpaperVideo();
    if (kind === 'sleep') {
      show('sleep');
      return;
    }
    $('#halt-text').textContent = kind === 'restart' ? 'Restarting' : 'Shutting down';
    show('halt');
    await wait(2200);
    // tear the session down so a restart really is a cold start
    $$('.win').forEach((w) => w.remove());
    winState.clear();
    activeId = null;
    zTop = 100;
    renderTaskbar();
    if (kind === 'restart') { config.fastBoot ? goLock() : runBios(); }
    else show('off');
  }

  function powerOn() {
    if (state !== 'off') return;
    if (config.fastBoot) { show('boot'); runBoot(); }
    else runBios();
  }

  /* ============================================================
     Window manager
     ============================================================ */
  const winState = new Map(); // id -> {el, min, max, prev}
  let zTop = 100;
  let activeId = null;

  function bounds() {
    return { w: window.innerWidth, h: window.innerHeight - $('#taskbar').offsetHeight };
  }

  function focusWin(id) {
    const s = winState.get(id);
    if (!s) return;
    activeId = id;
    s.el.style.zIndex = ++zTop;
    winState.forEach((v, k) => v.el.classList.toggle('inactive', k !== id));
    renderTaskbar();
  }

  function openApp(id, opts = {}) {
    closeAllFlyouts();
    if (winState.has(id)) {
      const s = winState.get(id);
      if (s.min) restoreWin(id); else focusWin(id);
      return;
    }
    const app = opts.app || APPS[id];
    if (!app) return;
    const built = app.build();

    const w = el('div', 'win');
    w.dataset.id = id;
    w.setAttribute('role', 'dialog');
    w.setAttribute('aria-label', app.title);

    const b = bounds();
    const openMax = isTouch();
    const width = Math.min(app.w, b.w - 24);
    const height = Math.min(app.h, b.h - 24);
    const n = winState.size;
    const left = Math.max(12, Math.min((b.w - width) / 2 + (n % 5) * 26 - 52, b.w - width - 12));
    const top = Math.max(10, Math.min((b.h - height) / 2 + (n % 5) * 22 - 44, b.h - height - 12));
    Object.assign(w.style, { left: left + 'px', top: top + 'px', width: width + 'px', height: height + 'px', zIndex: ++zTop });

    w.innerHTML = `
      <div class="win-bar">
        <span class="icon">${app.icon}</span>
        <span class="win-title">${app.title}</span>
        <div class="win-controls">
          <button class="wc-min" title="Minimize" aria-label="Minimize">${I.min}</button>
          <button class="wc-max" title="Maximize" aria-label="Maximize">${I.max}</button>
          <button class="close wc-close" title="Close" aria-label="Close">${I.close}</button>
        </div>
      </div>
      <div class="win-body"></div>
      ${['n', 's', 'w', 'e', 'nw', 'ne', 'sw', 'se'].map((d) => `<div class="rz rz-${d}" data-dir="${d}"></div>`).join('')}`;

    const body = $('.win-body', w);
    body.innerHTML = built.html;
    if (app.pad === false) body.style.overflow = id === 'projects' ? 'hidden' : 'auto';

    $('#windows').appendChild(w);
    winState.set(id, { el: w, min: false, max: false, prev: null, title: app.title, icon: app.icon });

    if (built.mount) built.mount(body, w);
    wireWindow(w, id);
    wireContentLinks(body);
    if (openMax) toggleMax(id, true);
    focusWin(id);
    renderTaskbar();
  }

  function openProject(pid) {
    const p = PROJECTS.find((x) => x.id === pid);
    if (!p) return;
    openApp('project-' + pid, {
      app: { title: p.name + ' — Properties', icon: I.folderOpen, w: 700, h: 600, build: () => appProject(pid) }
    });
  }

  function closeApp(id) {
    const s = winState.get(id);
    if (!s) return;
    s.el.classList.add('closing');
    setTimeout(() => {
      s.el.remove();
      winState.delete(id);
      if (activeId === id) {
        activeId = null;
        const last = Array.from(winState.entries()).filter(([, v]) => !v.min).pop();
        if (last) focusWin(last[0]);
      }
      renderTaskbar();
    }, 130);
  }

  function minimizeWin(id) {
    const s = winState.get(id);
    if (!s || s.min) return;
    s.min = true;
    s.el.classList.add('minimized');
    setTimeout(() => { if (s.min) s.el.style.visibility = 'hidden'; }, 160);
    if (activeId === id) activeId = null;
    renderTaskbar();
  }

  function restoreWin(id) {
    const s = winState.get(id);
    if (!s) return;
    s.min = false;
    s.el.style.visibility = '';
    s.el.classList.remove('minimized');
    focusWin(id);
  }

  function toggleMax(id, force) {
    const s = winState.get(id);
    if (!s) return;
    const next = force !== undefined ? force : !s.max;
    const btn = $('.wc-max', s.el);
    if (next) {
      s.prev = { left: s.el.style.left, top: s.el.style.top, width: s.el.style.width, height: s.el.style.height };
      const b = bounds();
      Object.assign(s.el.style, { left: '0px', top: '0px', width: b.w + 'px', height: b.h + 'px' });
      s.el.classList.add('maximized');
      btn.innerHTML = I.restore;
      btn.title = 'Restore';
    } else {
      if (s.prev) Object.assign(s.el.style, s.prev);
      s.el.classList.remove('maximized');
      btn.innerHTML = I.max;
      btn.title = 'Maximize';
    }
    s.max = next;
  }

  function snapTo(id, side) {
    const s = winState.get(id);
    if (!s) return;
    const b = bounds();
    if (s.max) toggleMax(id, false);
    const rects = {
      left: { left: 0, top: 0, width: b.w / 2, height: b.h },
      right: { left: b.w / 2, top: 0, width: b.w / 2, height: b.h }
    };
    const r = rects[side];
    Object.assign(s.el.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
  }

  /* ---------- drag / resize ---------- */
  function wireWindow(w, id) {
    const s = winState.get(id);
    const bar = $('.win-bar', w);

    w.addEventListener('pointerdown', () => focusWin(id), true);
    $('.wc-min', w).onclick = (e) => { e.stopPropagation(); minimizeWin(id); };
    $('.wc-max', w).onclick = (e) => { e.stopPropagation(); toggleMax(id); };
    $('.wc-close', w).onclick = (e) => { e.stopPropagation(); closeApp(id); };
    bar.addEventListener('dblclick', (e) => { if (!e.target.closest('.win-controls')) toggleMax(id); });

    /* drag */
    bar.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.win-controls') || e.button !== 0 || isTouch()) return;
      const startX = e.clientX, startY = e.clientY;
      let ox, oy, moved = false, snapSide = null;
      const preview = $('#snap-preview');

      const begin = () => {
        if (s.max) {
          const ratio = (startX - w.getBoundingClientRect().left) / w.offsetWidth;
          toggleMax(id, false);
          ox = w.offsetWidth * ratio;
          oy = 20;
        } else {
          const r = w.getBoundingClientRect();
          ox = startX - r.left;
          oy = startY - r.top;
        }
        w.classList.add('dragging');
      };

      const move = (ev) => {
        if (!moved) {
          if (Math.abs(ev.clientX - startX) < 4 && Math.abs(ev.clientY - startY) < 4) return;
          moved = true;
          begin();
        }
        const b = bounds();
        let nx = ev.clientX - ox;
        let ny = Math.max(0, ev.clientY - oy);
        nx = Math.max(-w.offsetWidth + 90, Math.min(nx, b.w - 90));
        ny = Math.min(ny, b.h - 42);
        w.style.left = nx + 'px';
        w.style.top = ny + 'px';

        snapSide = ev.clientY <= 4 ? 'max' : ev.clientX <= 6 ? 'left' : ev.clientX >= b.w - 6 ? 'right' : null;
        if (snapSide) {
          const r = snapSide === 'max' ? { left: 0, top: 0, width: b.w, height: b.h }
            : snapSide === 'left' ? { left: 0, top: 0, width: b.w / 2, height: b.h }
              : { left: b.w / 2, top: 0, width: b.w / 2, height: b.h };
          Object.assign(preview.style, { left: r.left + 4 + 'px', top: r.top + 4 + 'px', width: r.width - 8 + 'px', height: r.height - 8 + 'px' });
          preview.classList.remove('hidden');
        } else preview.classList.add('hidden');
      };

      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        w.classList.remove('dragging');
        preview.classList.add('hidden');
        if (snapSide === 'max') toggleMax(id, true);
        else if (snapSide) snapTo(id, snapSide);
      };

      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    });

    /* resize */
    $$('.rz', w).forEach((h) => h.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || s.max) return;
      e.preventDefault();
      e.stopPropagation();
      const dir = h.dataset.dir;
      const r = w.getBoundingClientRect();
      const sx = e.clientX, sy = e.clientY;
      const b = bounds();
      w.classList.add('resizing');

      const move = (ev) => {
        const dx = ev.clientX - sx, dy = ev.clientY - sy;
        let { left, top, width, height } = { left: r.left, top: r.top, width: r.width, height: r.height };
        if (dir.includes('e')) width = Math.max(320, r.width + dx);
        if (dir.includes('s')) height = Math.max(200, r.height + dy);
        if (dir.includes('w')) { width = Math.max(320, r.width - dx); left = r.right - width; }
        if (dir.includes('n')) { height = Math.max(200, r.height - dy); top = r.bottom - height; }
        top = Math.max(0, Math.min(top, b.h - 60));
        Object.assign(w.style, { left: left + 'px', top: top + 'px', width: width + 'px', height: height + 'px' });
      };
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        w.classList.remove('resizing');
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    }));
  }

  /* data-open links inside app content */
  function wireContentLinks(root) {
    $$('[data-open]', root).forEach((n) => n.addEventListener('click', (e) => {
      e.preventDefault();
      openApp(n.dataset.open);
    }));
  }

  /* ============================================================
     Taskbar / Start / flyouts
     ============================================================ */
  const PINNED = ['about', 'projects', 'experience', 'skills', 'resume', 'contact', 'terminal', 'settings'];

  function renderTaskbar() {
    const host = $('#tb-apps');
    host.innerHTML = '';
    const shown = new Set();
    const add = (id, title, icon) => {
      if (shown.has(id)) return;
      shown.add(id);
      const running = winState.has(id);
      const b = el('button', 'tb-btn app' + (running ? ' active' : '') + (activeId === id ? ' focused' : ''));
      b.innerHTML = `<span class="icon">${icon}</span>`;
      b.title = title;
      b.setAttribute('aria-label', title);
      b.onclick = () => {
        const s = winState.get(id);
        if (!s) openApp(id);
        else if (activeId === id && !s.min) minimizeWin(id);
        else restoreWin(id);
      };
      host.appendChild(b);
    };
    PINNED.forEach((id) => add(id, APPS[id].title, APPS[id].icon));
    winState.forEach((s, id) => { if (!PINNED.includes(id)) add(id, s.title, s.icon); });
  }

  function renderStart() {
    const menu = $('#start-menu');
    menu.innerHTML = `
      <div class="start-search">${I.search}<input id="start-q" placeholder="Search apps and projects" aria-label="Search"></div>
      <div class="start-scroll">
        <div class="start-label"><span>Pinned</span></div>
        <div class="start-grid" id="start-grid">
          ${Object.entries(APPS).map(([id, a]) => `
            <button class="start-tile" data-app="${id}"><span class="icon" style="width:30px;height:30px">${a.icon}</span><span>${a.title.split(' — ')[0]}</span></button>`).join('')}
        </div>
        <div class="start-label"><span>Recommended</span></div>
        <div class="start-rec" id="start-rec">
          ${PROJECTS.map((p) => `
            <button class="rec-item" data-proj="${p.id}">${I.folder}<span><b>${p.file}</b><small>${p.subtitle}</small></span></button>`).join('')}
        </div>
      </div>
      <div class="start-foot">
        <div class="start-user"><span class="avatar">${PROFILE.initials}</span><b>${PROFILE.name}</b></div>
        <button class="icon-btn" id="power-btn" title="Power" aria-label="Power">${I.power}</button>
      </div>`;

    $$('.start-tile', menu).forEach((b) => b.onclick = () => { openApp(b.dataset.app); closeStart(); });
    $$('.rec-item', menu).forEach((b) => b.onclick = () => { openProject(b.dataset.proj); closeStart(); });
    $('#power-btn', menu).onclick = (e) => { e.stopPropagation(); togglePowerMenu(); };

    const q = $('#start-q', menu);
    q.addEventListener('input', () => {
      const v = q.value.trim().toLowerCase();
      $$('.start-tile', menu).forEach((t) => {
        t.style.display = !v || APPS[t.dataset.app].title.toLowerCase().includes(v) ? '' : 'none';
      });
      $$('.rec-item', menu).forEach((t) => {
        const p = PROJECTS.find((x) => x.id === t.dataset.proj);
        const hay = (p.name + p.subtitle + p.stack.join(' ')).toLowerCase();
        t.style.display = !v || hay.includes(v) ? '' : 'none';
      });
    });
    q.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const tile = $$('.start-tile', menu).find((t) => t.style.display !== 'none');
      if (tile) { openApp(tile.dataset.app); closeStart(); }
    });
  }

  function openStart() {
    renderStart();
    $('#start-menu').classList.remove('hidden');
    $('#start-btn').classList.add('open');
    setTimeout(() => $('#start-q')?.focus(), 60);
  }
  function closeStart() {
    $('#start-menu').classList.add('hidden');
    $('#start-btn').classList.remove('open');
    $('#power-menu').classList.add('hidden');
  }
  function toggleStart() {
    $('#start-menu').classList.contains('hidden') ? openStart() : closeStart();
  }

  function togglePowerMenu() {
    const m = $('#power-menu');
    if (!m.classList.contains('hidden')) { m.classList.add('hidden'); return; }
    const btn = $('#power-btn');
    const r = btn.getBoundingClientRect();
    m.classList.remove('hidden');
    m.style.left = Math.max(8, r.right - m.offsetWidth) + 'px';
    m.style.top = (r.top - m.offsetHeight - 8) + 'px';
  }

  function closeAllFlyouts() {
    closeStart();
    $('#tray-flyout').classList.add('hidden');
    $('#cal-flyout').classList.add('hidden');
    $('#weather-flyout').classList.add('hidden');
    $('#ctx-menu').classList.add('hidden');
  }

  function toggleFlyout(sel) {
    const n = $(sel);
    const wasHidden = n.classList.contains('hidden');
    closeAllFlyouts();
    if (wasHidden) n.classList.remove('hidden');
  }

  /* ---------- clock / calendar ---------- */
  function tickClock() {
    const now = new Date();
    const t = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const d = now.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });
    const clock = $('#clock');
    if (clock) clock.innerHTML = `<div>${t}</div><div>${d}</div>`;
    const lt = $('#lock-time'), ld = $('#lock-date');
    if (lt) lt.textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    if (ld) ld.textContent = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
    const ct = $('#cal-time'), cd = $('#cal-date');
    if (ct) ct.textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });
    if (cd) cd.textContent = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }

  function renderCalendar() {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    let g = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => `<b>${d}</b>`).join('');
    for (let i = 0; i < first; i++) g += '<i></i>';
    for (let d = 1; d <= days; d++) g += `<i class="${d === now.getDate() ? 'today' : ''}">${d}</i>`;
    $('#cal-grid').innerHTML = g;
  }

  /* ---------- weather (Open-Meteo, no key required) ---------- */
  const WEATHER_PLACE = { name: 'New Delhi', lat: 28.6139, lon: 77.2090 };

  /* WMO weather codes → label + icon */
  const WMO = [
    [[0], 'Clear', 'wSun'],
    [[1], 'Mainly clear', 'wSun'],
    [[2], 'Partly cloudy', 'wPartly'],
    [[3], 'Overcast', 'wCloud'],
    [[45, 48], 'Fog', 'wFog'],
    [[51, 53, 55, 56, 57], 'Drizzle', 'wRain'],
    [[61, 63, 65, 66, 67], 'Rain', 'wRain'],
    [[71, 73, 75, 77], 'Snow', 'wSnow'],
    [[80, 81, 82], 'Showers', 'wRain'],
    [[85, 86], 'Snow showers', 'wSnow'],
    [[95, 96, 99], 'Thunderstorm', 'wStorm']
  ];
  const wmo = (code) => {
    const hit = WMO.find(([codes]) => codes.includes(code));
    return hit ? { label: hit[1], icon: I[hit[2]] } : { label: 'Unavailable', icon: I.wCloud };
  };

  let weather = null;

  async function loadWeather() {
    const url = 'https://api.open-meteo.com/v1/forecast'
      + `?latitude=${WEATHER_PLACE.lat}&longitude=${WEATHER_PLACE.lon}`
      + '&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code'
      + '&daily=weather_code,temperature_2m_max,temperature_2m_min'
      + '&timezone=auto&forecast_days=4';
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      weather = await res.json();
    } catch (e) {
      weather = null;                       // offline, blocked, or the API is down
    }
    renderWeather();
  }

  function renderWeather() {
    const btn = $('#weather-btn');
    if (!btn) return;
    if (!weather) {
      // never invent a temperature — show the place and let the flyout explain
      btn.classList.remove('loading');
      $('#w-icon').innerHTML = I.wCloud;
      $('#w-temp').textContent = WEATHER_PLACE.name;
      $('#w-desc').textContent = 'Weather unavailable';
      return;
    }
    const c = weather.current;
    const { label, icon } = wmo(c.weather_code);
    btn.classList.remove('loading');
    $('#w-icon').innerHTML = icon;
    $('#w-temp').textContent = Math.round(c.temperature_2m) + '°C';
    $('#w-desc').textContent = `${label} · ${WEATHER_PLACE.name}`;
  }

  function renderWeatherFlyout() {
    const f = $('#weather-flyout');
    if (!weather) {
      f.innerHTML = `<div class="wf-err">
        Live weather for ${WEATHER_PLACE.name} could not be loaded — the device may be offline
        or the forecast service unreachable.
        <div style="margin-top:12px"><button class="toast-btn" id="w-retry">Try again</button></div>
      </div>`;
      $('#w-retry').onclick = (e) => { e.stopPropagation(); loadWeather().then(renderWeatherFlyout); };
      return;
    }
    const c = weather.current;
    const d = weather.daily;
    const now = wmo(c.weather_code);
    const days = d.time.map((t, i) => ({
      day: i === 0 ? 'Today' : new Date(t).toLocaleDateString([], { weekday: 'short' }),
      ...wmo(d.weather_code[i]),
      hi: Math.round(d.temperature_2m_max[i]),
      lo: Math.round(d.temperature_2m_min[i])
    }));
    f.innerHTML = `
      <div class="wf-head">
        ${now.icon}
        <div>
          <div class="wf-temp">${Math.round(c.temperature_2m)}°C</div>
          <div class="wf-desc">${now.label}</div>
          <div class="wf-place">${WEATHER_PLACE.name}, India</div>
        </div>
      </div>
      <div class="wf-meta">
        <div>Feels like<b>${Math.round(c.apparent_temperature)}°C</b></div>
        <div>Humidity<b>${Math.round(c.relative_humidity_2m)}%</b></div>
        <div>Wind<b>${Math.round(c.wind_speed_10m)} km/h</b></div>
      </div>
      <div class="wf-days">
        ${days.map((x) => `<div class="wf-day">${x.day}${x.icon}<b>${x.hi}°</b><span>${x.lo}°</span></div>`).join('')}
      </div>`;
  }

  /* ---------- context menu ---------- */
  function openCtx(x, y) {
    const m = $('#ctx-menu');
    m.classList.remove('hidden');
    const w = m.offsetWidth, h = m.offsetHeight;
    m.style.left = Math.min(x, window.innerWidth - w - 8) + 'px';
    m.style.top = Math.min(y, window.innerHeight - h - 60) + 'px';
  }

  /* ---------- toasts ---------- */
  function toast(title, body, icon, onMount) {
    const t = el('div', 'toast', `
      <div class="toast-head">${icon || I.bell}<span>PrabhatOS</span></div>
      <b>${title}</b><p>${body}</p>`);
    $('#toasts').appendChild(t);
    const kill = () => { t.classList.add('out'); setTimeout(() => t.remove(), 260); };
    t.addEventListener('click', kill);
    // actions must not dismiss the toast out from under the click
    if (onMount) onMount(t, kill);
    setTimeout(kill, onMount ? 20000 : 8000);
  }

  /* ============================================================
     Desktop icons
     ============================================================ */
  const DESK = [
    { id: 'about', label: 'About This PC', icon: I.pc },
    { id: 'projects', label: 'Projects', icon: I.folder },
    { id: 'experience', label: 'Experience', icon: I.briefcase },
    { id: 'skills', label: 'Skills', icon: I.chart },
    { id: 'ai', label: 'AI Enablement', icon: I.sparkle },
    { id: 'resume', label: 'Resume.txt', icon: I.pdf },
    { id: 'contact', label: 'Contact', icon: I.mail },
    { id: 'terminal', label: 'Terminal', icon: I.terminal },
    { id: 'settings', label: 'Settings', icon: I.gear },
    { id: 'bin', label: 'Recycle Bin', icon: I.bin }
  ];

  function renderDesktopIcons() {
    const host = $('#desktop-icons');
    host.innerHTML = '';
    DESK.forEach((d) => {
      const b = el('button', 'dicon', `<span class="icon" style="width:38px;height:38px">${d.icon}</span><span>${d.label}</span>`);
      b.title = 'Open ' + d.label;
      let timer = null;
      b.addEventListener('click', () => {
        $$('.dicon').forEach((x) => x.classList.toggle('selected', x === b));
        if (isTouch()) { openApp(d.id); return; }
        clearTimeout(timer);
        timer = setTimeout(() => { }, 250);
      });
      b.addEventListener('dblclick', () => { clearTimeout(timer); openApp(d.id); });
      b.addEventListener('keydown', (e) => { if (e.key === 'Enter') openApp(d.id); });
      host.appendChild(b);
    });
  }

  /* ============================================================
     Wiring
     ============================================================ */
  function init() {
    applyConfig();
    renderDesktopIcons();
    renderTaskbar();
    renderCalendar();
    tickClock();
    $('#tb-search-icon').innerHTML = I.searchColor;
    $('#tb-search-thumb').innerHTML = I.searchThumb;
    setInterval(tickClock, 1000);

    /* power on */
    $('#power-on').onclick = powerOn;
    $('#screen-off').onclick = (e) => { if (e.target.closest('#screen-off')) powerOn(); };
    $('#bios-skip').onclick = () => { state = 'bios-skipped'; show('boot'); state = 'boot'; runBoot(); };

    /* lock → login */
    $('#screen-lock').onclick = unlock;
    $('#screen-sleep').onclick = () => { goLock(); };

    /* login */
    $('#login-form').addEventListener('submit', (e) => { e.preventDefault(); signIn(); });

    /* taskbar */
    $('#start-btn').onclick = (e) => { e.stopPropagation(); toggleStart(); };
    $('#tb-search').onclick = (e) => { e.stopPropagation(); openStart(); };
    $('#tray-btn').onclick = (e) => { e.stopPropagation(); toggleFlyout('#tray-flyout'); };
    $('#clock').onclick = (e) => { e.stopPropagation(); renderCalendar(); toggleFlyout('#cal-flyout'); };
    $('#weather-btn').onclick = (e) => { e.stopPropagation(); renderWeatherFlyout(); toggleFlyout('#weather-flyout'); };
    $('#show-desktop').onclick = () => {
      const anyOpen = Array.from(winState.values()).some((s) => !s.min);
      winState.forEach((s, id) => anyOpen ? minimizeWin(id) : restoreWin(id));
    };

    /* power menu */
    $$('#power-menu .power-item').forEach((b) => b.onclick = () => power(b.dataset.power));

    /* tray flyout */
    $$('.tray-tile').forEach((t) => t.onclick = () => {
      if (t.dataset.theme) { setConfig({ theme: config.theme === 'dark' ? 'light' : 'dark' }); syncTray(); return; }
      t.classList.toggle('on');
    });
    $('#tray-settings').onclick = () => { closeAllFlyouts(); openApp('settings'); };

    /* desktop context menu */
    $('#desktop').addEventListener('contextmenu', (e) => {
      if (e.target.closest('.win') || e.target.closest('#taskbar')) return;
      e.preventDefault();
      openCtx(e.clientX, e.clientY);
    });
    $$('#ctx-menu .ctx-item').forEach((b) => b.onclick = () => {
      const a = b.dataset.ctx;
      $('#ctx-menu').classList.add('hidden');
      if (a === 'refresh') { renderDesktopIcons(); toast('Desktop', 'Refreshed.'); }
      else if (a === 'theme') setConfig({ theme: config.theme === 'dark' ? 'light' : 'dark' });
      else if (a === 'lock') { closeAllFlyouts(); goLock(); }
      else openApp(a);
    });

    /* global dismiss */
    document.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.flyout') || e.target.closest('#start-btn') || e.target.closest('#tray-btn')
        || e.target.closest('#clock') || e.target.closest('#weather-btn')) return;
      closeAllFlyouts();
      if (!e.target.closest('.dicon')) $$('.dicon').forEach((x) => x.classList.remove('selected'));
    });

    /* keyboard */
    document.addEventListener('keydown', (e) => {
      if (state === 'lock') { unlock(); return; }
      if (state === 'sleep') { goLock(); return; }
      if (state === 'off' && (e.key === 'Enter' || e.key === ' ')) { powerOn(); return; }
      if (state !== 'desktop') return;
      if (e.key === 'Escape') closeAllFlyouts();
      if (e.key === 'Meta' || (e.ctrlKey && e.key === 'Escape')) { e.preventDefault(); toggleStart(); }
      if (activeId && e.altKey && e.key === 'F4') { e.preventDefault(); closeApp(activeId); }
      if (activeId && e.metaKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
        snapTo(activeId, e.key === 'ArrowLeft' ? 'left' : 'right');
      }
    });

    /* keep windows on screen */
    window.addEventListener('resize', () => {
      applyWallpaper();
      const b = bounds();
      winState.forEach((s, id) => {
        if (s.max) { Object.assign(s.el.style, { width: b.w + 'px', height: b.h + 'px', left: '0px', top: '0px' }); return; }
        const r = s.el.getBoundingClientRect();
        if (r.left > b.w - 90) s.el.style.left = Math.max(8, b.w - r.width - 8) + 'px';
        if (r.top > b.h - 42) s.el.style.top = Math.max(0, b.h - r.height - 8) + 'px';
      });
    });

    syncTray();
    loadWeather();
    setInterval(loadWeather, 30 * 60 * 1000);
    show('off');
  }

  function syncTray() {
    const t = $('.tray-tile[data-theme]');
    if (t) {
      t.classList.toggle('on', config.theme === 'dark');
      t.querySelectorAll('span')[1].textContent = config.theme === 'dark' ? 'Dark mode' : 'Light mode';
      t.querySelector('.icon').innerHTML = config.theme === 'dark' ? I.moon : I.sun;
    }
  }

  return {
    init, openApp, closeApp, openProject, power, toast, setConfig,
    get config() { return config; }
  };
})();

document.addEventListener('DOMContentLoaded', OS.init);
