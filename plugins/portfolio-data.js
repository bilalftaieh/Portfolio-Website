import { readFile, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

// Everything this plugin emits is derived from src/data — nothing here is
// hand-authored. Two jobs:
//
//   1. Publish the résumé and the site's crawlable metadata at real URLs
//      (/api/v1/resume, /llms.txt, /openapi.json, /robots.txt, /sitemap.xml)
//      so section 06 describes an endpoint that exists rather than one it
//      mimes. Served by middleware in dev, emitted as static assets at build,
//      routed by vercel.json in production.
//   2. Refresh the GitHub facts behind the project catalog at build time,
//      falling back to the committed cache when the network or the rate limit
//      says no — a build must never fail because GitHub had a bad minute.

const REPO_CACHE = 'src/data/repos.json'
const GITHUB_OWNER = 'bilalftaieh'

async function loadResumeData(root) {
  // The browser modules are plain ESM with no Vite-specific syntax, so Node
  // can import them directly and there's only one definition of the résumé.
  const url = pathToFileURL(resolve(root, 'src/data/resume.js')).href
  const profileUrl = pathToFileURL(resolve(root, 'src/data/profile.js')).href
  const [resume, profileModule] = await Promise.all([import(url), import(profileUrl)])
  return { resume, ...profileModule }
}

function buildOpenApi({ profile, resumeFile }) {
  return {
    openapi: '3.1.0',
    info: {
      title: `${profile.name} — Résumé API`,
      version: '1.0.0',
      summary: 'The one endpoint this portfolio actually serves.',
      contact: { name: profile.name, email: profile.email, url: profile.links.github },
    },
    paths: {
      '/api/v1/resume': {
        get: {
          operationId: 'getResume',
          summary: 'Fetch the résumé in a given representation',
          parameters: [
            {
              name: 'format',
              in: 'query',
              required: false,
              description: 'Representation to return. Defaults to json.',
              schema: { type: 'string', enum: ['json', 'md', 'pdf'], default: 'json' },
            },
          ],
          responses: {
            200: {
              description: 'The résumé',
              content: {
                'application/json': { schema: { type: 'object' } },
                'text/markdown': { schema: { type: 'string' } },
                'application/pdf': {
                  schema: { type: 'string', format: 'binary' },
                  example: `${resumeFile.pages} pages, ${resumeFile.bytes} bytes`,
                },
              },
            },
            429: {
              description:
                'Quota exceeded. Enforced in the browser console on this site; the static routes are unmetered.',
              headers: {
                'Retry-After': { schema: { type: 'integer' }, description: 'Seconds until reset' },
              },
            },
          },
        },
      },
    },
  }
}

function buildLlmsTxt({ profile, resume, experience, skills, certifications, education }) {
  const lines = [
    `# ${profile.name}`,
    '',
    `> ${profile.title} — ${profile.tagline}. Based in ${profile.location}.`,
    '',
    profile.summary,
    '',
    '## Contact',
    '',
    `- Email: ${profile.email}`,
    `- GitHub: ${profile.links.github}`,
    `- LinkedIn: ${profile.links.linkedin}`,
    '',
    '## Experience',
    '',
  ]

  experience.forEach((job) => {
    lines.push(`### ${job.role} — ${job.company} (${job.period}, ${job.location})`)
    job.points.forEach((point) => lines.push(`- ${point}`))
    lines.push(`- Stack: ${job.stack.join(', ')}`)
    lines.push('')
  })

  lines.push('## Skills', '')
  skills.forEach((group) => lines.push(`- ${group.group}: ${group.items.join(', ')}`))

  lines.push('', '## Certifications', '')
  certifications.forEach((cert) =>
    lines.push(
      `- ${cert.name} — ${cert.issuer}, issued ${cert.issued}${
        cert.expires ? `, expires ${cert.expires}` : ' (no expiry)'
      }. Verify: ${cert.url}`,
    ),
  )

  lines.push(
    '',
    '## Education',
    '',
    `- ${education.degree}, ${education.school} (${education.period})`,
    '',
    '## Machine-readable',
    '',
    '- Résumé as JSON: /api/v1/resume?format=json',
    '- Résumé as Markdown: /api/v1/resume?format=md',
    `- Résumé as PDF: ${resume.resumeFile.path}`,
    '- API description: /openapi.json',
    '',
  )

  return lines.join('\n')
}

function buildRobotsTxt({ profile }) {
  // Everything here is public by design — the point is that crawlers and LLM
  // agents find the machine-readable routes, not that they are kept out.
  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${profile.siteUrl}/sitemap.xml`,
    '',
  ].join('\n')
}

function buildSitemap({ profile }) {
  // One HTML route: the app is a single page and App.jsx 404s everything else.
  // The résumé representations are listed as alternates rather than <url>
  // entries, since a sitemap describes pages, not content negotiation.
  const lastmod = new Date().toISOString().slice(0, 10)
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url>',
    `    <loc>${profile.siteUrl}/</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    '    <changefreq>monthly</changefreq>',
    '    <priority>1.0</priority>',
    '  </url>',
    '</urlset>',
    '',
  ].join('\n')
}

async function fetchRepo(name) {
  const headers = { accept: 'application/vnd.github+json', 'user-agent': 'portfolio-build' }
  const base = `https://api.github.com/repos/${GITHUB_OWNER}/${name}`

  const [repoRes, langRes] = await Promise.all([
    fetch(base, { headers }),
    fetch(`${base}/languages`, { headers }),
  ])
  if (!repoRes.ok) throw new Error(`${name}: ${repoRes.status}`)

  const repo = await repoRes.json()
  const languages = langRes.ok ? await langRes.json() : {}

  return {
    name: repo.name,
    pushedAt: repo.pushed_at,
    createdAt: repo.created_at,
    defaultBranch: repo.default_branch,
    sizeKb: repo.size,
    stars: repo.stargazers_count,
    openIssues: repo.open_issues_count,
    languages,
  }
}

export default function portfolioData() {
  let root = process.cwd()
  let outDir = 'dist'

  const artifacts = async () => {
    const data = await loadResumeData(root)
    const { resume } = data
    return [
      {
        fileName: 'api/v1/resume.json',
        source: JSON.stringify(resume.resumeJson, null, 2),
        type: 'application/json; charset=utf-8',
      },
      {
        fileName: 'api/v1/resume.md',
        source: resume.resumeMarkdown(),
        type: 'text/markdown; charset=utf-8',
      },
      {
        fileName: 'openapi.json',
        source: JSON.stringify(buildOpenApi({ ...data, resumeFile: resume.resumeFile }), null, 2),
        type: 'application/json; charset=utf-8',
      },
      {
        fileName: 'llms.txt',
        source: buildLlmsTxt(data),
        type: 'text/plain; charset=utf-8',
      },
      {
        fileName: 'robots.txt',
        source: buildRobotsTxt(data),
        type: 'text/plain; charset=utf-8',
      },
      {
        fileName: 'sitemap.xml',
        source: buildSitemap(data),
        type: 'application/xml; charset=utf-8',
      },
    ]
  }

  // Shared by the dev and preview servers.
  async function middleware(req, res, next) {
    const url = new URL(req.url, 'http://localhost')
    const files = await artifacts()

    const send = (asset) => {
      res.setHeader('content-type', asset.type)
      res.end(asset.source)
    }

    if (url.pathname === '/api/v1/resume') {
      const format = url.searchParams.get('format') ?? 'json'
      if (format === 'pdf') {
        const { resume } = await loadResumeData(root)
        res.statusCode = 302
        res.setHeader('location', resume.resumeFile.path)
        res.end()
        return
      }
      send(files.find((f) => f.fileName === `api/v1/resume.${format === 'md' ? 'md' : 'json'}`))
      return
    }

    if (['/llms.txt', '/openapi.json', '/robots.txt', '/sitemap.xml'].includes(url.pathname)) {
      send(files.find((f) => f.fileName === url.pathname.slice(1)))
      return
    }

    next()
  }

  return {
    name: 'portfolio-data',

    configResolved(config) {
      root = config.root
      outDir = config.build.outDir
    },

    // index.html is static, so it cannot import profile.js. Rather than let a
    // second copy of the origin drift out of sync with the first, the tags
    // carry a placeholder and the real value is substituted here — which runs
    // for the dev server and the production build alike.
    async transformIndexHtml(html) {
      const { profile } = await loadResumeData(root)
      return html.replaceAll('__SITE_URL__', profile.siteUrl)
    },

    // Build-time only: dev servers shouldn't spend a rate-limit budget on
    // every restart, and the committed cache is what dev reads anyway.
    async buildStart() {
      if (process.env.SKIP_GITHUB_SYNC) return

      const cachePath = resolve(root, REPO_CACHE)
      let cache
      try {
        cache = JSON.parse(await readFile(cachePath, 'utf8'))
      } catch {
        cache = { syncedAt: null, repos: {} }
      }

      const names = Object.keys(cache.repos)
      if (names.length === 0) return

      try {
        const fetched = await Promise.all(names.map(fetchRepo))
        const repos = {}
        fetched.forEach((repo) => {
          repos[repo.name] = repo
        })
        const next = { syncedAt: new Date().toISOString(), repos }
        await writeFile(cachePath, `${JSON.stringify(next, null, 2)}\n`)
        this.info(`refreshed GitHub facts for ${fetched.length} repos`)
      } catch (error) {
        this.warn(`GitHub sync skipped (${error.message}) — using committed cache`)
      }
    },

    async generateBundle() {
      for (const asset of await artifacts()) {
        this.emitFile({ type: 'asset', fileName: asset.fileName, source: asset.source })
      }
    },

    // Vercel serves 404.html from the output directory for any path that
    // matches no file and no rewrite, and — unlike a catch-all rewrite to
    // index.html — it does so with an actual 404 status. The file is a byte
    // copy of index.html, so the same bundle boots and App.jsx renders
    // NotFound for the path; only the status line differs.
    writeBundle(_options, bundle) {
      const html = bundle['index.html']
      if (!html) return
      return writeFile(resolve(root, outDir, '404.html'), html.source)
    },

    // Dev and preview both serve the routes vercel.json rewrites in production,
    // so the endpoint can be exercised locally either way.
    configureServer(server) {
      server.middlewares.use(middleware)
    },

    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}
