// Extensions are explicit in this file (and only this file) because the build
// plugin imports it directly in Node to emit /api/v1/resume — bare specifiers
// resolve under Vite but not under plain ESM.
import { certifications, education, experience, profile, projects, skills } from './profile.js'
import { monthLabel } from '../lib/credentials.js'

// The PDF in /public is the artefact; every other representation on this page
// is derived from profile.js, so the console can never serve a résumé that has
// drifted from the site's own data.
export const resumeFile = {
  filename: 'Belal_Alfutayh_Resume_2026-08-16.pdf',
  path: '/Belal_Alfutayh_Resume_2026-08-16.pdf',
  // Downloaded copies get a stable, human name rather than the dated one.
  downloadAs: 'Belal-Alfutayh-Resume.pdf',
  bytes: 157565,
  pages: 2,
  modified: '2026-08-16T09:32:00Z',
}

export function formatBytes(bytes) {
  return bytes < 1024 ? `${bytes} B` : `${Math.round(bytes / 1024)} kB`
}

// ── Representations ────────────────────────────────────────────────────────

export const resumeJson = {
  name: profile.name,
  title: profile.title,
  location: profile.location,
  email: profile.email,
  links: profile.links,
  summary: profile.summary,
  experience: experience.map((job) => ({
    company: job.company,
    role: job.role,
    period: job.period,
    location: job.location,
    stack: job.stack,
    highlights: job.points,
  })),
  skills: Object.fromEntries(skills.map((group) => [group.group, group.items])),
  certifications: certifications.map((c) => ({
    name: c.name,
    issuer: c.issuer,
    issued: c.issued,
    expires: c.expires,
    credentialId: c.credentialId,
    verify: c.url,
  })),
  education: [`${education.degree}, ${education.school} (${education.period})`],
  projects: projects.map((p) => ({ title: p.title, tags: p.tags, url: p.href })),
}

export function resumeMarkdown() {
  const out = [
    `# ${profile.name}`,
    `${profile.title} · ${profile.location}`,
    `${profile.email} · ${profile.links.github} · ${profile.links.linkedin}`,
    '',
    profile.summary,
    '',
    '## Experience',
  ]

  experience.forEach((job) => {
    out.push('', `### ${job.role} — ${job.company}`, `_${job.period} · ${job.location}_`, '')
    job.points.forEach((p) => out.push(`- ${p}`))
    out.push(`\`${job.stack.join(' · ')}\``)
  })

  out.push('', '## Skills', '')
  skills.forEach((group) => out.push(`- **${group.group}:** ${group.items.join(', ')}`))

  out.push('', '## Certifications', '')
  certifications.forEach((c) =>
    out.push(`- ${c.name} — ${c.issuer}, ${monthLabel(c.issued)} · [verify](${c.url})`),
  )

  out.push('', '## Education', '', `- ${education.degree}, ${education.school} (${education.period})`)

  return out.join('\n')
}

// ── Response bodies ────────────────────────────────────────────────────────

const jsonBody = JSON.stringify(resumeJson, null, 2)

// Byte-accurate so `content-length` is a real number rather than set dressing.
const byteLength = (s) => new TextEncoder().encode(s).length

export const formats = [
  {
    id: 'pdf',
    label: 'pdf',
    accept: 'application/pdf',
    contentType: 'application/pdf',
    bytes: resumeFile.bytes,
    note: 'the document itself — downloads on send',
  },
  {
    id: 'json',
    label: 'json',
    accept: 'application/json',
    contentType: 'application/json; charset=utf-8',
    bytes: byteLength(jsonBody),
    body: jsonBody,
    note: 'the same résumé, machine-readable',
  },
  {
    id: 'md',
    label: 'md',
    accept: 'text/markdown',
    contentType: 'text/markdown; charset=utf-8',
    bytes: byteLength(resumeMarkdown()),
    body: resumeMarkdown(),
    note: 'plain text, paste-anywhere',
  },
]

export function findFormat(id) {
  return formats.find((f) => f.id === id) ?? formats[0]
}

// ── Endpoint ───────────────────────────────────────────────────────────────
// These routes exist: the build plugin emits them and vercel.json rewrites
// them, so the console describes something a visitor can actually curl.

export const endpoint = {
  path: '/api/v1/resume',
  url: (format) => (format === 'pdf' ? resumeFile.path : `/api/v1/resume?format=${format}`),
}

// ── Quota ──────────────────────────────────────────────────────────────────
// A Quota policy is the first thing you put in front of a public endpoint, so
// the console enforces one on itself. The static routes above are unmetered —
// this is the browser being honest about a policy, not a gateway pretending.

export const quota = { limit: 3, windowMs: 10000 }

/** The header block a real gateway would put on this response. */
export function responseHeaders(format, meter) {
  const headers = [
    ['content-type', format.contentType],
    ['content-length', String(format.bytes)],
  ]

  if (format.id === 'pdf') {
    headers.push(['content-disposition', `attachment; filename="${resumeFile.downloadAs}"`])
    headers.push(['x-page-count', String(resumeFile.pages)])
  }

  headers.push(['last-modified', new Date(resumeFile.modified).toUTCString()])
  headers.push(['x-ratelimit-limit', String(quota.limit)])
  headers.push(['x-ratelimit-remaining', String(meter.remaining)])
  headers.push(['x-ratelimit-reset', `${meter.resetSeconds}s`])
  headers.push(['x-served-by', 'portfolio-edge'])
  return headers
}

/** What the same gateway returns once the quota is spent. */
export function quotaHeaders(retryAfter) {
  return [
    ['content-type', 'application/json; charset=utf-8'],
    ['retry-after', String(retryAfter)],
    ['x-ratelimit-limit', String(quota.limit)],
    ['x-ratelimit-remaining', '0'],
    ['x-ratelimit-reset', `${retryAfter}s`],
    ['x-served-by', 'portfolio-edge'],
  ]
}

export function quotaBody(retryAfter) {
  return JSON.stringify(
    {
      error: {
        code: 429,
        status: 'RESOURCE_EXHAUSTED',
        message: `Quota exceeded for resume.fetch: ${quota.limit} requests per ${
          quota.windowMs / 1000
        }s.`,
        retry_after: retryAfter,
        hint: 'The static route is unmetered — curl it instead.',
      },
    },
    null,
    2,
  )
}

// ── JSON colouring ─────────────────────────────────────────────────────────
// One pass over the serialized body rather than a hand-maintained token array,
// so the highlighting can't fall out of sync with the data.

const TOKEN = /("(?:\\.|[^"\\])*"\s*:?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?)/g

export function tokenizeJson(text) {
  return text.split('\n').map((line) => {
    const parts = []
    let last = 0

    for (const match of line.matchAll(TOKEN)) {
      if (match.index > last) parts.push({ t: line.slice(last, match.index), c: 'muted' })
      const raw = match[0]
      if (raw.startsWith('"')) {
        parts.push(raw.trimEnd().endsWith(':') ? { t: raw, c: 'key' } : { t: raw, c: 'string' })
      } else if (/^-?\d/.test(raw)) {
        parts.push({ t: raw, c: 'number' })
      } else {
        parts.push({ t: raw, c: 'bool' })
      }
      last = match.index + raw.length
    }

    if (last < line.length) parts.push({ t: line.slice(last), c: 'muted' })
    return parts
  })
}
