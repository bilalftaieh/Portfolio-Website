import { experience } from '../data/profile'

// Derives the stack timeline from the same `experience` array the changelog
// renders. Nothing here is a second copy of the career — add a job to
// profile.js and it appears in the chart, with no dates to keep in sync.
//
// What the chart is allowed to claim matters. `experience[].stack` records the
// technologies a role's stack listed, over that role's period. It does not
// record when someone stopped using something, so the chart says the former and
// the caption says so plainly. A row is drawn as one segment per role, which is
// why a technology that came back after a gap shows two bars and not one long
// one — the gap is real and hiding it would be the lie.

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
const LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** 'Jul 2023' → 2023.5. Decimal years make the geometry one subtraction. */
function parseMonth(text) {
  const trimmed = text.trim()
  if (/^present$/i.test(trimmed)) {
    const now = new Date()
    return { t: now.getFullYear() + now.getMonth() / 12, open: true }
  }
  const [mon, year] = trimmed.split(/\s+/)
  const month = MONTHS.indexOf((mon ?? '').slice(0, 3).toLowerCase())
  if (month < 0 || !year) return null
  return { t: Number(year) + month / 12, open: false }
}

/** 2023.5 → 'Jul 2023', for the table view and the tooltips. */
export function formatMonth(t) {
  const year = Math.floor(t)
  const month = Math.round((t - year) * 12)
  return `${LABELS[Math.min(month, 11)]} ${year}`
}

function parsePeriod(period) {
  // The data uses an em dash; accept the other dashes so a hand edit can't
  // silently drop a job out of the chart.
  const [from, to] = period.split(/\s*[—–-]\s*/)
  const start = parseMonth(from ?? '')
  const end = parseMonth(to ?? '')
  return start && end ? { start: start.t, end: end.t, open: end.open } : null
}

/**
 * One row per technology, ordered by when it first appears, so the chart reads
 * top-left to bottom-right and the shape of the career is the shape of the
 * drawing.
 */
export function buildTimeline() {
  const roles = experience
    .map((job) => ({ job, span: parsePeriod(job.period) }))
    .filter((r) => r.span)

  if (roles.length === 0) return null

  const domain = {
    start: Math.min(...roles.map((r) => r.span.start)),
    end: Math.max(...roles.map((r) => r.span.end)),
  }

  // The role still running is what makes a technology "current" — an explicit
  // fact from the data rather than a guess from the most recent date.
  const currentStack = new Set(
    roles.filter((r) => r.span.open).flatMap((r) => r.job.stack),
  )

  const byTech = new Map()
  // Oldest first, so first appearance is genuinely first.
  for (const { job, span } of [...roles].reverse()) {
    for (const tech of job.stack) {
      if (!byTech.has(tech)) byTech.set(tech, { tech, segments: [] })
      byTech.get(tech).segments.push({
        start: span.start,
        end: span.end,
        open: span.open,
        company: job.short ?? job.company,
        role: job.role,
      })
    }
  }

  const rows = [...byTech.values()].map((row) => ({
    ...row,
    current: currentStack.has(row.tech),
    firstUsed: Math.min(...row.segments.map((s) => s.start)),
    lastUsed: Math.max(...row.segments.map((s) => s.end)),
    stillOpen: row.segments.some((s) => s.open),
  }))

  const companies = [...roles].reverse().map(({ job, span }) => ({
    label: job.short ?? job.company,
    ...span,
  }))

  // Integer year boundaries inside the domain — the only gridlines the chart
  // needs, and they land on numbers a reader already has in mind.
  const ticks = []
  for (let year = Math.ceil(domain.start); year <= Math.floor(domain.end); year += 1) {
    ticks.push(year)
  }

  return { rows, companies, domain, ticks }
}

/** Position within the domain, as a percentage, for CSS to place a bar. */
export function scale(domain, t) {
  return ((t - domain.start) / (domain.end - domain.start)) * 100
}
