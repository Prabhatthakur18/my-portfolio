/* ============================================================
   PrabhatOS — applications
   Each app returns { html, mount? }. The shell owns the frame.
   ============================================================ */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const li = (arr) => arr.map((p) => `<li>${esc(p)}</li>`).join('');
const chips = (arr) => `<div class="chiprow">${arr.map((t) => `<span class="chip">${esc(t)}</span>`).join('')}</div>`;
const stats = (arr) => `<div class="statgrid">${arr.map(([k, v]) => `<div class="stat"><b>${esc(v)}</b><span>${esc(k)}</span></div>`).join('')}</div>`;

/* ---------- About ---------- */
function appAbout() {
  return {
    html: `
    <div class="app">
      <div class="hero">
        <div class="avatar">${PROFILE.initials}</div>
        <div class="hero-meta">
          <h1>${esc(PROFILE.name)}</h1>
          <div class="role">${esc(PROFILE.tagline)}</div>
          <div class="where">${esc(PROFILE.location)}</div>
          <div class="chiprow">
            <span class="chip solid">Open to interesting problems</span>
            <span class="chip">React · TypeScript</span>
            <span class="chip">Node · FastAPI · Spring Boot</span>
            <span class="chip">AWS</span>
          </div>
        </div>
      </div>
      <p>${esc(PROFILE.summary)}</p>
      <h2>Device specifications</h2>
      <div class="card"><table class="spec-table">
        ${PROFILE.specs.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}
      </table></div>
      <h2>Education &amp; certifications</h2>
      ${EDUCATION.map((e) => `
        <div class="card"><div class="card-row">
          <div><h3>${esc(e.title)}</h3><p style="margin:0">${esc(e.org)}</p></div>
          <div style="text-align:right"><span class="chip">${esc(e.period)}</span><div style="font-size:12px;color:var(--text-3);margin-top:6px">${esc(e.detail)}</div></div>
        </div></div>`).join('')}
      <div class="btnrow">
        <button class="linkbtn primary" data-open="projects">${I.folderOpen}Browse projects</button>
        <button class="linkbtn" data-open="contact">${I.mail}Get in touch</button>
      </div>
    </div>`
  };
}

/* ---------- Projects (File Explorer) ---------- */
function appProjects() {
  const files = PROJECTS.map((p) => `
    <button class="fitem" data-project="${p.id}" title="Open ${esc(p.name)}">
      ${I.folder}
      <b>${esc(p.file)}</b>
      <small>${esc(p.kind)} · ${esc(p.year)}</small>
    </button>`).join('');
  return {
    html: `
    <div class="explorer">
      <div class="exp-side">
        <div class="sec">Quick access</div>
        <button class="exp-link on">${I.folder}Projects</button>
        <button class="exp-link" data-open="experience">${I.briefcase}Experience</button>
        <button class="exp-link" data-open="skills">${I.chart}Skills</button>
        <button class="exp-link" data-open="ai">${I.sparkle}AI Enablement</button>
        <div class="sec">This PC</div>
        <button class="exp-link" data-open="about">${I.pc}About this PC</button>
        <button class="exp-link" data-open="resume">${I.pdf}Resume.pdf</button>
        <button class="exp-link" data-open="bin">${I.bin}Recycle Bin</button>
      </div>
      <div class="exp-main">
        <div class="exp-bar">
          <div class="crumb">${I.folder}<span>This PC &nbsp;›&nbsp; Prabhat &nbsp;›&nbsp; Projects</span></div>
        </div>
        <div class="exp-body"><div class="exp-grid">${files}</div></div>
        <div class="exp-status">${PROJECTS.length} items · click a folder to open it</div>
      </div>
    </div>`,
    mount(body) {
      body.querySelectorAll('[data-project]').forEach((el) => {
        el.addEventListener('click', () => OS.openProject(el.dataset.project));
      });
    }
  };
}

/* ---------- One project ---------- */
function appProject(id) {
  const p = PROJECTS.find((x) => x.id === id);
  return {
    html: `
    <div class="app">
      <h1>${esc(p.name)}</h1>
      <div class="role" style="color:var(--accent);font-weight:600;font-size:13.5px">${esc(p.subtitle)}</div>
      <p style="margin-top:12px">${esc(p.blurb)}</p>
      ${stats(p.stats)}
      <h2>Stack</h2>
      ${chips(p.stack)}
      <h2>What I built</h2>
      <ul>${li(p.points)}</ul>
      <div class="btnrow">
        ${p.live ? `<a class="linkbtn primary" href="${p.live}" target="_blank" rel="noopener">${I.link}Open live site</a>` : `<span class="chip">Internal tool — not publicly hosted</span>`}
        <button class="linkbtn" data-open="projects">${I.folder}Back to Projects</button>
      </div>
    </div>`
  };
}

/* ---------- Experience ---------- */
function appExperience() {
  return {
    html: `
    <div class="app">
      <h1>Experience</h1>
      <p class="lede">Four years of shipping — from Spring Boot services as a trainee to leading engineering for a group's digital products.</p>
      <div class="tl" style="margin-top:20px">
        ${EXPERIENCE.map((e) => `
          <div class="tl-item ${e.current ? 'now' : ''}">
            <div class="card">
              <div class="card-row">
                <div><h3>${esc(e.role)}</h3><p style="margin:0;color:var(--accent);font-weight:600">${esc(e.company)}</p></div>
                <div style="text-align:right">
                  ${e.current ? '<span class="badge-now">Current</span><br>' : ''}
                  <span class="chip" style="margin-top:6px;display:inline-block">${esc(e.period)}</span>
                </div>
              </div>
              <ul style="margin-top:12px">${li(e.points)}</ul>
            </div>
          </div>`).join('')}
      </div>
    </div>`
  };
}

/* ---------- AI enablement ---------- */
function appAI() {
  return {
    html: `
    <div class="app">
      <h1>${esc(AI_PROGRAM.title)}</h1>
      <div style="color:var(--accent);font-weight:600;font-size:13.5px">${esc(AI_PROGRAM.org)} · ${esc(AI_PROGRAM.period)}</div>
      ${stats(AI_PROGRAM.metrics)}
      <h2>Programme</h2>
      <div class="card"><ul>${li(AI_PROGRAM.points)}</ul></div>
      <h2>Tools covered</h2>
      ${chips(['Claude', 'ChatGPT', 'Gemini', 'NotebookLM', 'Prompt engineering', 'Deep research'])}
    </div>`
  };
}

/* ---------- Skills (Task Manager) ---------- */
function appSkills() {
  let rows = '';
  SKILL_GROUPS.forEach((g) => {
    rows += `<tr class="grp"><td colspan="3">${esc(g.name)}</td></tr>`;
    g.items.forEach(([n, v]) => {
      const heat = v >= 88 ? 'heat-3' : v >= 78 ? 'heat-2' : 'heat-1';
      rows += `<tr>
        <td>${esc(n)}<div class="tm-bar"><i data-w="${v}" style="width:0"></i></div></td>
        <td class="num ${heat}">${v}%</td>
        <td class="num">${v >= 85 ? 'High' : v >= 70 ? 'Normal' : 'Low'}</td>
      </tr>`;
    });
  });
  const total = SKILL_GROUPS.reduce((a, g) => a + g.items.length, 0);
  return {
    html: `
    <div style="display:flex;flex-direction:column;height:100%">
      <div class="tm-head">
        <div class="tm-gauge"><b>${total}</b><span>Processes</span></div>
        <div class="tm-gauge"><b>4.2 yrs</b><span>Uptime</span></div>
        <div class="tm-gauge"><b>0</b><span>Not responding</span></div>
        <div class="tm-gauge"><b>${SKILL_GROUPS.length}</b><span>Groups</span></div>
      </div>
      <div style="flex:1;overflow:auto">
        <table class="tm-table">
          <thead><tr><th>Name</th><th class="num">Proficiency</th><th class="num">Priority</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`,
    mount(body) {
      requestAnimationFrame(() => body.querySelectorAll('.tm-bar i').forEach((b, idx) => {
        setTimeout(() => { b.style.width = b.dataset.w + '%'; }, idx * 22);
      }));
    }
  };
}

/* ---------- Resume (Notepad) ---------- */
function resumeText() {
  const line = (s) => s + '\n';
  let t = '';
  t += line(`${PROFILE.name.toUpperCase()}`);
  t += line(`${PROFILE.role} | ${PROFILE.location}`);
  t += line(`${PROFILE.phone} | ${PROFILE.email} | ${PROFILE.githubLabel}`);
  t += line('');
  t += line('== SUMMARY ==');
  t += line(PROFILE.summary);
  t += line('');
  t += line('== EXPERIENCE ==');
  EXPERIENCE.forEach((e) => {
    t += line(`${e.role} | ${e.company} | ${e.period}`);
    e.points.forEach((p) => { t += line('  - ' + p); });
    t += line('');
  });
  t += line('== AI ENABLEMENT & TRAINING ==');
  t += line(`${AI_PROGRAM.title} | ${AI_PROGRAM.org} | ${AI_PROGRAM.period}`);
  AI_PROGRAM.points.forEach((p) => { t += line('  - ' + p); });
  t += line('');
  t += line('== PROJECTS ==');
  PROJECTS.forEach((p) => {
    t += line(`${p.name} — ${p.subtitle}`);
    t += line(`  Stack: ${p.stack.join(', ')}`);
    if (p.live) t += line(`  Live: ${p.live}`);
    p.points.forEach((x) => { t += line('  - ' + x); });
    t += line('');
  });
  t += line('== TECHNICAL SKILLS ==');
  SKILL_GROUPS.forEach((g) => { t += line(`${g.name}: ${g.items.map((i) => i[0]).join(', ')}`); });
  t += line('');
  t += line('== EDUCATION & CERTIFICATIONS ==');
  EDUCATION.forEach((e) => { t += line(`${e.title} — ${e.org} | ${e.period} | ${e.detail}`); });
  return t;
}

function appResume() {
  const txt = resumeText();
  const pretty = esc(txt)
    .replace(/^(== .+ ==)$/gm, '<span class="h">$1</span>')
    .replace(/^(  - )/gm, '<span class="k">  • </span>');
  return {
    html: `
    <div style="display:flex;flex-direction:column;height:100%">
      <div class="pad-menu">
        <a href="assets/os/files/Prabhat_Thakur_Resume.pdf" download style="text-decoration:none">
          <button type="button">Download PDF</button>
        </a>
        <button data-act="download">Save as .txt</button>
        <button data-act="print">Print</button>
        <button data-act="copy">Copy all</button>
        <button data-open="contact">Send to Prabhat</button>
      </div>
      <div style="flex:1;overflow:auto"><div class="pad-doc">${pretty}</div></div>
    </div>`,
    mount(body) {
      body.querySelector('[data-act="download"]').onclick = () => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain' }));
        a.download = 'Prabhat_Thakur_Resume.txt';
        a.click();
        URL.revokeObjectURL(a.href);
        OS.toast('Resume', 'Saved Prabhat_Thakur_Resume.txt to your downloads.');
      };
      body.querySelector('[data-act="print"]').onclick = () => window.print();
      body.querySelector('[data-act="copy"]').onclick = async () => {
        try { await navigator.clipboard.writeText(txt); OS.toast('Resume', 'Full resume copied to clipboard.'); }
        catch { OS.toast('Resume', 'Clipboard blocked — use Save as… instead.'); }
      };
    }
  };
}

/* ---------- Contact (Mail) ---------- */
function appContact() {
  return {
    html: `
    <div class="app">
      <h1>New message</h1>
      <p class="lede">Drop a line about a role, a build, or a problem worth solving. Sending opens your mail client with everything filled in.</p>
      <div class="contact-links" style="margin:18px 0 22px">
        <a class="clink" href="mailto:${PROFILE.email}">${I.mail}<span><b>Email</b><small>${PROFILE.email}</small></span></a>
        <a class="clink" href="tel:${PROFILE.phoneRaw}">${I.phone}<span><b>Phone</b><small>${PROFILE.phone}</small></span></a>
        <a class="clink" href="${PROFILE.github}" target="_blank" rel="noopener">${I.github}<span><b>GitHub</b><small>${PROFILE.githubLabel}</small></span></a>
        ${PROFILE.linkedin ? `<a class="clink" href="${PROFILE.linkedin}" target="_blank" rel="noopener">${I.linkedin}<span><b>LinkedIn</b><small>${PROFILE.linkedinLabel}</small></span></a>` : ''}
      </div>
      <form id="mailform">
        <div class="field"><label for="cf-name">Your name</label><input id="cf-name" required placeholder="Jane Doe"></div>
        <div class="field"><label for="cf-sub">Subject</label><input id="cf-sub" required placeholder="Frontend role at …"></div>
        <div class="field"><label for="cf-msg">Message</label><textarea id="cf-msg" rows="6" required placeholder="Hi Prabhat — "></textarea></div>
        <div class="btnrow"><button class="linkbtn primary" type="submit">${I.mail}Send</button></div>
        <p style="font-size:11.5px;color:var(--text-3);margin-top:10px">
          Send hands the message to your mail client — nothing is posted to a server.
          No mail client? The notification that appears offers Gmail and copy-to-clipboard instead.
        </p>
      </form>
    </div>`,
    mount(body) {
      body.querySelector('#mailform').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = body.querySelector('#cf-name').value.trim();
        const sub = body.querySelector('#cf-sub').value.trim();
        const msg = body.querySelector('#cf-msg').value.trim();
        const fullBody = msg + '\n\n— ' + name;
        const q = `subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(fullBody)}`;
        const mailto = `mailto:${PROFILE.email}?${q}`;
        const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(PROFILE.email)}&${q}`;
        const plain = `To: ${PROFILE.email}\nSubject: ${sub}\n\n${fullBody}`;

        // mailto only lands if the visitor has a mail client registered, so the
        // toast always offers a route that works without one
        window.location.href = mailto;
        OS.toast(
          'Mail',
          `Handed to your mail client. If nothing opened:
           <span class="toast-actions">
             <a class="toast-btn" href="${gmail}" target="_blank" rel="noopener">Open in Gmail</a>
             <button class="toast-btn" data-copy>Copy message</button>
           </span>`,
          I.mail,
          (node) => {
            node.querySelectorAll('.toast-btn').forEach((btn) => btn.addEventListener('click', (ev) => ev.stopPropagation()));
            node.querySelector('[data-copy]').addEventListener('click', async () => {
              try { await navigator.clipboard.writeText(plain); OS.toast('Mail', 'Message copied — paste it into any mail app.'); }
              catch { OS.toast('Mail', `Clipboard blocked. Email me directly at <b>${PROFILE.email}</b>.`); }
            });
          }
        );
      });
    }
  };
}

/* ---------- Recycle Bin ---------- */
function appBin() {
  return {
    html: `
    <div class="app" style="max-width:none">
      <h1>Recycle Bin</h1>
      <p class="lede">Things this stack used to do, and no longer does.</p>
      <div class="card" style="padding:0;overflow:hidden;margin-top:16px">
        ${RECYCLED.map((r) => `<div class="bin-item">${I.file}<span><b>${esc(r.name)}</b><br><small>${esc(r.note)}</small></span></div>`).join('')}
      </div>
      <div class="btnrow"><button class="linkbtn" data-act="empty">${I.bin}Empty Recycle Bin</button></div>
    </div>`,
    mount(body) {
      body.querySelector('[data-act="empty"]').onclick = () =>
        OS.toast('Recycle Bin', 'Kept on purpose — every one of these is a lesson that shipped.');
    }
  };
}

/* ---------- Settings ---------- */
const WALLPAPERS = [
  { id: 'bloom', name: 'Bloom', css: 'radial-gradient(120% 110% at 22% 12%, #1e4fd8 0%, #0b2ea0 32%, #08154f 62%, #04081f 100%)' },
  { id: 'sunset', name: 'Ember', css: 'radial-gradient(120% 110% at 78% 14%, #ff7a45 0%, #c2255c 34%, #5b1e6b 66%, #14092b 100%)' },
  { id: 'forest', name: 'Verdant', css: 'radial-gradient(120% 110% at 26% 82%, #12c48b 0%, #0a7f6b 32%, #063d4a 64%, #041520 100%)' },
  { id: 'slate', name: 'Graphite', css: 'radial-gradient(120% 110% at 50% 10%, #4a5568 0%, #2d3748 34%, #1a202c 66%, #0d1117 100%)' }
];
const ACCENTS = ['#0078d4', '#8b5cf6', '#0f7b6c', '#c2410c', '#be185d', '#0369a1'];

function appSettings() {
  const cfg = OS.config;
  return {
    html: `
    <div class="app">
      <h1>Settings</h1>
      <h2>Personalisation</h2>
      <div class="set-row">
        <div class="txt"><b>Mode</b><small>Light or dark across the whole shell.</small></div>
        <div class="seg" id="theme-seg">
          <button data-theme="light" class="${cfg.theme === 'light' ? 'on' : ''}">Light</button>
          <button data-theme="dark" class="${cfg.theme === 'dark' ? 'on' : ''}">Dark</button>
        </div>
      </div>
      <div class="set-row">
        <div class="txt"><b>Accent colour</b><small>Used for highlights, focus rings and taskbar indicators.</small></div>
        <div class="swatches" id="accent-row">
          ${ACCENTS.map((c) => `<button class="swatch ${cfg.accent === c ? 'on' : ''}" data-accent="${c}" style="background:${c}" aria-label="Accent ${c}"></button>`).join('')}
        </div>
      </div>
      <div class="set-row">
        <div class="txt"><b>Desktop background</b><small>Four backgrounds, no downloads required.</small></div>
        <div class="wallpapers" id="wall-row">
          ${WALLPAPERS.map((w) => `<button class="wall ${cfg.wallpaper === w.id ? 'on' : ''}" data-wall="${w.id}" style="background-image:${w.css}" title="${w.name}"></button>`).join('')}
        </div>
      </div>
      <h2>System</h2>
      <div class="set-row">
        <div class="txt"><b>Boot sequence</b><small>Skip POST and sign-in on your next visit.</small></div>
        <div class="seg" id="boot-seg">
          <button data-boot="full" class="${cfg.fastBoot ? '' : 'on'}">Full</button>
          <button data-boot="fast" class="${cfg.fastBoot ? 'on' : ''}">Fast</button>
        </div>
      </div>
      <div class="set-row">
        <div class="txt"><b>Reset</b><small>Clear saved preferences and restart the machine.</small></div>
        <button class="linkbtn" data-act="reset">${I.refresh}Reset &amp; restart</button>
      </div>
      <h2>About</h2>
      <div class="card"><table class="spec-table">
        <tr><td>Edition</td><td>PrabhatOS Portfolio Edition</td></tr>
        <tr><td>Version</td><td>2.0 · built ${new Date().getFullYear()}</td></tr>
        <tr><td>Built with</td><td>Vanilla HTML, CSS and JavaScript — no framework, no build step</td></tr>
      </table></div>
    </div>`,
    mount(body) {
      body.querySelectorAll('#theme-seg button').forEach((b) => b.onclick = () => {
        OS.setConfig({ theme: b.dataset.theme });
        body.querySelectorAll('#theme-seg button').forEach((x) => x.classList.toggle('on', x === b));
      });
      body.querySelectorAll('#accent-row button').forEach((b) => b.onclick = () => {
        OS.setConfig({ accent: b.dataset.accent });
        body.querySelectorAll('#accent-row button').forEach((x) => x.classList.toggle('on', x === b));
      });
      body.querySelectorAll('#wall-row button').forEach((b) => b.onclick = () => {
        OS.setConfig({ wallpaper: b.dataset.wall });
        body.querySelectorAll('#wall-row button').forEach((x) => x.classList.toggle('on', x === b));
      });
      body.querySelectorAll('#boot-seg button').forEach((b) => b.onclick = () => {
        OS.setConfig({ fastBoot: b.dataset.boot === 'fast' });
        body.querySelectorAll('#boot-seg button').forEach((x) => x.classList.toggle('on', x === b));
        OS.toast('Settings', b.dataset.boot === 'fast' ? 'Fast boot on — POST and sign-in will be skipped.' : 'Full boot restored.');
      });
      body.querySelector('[data-act="reset"]').onclick = () => {
        localStorage.removeItem('prabhatos');
        OS.power('restart');
      };
    }
  };
}

/* ---------- Terminal ---------- */
function appTerminal() {
  const banner = [
    'PrabhatOS [Version 2.0.2026]',
    '(c) Prabhat Thakur. Built with vanilla JS.',
    '',
    'Type <span class="hl">help</span> for a list of commands.',
    ''
  ];
  return {
    html: `<div class="term" id="term-root">${banner.map((b) => `<div class="term-line">${b}</div>`).join('')}
      <div class="term-in"><span class="p">prabhat@os</span><span>:</span><span class="path">~</span><span>$&nbsp;</span><input id="term-input" autocomplete="off" spellcheck="false" aria-label="Terminal input"></div>
    </div>`,
    mount(body) {
      const root = body.querySelector('#term-root');
      const input = body.querySelector('#term-input');
      const inRow = body.querySelector('.term-in');
      const hist = [];
      let hi = -1;

      const print = (html = '') => {
        const d = document.createElement('div');
        d.className = 'term-line';
        d.innerHTML = html;
        root.insertBefore(d, inRow);
      };
      const scroll = () => { body.scrollTop = body.scrollHeight; };

      const commands = {
        help() {
          print('Available commands:');
          [
            ['about', 'who I am, in one paragraph'],
            ['projects', 'list the four flagship builds'],
            ['open &lt;app&gt;', 'launch an app (about, projects, skills, resume, contact, settings)'],
            ['experience', 'work history'],
            ['skills', 'technical stack by group'],
            ['contact', 'how to reach me'],
            ['neofetch', 'system summary'],
            ['whoami', 'short answer'],
            ['sudo', 'try it'],
            ['clear', 'clear the screen'],
            ['shutdown', 'power off the machine']
          ].forEach(([c, d]) => print(`  <span class="hl">${c.padEnd(18, ' ')}</span> ${d}`));
        },
        about() { print(PROFILE.summary); },
        whoami() { print(`<span class="hl">${PROFILE.name}</span> — ${PROFILE.tagline}, ${PROFILE.location}.`); },
        projects() {
          PROJECTS.forEach((p, i) => {
            print(`  <span class="hl">[${i + 1}] ${p.name}</span> — ${p.subtitle}`);
            print(`      ${p.stack.slice(0, 6).join(' · ')}`);
            if (p.live) print(`      <span class="path">${p.live}</span>`);
          });
          print('');
          print('Run <span class="hl">open projects</span> for the full explorer view.');
        },
        experience() {
          EXPERIENCE.forEach((e) => print(`  <span class="hl">${e.role}</span> @ ${e.company} <span class="warn">(${e.period})</span>`));
        },
        skills() {
          SKILL_GROUPS.forEach((g) => print(`  <span class="hl">${g.name}:</span> ${g.items.map((i) => i[0]).join(', ')}`));
        },
        contact() {
          print(`  email    <span class="hl">${PROFILE.email}</span>`);
          print(`  phone    <span class="hl">${PROFILE.phone}</span>`);
          print(`  github   <span class="path">${PROFILE.githubLabel}</span>`);
          if (PROFILE.linkedin) print(`  linkedin <span class="path">${PROFILE.linkedinLabel}</span>`);
        },
        neofetch() {
          const info = [
            `<span class="hl">${PROFILE.name}</span>@prabhat-os`,
            '-----------------------------',
            `OS:       PrabhatOS 2.0 (Portfolio Edition)`,
            `Role:     ${PROFILE.role} — Engineering Lead`,
            `Uptime:   4.2 years in production`,
            `Shell:    vanilla-js 0-dependency`,
            `Stack:    React/TS · Node/Express · FastAPI · Spring Boot`,
            `Cloud:    AWS (EC2, S3, IAM, CloudFront, Lambda) · VPS`,
            `Projects: ${PROJECTS.length} flagship builds`,
            `Location: ${PROFILE.location}`
          ];
          print(`<pre style="margin:0;color:#3b78ff">${info.map((x) => '  ' + x).join('\n')}</pre>`);
        },
        clear() { root.querySelectorAll('.term-line').forEach((n) => n.remove()); },
        sudo() { print('<span class="err">Nice try.</span> This machine trusts code review, not sudo.'); },
        shutdown() { print('Powering off…'); setTimeout(() => OS.power('shutdown'), 500); },
        exit() { OS.closeApp('terminal'); },
        open(arg) {
          const map = { about: 'about', projects: 'projects', skills: 'skills', resume: 'resume', contact: 'contact', settings: 'settings', experience: 'experience', ai: 'ai', bin: 'bin' };
          if (map[arg]) { OS.openApp(map[arg]); print(`Launching <span class="hl">${arg}</span>…`); }
          else print(`<span class="err">open: unknown app '${esc(arg || '')}'</span> — try about, projects, skills, resume, contact, settings.`);
        }
      };

      const run = (raw) => {
        const line = raw.trim();
        print(`<span class="p">prabhat@os</span>:<span class="path">~</span>$ ${esc(raw)}`);
        if (!line) return;
        hist.push(line); hi = hist.length;
        const [cmd, ...rest] = line.split(/\s+/);
        const fn = commands[cmd.toLowerCase()];
        if (fn) fn(rest.join(' ').toLowerCase());
        else print(`<span class="err">'${esc(cmd)}' is not recognized.</span> Type <span class="hl">help</span>.`);
        print('');
      };

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { run(input.value); input.value = ''; scroll(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) input.value = hist[--hi] || ''; }
        else if (e.key === 'ArrowDown') { e.preventDefault(); if (hi < hist.length - 1) input.value = hist[++hi] || ''; else { hi = hist.length; input.value = ''; } }
        else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); commands.clear(); }
      });
      root.addEventListener('mousedown', (e) => { if (e.target === root || e.target.classList.contains('term-line')) setTimeout(() => input.focus(), 0); });
      setTimeout(() => input.focus(), 60);
    }
  };
}

/* ---------- registry ---------- */
const APPS = {
  about:      { title: 'About This PC', icon: I.pc,        w: 720, h: 620, build: appAbout },
  projects:   { title: 'Projects — File Explorer', icon: I.folder, w: 880, h: 560, build: appProjects, pad: false },
  experience: { title: 'Experience',   icon: I.briefcase,  w: 760, h: 620, build: appExperience },
  skills:     { title: 'Task Manager — Skills', icon: I.chart, w: 700, h: 600, build: appSkills, pad: false },
  ai:         { title: 'AI Enablement', icon: I.sparkle,   w: 720, h: 560, build: appAI },
  resume:     { title: 'Resume.txt — Notepad', icon: I.pdf, w: 780, h: 640, build: appResume, pad: false },
  contact:    { title: 'Contact — Mail', icon: I.mail,     w: 700, h: 640, build: appContact },
  terminal:   { title: 'PrabhatOS Terminal', icon: I.terminal, w: 720, h: 460, build: appTerminal, pad: false },
  settings:   { title: 'Settings',     icon: I.gear,       w: 760, h: 620, build: appSettings },
  bin:        { title: 'Recycle Bin',  icon: I.bin,        w: 640, h: 520, build: appBin }
};
