import { clientOffset, clientRegion } from '../lib/client'

// Region and offset come from lib/client.js — the request-path figure puts the
// same two facts at the client end of its wire, and they should never be able
// to disagree about who is reading.
function Field({ label, title, children }) {
  return (
    <span className="flex items-baseline gap-1.5" title={title}>
      <span className="text-text-muted/60">{label}</span>
      <span className="text-text">{children}</span>
    </span>
  )
}

// There used to be a `session` field here counting how long you had been on the
// page, redrawn every second for the whole visit. It measured nothing about the
// work and read as a flex rather than as craft — and it was the one field a
// reader could tell was there to look impressive. The rest of the bar reports
// facts about the person reading it, so it stays; the stopwatch went.
export default function SystemStatus() {
  const client = clientRegion()
  const offset = clientOffset()

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-[11px] tracking-wide">
      <span className="flex items-center gap-2 text-signal">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-70" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
        </span>
        operational
      </span>
      {client && (
        <Field label="client" title="Your region, read from your browser's timezone">
          {client}
        </Field>
      )}
      <Field label="offset" title="Your UTC offset">
        {offset}
      </Field>
    </div>
  )
}
