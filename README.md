# PrabhatOS — portfolio as a desktop operating system

The portfolio of **Prabhat Thakur**, Software Engineer (New Delhi), presented as a
Windows-style OS you actually boot, use, and shut down. No framework, no build step —
plain HTML, CSS and JavaScript.

## The lifecycle

| Stage | What happens |
| --- | --- |
| Power off | A power button on a black screen. Click it (or press Enter). |
| POST / BIOS | Faux self-test enumerating the stack as drives. `Skip POST` jumps ahead. |
| Boot splash | Logo, dot spinner, progress bar. |
| Lock screen | Live clock and date. Click or press any key. |
| Sign-in | Avatar + PIN field — no password, just press Enter. |
| Desktop | Icons, taskbar, Start menu, quick settings, calendar, toasts, right-click menu. |
| Sleep / Restart / Shut down | Start → power. Restart returns to POST with a clean session; shut down returns to the power button. |

## Apps

| App | Content |
| --- | --- |
| About This PC | Profile, summary, "device specifications", education |
| Projects (File Explorer) | The four flagship builds — click a folder for full detail |
| Experience | Timeline of roles and what shipped in each |
| Task Manager | Technical skills rendered as running processes with proficiency |
| AI Enablement | The company-wide AI literacy programme |
| Resume | Full resume as text, plus a PDF download |
| Contact (Mail) | Compose form that hands off to `mailto:`, plus direct links |
| Terminal | `help`, `about`, `projects`, `skills`, `neofetch`, `open <app>`, `shutdown`, … |
| Settings | Light/dark, accent colour, wallpaper, fast boot, reset |
| Recycle Bin | Practices this stack retired |

## Window management

Drag by the title bar, resize from any edge or corner, minimise / maximise / close,
double-click the title bar to maximise, drag to a screen edge to snap (left / right / top),
`Win`+`←`/`→` to snap, `Alt`+`F4` to close, taskbar buttons to raise or minimise.
On narrow screens windows open maximised and dragging is disabled.

## Layout

```
index.html                     the shell: boot screens, desktop, taskbar, flyouts
assets/os/css/os.css           Fluent-flavoured styling, light + dark tokens
assets/os/js/icons.js          inline SVG icon set
assets/os/js/data.js           all portfolio content — edit this to update the site
assets/os/js/apps.js           one function per app, returns { html, mount? }
assets/os/js/os.js             boot state machine, window manager, taskbar, Start
assets/os/files/               resume PDF
classic.html                   the previous Bootstrap-template portfolio, kept for reference
```

## Editing content

Everything the site displays lives in `assets/os/js/data.js` — profile, experience,
projects, skills, education. No other file needs touching to update the portfolio.

## Running locally

It is a static site; open `index.html`, or serve the folder:

```sh
python3 -m http.server 8000
```

Preferences (theme, accent, wallpaper, fast boot) persist in `localStorage`.
