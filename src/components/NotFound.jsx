import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { endpoint, resumeFile, formatBytes } from '../data/resume'
import { profile } from '../data/profile'

// Every path here is real: the build plugin emits them and vercel.json routes
// them. A 404 that lists routes it can't actually serve is just decoration.
const ROUTES = [
  { path: '/', note: 'the portfolio', internal: true },
  { path: `${endpoint.path}?format=json`, note: 'résumé · application/json' },
  { path: `${endpoint.path}?format=md`, note: 'résumé · text/markdown' },
  { path: resumeFile.path, note: `résumé · pdf · ${formatBytes(resumeFile.bytes)}` },
  { path: '/openapi.json', note: 'the spec for the route above' },
  { path: '/llms.txt', note: 'this site, for machines' },
]

export default function NotFound({ path }) {
  return (
    <main className="flex min-h-screen items-center px-6 py-24">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-center gap-4">
          <span className="meta text-accent">404</span>
          <span className="meta">No route matched</span>
          <span className="rule-sub flex-1" />
        </div>

        <h1 className="display mt-8 text-[clamp(2.5rem,9vw,4.5rem)]">
          Nothing is served
          <br />
          <span className="text-gradient">at that path.</span>
        </h1>

        <p className="mt-6 font-mono text-sm text-text-muted">
          <span className="text-text-muted/60">requested: </span>
          <span className="text-text-heading break-all">{path}</span>
        </p>

        <div className="card mt-10 overflow-hidden">
          <p className="meta border-b border-border px-5 py-3">Routes that do exist</p>
          <ul className="divide-y divide-border">
            {ROUTES.map((route) => (
              <li key={route.path}>
                <a
                  href={route.path}
                  className="group flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-surface/60"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-[13px] text-text-heading">
                      {route.path}
                    </span>
                    <span className="meta mt-1 block tracking-[0.12em]">{route.note}</span>
                  </span>
                  {route.internal ? (
                    <ArrowLeft
                      size={15}
                      className="shrink-0 text-text-muted/50 transition-all group-hover:-translate-x-0.5 group-hover:text-accent"
                    />
                  ) : (
                    <ArrowUpRight
                      size={15}
                      className="shrink-0 text-text-muted/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 font-mono text-xs text-text-muted">
          {profile.name} · <a href="/" className="text-text underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent">back to the portfolio</a>
        </p>
      </div>
    </main>
  )
}
