/* MacEx website: hero, live demo inside a MacBook, feature explorer.
   Everything here runs on sample data. Nothing reads real files. */
(() => {
'use strict';

/* ---------------------------------------------------------
   Small helpers
   --------------------------------------------------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const icon = (id, cls = '') => `<svg class="ico ${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused = reduceMotion.matches;

const DAY = 864e5;
const NOW = new Date();
const startOfDay = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const startOfWeek = d => { const x = startOfDay(d); x.setDate(x.getDate() - x.getDay()); return x; };
const WEEK_START = startOfWeek(NOW);
const LAST_WEEK_START = new Date(WEEK_START.getTime() - 7 * DAY);
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const MONTH_SHORT = { jan: 0, feb: 1, mar: 2, apr: 3, jun: 5, jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11 };
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

function when(spec) {
  if (typeof spec === 'number') return new Date(NOW.getTime() - spec * DAY - (spec ? 3.2 : .4) * 3600e3);
  if (spec.lw != null) return new Date(LAST_WEEK_START.getTime() + spec.lw * DAY + 10.5 * 3600e3);
  return new Date(spec.abs + 'T11:20:00');
}
function fmtSize(b) {
  if (b === 0) return 'Zero KB';
  if (b < 1e3) return `${b} bytes`;
  if (b < 1e6) return `${Math.round(b / 1e3)} KB`;
  if (b < 1e9) return `${(b / 1e6).toFixed(b < 1e8 ? 1 : 0)} MB`;
  return `${(b / 1e9).toFixed(1)} GB`;
}
function fmtDate(d) {
  const t = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const days = Math.floor((startOfDay(NOW) - startOfDay(d)) / DAY);
  if (days === 0) return `Today at ${t}`;
  if (days === 1) return `Yesterday at ${t}`;
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}
const pad = n => String(n).padStart(2, '0');
const ageDays = f => (NOW - f.date) / DAY;

/* ---------------------------------------------------------
   Sample library
   --------------------------------------------------------- */
let nextId = 1;
function file(name, kind, size, date, folder, source, art, extra = {}) {
  const d = when(date);
  const ext = (name.match(/\.([a-z0-9]+)$/i) || [, ''])[1].toLowerCase();
  return { id: nextId++, name, kind, size, date: d, folder, source, art, ext, h: 210, ...extra };
}
function shot(daysAgo, size, extra = {}) {
  const d = when(daysAgo);
  const name = `Screenshot ${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} at ${pad(d.getHours())}.${pad(d.getMinutes())}.${pad((daysAgo * 7) % 60)}.png`;
  return file(name, 'image', size, daysAgo, 'Desktop', 'Screenshot', 'shot', { shot: true, ...extra });
}
const MB = 1e6, GB = 1e9;
const FILES = [
  // Images
  file('golden-hour.heic', 'image', 3.2 * MB, 1, 'Pictures', 'iPhone', 'sunset'),
  shot(3, 1.1 * MB, { text: 'Studio Wi-Fi network. Password: maple-garden-42', h: 228 }),
  file('mascot-sketch.png', 'image', .8 * MB, 4, 'Downloads', 'slack.com', 'landscape', { h: 190 }),
  file('receipt-scan.jpg', 'image', 1.3 * MB, 9, 'Pictures', 'iPhone', 'receipt', { text: 'Corner Cafe receipt. 2 flat whites, 1 croissant. Total 42.80' }),
  file('forest-trail.jpg', 'image', 2.8 * MB, 26, 'Pictures', 'iPhone', 'forest'),
  shot(45, 2.4 * MB, { text: 'Invoice #2231. Amount due 1,240.00. Due in 14 days', h: 250 }),
  file('coastal-walk.jpg', 'image', 4.7 * MB, { abs: '2026-08-16' }, 'Pictures', 'iPhone', 'ocean'),
  file('beach-burst-1.jpg', 'image', 3.9 * MB, { abs: '2026-08-16' }, 'Pictures', 'iPhone', 'ocean', { similar: 1 }),
  file('beach-burst-2.jpg', 'image', 4.0 * MB, { abs: '2026-08-16' }, 'Pictures', 'iPhone', 'ocean', { similar: 2 }),
  file('beach-burst-3.jpg', 'image', 4.1 * MB, { abs: '2026-08-16' }, 'Pictures', 'iPhone', 'ocean', { similar: 3 }),
  file('mountain-lake.jpg', 'image', 5.6 * MB, { abs: '2026-08-09' }, 'Pictures', 'iPhone', 'landscape', { h: 200 }),
  shot(62, .9 * MB, { h: 200 }),
  shot(75, 1.6 * MB, { text: 'Boarding pass. Gate B12. Seat 14A', h: 260 }),
  // Videos
  file('beach-day.mov', 'video', 184 * MB, { abs: '2026-08-16' }, 'Movies', 'iPhone', 'video', { h: 195 }),
  file('surf-session.mov', 'video', 248 * MB, { abs: '2026-08-22' }, 'Movies', 'iPhone', 'video', { h: 175 }),
  file('product-demo.mp4', 'video', 96 * MB, 12, 'Downloads', 'drive.google.com', 'video', { h: 255 }),
  file('birthday-toast.mov', 'video', 62 * MB, 33, 'Movies', 'iPhone', 'video', { h: 320 }),
  file('screen-recording.mov', 'video', 1.2 * GB, 210, 'Desktop', 'Screen recording', 'video', { h: 230 }),
  // Music
  file('good-vibes.mp3', 'music', 6.8 * MB, 20, 'Music', 'Music', 'music', { h: 285, dur: '3:24' }),
  file('late-night-drive.m4a', 'music', 9.1 * MB, 48, 'Music', 'Music', 'music', { h: 215, dur: '4:41' }),
  file('rain-loops.wav', 'music', 31 * MB, 90, 'Music', 'Music', 'music', { h: 180, dur: '2:58' }),
  // Documents
  file('the-big-idea.pdf', 'document', 8.4 * MB, { lw: 2 }, 'Downloads', 'mail.google.com', 'doc', { text: 'The big idea. Pitch deck, seed round' }),
  file('quarterly-report.pdf', 'document', 6.1 * MB, { lw: 4 }, 'Documents', 'mail.google.com', 'doc', { text: 'Quarterly report. Revenue, growth and hiring' }),
  file('travel-itinerary.pdf', 'document', .4 * MB, { lw: 1 }, 'Downloads', 'mail.google.com', 'doc', { text: 'Flight itinerary. Seat 14A. Hotel check in' }),
  file('design-guide.pdf', 'document', 7.3 * MB, 3, 'Downloads', 'slack.com', 'doc'),
  file('meeting-notes.docx', 'document', 41e3, 2, 'Documents', '', 'text', { label: 'DOC' }),
  file('budget-2026.xlsx', 'document', 92e3, 6, 'Documents', '', 'sheet', { label: 'XLS' }),
  file('reading-list.md', 'document', 5e3, 8, 'Documents', '', 'text', { label: 'MD' }),
  file('proposal.pdf', 'document', 3.4 * MB, 14, 'Documents', '', 'doc', { dupKeep: true }),
  file('proposal copy.pdf', 'document', 3.4 * MB, 13, 'Downloads', 'mail.google.com', 'doc', { dupOf: 'proposal.pdf' }),
  file('project-notes.pdf', 'document', 1.2 * MB, 20, 'Documents', '', 'doc'),
  file('lease-agreement.pdf', 'document', 2.2 * MB, 40, 'Documents', 'drive.google.com', 'doc', { text: 'Lease agreement. Monthly rent, deposit, notice period' }),
  file('invoice-0923.pdf', 'document', .2 * MB, 49, 'Downloads', 'mail.google.com', 'doc', { text: 'Invoice 0923. Design retainer' }),
  file('empty-notes.txt', 'document', 0, 50, 'Desktop', '', 'text', { label: 'TXT' }),
  file('untitled 2.txt', 'document', 0, 70, 'Desktop', '', 'text', { label: 'TXT' }),
  // Archives and installers
  file('brand-kit.zip', 'archive', 12.6 * MB, 2, 'Downloads', 'slack.com', 'zip'),
  file('fonts-collection.zip', 'archive', 34 * MB, 15, 'Downloads', 'slack.com', 'zip'),
  file('old-site.zip', 'archive', 48 * MB, 130, 'Downloads', 'drive.google.com', 'zip'),
  file('photos-backup-2025.zip', 'archive', 2.1 * GB, 240, 'Documents', '', 'zip'),
  file('Notewise-1.8.dmg', 'archive', 96 * MB, 6, 'Downloads', 'notewise.app', 'dmg', { installer: true }),
  file('Sketchpad-3.2.dmg', 'archive', 182 * MB, 95, 'Downloads', 'sketchpad.design', 'dmg', { installer: true }),
  file('printer-driver.pkg', 'archive', 64 * MB, 140, 'Downloads', 'support.example.com', 'dmg', { installer: true }),
  // Apps
  file('MacEx.app', 'app', 38 * MB, 1, 'Applications', '', 'app', { h: 212, glyph: 'M', used: 0 }),
  file('Sketchpad.app', 'app', 412 * MB, 30, 'Applications', '', 'app', { h: 330, glyph: 'S', used: 2 }),
  file('Notewise.app', 'app', 96 * MB, 6, 'Applications', '', 'app', { h: 40, glyph: 'N', used: 0 }),
  file('Tempo.app', 'app', 64 * MB, 80, 'Applications', '', 'app', { h: 150, glyph: 'T', used: 5 }),
  file('Pixelate.app', 'app', 210 * MB, 500, 'Applications', '', 'app', { h: 280, glyph: 'P', used: 410 }),
  file('Orbit.app', 'app', 88 * MB, 620, 'Applications', '', 'app', { h: 190, glyph: 'O', used: 540 }),
];
FILES.forEach(f => { f.label = f.label || (f.ext === 'pdf' ? 'PDF' : ''); });

const KINDS = {
  image: { title: 'Images', icon: 'image', color: '#5762c9' },
  video: { title: 'Videos', icon: 'video', color: '#6a58c6' },
  music: { title: 'Music', icon: 'music', color: '#b0694c' },
  document: { title: 'Documents', icon: 'doc', color: '#3d8a78' },
  archive: { title: 'Archives', icon: 'archive', color: '#977532' },
  app: { title: 'Apps', icon: 'apps', color: '#a25673' },
};
const KIND_NAME = { image: 'Image', video: 'Movie', music: 'Audio', document: 'Document', archive: 'Archive', app: 'Application' };
const LOCATIONS = [['~', 'Home', 'home'], ['Desktop', 'Desktop', 'desktop'], ['Documents', 'Documents', 'doc'], ['Downloads', 'Downloads', 'download'], ['Pictures', 'Pictures', 'image'], ['Music', 'Music', 'music'], ['Movies', 'Movies', 'film']];

function thumb(f, extraClass = '') {
  const cls = { sunset: 'th-sunset', ocean: 'th-ocean', forest: 'th-forest', landscape: 'th-landscape', receipt: 'th-receipt', shot: 'th-shot', video: 'th-video', music: 'th-music', doc: 'th-doc', text: 'th-text', sheet: 'th-sheet', zip: 'th-zip', dmg: 'th-dmg', app: 'th-app', folder: 'th-folder' }[f.art] || 'th-doc';
  const inner = f.art === 'app' ? `<b>${esc(f.glyph || '')}</b>` : (f.label ? `<b>${esc(f.label)}</b>` : '');
  return `<i class="th ${cls} ${extraClass}" style="--h:${f.h}" aria-hidden="true">${inner}</i>`;
}

/* ---------------------------------------------------------
   Natural search parser
   Turns a plain phrase into visible, removable filter chips.
   --------------------------------------------------------- */
const NUM_WORDS = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twelve: 12 };
const UNIT_DAYS = { day: 1, week: 7, month: 30.44, year: 365.25 };
const SOURCES = { gmail: 'mail.google.com', mail: 'mail.google.com', email: 'mail.google.com', 'e-mail': 'mail.google.com', dropbox: 'dropbox.com', 'google drive': 'drive.google.com', drive: 'drive.google.com', slack: 'slack.com', chatgpt: 'chatgpt.com', whatsapp: 'web.whatsapp.com' };
const TYPE_RULES = [
  [/\b(pdf)s?\b/, 'PDF', f => f.ext === 'pdf'],
  [/\b(screen ?shots?|screen ?caps?)\b/, 'Screenshots', f => !!f.shot],
  [/\b(images?|photos?|pictures?|pics?)\b/, 'Images', f => f.kind === 'image'],
  [/\b(videos?|movies?|clips?|recordings?)\b/, 'Videos', f => f.kind === 'video'],
  [/\b(music|songs?|audio|tracks?)\b/, 'Music', f => f.kind === 'music'],
  [/\b(installers?|dmgs?)\b/, 'Installers', f => !!f.installer],
  [/\b(zips?|archives?)\b/, 'Archives', f => f.kind === 'archive' && !f.installer],
  [/\b(spreadsheets?|sheets?)\b/, 'Spreadsheets', f => f.ext === 'xlsx'],
  [/\b(docs?|documents?)\b/, 'Documents', f => f.kind === 'document'],
  [/\b(apps?|applications?)\b/, 'Apps', f => f.kind === 'app'],
  [/\b(png|jpe?g|heic|mov|mp4|mp3|m4a|wav|docx|xlsx|md|txt|pkg)s?\b/, null, null],
];
const STOP = new Set(['from', 'the', 'my', 'a', 'an', 'of', 'and', 'files', 'file', 'all', 'show', 'me', 'find', 'that', 'which', 'i', 'in', 'on', 'for', 'some', 'any', 'get', 'stuff', 'things', 'ones', 'were', 'was', 'is', 'are', 'to', 'with', 'or', 'those', 'these', 'where', 'what', 'please', 'by', 'at', 'it']);

function parseQuery(q) {
  const src = q.toLowerCase();
  let w = src;
  const chips = [], spans = [];
  const take = (re, build) => {
    w = w.replace(re, (...args) => {
      const m = args[0];
      const off = args[args.length - 2];
      const chip = build(args);
      if (!chip) return m;
      chip.key = chip.kind + ':' + chip.label;
      if (!chips.some(c => c.key === chip.key)) chips.push(chip);
      spans.push({ s: off, e: off + m.length, k: chip.kind });
      return ' '.repeat(m.length);
    });
  };
  const sizeBytes = (n, u) => parseFloat(n) * ({ k: 1e3, m: 1e6, g: 1e9 }[u[0]]);
  const sizeLabel = (n, u) => `${n} ${u[0].toUpperCase()}B`;
  const range = (label, from, to) => ({ kind: 'date', icon: 'calendar', label, test: f => f.date >= from && f.date < to });

  // Size
  take(/\b(?:over|bigger than|larger than|more than|above|greater than|at least)\s*(\d+(?:\.\d+)?)\s*(kb|mb|gb|k|m|g)\b|>\s*(\d+(?:\.\d+)?)\s*(kb|mb|gb)\b/, a => {
    const n = a[1] || a[3], u = a[2] || a[4];
    const min = sizeBytes(n, u);
    return { kind: 'size', icon: 'archive', label: `≥ ${sizeLabel(n, u)}`, test: f => f.size >= min };
  });
  take(/\b(?:under|smaller than|less than|below|at most)\s*(\d+(?:\.\d+)?)\s*(kb|mb|gb|k|m|g)\b|<\s*(\d+(?:\.\d+)?)\s*(kb|mb|gb)\b/, a => {
    const n = a[1] || a[3], u = a[2] || a[4];
    const max = sizeBytes(n, u);
    return { kind: 'size', icon: 'archive', label: `≤ ${sizeLabel(n, u)}`, test: f => f.size <= max };
  });
  take(/\b(large|big|huge)\b/, () => ({ kind: 'size', icon: 'archive', label: '≥ 100 MB', test: f => f.size >= 100 * MB }));
  take(/\b(empty)\b/, () => ({ kind: 'size', icon: 'archive', label: 'Zero KB', test: f => f.size === 0 }));

  // Dates
  take(/\b(?:older than|more than|over)\s+(\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten|twelve)\s+(day|week|month|year)s?(?:\s+old)?\b/, a => {
    const n = NUM_WORDS[a[1]] || parseInt(a[1], 10), unit = a[2];
    const cutoff = new Date(NOW.getTime() - n * UNIT_DAYS[unit] * DAY);
    return { kind: 'date', icon: 'calendar', label: `Older than ${n} ${unit}${n > 1 ? 's' : ''}`, test: f => f.date < cutoff };
  });
  take(/\b(?:from |in |during )?last week\b/, () => range('Last week · added/created', LAST_WEEK_START, WEEK_START));
  take(/\b(?:from |in )?this week\b/, () => range('This week', WEEK_START, new Date(NOW.getTime() + DAY)));
  take(/\b(?:from )?yesterday\b/, () => range('Yesterday', new Date(startOfDay(NOW) - DAY), startOfDay(NOW)));
  take(/\b(?:from )?today\b/, () => range('Today', startOfDay(NOW), new Date(NOW.getTime() + DAY)));
  take(/\b(?:from |in )?this month\b/, () => range('This month', new Date(NOW.getFullYear(), NOW.getMonth(), 1), new Date(NOW.getTime() + DAY)));
  take(/\b(?:from |in )?last month\b/, () => range('Last month', new Date(NOW.getFullYear(), NOW.getMonth() - 1, 1), new Date(NOW.getFullYear(), NOW.getMonth(), 1)));
  take(/\b(?:from |in )?this year\b/, () => range('This year', new Date(NOW.getFullYear(), 0, 1), new Date(NOW.getTime() + DAY)));
  take(/\b(?:from |in )?last year\b/, () => range('Last year', new Date(NOW.getFullYear() - 1, 0, 1), new Date(NOW.getFullYear(), 0, 1)));
  take(/\b(recent|recently|latest|new)\b/, () => range('Last 7 days', new Date(NOW.getTime() - 7 * DAY), new Date(NOW.getTime() + DAY)));
  take(/\b(old)\b/, () => { const c = new Date(NOW.getTime() - 30 * DAY); return { kind: 'date', icon: 'calendar', label: 'Older than 30 days', test: f => f.date < c }; });
  take(new RegExp(`\\b(?:in |from |during |taken in )?(${MONTHS.join('|')}|${Object.keys(MONTH_SHORT).join('|')})\\b(?:\\s+(20\\d\\d))?`), a => {
    const m = MONTHS.indexOf(a[1]) >= 0 ? MONTHS.indexOf(a[1]) : MONTH_SHORT[a[1]];
    const y = a[2] ? +a[2] : null;
    return { kind: 'date', icon: 'calendar', label: cap(MONTHS[m]) + (y ? ` ${y}` : ''), test: f => f.date.getMonth() === m && (!y || f.date.getFullYear() === y) };
  });
  take(/\b(?:in |from |during )(20\d\d)\b/, a => ({ kind: 'date', icon: 'calendar', label: a[1], test: f => f.date.getFullYear() === +a[1] }));

  // Sources
  take(/\b(?:from|on|taken with|shot on|taken on)\s+(?:my\s+)?(iphone|phone|camera)\b/, () => ({ kind: 'source', icon: 'camera', label: 'From iPhone', test: f => f.source === 'iPhone' }));
  take(/\b(?:from|via|on|in|off)\s+(google drive|gmail|e-?mail|mail|dropbox|drive|slack|chatgpt|whatsapp)\b/, a => {
    const host = SOURCES[a[1]];
    return { kind: 'source', icon: 'globe', label: `From ${host}`, test: f => f.source === host };
  });

  // Places
  take(/\b(?:in|on|inside)\s+(?:my\s+|the\s+)?(downloads|desktop|documents|pictures|movies|music|applications)(?:\s+folder)?\b/, a => {
    const name = cap(a[1]);
    return { kind: 'place', icon: 'folder', label: `In ${name}`, test: f => f.folder === name };
  });

  // Types
  for (const [re, label, test] of TYPE_RULES) {
    const g = new RegExp(re.source, 'g');
    take(g, a => {
      if (label) return { kind: 'type', icon: 'doc', label, test };
      const ext = a[1].replace('jpeg', 'jpg');
      return { kind: 'type', icon: 'doc', label: ext.toUpperCase(), test: f => f.ext === ext || (ext === 'jpg' && f.ext === 'jpeg') };
    });
  }

  // Text inside files (on-device OCR in the real app)
  take(/\b(?:with|containing|that says?|mentioning|saying|about|showing)\s+([a-z0-9#'.\- ]*[a-z0-9#])\s*$/, a => {
    const words = a[1].trim().split(/\s+/).filter(x => !STOP.has(x));
    if (!words.length) return null;
    const phrase = words.join(' ');
    return { kind: 'text', icon: 'text', label: `Text: “${phrase}”`, test: f => { const h = ((f.text || '') + ' ' + f.name).toLowerCase(); return words.every(x => h.replace(/[-_]/g, '').includes(x.replace(/[-_]/g, '')) || h.replace(/[-_]/g, ' ').includes(x.replace(/[-_]/g, ' '))); } };
  });

  // Anything left stays literal: never silently dropped
  const rest = [];
  w.replace(/[a-z0-9#'._-]+/g, (m, off) => {
    if (STOP.has(m)) return m;
    rest.push(m); spans.push({ s: off, e: off + m.length, k: 'literal' });
    return m;
  });
  if (rest.length) {
    const phrase = rest.join(' ');
    chips.push({ kind: 'literal', key: 'literal:' + phrase, icon: 'search', label: `“${phrase}”`, test: f => rest.every(x => (f.name + ' ' + (f.text || '') + ' ' + f.source).toLowerCase().includes(x)) });
  }
  return { chips, spans: spans.sort((a, b) => a.s - b.s) };
}

function applyChips(files, chips) {
  const types = chips.filter(c => c.kind === 'type');
  const others = chips.filter(c => c.kind !== 'type');
  return files.filter(f => (!types.length || types.some(c => c.test(f))) && others.every(c => c.test(f)));
}
function highlightQuery(q, spans) {
  let out = '', i = 0;
  for (const sp of spans) {
    if (sp.s < i) continue;
    out += esc(q.slice(i, sp.s));
    out += `<span class="k-${sp.k}">${esc(q.slice(sp.s, sp.e))}</span>`;
    i = sp.e;
  }
  return out + esc(q.slice(i));
}
const chipHTML = (c, i = 0) => `<span class="qchip k-${c.kind}" style="animation-delay:${i * 90}ms">${icon(c.icon)}${esc(c.label)}</span>`;

const EXAMPLES = [
  'pdfs from last week over 5 mb',
  'videos from my iphone in august',
  'screenshots with wifi password',
  'zips bigger than 1 gb older than 6 months',
  'pdfs from gmail',
  'large videos in downloads',
  'receipts containing total',
  'photos from august',
  'installers older than 3 months',
  'empty files on desktop',
  'music over 10 mb',
  'docs from this week',
];

/* ---------------------------------------------------------
   HERO: typing search, parallax, marquee
   --------------------------------------------------------- */
function initHero() {
  const qEl = $('#hero-query'), chipsEl = $('#hero-chips');
  const stage = $('#hero-stage');
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(stage);
  const heroEx = ['pdfs from last week over 5 mb', 'videos from my iphone in august', 'screenshots with wifi password', 'zips bigger than 1 gb older than 6 months', 'large videos in downloads'];
  const label = '<span class="hs-label">Understood as</span>';
  (async function loop() {
    let i = 0;
    if (reduceMotion.matches) {
      qEl.textContent = heroEx[0];
      chipsEl.innerHTML = label + parseQuery(heroEx[0]).chips.map(chipHTML).join('');
      return;
    }
    await sleep(1400);
    for (;;) {
      const text = heroEx[i++ % heroEx.length];
      chipsEl.innerHTML = label;
      for (let n = 1; n <= text.length; n++) {
        while (!visible || motionPaused) await sleep(300);
        qEl.textContent = text.slice(0, n);
        await sleep(42 + Math.random() * 40);
      }
      await sleep(260);
      chipsEl.innerHTML = label + parseQuery(text).chips.map(chipHTML).join('');
      await sleep(2600);
      while (!visible || motionPaused) await sleep(300);
      for (let n = text.length; n >= 0; n -= 2) { qEl.textContent = text.slice(0, n); await sleep(14); }
      await sleep(300);
    }
  })();

  // Shrink the mascot, rings and cards with the stage so the first screen fits the window
  const fitStage = () => stage.style.setProperty('--k', clamp(stage.clientHeight / 480, .55, 1).toFixed(3));
  if ('ResizeObserver' in window) new ResizeObserver(fitStage).observe(stage); fitStage();

  // Gentle parallax
  const layers = $$('[data-depth]', stage);
  let raf = 0, tx = 0, ty = 0;
  $('.hero').addEventListener('pointermove', e => {
    if (motionPaused || e.pointerType !== 'mouse') return;
    tx = (e.clientX / innerWidth - .5) * 2; ty = (e.clientY / innerHeight - .5) * 2;
    if (!raf) raf = requestAnimationFrame(() => {
      raf = 0;
      layers.forEach(l => { const d = +l.dataset.depth; l.style.transform = `translate3d(${tx * d}px,${ty * d}px,0)`; });
    });
  });

  // Marquee of example searches; click one to try it in the demo
  const rows = [EXAMPLES.slice(0, 6), EXAMPLES.slice(6)];
  $$('.marquee-row').forEach((row, r) => {
    const track = row.querySelector('.marquee-track');
    track.innerHTML = rows[r].map(t => `<button class="mq" data-try="${esc(t)}">${icon('search')}${esc(t)}</button>`).join('');
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    $$('button', clone).forEach(b => b.tabIndex = -1);
    row.append(clone);
  });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-try]');
    if (!b) return;
    $('#mac-stage').scrollIntoView({ behavior: motionPaused ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => Demo.typeSearch(b.dataset.try), motionPaused ? 50 : 700);
  });
}

/* ---------------------------------------------------------
   DEMO: the MacEx app inside the MacBook
   --------------------------------------------------------- */
const Demo = (() => {
  const app = $('#app'), content = $('#app-content'), sidebar = $('#app-sidebar'), statusEl = $('#app-status');
  const previewEl = $('#app-preview'), sheetEl = $('#app-sheet'), toastEl = $('#app-toast'), input = $('#app-search');
  const stage = $('#mac-stage'), mbp = $('#mbp'), screen = $('#mbp-screen'), desktop = $('#desktop');

  const fresh = () => ({
    route: 'home', back: [], fwd: [], view: 'grid', sort: 'newest', theme: 'dark', sidebar: true, preview: false,
    selected: null, query: '', removed: new Set(), editFilters: false, saved: [], trashed: new Set(), tidy: false,
    fuSel: new Set(), fuOpen: new Set(), age: 30, dupes: false, similar: false, menu: false, undo: null, preRoute: null,
  });
  let S = fresh();
  let tourToken = 0;
  let active = false;

  const live = () => FILES.filter(f => !S.trashed.has(f.id));
  const byKind = k => live().filter(f => f.kind === k);
  const sum = arr => arr.reduce((a, f) => a + f.size, 0);
  const tidyGroup = f => f.installer ? 'Installers' : KINDS[f.kind].title;

  function sorted(arr) {
    const a = [...arr];
    if (S.sort === 'name') a.sort((x, y) => x.name.localeCompare(y.name, undefined, { numeric: true }));
    else if (S.sort === 'size') a.sort((x, y) => y.size - x.size);
    else if (S.sort === 'kind') a.sort((x, y) => x.kind.localeCompare(y.kind) || y.date - x.date);
    else a.sort((x, y) => y.date - x.date);
    return a;
  }

  /* ----- navigation ----- */
  function go(route, { push = true } = {}) {
    if (route === S.route) { render(); return; }
    if (push) { S.back.push(S.route); S.fwd = []; }
    S.route = route; S.menu = false; S.selected = null;
    if (route !== 'search') { S.query = ''; input.value = ''; S.removed.clear(); S.editFilters = false; }
    render(true);
  }
  function back() { if (!S.back.length) return; S.fwd.push(S.route); leave(S.back.pop()); }
  function forward() { if (!S.fwd.length) return; S.back.push(S.route); leave(S.fwd.pop()); }
  function leave(route) {
    S.route = route; S.menu = false; S.selected = null;
    if (route !== 'search') { S.query = ''; input.value = ''; }
    render(true);
  }

  /* ----- render ----- */
  function render(animate = false) {
    const hadFocus = app.contains(document.activeElement) && document.activeElement !== input;
    app.classList.toggle('light', S.theme === 'light');
    app.classList.toggle('dark', S.theme === 'dark');
    app.classList.toggle('no-sidebar', !S.sidebar);
    app.classList.toggle('show-preview', S.preview);
    $('[data-act="theme"] use', app).setAttribute('href', S.theme === 'dark' ? '#i-sun' : '#i-moon');
    $('[data-act="back"]', app).disabled = !S.back.length;
    $('[data-act="forward"]', app).disabled = !S.fwd.length;
    $('.app-search', app).classList.toggle('has-text', !!input.value);
    renderSidebar();
    const keepScroll = !animate ? content.scrollTop : 0;
    content.innerHTML = `<div class="${animate ? 'view-in' : ''}">${renderRoute()}</div>`;
    content.scrollTop = keepScroll;
    renderStatus();
    renderPreview();
    if (hadFocus && !app.contains(document.activeElement)) app.focus({ preventScroll: true });
  }

  function renderSidebar() {
    const item = (route, label, ic, count = '', extra = '') =>
      `<button class="sb-item ${S.route === route ? 'active' : ''} ${extra}" data-nav="${route}">${icon(ic)}<span>${esc(label)}</span>${count !== '' ? `<small>${count}</small>` : ''}</button>`;
    let h = item('home', 'Home', 'home') + item('recents', 'Recents', 'clock');
    h += `<div class="sb-label">Library</div>`;
    for (const [k, v] of Object.entries(KINDS)) h += item('category:' + k, v.title, v.icon, byKind(k).length);
    if (S.saved.length) {
      h += `<div class="sb-label">Saved Searches</div>`;
      S.saved.forEach((q, i) => { h += `<button class="sb-item" data-saved="${i}">${icon('bookmark')}<span>${esc(q)}</span></button>`; });
    }
    h += `<div class="sb-label">Locations</div>`;
    for (const [key, label, ic] of LOCATIONS) h += item('location:' + key, label, ic);
    h += `<button class="sb-item muted" data-act="soon" data-msg="Add Folder lets you include up to eight custom folders.">${icon('plus')}<span>Add Folder</span></button>`;
    h += `<div class="sb-label">Workspaces</div><button class="sb-item muted" data-act="soon" data-msg="Workspaces group files from different folders, without moving them.">${icon('plus')}<span>New Workspace</span></button>`;
    h += `<div class="sb-label">Tools</div>`;
    h += item('freeup', 'Free Up Space', 'sparkles');
    h += `<button class="sb-item" data-act="tidy">${icon('wand')}<span>Tidy Downloads</span></button>`;
    h += item('connections', 'Connections', 'globe');
    h += `<div class="sb-spacer"></div><div class="sb-foot"><button class="tb-btn ${S.route === 'trash' ? 'on' : ''}" data-nav="trash" aria-label="Trash">${icon('trash')}</button><button class="tb-btn" data-act="soon" data-msg="Settings: appearance, locations, text recognition and Quick Search shortcut." aria-label="Settings">${icon('gear')}</button></div>`;
    sidebar.innerHTML = h;
    if (S.route.startsWith('location:Downloads/')) $('[data-nav="location:Downloads"]', sidebar)?.classList.add('active');
  }

  function renderStatus() {
    const all = live();
    let t = `${all.length} files · 0 excluded · online-only contents stay undownloaded`;
    if (S.route.startsWith('location:')) {
      const items = locationItems(S.route.slice(9));
      t = `${items.length} items · 807.49 GB available`;
    }
    statusEl.innerHTML = `<i></i><span>${t}</span>`;
  }

  function tools() {
    return `<div class="pg-tools">
      <button class="icon-tool ${S.menu ? 'on' : ''}" data-act="sort-menu" aria-label="Sort" aria-expanded="${S.menu}">${icon('sort')}</button>
      <div class="seg" role="group" aria-label="View"><button class="${S.view === 'grid' ? 'on' : ''}" data-view="grid" aria-label="Grid view" aria-pressed="${S.view === 'grid'}">${icon('grid')}</button><button class="${S.view === 'list' ? 'on' : ''}" data-view="list" aria-label="List view" aria-pressed="${S.view === 'list'}">${icon('list')}</button></div>
      ${S.menu ? `<div class="menu" role="menu"><small>Sort</small>${['newest', 'name', 'size', 'kind'].map(s => `<button role="menuitemradio" aria-checked="${S.sort === s}" class="${S.sort === s ? 'on' : ''}" data-sort="${s}">${icon('check')}${cap(s)}</button>`).join('')}</div>` : ''}
    </div>`;
  }

  function tiles(files, { folderTiles = [] } = {}) {
    if (!files.length && !folderTiles.length) return '';
    const list = sorted(files);
    if (S.view === 'list') {
      const col = s => S.sort === s ? 'on' : '';
      return `<div class="list" role="listbox" aria-label="Files">
        <div class="list-head"><span class="${col('name')}">Name</span><span class="${col('newest')}">Date Added</span><span class="${col('size')}" style="text-align:right">Size</span><span class="${col('kind')}">Kind</span></div>
        ${folderTiles.map(([route, name, n]) => `<button class="row" data-nav="${route}"><span class="rn"><i class="mini-folder"></i><span>${esc(name)}</span></span><span class="rm">Today</span><span class="rs">${n} items</span><span class="rm">Folder</span></button>`).join('')}
        ${list.map((f, i) => `<button class="row ${S.selected === f.id ? 'sel' : ''}" data-file="${f.id}" role="option" aria-selected="${S.selected === f.id}" style="animation-delay:${Math.min(i, 14) * 18}ms"><span class="rn">${thumb(f)}<span>${esc(f.name)}</span></span><span class="rm">${fmtDate(f.date)}</span><span class="rs">${fmtSize(f.size)}</span><span class="rm">${KIND_NAME[f.kind]}</span></button>`).join('')}
      </div>`;
    }
    return `<div class="grid" role="listbox" aria-label="Files">
      ${folderTiles.map(([route, name, n]) => `<button class="tile" data-nav="${route}"><i class="th th-folder" aria-hidden="true"></i><span class="nm">${esc(name)}</span><span class="mt">${n} items</span></button>`).join('')}
      ${list.map((f, i) => `<button class="tile ${S.selected === f.id ? 'sel' : ''}" data-file="${f.id}" role="option" aria-selected="${S.selected === f.id}" style="animation-delay:${Math.min(i, 14) * 22}ms">${thumb(f)}<span class="nm">${esc(f.name)}</span><span class="mt">${fmtSize(f.size)}</span></button>`).join('')}
    </div>`;
  }

  function renderRoute() {
    const r = S.route;
    if (r === 'home') return viewHome();
    if (r === 'recents') {
      const items = live().filter(f => ageDays(f) <= 30 && f.kind !== 'app');
      return `<div class="pg-head"><h3>${icon('clock')} Recents <small>${items.length}</small></h3>${tools()}</div>${tiles(items)}`;
    }
    if (r.startsWith('category:')) {
      const k = r.slice(9), items = byKind(k);
      return `<div class="pg-head"><h3>${icon(KINDS[k].icon)} ${KINDS[k].title} <small>${items.length}</small></h3>${tools()}</div>${tiles(items) || emptyState('folder', 'Nothing here yet', 'Files of this kind will appear as MacEx finds them.')}`;
    }
    if (r.startsWith('location:')) return viewLocation(r.slice(9));
    if (r === 'search') return viewSearch();
    if (r === 'freeup') return viewFreeUp();
    if (r === 'connections') return viewConnections();
    if (r === 'trash') return viewTrash();
    return '';
  }

  function emptyState(ic, title, text, action = '') {
    return `<div class="empty-state">${icon(ic)}<b>${title}</b><p>${text}</p>${action}</div>`;
  }

  function viewHome() {
    const hr = new Date().getHours();
    const hello = hr < 5 ? 'Good evening' : hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
    const all = live();
    const cards = Object.entries(KINDS).map(([k, v]) => {
      const items = sorted(byKind(k)).slice(0, 3);
      const sub = k === 'app' ? `${byKind(k).length} items · Application bundles` : `${byKind(k).length} items · ${fmtSize(sum(byKind(k)))}`;
      return `<button class="fcard" data-nav="category:${k}" aria-label="${v.title}, ${sub}">
        <div class="folder" style="--fc:${v.color}"><div class="f-tab"></div><div class="f-back"></div>
          <div class="f-papers">${items.map(f => thumb(f)).join('')}</div>
          <div class="f-front"><span class="f-icon">${icon(v.icon)}</span><span class="f-go">${icon('arrow')}</span></div>
        </div><b>${v.title}</b><small>${sub}</small></button>`;
    }).join('');
    const shelf = (items) => `<div class="shelf">${items.map(f => `<button class="tile ${S.selected === f.id ? 'sel' : ''}" data-file="${f.id}">${thumb(f)}<span class="nm">${esc(f.name)}</span></button>`).join('')}</div>`;
    const recentImgs = sorted(byKind('image')).slice(0, 6);
    const recentDl = live().filter(f => f.folder === 'Downloads').sort((a, b) => b.date - a.date).slice(0, 6);
    return `<div class="home-hello"><div><h3>${hello}</h3><p>${all.length} files · ${fmtSize(sum(all))} in your library</p></div><button class="tb-btn" data-act="refresh" aria-label="Refresh library">${icon('reset')}</button></div>
      <div class="sec-title"><h4>Library</h4></div><div class="folders">${cards}</div>
      <div class="sec-title"><h4>Recent images</h4><button data-nav="category:image">View all</button></div>${shelf(recentImgs)}
      <div class="sec-title"><h4>Recent downloads</h4><button data-nav="location:Downloads">View all</button></div>${shelf(recentDl)}`;
  }

  function locationItems(loc) {
    if (loc === '~') return LOCATIONS.slice(1);
    const [base, sub] = loc.split('/');
    let items = live().filter(f => f.folder === base);
    if (base === 'Downloads' && S.tidy) items = sub ? items.filter(f => tidyGroup(f) === sub) : [];
    return items;
  }
  function viewLocation(loc) {
    const [base, sub] = loc.split('/');
    const crumbs = ['Macintosh HD', 'Users', 'you'];
    const path = base === '~' ? crumbs.slice(0, 2) : sub ? [...crumbs, base] : crumbs;
    const title = base === '~' ? 'you' : (sub || base);
    const crumbHTML = `<div class="crumbs">${path.map((c, i) => `<button ${i === path.length - 1 && sub ? 'data-nav="location:' + base + '"' : ''}>${esc(c)}</button>${icon('right')}`).join('')}<b>${icon('folder')}${esc(title)}</b></div>`;
    if (base === '~') {
      const folders = LOCATIONS.slice(1).map(([k, l]) => ['location:' + k, l, live().filter(f => f.folder === k).length]);
      return `<div class="pg-head">${crumbHTML}${tools()}</div>${tiles([], { folderTiles: folders })}`;
    }
    let folderTiles = [];
    if (base === 'Downloads' && S.tidy && !sub) {
      const groups = {};
      live().filter(f => f.folder === 'Downloads').forEach(f => { groups[tidyGroup(f)] = (groups[tidyGroup(f)] || 0) + 1; });
      folderTiles = Object.entries(groups).sort().map(([g, n]) => ['location:Downloads/' + g, g, n]);
    }
    const items = locationItems(loc);
    const tidyBtn = base === 'Downloads' && !sub ? `<button class="icon-tool" data-act="tidy" aria-label="Tidy Downloads">${icon('wand')}</button>` : '';
    return `<div class="pg-head">${crumbHTML}<div class="pg-tools">${tidyBtn}</div>${tools()}</div>${tiles(items, { folderTiles }) || emptyState('folder', 'This folder is empty', 'Nothing to show here.')}`;
  }

  function currentChips() {
    const { chips } = parseQuery(S.query);
    return chips;
  }
  function viewSearch() {
    const chips = currentChips();
    const activeChips = chips.filter(c => !S.removed.has(c.key));
    const results = applyChips(live(), activeChips);
    const saved = S.saved.includes(S.query.trim());
    const chipRow = chips.length ? `<div class="understood"><span>Understood as</span>${chips.map((c, i) => S.removed.has(c.key) ? '' : `<span class="fchip k-${c.kind}" style="animation-delay:${i * 60}ms">${esc(c.label)}<button data-chip="${esc(c.key)}" aria-label="Remove filter ${esc(c.label)}">${icon('x')}</button></span>`).join('')}</div>` : '';
    const val = k => activeChips.filter(c => c.kind === k).map(c => c.label).join(', ') || 'Any';
    const filters = S.editFilters ? `<div class="filter-grid"><label>Kind<span>${esc(val('type'))}</span></label><label>Date<span>${esc(val('date'))}</span></label><label>Size<span>${esc(val('size'))}</span></label><label>Source<span>${esc(val('source'))}</span></label><label>Where<span>${esc(val('place'))}</span></label><label>Text<span>${esc(val('text'))}</span></label><label>Name<span>${esc(val('literal'))}</span></label><label>Scope<span>Whole library</span></label></div>` : '';
    const tryList = ['pdfs from last week over 5 mb', 'videos from my iphone in august', 'screenshots with wifi password', 'zips bigger than 1 gb older than 6 months'];
    const body = results.length ? tiles(results) : emptyState('search', 'No matching files', 'Filters use the available library metadata and recognized text. Missing camera, source or date metadata is excluded by those filters.', `<button class="btn-acc" data-act="clear-search">Clear Search</button><div class="search-hint" style="margin-top:18px">${tryList.map(t => `<button data-query="${esc(t)}">${esc(t)}</button>`).join('')}</div>`);
    return `<div class="pg-head"><h3>${icon('search')} Search <small>${results.length}</small></h3><div class="pg-tools"><button class="icon-tool ${saved ? 'on' : ''}" data-act="save-search" aria-label="Save search to sidebar">${icon('bookmark')}</button></div>${tools()}</div>
      ${chipRow}<button class="edit-filters ${S.editFilters ? 'open' : ''}" data-act="edit-filters" aria-expanded="${S.editFilters}">${icon('right')} Edit Filters</button>${filters}${body}`;
  }

  /* ----- Free Up Space ----- */
  function fuGroups() {
    const A = S.age, L = live();
    const safe = [
      { key: 'shots', title: 'Old screenshots', sub: `Screenshots older than ${A} days`, ic: 'camera', c: 'linear-gradient(135deg,#e05cf0,#b23bd8)', bar: '#d24bea', files: L.filter(f => f.shot && ageDays(f) > A) },
      { key: 'installers', title: 'Old installers', sub: '.dmg and .pkg files you already used', ic: 'archive', c: 'linear-gradient(135deg,#6f9bff,#4c6ef0)', bar: '#5b8cff', files: L.filter(f => f.installer && ageDays(f) > A) },
      { key: 'forgotten', title: 'Forgotten downloads', sub: 'Not opened in months', ic: 'download', c: 'linear-gradient(135deg,#3fd7c4,#1ea89a)', bar: '#2fc4b2', files: L.filter(f => f.folder === 'Downloads' && !f.installer && ageDays(f) > Math.max(A, 90)) },
      { key: 'empty', title: 'Empty files', sub: 'Zero-byte files left behind', ic: 'doc', c: 'linear-gradient(135deg,#5ee0e8,#2bb7c9)', bar: '#f2a33a', files: L.filter(f => f.size === 0) },
    ];
    const dupe = L.filter(f => f.dupOf);
    const sim = L.filter(f => f.similar && f.similar > 1);
    const call = [
      { key: 'dupes', title: 'Duplicates', sub: 'Files that are exact copies of each other', ic: 'copy', c: 'linear-gradient(135deg,#8b8cff,#6366f1)', files: dupe, action: S.dupes ? null : ['find-dupes', 'Find Duplicates'] },
      { key: 'similar', title: 'Similar photos', sub: 'Bursts and near-identical shots, compared on this Mac', ic: 'image', c: 'linear-gradient(135deg,#4fd8a8,#22a77a)', files: sim, action: S.similar ? null : ['find-similar', 'Review'] },
      { key: 'bigvideos', title: 'Big old videos', sub: 'Over 500 MB and older than 6 months', ic: 'video', c: 'linear-gradient(135deg,#ff8a65,#e8553a)', files: L.filter(f => f.kind === 'video' && f.size > 500 * MB && ageDays(f) > 180) },
      { key: 'apps', title: 'Unused apps', sub: 'Not opened in over a year', ic: 'apps', c: 'linear-gradient(135deg,#f472b6,#c0447f)', files: L.filter(f => f.kind === 'app' && f.used > 365) },
    ];
    return { safe, call };
  }
  function viewFreeUp() {
    const { safe, call } = fuGroups();
    const safeOn = safe.filter(g => g.files.length);
    const safeTotal = sum(safeOn.flatMap(g => g.files)), safeCount = safeOn.reduce((a, g) => a + g.files.length, 0);
    const big = safeTotal >= 1e9 ? [(safeTotal / 1e9).toFixed(1), 'GB'] : safeTotal >= 1e6 ? [(safeTotal / 1e6).toFixed(1), 'MB'] : [Math.round(safeTotal / 1e3), 'KB'];
    const row = (g, selectable) => {
      const on = S.fuSel.has(g.key), open = S.fuOpen.has(g.key);
      const right = g.action ? `<span class="btn-soft" data-act="${g.action[0]}" role="button" tabindex="0">${g.action[1]}</span>` : `<span class="fu-amt"><b>${fmtSize(sum(g.files))}</b><small>${g.files.length} file${g.files.length > 1 ? 's' : ''}</small></span>${icon('right', 'fu-chev')}`;
      let extra = '';
      if (g.key === 'dupes' && S.dupes) {
        const keep = live().find(f => f.dupKeep);
        extra = `<div class="fu-pair"><div>${keep ? thumb(keep) : ''}<span>${keep ? esc(keep.name) : 'Original'}<small>Documents</small></span><em class="keep">Keep</em></div>${g.files.map(f => `<div>${thumb(f)}<span>${esc(f.name)}<small>Identical bytes · ${fmtSize(f.size)}</small></span><em class="dup">Copy</em></div>`).join('')}</div>`;
      } else if (g.key === 'similar' && S.similar) {
        const all = live().filter(f => f.similar);
        extra = `<div class="fu-similar">${all.map(f => `<i class="th th-ocean ${f.similar === 1 ? 'best' : ''}" style="--h:${190 + f.similar * 6}" title="${esc(f.name)}"></i>`).join('')}</div>`;
      } else if (open) {
        extra = `<div class="fu-files">${g.files.map(f => `<div class="fu-file">${thumb(f)}<span>${esc(f.name)}</span><em>${fmtSize(f.size)}</em></div>`).join('')}</div>`;
      }
      const canSelect = selectable && !g.action;
      return `<div class="fu-row ${on ? 'on' : ''} ${open ? 'open' : ''}">
        <div class="fu-row-main" ${g.action ? '' : `data-fu-open="${g.key}" role="button" tabindex="0" aria-expanded="${open}"`}>
          ${canSelect ? `<button class="fu-radio" data-fu="${g.key}" role="checkbox" aria-checked="${on}" aria-label="Select ${g.title}">${icon('check')}</button>` : '<span style="width:22px"></span>'}
          <span class="fu-ic" style="--c:${g.c}">${icon(g.ic)}</span><span class="fu-txt"><b>${g.title}</b><small>${g.sub}</small></span>${right}
        </div>${extra}</div>`;
    };
    const clearNames = arr => arr.filter(g => !g.files.length).map(g => g.title);
    const allClear = names => names.length ? `<div class="fu-clear">${icon('check')}All clear: ${names.join(', ').replace(/, ([^,]*)$/, ' and $1')}</div>` : '';
    const callShown = call.filter(g => g.files.length);
    const selFiles = [...S.fuSel].flatMap(k => [...safe, ...call].find(g => g.key === k)?.files || []);
    return `<div class="fu-head"><h3>${icon('sparkles')} Free Up Space</h3><button class="fu-age" data-act="age">${icon('calendar')} Older than ${S.age} days ${icon('right')}</button></div>
      <div class="fu-hero"><div class="fu-top"><div><b>${big[0]} ${big[1]}</b><span>safe to clear in ${safeCount} files</span></div><button class="btn-acc" data-act="select-safe" ${safeCount ? '' : 'disabled'}>${icon('check')} Select all safe</button></div>
        <div class="fu-bar">${safeOn.map(g => `<i style="--c:${g.bar};flex-grow:${sum(g.files) || 1}"></i>`).join('')}</div>
        <div class="fu-legend">${safeOn.map(g => `<span style="--c:${g.bar}">${g.title} · ${fmtSize(sum(g.files))}</span>`).join('') || '<span style="--c:#34c759">Nothing to clear right now</span>'}</div></div>
      <div class="fu-group"><h4>Safe to clear</h4><p>Usually fine to remove. You still review everything before it moves to Trash.</p>${safeOn.map(g => row(g, true)).join('')}${allClear(clearNames(safe))}</div>
      <div class="fu-group"><h4>Your call</h4><p>Worth a look, but only you know if you still need these.</p>${callShown.map(g => row(g, true)).join('')}${allClear(clearNames(call))}</div>
      ${selFiles.length ? `<div class="fu-actionbar"><b>${selFiles.length} file${selFiles.length > 1 ? 's' : ''} selected</b><span>${fmtSize(sum(selFiles))}</span><button class="btn-acc" data-act="trash-selected">${icon('trash')} Move to Trash…</button></div>` : ''}`;
  }

  function viewConnections() {
    return `<div class="pg-head"><h3>${icon('globe')} Connections</h3><div class="pg-tools"><button class="btn-acc" data-act="soon" data-msg="In the real app you add a host, review its key fingerprint, then sign in.">${icon('plus')} Add Connection</button></div></div>
      <div class="conn-card"><span class="fu-ic">${icon('server')}</span><span class="fu-txt"><b>studio-nas.local</b><small>sftp · you@studio-nas.local · port 22</small></span><span class="ok">${icon('shield')} Host key verified</span></div>
      <div class="fp-line">ED25519 SHA256:3Fq9kL2x8vNwZp1RyT6mHc4eAb0sUd7K · pinned on first connection</div>
      <div class="conn-card"><span class="fu-ic" style="--c:linear-gradient(135deg,#6b7a99,#46526e)">${icon('server')}</span><span class="fu-txt"><b>backup.example.net</b><small>sftp · key from SSH agent</small></span><span class="ok" style="color:var(--a-mut)">Not connected</span></div>`;
  }
  function viewTrash() {
    const items = FILES.filter(f => S.trashed.has(f.id));
    if (!items.length) return `<div class="pg-head"><h3>${icon('trash')} Trash</h3></div>${emptyState('trash', 'Trash is empty', 'Files MacEx moves to Trash show up here, with a way to put them back.')}`;
    return `<div class="pg-head"><h3>${icon('trash')} Trash <small>${items.length}</small></h3><div class="pg-tools"><button class="btn-soft" data-act="restore-all">Put Back All</button></div></div>
      <div class="list">${items.map(f => `<div class="row"><span class="rn">${thumb(f)}<span>${esc(f.name)}</span></span><span class="rm">from ${esc(f.folder)}</span><span class="rs">${fmtSize(f.size)}</span><span><button class="btn-plain" data-restore="${f.id}">Put Back</button></span></div>`).join('')}</div>`;
  }

  /* ----- preview pane ----- */
  function renderPreview() {
    const f = FILES.find(x => x.id === S.selected);
    if (!f) { previewEl.innerHTML = `<div class="pv"><div class="pv-empty">${icon('inspector')}<p>Select a file to preview it here.<br>Press Space to toggle.</p></div></div>`; return; }
    const rows = [['Kind', KIND_NAME[f.kind] + (f.ext ? ` (.${f.ext})` : '')], ['Size', fmtSize(f.size)], ['Added', fmtDate(f.date)], ['Where', f.folder]];
    if (f.source && !['Screenshot', 'Music'].includes(f.source)) rows.push(['Source', f.source]);
    if (f.kind === 'image' && !f.shot) rows.push(['Dimensions', '4032 × 3024']);
    if (f.shot) rows.push(['Dimensions', '2880 × 1800']);
    if (f.dur) rows.push(['Duration', f.dur]);
    const player = f.kind === 'music' ? `<div class="player"><button data-act="play" aria-label="Play">${icon('play')}</button><div class="bar"><i></i></div><small>${f.dur}</small></div>` : '';
    const ocr = f.text ? `<div class="pv-ocr"><small>Recognized text</small>${esc(f.text)}</div><div class="pv-actions"><button class="btn-acc" data-act="copy-text">${icon('copy')} Copy Text</button></div>` : '';
    previewEl.innerHTML = `<div class="pv"><div class="pv-art">${thumb(f)}</div><h5>${esc(f.name)}</h5>${player}<dl>${rows.map(([a, b]) => `<dt>${a}</dt><dd>${esc(b)}</dd>`).join('')}</dl>${ocr}</div>`;
  }

  /* ----- sheets & toasts ----- */
  let toastTimer;
  function toast(msg, opts = {}) {
    clearTimeout(toastTimer);
    toastEl.innerHTML = `${icon(opts.icon || 'check')}<span>${esc(msg)}</span>${opts.undo ? '<button data-act="undo">Undo</button>' : ''}`;
    toastEl.classList.add('show');
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), opts.ms || 3800);
  }
  function openSheet(html) { sheetEl.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">${html}</div>`; sheetEl.hidden = false; $('.sheet button.btn-acc, .sheet button', sheetEl)?.focus({ preventScroll: true }); }
  function closeSheet() { const had = sheetEl.contains(document.activeElement); sheetEl.hidden = true; sheetEl.innerHTML = ''; if (had) app.focus({ preventScroll: true }); }

  function openTidy() {
    const loose = S.tidy ? [] : live().filter(f => f.folder === 'Downloads');
    const groups = {};
    loose.forEach(f => { (groups[tidyGroup(f)] = groups[tidyGroup(f)] || []).push(f); });
    if (!loose.length) {
      openSheet(`<div class="sheet-top"><span class="fu-ic">${icon('wand')}</span><span><b>Downloads is already tidy</b><small>~/Downloads</small></span></div><div class="sheet-foot"><small>${icon('reset')} Existing files are never replaced. ⌘Z puts everything back.</small><button class="btn-acc" data-act="close-sheet">Done</button></div>`);
      return;
    }
    openSheet(`<div class="sheet-top"><span class="fu-ic">${icon('wand')}</span><span><b>Tidy ${loose.length} files in Downloads</b><small>~/Downloads</small></span></div>
      <div class="sheet-body">${Object.entries(groups).sort().map(([g, arr]) => `<div class="sheet-move"><i class="mini-folder"></i><span>${g}</span><em>${arr.length} file${arr.length > 1 ? 's' : ''}</em></div>`).join('')}</div>
      <div class="sheet-foot"><small>${icon('reset')} Existing files are never replaced. ⌘Z puts everything back.</small><button class="btn-plain" data-act="close-sheet">Cancel</button><button class="btn-acc" data-act="do-tidy">Tidy Up</button></div>`);
  }
  function doTidy() {
    const n = live().filter(f => f.folder === 'Downloads').length;
    S.tidy = true; S.undo = { type: 'tidy' };
    closeSheet(); go('location:Downloads');
    const groups = new Set(live().filter(f => f.folder === 'Downloads').map(tidyGroup));
    toast(`Tidied ${n} files into ${groups.size} folders`, { icon: 'wand', undo: true });
  }
  function confirmTrash() {
    const { safe, call } = fuGroups();
    const files = [...S.fuSel].flatMap(k => [...safe, ...call].find(g => g.key === k)?.files || []);
    if (!files.length) return;
    openSheet(`<div class="sheet-top"><span class="fu-ic" style="background:linear-gradient(135deg,#ff7a7a,#e5484d)">${icon('trash')}</span><span><b>Move ${files.length} file${files.length > 1 ? 's' : ''} to Trash?</b><small>${fmtSize(sum(files))} · You can put them back from MacEx history.</small></span></div>
      <div class="sheet-body">${files.slice(0, 6).map(f => `<div class="sheet-move">${thumb(f, 'mini')}<span>${esc(f.name)}</span><em>${fmtSize(f.size)}</em></div>`).join('')}${files.length > 6 ? `<div class="sheet-move"><span>and ${files.length - 6} more</span></div>` : ''}</div>
      <div class="sheet-foot"><small>${icon('shield')} Nothing is permanently deleted.</small><button class="btn-plain" data-act="close-sheet">Cancel</button><button class="btn-acc" data-act="do-trash" style="background:#e5484d">Move to Trash</button></div>`);
    $$('.sheet-move .th', sheetEl).forEach(t => { t.style.cssText += ';width:22px;height:22px;border-radius:4px'; });
  }
  function doTrash() {
    const { safe, call } = fuGroups();
    const files = [...S.fuSel].flatMap(k => [...safe, ...call].find(g => g.key === k)?.files || []);
    files.forEach(f => S.trashed.add(f.id));
    S.undo = { type: 'trash', ids: files.map(f => f.id) };
    S.fuSel.clear(); closeSheet(); render();
    toast(`Moved ${files.length} files to Trash · ${fmtSize(sum(files))} freed`, { icon: 'trash', undo: true });
  }
  function undo() {
    const u = S.undo; if (!u) return;
    if (u.type === 'trash') { u.ids.forEach(id => S.trashed.delete(id)); toast('Put everything back', { icon: 'reset' }); }
    if (u.type === 'tidy') { S.tidy = false; if (S.route.startsWith('location:Downloads/')) S.route = 'location:Downloads'; toast('Downloads is back the way it was', { icon: 'reset' }); }
    S.undo = null; render();
  }

  /* ----- search input ----- */
  function setQuery(q) {
    input.value = q;
    S.query = q; S.removed.clear();
    if (q.trim()) {
      if (S.route !== 'search') { S.back.push(S.route); S.fwd = []; S.route = 'search'; S.selected = null; render(true); return; }
    } else if (S.route === 'search') { S.route = S.back.pop() || 'home'; render(true); return; }
    render();
  }
  input.addEventListener('input', () => setQuery(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.stopPropagation(); if (input.value) setQuery(''); else input.blur(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); input.blur(); moveSel(1); }
  });

  async function typeSearch(q, token = ++tourToken) {
    openLid(); closeOverlays();
    if (S.route !== 'home' && S.route !== 'search') go('home');
    input.focus({ preventScroll: true });
    setQuery('');
    await sleep(250);
    for (let i = 1; i <= q.length; i++) {
      if (token !== tourToken) return;
      setQuery(q.slice(0, i));
      await sleep(motionPaused ? 0 : 38);
    }
  }

  /* ----- selection & keyboard ----- */
  function visibleFileIds() { return $$('[data-file]', content).map(b => +b.dataset.file); }
  function select(id, { scroll = true } = {}) {
    S.selected = id;
    $$('[data-file]', content).forEach(b => { const on = +b.dataset.file === id; b.classList.toggle('sel', on); b.setAttribute('aria-selected', on); if (on && scroll) reveal(b); });
    renderPreview();
  }
  function reveal(el) {
    const s = parseFloat(desktop.style.getPropertyValue('--s')) || 1;
    const cr = content.getBoundingClientRect(), br = el.getBoundingClientRect();
    if (br.top < cr.top) content.scrollTop -= (cr.top - br.top) / s + 12;
    else if (br.bottom > cr.bottom) content.scrollTop += (br.bottom - cr.bottom) / s + 12;
  }
  function moveSel(d) {
    const ids = visibleFileIds(); if (!ids.length) return;
    let i = ids.indexOf(S.selected);
    if (i < 0) i = d > 0 ? -1 : ids.length;
    let step = d;
    if (Math.abs(d) === 2) { const grid = $('.grid', content); const cols = grid ? getComputedStyle(grid).gridTemplateColumns.split(' ').length : 1; step = Math.sign(d) * cols; }
    select(ids[clamp(i + step, 0, ids.length - 1)]);
  }
  function togglePreview(force) {
    S.preview = force ?? !S.preview;
    if (S.preview && !S.selected) { const ids = visibleFileIds(); if (ids.length) S.selected = ids[0]; }
    render();
  }
  function closeOverlays() { closeSheet(); if (S.menu) { S.menu = false; render(); } }

  document.addEventListener('keydown', e => {
    const mod = e.metaKey || e.ctrlKey;
    if (mod && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (!stage.classList.contains('fs')) $('#mac-stage').scrollIntoView({ behavior: motionPaused ? 'auto' : 'smooth', block: 'start' });
      openLid(); setTimeout(() => input.focus({ preventScroll: true }), 300);
      return;
    }
    if (!active && !stage.classList.contains('fs')) return;
    const typing = document.activeElement === input || (document.activeElement && document.activeElement.matches('input,textarea'));
    if (e.key === 'Escape') {
      if (!sheetEl.hidden) { closeSheet(); return; }
      if (S.menu) { S.menu = false; render(); return; }
      if (stage.classList.contains('fs')) { toggleFs(false); return; }
      if (S.preview) { togglePreview(false); return; }
      return;
    }
    if (mod && e.key.toLowerCase() === 'f') { e.preventDefault(); input.focus({ preventScroll: true }); input.select(); return; }
    if (mod && e.key.toLowerCase() === 'z' && !typing) { e.preventDefault(); undo(); return; }
    if (mod && e.key === '[') { e.preventDefault(); back(); return; }
    if (mod && e.key === ']') { e.preventDefault(); forward(); return; }
    if (typing || !sheetEl.hidden) return;
    if (e.key === ' ') {
      const b = e.target.closest && e.target.closest('button,a,summary,[role="button"]');
      if (b && !b.matches('[data-file]')) return;
      e.preventDefault(); togglePreview(); return;
    }
    if (e.key === 'ArrowRight') { e.preventDefault(); moveSel(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); moveSel(-1); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); moveSel(S.view === 'list' ? 1 : 2); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveSel(S.view === 'list' ? -1 : -2); }
    else if (e.key === 'Enter' && S.selected) { e.preventDefault(); togglePreview(true); }
  });
  app.tabIndex = -1;
  app.addEventListener('pointerdown', e => { if (!e.target.closest('button,input,a,[tabindex]:not(#app)')) setTimeout(() => app.focus({ preventScroll: true }), 0); });
  stage.addEventListener('focusin', () => { active = true; });
  stage.addEventListener('focusout', () => { setTimeout(() => { active = stage.contains(document.activeElement); }, 0); });

  /* ----- clicks ----- */
  let lastClick = { id: 0, t: 0 };
  app.addEventListener('click', e => {
    const t = e.target;
    const chip = t.closest('[data-chip]');
    if (chip) { S.removed.add(chip.dataset.chip); render(); return; }
    const sortB = t.closest('[data-sort]');
    if (sortB) { S.sort = sortB.dataset.sort; S.menu = false; render(); return; }
    const viewB = t.closest('[data-view]');
    if (viewB) { S.view = viewB.dataset.view; render(); return; }
    const q = t.closest('[data-query]');
    if (q) { setQuery(q.dataset.query); return; }
    const saved = t.closest('[data-saved]');
    if (saved) { input.value = S.saved[+saved.dataset.saved]; setQuery(input.value); return; }
    const restore = t.closest('[data-restore]');
    if (restore) { S.trashed.delete(+restore.dataset.restore); render(); toast('Put back where it came from', { icon: 'reset' }); return; }
    const fuR = t.closest('[data-fu]');
    if (fuR) { e.stopPropagation(); const k = fuR.dataset.fu; S.fuSel.has(k) ? S.fuSel.delete(k) : S.fuSel.add(k); render(); return; }
    const act = t.closest('[data-act]');
    if (act) { onAct(act.dataset.act, act, e); return; }
    const fuO = t.closest('[data-fu-open]');
    if (fuO) { const k = fuO.dataset.fuOpen; S.fuOpen.has(k) ? S.fuOpen.delete(k) : S.fuOpen.add(k); render(); return; }
    const nav = t.closest('[data-nav]');
    if (nav) { go(nav.dataset.nav); return; }
    const fileB = t.closest('[data-file]');
    if (fileB) {
      const id = +fileB.dataset.file, now = Date.now();
      if (lastClick.id === id && now - lastClick.t < 400) togglePreview(true);
      else select(id, { scroll: false });
      lastClick = { id, t: now };
      return;
    }
    if (S.menu && !t.closest('.menu')) { S.menu = false; render(); }
  });
  app.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role="button"][data-fu-open],[role="button"][data-act]')) { e.preventDefault(); e.target.click(); }
  });

  function onAct(a, el) {
    switch (a) {
      case 'toggle-sidebar': S.sidebar = !S.sidebar; render(); break;
      case 'back': back(); break;
      case 'forward': forward(); break;
      case 'theme': S.theme = S.theme === 'dark' ? 'light' : 'dark'; render(); break;
      case 'toggle-preview': togglePreview(); break;
      case 'clear-search': setQuery(''); input.focus({ preventScroll: true }); break;
      case 'sort-menu': S.menu = !S.menu; render(); break;
      case 'edit-filters': S.editFilters = !S.editFilters; render(); break;
      case 'save-search': {
        const q = S.query.trim(); if (!q) break;
        if (S.saved.includes(q)) S.saved = S.saved.filter(x => x !== q); else { S.saved.push(q); toast('Saved to the sidebar. Relative dates stay fresh.', { icon: 'bookmark' }); }
        render(); break;
      }
      case 'refresh': toast('Library refreshed', { icon: 'reset' }); break;
      case 'tidy': openTidy(); break;
      case 'do-tidy': doTidy(); break;
      case 'close-sheet': closeSheet(); break;
      case 'select-safe': fuGroups().safe.forEach(g => g.files.length && S.fuSel.add(g.key)); render(); break;
      case 'trash-selected': confirmTrash(); break;
      case 'do-trash': doTrash(); break;
      case 'undo': undo(); toastEl.classList.remove('show'); break;
      case 'age': S.age = S.age === 30 ? 90 : S.age === 90 ? 7 : 30; S.fuSel.clear(); render(); break;
      case 'find-dupes': S.dupes = true; render(); toast('Compared byte for byte. 1 exact copy found.', { icon: 'copy' }); break;
      case 'find-similar': S.similar = true; render(); toast('Kept the sharpest shot. 2 look-alikes to review.', { icon: 'image' }); break;
      case 'restore-all': S.trashed.clear(); render(); toast('Put everything back', { icon: 'reset' }); break;
      case 'copy-text': {
        const f = FILES.find(x => x.id === S.selected);
        try { navigator.clipboard?.writeText(f.text); } catch (_) { /* clipboard may be blocked */ }
        toast('Text copied', { icon: 'copy' }); break;
      }
      case 'play': {
        const p = el.closest('.player'); const on = p.classList.toggle('playing');
        el.innerHTML = icon(on ? 'pause' : 'play'); el.setAttribute('aria-label', on ? 'Pause' : 'Play');
        break;
      }
      case 'soon': toast(el.dataset.msg || 'Available in the real app', { icon: 'sparkles', ms: 4200 }); break;
    }
  }

  /* ----- tour ----- */
  async function tour(step) {
    const token = ++tourToken;
    $$('.tour-step').forEach(b => b.classList.toggle('active', b.dataset.tour === step));
    openLid(); closeSheet(); S.menu = false;
    const ok = () => token === tourToken;
    const pulse = sel => { const el = $(sel, app); if (el) { el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse'); } };
    if (step === 'search') {
      await typeSearch('pdfs from last week over 5 mb', token);
      if (!ok()) return;
      await sleep(400); pulse('.fchip');
      toast('Tap × on a filter to drop it. Try your own words too.', { icon: 'search', ms: 4500 });
    }
    if (step === 'preview') {
      S.preview = false; go('category:image');
      await sleep(350); if (!ok()) return;
      const first = visibleFileIds()[1]; select(first);
      await sleep(450); if (!ok()) return;
      togglePreview(true);
      toast('Space toggles the preview. Arrow keys flip through files.', { icon: 'image', ms: 4500 });
    }
    if (step === 'space') {
      S.preview = false; go('freeup');
      await sleep(500); if (!ok()) return;
      pulse('[data-act="select-safe"]');
      toast('Select what you want gone. Nothing moves until you confirm.', { icon: 'sparkles', ms: 4500 });
    }
    if (step === 'tidy') {
      S.preview = false; go('location:Downloads');
      await sleep(500); if (!ok()) return;
      openTidy();
    }
    if (step === 'sort') {
      S.preview = false; go('category:document');
      await sleep(400); if (!ok()) return;
      S.view = 'list'; render();
      await sleep(500); if (!ok()) return;
      S.menu = true; render();
      await sleep(900); if (!ok()) return;
      S.sort = 'size'; S.menu = false; render();
      toast('Sorted by size. Switch back to grid any time.', { icon: 'sort' });
    }
  }
  $$('.tour-step').forEach(b => b.addEventListener('click', () => tour(b.dataset.tour)));

  /* ----- laptop: scale, open, zoom, full screen ----- */
  const fit = () => desktop.style.setProperty('--s', (screen.clientWidth / 1280).toFixed(4));
  new ResizeObserver(fit).observe(screen); fit();
  function openLid() { mbp.classList.add('open'); stage.classList.add('lit'); }
  if (reduceMotion.matches) openLid();
  else new IntersectionObserver(([e]) => { if (e.isIntersecting) openLid(); }, { threshold: .28 }).observe(mbp);

  let zraf = 0;
  const zoom = () => {
    zraf = 0;
    if (stage.classList.contains('fs') || reduceMotion.matches || motionPaused) { mbp.style.transform = ''; return; }
    const r = stage.getBoundingClientRect(), vh = innerHeight;
    const p = clamp((vh - r.top) / (vh * .95), 0, 1);
    const e = 1 - Math.pow(1 - p, 3);
    mbp.style.transform = `scale(${(.86 + .14 * e).toFixed(4)}) translateY(${((1 - e) * 40).toFixed(1)}px)`;
  };
  addEventListener('scroll', () => { if (!zraf) zraf = requestAnimationFrame(zoom); }, { passive: true });
  zoom();

  const fsBtn = $('#fs-btn');
  function toggleFs(force) {
    const on = force ?? !stage.classList.contains('fs');
    stage.classList.toggle('fs', on);
    document.body.classList.toggle('fs-lock', on);
    fsBtn.querySelector('span').textContent = on ? 'Exit full screen' : 'Full screen';
    fsBtn.querySelector('use').setAttribute('href', on ? '#i-shrink' : '#i-expand');
    openLid(); zoom(); requestAnimationFrame(fit);
    if (on) active = true;
  }
  $('#mobile-open').addEventListener('click', () => toggleFs(true));
  stage.addEventListener('click', e => {
    const a = e.target.closest('.tour-tools [data-act]');
    if (!a) return;
    if (a.dataset.act === 'fullscreen') toggleFs();
    if (a.dataset.act === 'reset-demo') { tourToken++; const theme = S.theme; S = fresh(); S.theme = theme; input.value = ''; closeSheet(); $$('.tour-step').forEach(b => b.classList.remove('active')); render(true); toast('Demo reset', { icon: 'reset' }); }
  });

  // Live clock in the menu bar
  const clockEl = $('#mb-clock');
  const tick = () => { const d = new Date(); clockEl.textContent = d.toLocaleDateString([], { weekday: 'short' }) + ' ' + d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); };
  tick(); setInterval(tick, 30e3);

  render();
  return { typeSearch, toggleFs };
})();

/* ---------------------------------------------------------
   FEATURES: sidebar tabs + live panels
   --------------------------------------------------------- */
function initFeatures() {
  const tabs = $$('.fn-item'), panels = $$('.fp');
  let current = 'search';
  function activate(key, focus = false) {
    current = key;
    tabs.forEach(t => { const on = t.dataset.feature === key; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus({ preventScroll: true }); if (on) { const nav = t.parentElement; if (nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left: t.offsetLeft - nav.clientWidth / 2 + t.offsetWidth / 2, behavior: 'smooth' }); } });
    panels.forEach(p => { const on = p.id === 'fp-' + key; p.hidden = !on; p.classList.remove('active'); if (on) { void p.offsetWidth; p.classList.add('active'); } });
    syncVideos(true);
  }

  // Feature videos: only the open tab plays, and only while the section is on screen
  const featureVideos = $$('.fp video');
  let featuresVisible = !('IntersectionObserver' in window);
  function syncVideos(restart = false) {
    featureVideos.forEach(v => {
      const live = !v.closest('.fp').hidden;
      v.controls = motionPaused;
      if (live && featuresVisible && !motionPaused) {
        if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); }
        if (restart) v.currentTime = 0;
        v.play().catch(() => { v.controls = true; });
      } else if (!v.paused) v.pause();
    });
  }
  window.syncFeatureVideos = syncVideos;
  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { featuresVisible = e.isIntersecting; syncVideos(); }, { threshold: .2 }).observe($('.feature-panels'));
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activate(t.dataset.feature));
    t.addEventListener('keydown', e => {
      const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (d) { e.preventDefault(); activate(tabs[(i + d + tabs.length) % tabs.length].dataset.feature, true); }
      if (e.key === 'Home') { e.preventDefault(); activate(tabs[0].dataset.feature, true); }
      if (e.key === 'End') { e.preventDefault(); activate(tabs[tabs.length - 1].dataset.feature, true); }
    });
  });

  activate('search');
}

/* ---------------------------------------------------------
   Page-level: reveal, nav shadow, motion toggle
   --------------------------------------------------------- */
function initPage() {
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    document.documentElement.classList.add('js-motion');
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: .08 });
    $$('.reveal, .stagger').forEach(el => io.observe(el));
    $$('.stagger').forEach(list => [...list.children].forEach((c, i) => c.style.setProperty('--i', i)));
  }
  const nav = $('.nav-wrap');
  // Thin reading-progress line along the bottom of the nav
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  nav.append(bar);
  let ticking = false;
  const onScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 10);
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--p', max > 0 ? Math.min(1, scrollY / max) : 0);
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  // Shortcut cards: spotlight follows the pointer
  $$('.kb-card').forEach(card => card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  }));
  // Animations follow the system "Reduce motion" setting
  const setMotion = () => { document.documentElement.classList.toggle('motion-paused', motionPaused); window.syncFeatureVideos?.(); };
  reduceMotion.addEventListener('change', e => { motionPaused = e.matches; setMotion(); });
  setMotion();
}

initPage();
initHero();
initFeatures();
})();
