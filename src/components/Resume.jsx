import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Check, Copy, CornerDownLeft, Download } from 'lucide-react'
import Section from './Section'
import {
  endpoint,
  findFormat,
  formats,
  formatBytes,
  quota,
  quotaBody,
  quotaHeaders,
  resumeFile,
  responseHeaders,
  tokenizeJson,
} from '../data/resume'
import { duration, ease, orchestrate, slideIn, spring, stagger } from '../lib/motion'

const TOKEN_COLOR = {
  key: 'text-accent-soft',
  string: 'text-code-string',
  number: 'text-code-number',
  bool: 'text-accent',
  muted: 'text-text-muted',
}

/** Kick off a real download without navigating away from the page. */
function downloadResume() {
  const a = document.createElement('a')
  a.href = resumeFile.path
  a.download = resumeFile.downloadAs
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function JsonBody({ text }) {
  return tokenizeJson(text).map((parts, i) => (
    <div key={i}>
      {parts.length === 0
        ? ' '
        : parts.map((part, j) => (
            <span key={j} className={TOKEN_COLOR[part.c]}>
              {part.t}
            </span>
          ))}
    </div>
  ))
}

function MarkdownBody({ text }) {
  return text.split('\n').map((row, i) => (
    <div key={i} className={row.startsWith('#') ? 'text-text-heading' : 'text-text-muted'}>
      {row || ' '}
    </div>
  ))
}

export default function Resume() {
  const reduce = useReducedMotion()
  const [formatId, setFormatId] = useState('pdf')
  const [state, setState] = useState('idle') // idle · pending · done
  const [response, setResponse] = useState(null)
  const [copied, setCopied] = useState(false)
  const [retryAfter, setRetryAfter] = useState(0)
  const timers = useRef([])
  const hits = useRef([])

  const format = findFormat(formatId)
  const line = slideIn(reduce, { x: -6, d: duration.base })

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // While a 429 is on screen its Retry-After has to count down, or the header
  // is a number that lies a second after it was printed. Held in state rather
  // than read during render, so the value can't shift mid-paint.
  useEffect(() => {
    if (response?.status !== 429) return undefined

    const update = () =>
      setRetryAfter(Math.max(0, Math.ceil((response.resetAt - Date.now()) / 1000)))
    update()
    const id = setInterval(update, 500)
    return () => clearInterval(id)
  }, [response])

  const send = () => {
    timers.current.forEach(clearTimeout)
    const now = Date.now()
    hits.current = hits.current.filter((at) => now - at < quota.windowMs)

    // Spent quota is refused before any work happens, which is why the
    // rejection comes back an order of magnitude faster than a 200.
    if (hits.current.length >= quota.limit) {
      const resetAt = hits.current[0] + quota.windowMs
      const ms = 2 + Math.round(Math.random() * 4)
      setState('pending')
      timers.current = [
        setTimeout(
          () => {
            setState('done')
            setResponse({ id: now, format, ms, status: 429, resetAt })
          },
          reduce ? 0 : 90,
        ),
      ]
      return
    }

    hits.current.push(now)
    const remaining = quota.limit - hits.current.length
    const resetSeconds = Math.ceil(quota.windowMs / 1000)
    setState('pending')

    // A plausible edge latency, rolled per request. The number is theatre, but
    // the wait is what makes the response feel like it arrived rather than
    // like it had been sitting there all along.
    const ms = 18 + Math.round(Math.random() * 44)
    const wait = reduce ? 0 : 220 + ms

    timers.current = [
      setTimeout(() => {
        setState('done')
        setResponse({ id: now, format, ms, status: 200, meter: { remaining, resetSeconds } })
        if (format.id === 'pdf') downloadResume()
      }, wait),
    ]
  }

  const copyBody = async () => {
    if (!response?.format.body) return
    try {
      await navigator.clipboard.writeText(response.format.body)
      setCopied(true)
      timers.current.push(setTimeout(() => setCopied(false), 1600))
    } catch {
      setCopied(false)
    }
  }

  return (
    <Section
      id="resume"
      index="06"
      eyebrow="Résumé"
      title="The whole record, in two pages"
      lede="One résumé, three formats. PDF returns as a download; JSON and Markdown render inline — a CV that only exists as a page of paper is a CV nothing else can read."
    >
      <div className="card overflow-hidden">
        {/* ── Request ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="shrink-0 rounded-md border border-signal/30 bg-signal/10 px-2 py-1 font-mono text-[11px] font-medium tracking-wider text-signal">
              GET
            </span>
            <code className="min-w-0 truncate font-mono text-[13px] text-text-heading">
              <span className="text-text-muted">{'{{base_url}}'}</span>/api/v1/resume
              <span className="text-text-muted">?format=</span>
              <span className="text-accent">{format.id}</span>
            </code>
          </div>

          <motion.button
            type="button"
            onClick={send}
            disabled={state === 'pending'}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: duration.fast, ease }}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-[filter] hover:brightness-110 disabled:opacity-60"
          >
            {state === 'pending' ? 'Sending' : 'Send'}
            <CornerDownLeft size={14} />
          </motion.button>
        </div>

        {/* ── Params ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="meta">Accept</span>
            <div className="flex items-center gap-1 rounded-full border border-border p-1">
              {formats.map((f) => {
                const active = f.id === formatId
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFormatId(f.id)}
                    className={`relative rounded-full px-3 py-1 font-mono text-xs transition-colors ${
                      active ? 'text-bg' : 'text-text-muted hover:text-text-heading'
                    }`}
                  >
                    {/* One chip slides between formats — the same gesture the
                        nav pill makes, so the page keeps one vocabulary. */}
                    {active && (
                      <motion.span
                        layoutId="format-chip"
                        transition={spring.pill}
                        className="absolute inset-0 rounded-full bg-accent"
                      />
                    )}
                    <span className="relative">{f.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <p className="font-mono text-xs text-text-muted">{format.note}</p>
        </div>

        {/* ── Response ────────────────────────────────────────────────────── */}
        {/* No exit animations in here on purpose: a response panel should swap
            the moment the state changes, not wait for the previous line to
            finish leaving. */}
        <div
          aria-live="polite"
          className="border-t border-border bg-bg-soft/60 px-5 py-4 font-mono text-[13px]"
        >
          {state === 'idle' && (
            <p className="flex items-center gap-2 text-text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-border-hi" />
              awaiting request
            </p>
          )}

          {state === 'pending' && (
            <p className="flex items-center gap-2 text-text-muted">
              <span className="h-1.5 w-1.5 animate-drift rounded-full bg-accent" />
              waiting for {format.contentType.split(';')[0]}…
            </p>
          )}

          {state === 'done' && response && (
            // Keyed on the request, so a re-send replays the arrival rather
            // than silently swapping the body underneath you.
            <motion.div
              key={response.id}
              variants={orchestrate(reduce, { each: stagger.tight })}
              initial="hidden"
              animate="show"
            >
              <motion.p variants={line} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {response.status === 429 ? (
                  <span className="flex items-center gap-2 text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    429 Too Many Requests
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-signal">
                    <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                    200 OK
                  </span>
                )}
                <span className="text-text-muted">
                  {response.ms} ms ·{' '}
                  {response.status === 429 ? 'quota policy' : formatBytes(response.format.bytes)}
                </span>
              </motion.p>

              <div className="mt-3 space-y-0.5">
                {(response.status === 429
                  ? quotaHeaders(retryAfter)
                  : responseHeaders(response.format, response.meter)
                ).map(([name, value]) => (
                  <motion.p key={name} variants={line} className="truncate text-xs">
                    <span className="text-text-muted">{name}: </span>
                    <span className="text-text">{value}</span>
                  </motion.p>
                ))}
              </div>

              <motion.div variants={line} className="mt-4 border-t border-border pt-4">
                {response.status === 429 ? (
                  <div>
                    <pre className="max-h-80 overflow-auto text-xs leading-relaxed">
                      <JsonBody text={quotaBody(retryAfter)} />
                    </pre>
                    <p className="mt-3 text-xs text-text-muted">
                      {retryAfter > 0 ? (
                        <>
                          retry in <span className="text-accent">{retryAfter}s</span> — or take the
                          unmetered route:{' '}
                        </>
                      ) : (
                        <>quota reset, send again — or take the unmetered route: </>
                      )}
                      <a
                        href={endpoint.url(response.format.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-text underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                      >
                        {endpoint.url(response.format.id)}
                      </a>
                    </p>
                  </div>
                ) : response.format.id === 'pdf' ? (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="text-text-muted">
                      <p className="text-text-heading">%PDF-1.7 ⟨binary body⟩</p>
                      <p className="mt-1 text-xs">
                        {resumeFile.pages} pages · saved as {resumeFile.downloadAs}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={downloadResume}
                        className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-xs text-text-muted transition-colors hover:border-accent hover:text-accent"
                      >
                        <Download size={13} /> Save again
                      </button>
                      <a
                        href={resumeFile.path}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-xs text-text-muted transition-colors hover:border-accent hover:text-accent"
                      >
                        Open <ArrowUpRight size={13} />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute right-0 top-0 z-10 flex items-center gap-2">
                      <a
                        href={endpoint.url(response.format.id)}
                        target="_blank"
                        rel="noreferrer"
                        title="The same body at its real URL"
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-accent hover:text-accent"
                      >
                        Open <ArrowUpRight size={12} />
                      </a>
                      <button
                        type="button"
                        onClick={copyBody}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-accent hover:text-accent"
                      >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="max-h-80 overflow-auto pr-40 text-xs leading-relaxed">
                      {response.format.id === 'json' ? (
                        <JsonBody text={response.format.body} />
                      ) : (
                        <MarkdownBody text={response.format.body} />
                      )}
                    </pre>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

    </Section>
  )
}
