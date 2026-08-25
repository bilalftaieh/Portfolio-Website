import { projects } from '../data/profile'
import repoData from '../data/repos.json'

// The catalog joins what I wrote about each project to what GitHub says about
// it. Nothing here is asserted by hand: language mixes, sizes, and commit
// dates all come from src/data/repos.json, which the build plugin refreshes
// from the GitHub API. A repo with no cached facts renders without them rather
// than with invented ones.

const MAX_LANGUAGES = 3

const fmtDate = new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatMonth(iso) {
  return iso ? fmtDate.format(new Date(iso)) : null
}

export function formatSize(kb) {
  if (kb === null || kb === undefined) return null
  return kb < 1024 ? `${kb} kB` : `${(kb / 1024).toFixed(1)} MB`
}

/**
 * Language bytes → the top few as percentages, with everything else folded
 * into one "other" slice so the bar always totals 100.
 */
export function languageMix(languages) {
  const entries = Object.entries(languages ?? {})
  if (entries.length === 0) return []

  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0)
  if (total === 0) return []

  const sorted = entries.sort((a, b) => b[1] - a[1])
  const top = sorted.slice(0, MAX_LANGUAGES)
  const restBytes = sorted.slice(MAX_LANGUAGES).reduce((sum, [, bytes]) => sum + bytes, 0)

  const mix = top.map(([name, bytes]) => ({
    name,
    percent: (bytes / total) * 100,
  }))

  if (restBytes > 0) mix.push({ name: 'other', percent: (restBytes / total) * 100 })
  return mix
}

export const catalog = projects.map((project, index) => {
  const repo = repoData.repos[project.repo] ?? null

  return {
    ...project,
    index: String(index + 1).padStart(2, '0'),
    repo: project.repo,
    owner: 'bilalftaieh',
    runtime: repo ? (Object.keys(repo.languages ?? {})[0] ?? null) : null,
    languages: languageMix(repo?.languages),
    firstCommit: formatMonth(repo?.createdAt),
    lastCommit: formatMonth(repo?.pushedAt),
    branch: repo?.defaultBranch ?? null,
    size: formatSize(repo?.sizeKb),
  }
})

export const syncedAt = repoData.syncedAt ? formatMonth(repoData.syncedAt) : null
export const syncedAtExact = repoData.syncedAt
