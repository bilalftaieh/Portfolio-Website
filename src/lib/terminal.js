import { profile, experience, skills, projects, certifications, education } from '../data/profile'
import { endpoint, findFormat, formatBytes, quota, responseHeaders, resumeFile } from '../data/resume'

// ── Line model ─────────────────────────────────────────────────────────────
// A line is an array of coloured spans, the same {t, c} shape the code
// snippets use, so the console can highlight a value differently from its
// label instead of shipping one flat grey wall of text.

const s = (t, c = 'plain') => ({ t, c })
const dim = (t) => s(t, 'muted')
const key = (t) => s(t, 'accent')
const val = (t) => s(t, 'value')
const BLANK = []

/** label + value on one row, labels aligned to a common gutter. */
const row = (label, value, width = 9) => [dim('  '), key(label.padEnd(width)), val(value)]

// The banner is measured from its own content so the box always closes,
// however long the tagline gets.
const BANNER_LEFT = 'belal@portfolio'
const BANNER_RIGHT = 'apis · cloud · integration'
const BANNER_GAP = '  ·  '
const RULE = '─'.repeat(BANNER_LEFT.length + BANNER_GAP.length + BANNER_RIGHT.length + 4)

export const WELCOME_LINES = [
  [s(`╭${RULE}╮`, 'frame')],
  [
    s('│  ', 'frame'),
    key(BANNER_LEFT),
    dim(BANNER_GAP),
    val(BANNER_RIGHT),
    s('  │', 'frame'),
  ],
  [s(`╰${RULE}╯`, 'frame')],
  BLANK,
  [
    dim('  '),
    key('help'),
    dim(' lists commands · '),
    key('tab'),
    dim(' completes · '),
    key('↑'),
    dim(' recalls · '),
    key('esc'),
    dim(' closes'),
  ],
  BLANK,
]

// ── Command registry ───────────────────────────────────────────────────────
// One source of truth: `help` renders itself from this and tab-completion
// reads the same names, so a new command can never go undocumented.

const REGISTRY = [
  { name: 'whoami', blurb: 'identity card' },
  { name: 'about', blurb: 'the longer version' },
  { name: 'experience', blurb: 'career timeline' },
  { name: 'skills', blurb: 'technical toolbox' },
  { name: 'projects', blurb: 'selected work' },
  { name: 'certs', blurb: 'verified credentials' },
  { name: 'contact', blurb: 'how to reach me' },
  { name: 'cv', args: '[-d]', blurb: 'résumé metadata · -d downloads it' },
  { name: 'curl', args: '<url>', blurb: 'fetch a route this site really serves' },
  { name: 'open', args: '<target>', blurb: 'launch github · linkedin · mail' },
  { name: 'ls', blurb: 'what else is in here' },
  { name: 'clear', blurb: 'wipe the scrollback' },
  { name: 'exit', blurb: 'close the console' },
]

const ALIASES = {
  resume: 'cv',
  bio: 'about',
  work: 'experience',
  jobs: 'experience',
  stack: 'skills',
  certifications: 'certs',
  who: 'whoami',
  quit: 'exit',
  q: 'exit',
  cls: 'clear',
  '?': 'help',
  man: 'help',
}

const NAME_WIDTH = 12
const ARG_WIDTH = 10

/** Every completable token. */
export const COMMAND_NAMES = ['help', ...REGISTRY.map((c) => c.name)]

/** Longest common prefix of the candidates — how a real shell completes. */
export function complete(raw) {
  const text = raw.replace(/^\s+/, '').toLowerCase()
  if (!text || text.includes(' ')) return null

  const hits = COMMAND_NAMES.filter((n) => n.startsWith(text))
  if (hits.length === 0) return null
  if (hits.length === 1) return { value: `${hits[0]} `, hits }

  let prefix = hits[0]
  for (const hit of hits.slice(1)) {
    while (!hit.startsWith(prefix)) prefix = prefix.slice(0, -1)
  }
  return { value: prefix, hits }
}

// ── Views ──────────────────────────────────────────────────────────────────

// Deliberately not ASCII art of a face or a logo — a compass rose is about
// the only figure that still reads at eight columns wide.
const SIGIL = ['   ╱╲   ', '  ╱  ╲  ', ' ╱ ╲╱ ╲ ', ' ╲ ╱╲ ╱ ', '  ╲  ╱  ', '   ╲╱   ', '        ']

function whoamiCard() {
  const handle = profile.name.split(' ')[0].toLowerCase()
  const facts = [
    [null, `${handle}@portfolio`],
    [null, '─'.repeat(`${handle}@portfolio`.length)],
    ['role', profile.title],
    ['focus', 'Apigee · GCP · API design'],
    ['based', profile.location],
    ['certs', `${certifications.length} · latest ${certifications[0].name}`],
    ['school', `${education.degree} · ${education.school}`],
  ]

  return facts.map(([label, text], i) => {
    const sigil = s(SIGIL[Math.min(i, SIGIL.length - 1)], 'accent-deep')
    if (!label) return [sigil, s(text, i === 0 ? 'heading' : 'muted')]
    return [sigil, key(label.padEnd(8)), val(text)]
  })
}

function timeline() {
  const out = [BLANK]

  experience.forEach((job, i) => {
    const first = i === 0
    out.push([
      dim(first ? '  now ' : '      '),
      s(first ? '●' : '○', first ? 'signal' : 'accent'),
      s('  '),
      s(job.role, 'heading'),
      dim('  @  '),
      key(job.company),
    ])
    out.push([dim('      │   '), val(job.period), dim(`  ·  ${job.duration}`)])
    out.push([dim('      │   '), s(job.stack.join(' · '), 'code-string')])
    out.push([dim(i === experience.length - 1 ? '      ╵' : '      │')])
  })

  return out
}

function skillTable() {
  const out = []
  skills.forEach((group) => {
    out.push(BLANK, [dim('  ▸ '), s(group.group, 'heading')])
    group.items.forEach((item) => out.push([dim('      · '), val(item)]))
  })
  return out
}

function projectList() {
  const out = []
  projects.forEach((p, i) => {
    out.push(BLANK)
    out.push([key(`  ${String(i + 1).padStart(2, '0')}  `), s(p.title, 'heading')])
    out.push([dim('      '), s(p.tags.join(' · '), 'code-string')])
    out.push([dim('      '), s(p.href, 'link')])
  })
  out.push(BLANK, [dim('  run '), key('open 1'), dim(' … '), key(`open ${projects.length}`), dim(' to launch one')])
  return out
}

function certList() {
  const out = []
  certifications.forEach((c) => {
    out.push(BLANK)
    out.push([s('  ✓ ', 'signal'), s(c.name, 'heading'), dim('  ·  '), val(c.issuer)])
    out.push([
      dim('    issued '),
      val(c.issued),
      dim(c.expires ? `  ·  expires ${c.expires}` : '  ·  no expiry'),
      dim(`  ·  ${c.scope.join(' ')}`),
    ])
  })
  return out
}

function contactCard() {
  return [
    BLANK,
    row('email', profile.email, 10),
    [dim('  '), key('github'.padEnd(10)), s(profile.links.github, 'link')],
    [dim('  '), key('linkedin'.padEnd(10)), s(profile.links.linkedin, 'link')],
    BLANK,
    [dim('  '), key('open mail'), dim('  ·  '), key('open github'), dim('  ·  '), key('open linkedin')],
  ]
}

function helpView() {
  const out = [BLANK]
  REGISTRY.forEach((c) => {
    out.push([
      dim('  '),
      key(c.name.padEnd(NAME_WIDTH)),
      s((c.args ?? '').padEnd(ARG_WIDTH), 'code-number'),
      dim(c.blurb),
    ])
  })
  out.push(
    BLANK,
    [dim('  aliases  '), val('resume · work · stack · certifications · man')],
    // The palette is the other way into this site and nothing here mentioned
    // it, so anyone who found the console never learned it existed.
    [dim('  also     '), key('⌘K'), dim(' / '), key('ctrl+K'), dim(' opens the command palette')],
  )
  return out
}

function lsView() {
  const files = [
    ['drwxr-xr-x', 'sections/', 'accent', 'the page you scrolled past'],
    ['-rw-r--r--', 'whoami.json', 'heading', 'rendered above section 01'],
    ['-rw-r--r--', resumeFile.filename, 'heading', formatBytes(resumeFile.bytes)],
    ['-r--r--r--', '.motd', 'muted', 'you have already read it'],
  ]
  const width = Math.max(...files.map(([, name]) => name.length)) + 2

  return [
    BLANK,
    ...files.map(([mode, name, colour, note]) => [
      dim(`  ${mode}  `),
      s(name.padEnd(width), colour),
      dim(note),
    ]),
  ]
}

// The routes this site actually serves — the build emits them and vercel.json
// routes them, so `curl` can answer for real and 404 honestly on anything
// else instead of inventing a response.
const ROUTES = [
  { path: endpoint.path, note: '?format=json|md|pdf' },
  { path: '/openapi.json', note: 'the spec for the route above' },
  { path: '/llms.txt', note: 'this site, for machines' },
  { path: resumeFile.path, note: `pdf · ${formatBytes(resumeFile.bytes)}` },
]

const BODY_PREVIEW = 14

function routeList() {
  const width = Math.max(...ROUTES.map((r) => r.path.length)) + 2
  return ROUTES.map((r) => [dim('  '), s(r.path.padEnd(width), 'link'), dim(r.note)])
}

function curlView(target) {
  if (!target) {
    return [
      BLANK,
      [dim('  usage: '), key('curl'), s(' <url>', 'code-number')],
      BLANK,
      ...routeList(),
    ]
  }

  const [rawPath, query] = target.replace(/^https?:\/\/[^/]+/, '').split('?')
  const path = rawPath.replace(/(.)\/$/, '$1') || '/'
  const params = new URLSearchParams(query ?? '')

  if (path !== endpoint.path) {
    const known = ROUTES.find((route) => route.path === path)
    if (known) {
      return [
        BLANK,
        [s('  HTTP/2 200', 'signal')],
        [dim('  static file — '), key('open'), dim(' it in a tab: '), s(path, 'link')],
      ]
    }
    return [
      BLANK,
      [s('  HTTP/2 404', 'accent'), dim('   no route matched '), s(path, 'heading')],
      BLANK,
      ...routeList(),
    ]
  }

  const format = findFormat(params.get('format') ?? 'json')
  const meter = { remaining: quota.limit - 1, resetSeconds: quota.windowMs / 1000 }
  const head = [
    BLANK,
    [s('  HTTP/2 200', 'signal')],
    ...responseHeaders(format, meter).map(([name, value]) => [
      dim('  '),
      key(`${name}: `),
      val(value),
    ]),
    BLANK,
  ]

  if (!format.body) {
    return [
      ...head,
      [dim('  ⟨binary body — '), val(formatBytes(format.bytes)), dim('⟩')],
      [dim('  run '), key('cv -d'), dim(' to save it')],
    ]
  }

  // Truncated on purpose and labelled as such: a hundred-line body would bury
  // the prompt, and printing part of it silently would be worse.
  const body = format.body.split('\n')
  const shown = body.slice(0, BODY_PREVIEW)
  const rest = body.length - shown.length

  return [
    ...head,
    ...shown.map((row_) => [dim('  '), s(row_, 'code-string')]),
    ...(rest > 0
      ? [[dim(`  … ${rest} more lines — full body at `), s(endpoint.url(format.id), 'link')]]
      : []),
  ]
}

// `open` resolves a word or a project index to a real destination, so the
// command can never send you somewhere that is not already on this page.
const TARGETS = {
  github: profile.links.github,
  linkedin: profile.links.linkedin,
  mail: `mailto:${profile.email}`,
  email: `mailto:${profile.email}`,
  cv: resumeFile.path,
  resume: resumeFile.path,
}

function openTarget(arg) {
  if (!arg) {
    return {
      type: 'output',
      lines: [
        [dim('  usage: '), key('open'), s(` github | linkedin | mail | cv | 1-${projects.length}`, 'code-number')],
      ],
    }
  }

  const index = Number(arg)
  const project = Number.isInteger(index) ? projects[index - 1] : null
  const href = project ? project.href : TARGETS[arg]

  if (!href) {
    return { type: 'output', lines: [[dim('  no such target: '), s(arg, 'heading')]] }
  }

  return {
    type: 'open',
    href,
    lines: [[dim('  → '), s(project ? project.title : arg, 'heading'), dim('   opening '), s(href, 'link')]],
  }
}

// ── Dispatch ───────────────────────────────────────────────────────────────

export function runCommand(raw) {
  const trimmed = raw.trim()
  const [head, ...rest] = trimmed.split(/\s+/)
  const flags = rest.map((r) => r.toLowerCase())
  const cmd = ALIASES[head.toLowerCase()] ?? head.toLowerCase()

  switch (cmd) {
    case 'help':
      return { type: 'output', lines: helpView() }

    case 'whoami':
      return { type: 'output', lines: [BLANK, ...whoamiCard()] }

    case 'about':
      return { type: 'output', lines: [BLANK, [dim('  '), val(profile.summary)]] }

    case 'experience':
      return { type: 'output', lines: timeline() }

    case 'skills':
      return { type: 'output', lines: skillTable() }

    case 'projects':
      return { type: 'output', lines: projectList() }

    case 'certs':
      return { type: 'output', lines: certList() }

    case 'contact':
      return { type: 'output', lines: contactCard() }

    case 'ls':
      return { type: 'output', lines: lsView() }

    case 'open':
      return openTarget(flags[0])

    case 'curl':
      return { type: 'output', lines: curlView(rest[0]) }

    // The transfer itself is the widget's job — this only says what to fetch.
    case 'cv':
      if (flags.includes('-d') || flags.includes('--download')) {
        return {
          type: 'download',
          lines: [
            BLANK,
            [dim('  fetching '), s(resumeFile.filename, 'heading'), dim(`   ${formatBytes(resumeFile.bytes)}`)],
          ],
        }
      }
      return {
        type: 'output',
        lines: [
          BLANK,
          [dim('  '), s(resumeFile.filename, 'heading')],
          row('type', `pdf · ${resumeFile.pages} pages · ${formatBytes(resumeFile.bytes)}`),
          row('modified', resumeFile.modified.slice(0, 10)),
          BLANK,
          [dim('  run '), key('cv -d'), dim(' to download, or hit the endpoint in section 06')],
        ],
      }

    case 'sudo':
      return {
        type: 'output',
        lines: [[s('  permission denied', 'accent'), dim(' — and this incident will not be reported.')]],
      }

    case 'clear':
      return { type: 'clear' }

    case 'exit':
      return { type: 'exit' }

    default: {
      const near = COMMAND_NAMES.filter((n) => n.startsWith(cmd.slice(0, 2)))
      const lines = [[dim('  command not found: '), s(trimmed, 'heading')]]
      if (near.length) lines.push([dim('  did you mean '), key(near.join(', ')), dim('?')])
      else lines.push([dim('  type '), key('help'), dim(' for the list')])
      return { type: 'output', lines }
    }
  }
}
