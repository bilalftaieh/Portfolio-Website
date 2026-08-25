import { profile } from '../data/profile'

const buildDate = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
  timeZoneName: 'short',
}).format(new Date(__BUILD_TIME__))

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col items-center gap-2 text-center text-xs text-text-muted font-mono">
        <p>
          © {new Date(__BUILD_TIME__).getFullYear()} {profile.name}. Built with React, Tailwind &amp; Framer Motion.
        </p>
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-text-muted/80">
          {__COMMIT_SHA__ && (
            <>
              <span>
                commit <span className="text-accent">{__COMMIT_SHA__}</span>
                {__COMMIT_DIRTY__ && '+dirty'}
              </span>
              <span aria-hidden="true">·</span>
            </>
          )}
          <span>built {buildDate}</span>
          {profile.sourceRepo && (
            <>
              <span aria-hidden="true">·</span>
              <a href={profile.sourceRepo} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
                View Source
              </a>
            </>
          )}
        </p>
      </div>
    </footer>
  )
}
