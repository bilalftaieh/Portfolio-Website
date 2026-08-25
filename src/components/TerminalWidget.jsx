import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { TerminalSquare, X } from 'lucide-react'
import { complete, runCommand, WELCOME_LINES } from '../lib/terminal'
import { resumeFile } from '../data/resume'
import { duration, ease } from '../lib/motion'

const BAR_WIDTH = 22
const BAR_STEPS = 14
const BAR_INTERVAL = 70

// A 48px icon button with a `title` attribute is not an affordance — nobody
// hovers a FAB, so the best thing on the page went unfound. The hint shows
// once, ever, and says what to type rather than that a terminal exists.
// A shell prompt is the wrong input device for a thumb. On phones the same
// commands are offered as a tappable rail, so the best thing on the site stops
// being desktop-only — the chips run the identical code path as typing does.
const CHIPS = ['whoami', 'about', 'experience', 'skills', 'projects', 'certs', 'cv', 'contact', 'help', 'clear']

const HINT_KEY = 'terminal-hint-seen'
const HINT_DELAY = 5200
const HINT_LIFETIME = 13000

// Span colour → class. Kept here rather than in the command layer so the
// commands stay pure data and never import Tailwind vocabulary.
const SPAN_CLASS = {
  plain: 'text-text',
  muted: 'text-text-muted',
  value: 'text-text',
  heading: 'text-text-heading',
  accent: 'text-accent',
  'accent-deep': 'text-accent/45',
  signal: 'text-signal',
  frame: 'text-border-hi',
  link: 'text-accent-soft',
  'code-string': 'text-code-string',
  'code-number': 'text-code-number',
}

// Solid blocks rather than hashes — the bar should look like a transfer, not
// like a row of punctuation.
const progressLine = (pct) => {
  const filled = Math.round((pct / 100) * BAR_WIDTH)
  return [
    { t: '  ', c: 'muted' },
    { t: '█'.repeat(filled), c: 'accent' },
    { t: '░'.repeat(BAR_WIDTH - filled), c: 'frame' },
    { t: `  ${String(pct).padStart(3)}%`, c: pct === 100 ? 'signal' : 'muted' },
  ]
}

function saveResume() {
  const a = document.createElement('a')
  a.href = resumeFile.path
  a.download = resumeFile.downloadAs
  document.body.appendChild(a)
  a.click()
  a.remove()
}

/** History entries carry spans; strings are accepted and treated as plain. */
const toSpans = (line) =>
  typeof line === 'string' ? [{ t: line, c: 'muted' }] : line

export default function TerminalWidget() {
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState(() =>
    WELCOME_LINES.map((line) => ({ type: 'output', spans: toSpans(line) })),
  )
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [hint, setHint] = useState(false)
  const inputRef = useRef(null)
  const bottomRef = useRef(null)
  const transferRef = useRef(null)
  const reduce = useReducedMotion()

  const dismissHint = () => {
    setHint(false)
    try {
      localStorage.setItem(HINT_KEY, '1')
    } catch {
      // Private mode or storage disabled — the hint just shows again next visit.
    }
  }

  const openTerminal = () => {
    dismissHint()
    setOpen(true)
  }

  // Held back until the visitor has had time to start reading, then retired
  // for good whether or not they took it.
  useEffect(() => {
    let seen = true
    try {
      seen = localStorage.getItem(HINT_KEY) === '1'
    } catch {
      seen = false
    }
    if (seen) return undefined

    const show = setTimeout(() => setHint(true), HINT_DELAY)
    const hide = setTimeout(dismissHint, HINT_DELAY + HINT_LIFETIME)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [])

  // The completion the shell would accept on Tab, rendered as ghost text so
  // the next keystroke is discoverable without pressing anything.
  const ghost = useMemo(() => {
    const suggestion = complete(input)
    if (!suggestion) return ''
    const trimmed = input.trimStart()
    return suggestion.value.trimEnd().slice(trimmed.length)
  }, [input])

  const push = (entries) => setHistory((h) => [...h, ...entries])

  // The bar is drawn by rewriting the last history line in place, the way a
  // real transfer redraws over itself — appending 14 lines would just be a
  // wall of blocks.
  const runTransfer = () => {
    clearInterval(transferRef.current)

    const finish = () => {
      clearInterval(transferRef.current)
      transferRef.current = null
      setHistory((h) => [
        ...h.slice(0, -1),
        { type: 'output', spans: progressLine(100) },
        {
          type: 'output',
          spans: [
            { t: '  saved  ', c: 'signal' },
            { t: resumeFile.downloadAs, c: 'heading' },
          ],
        },
      ])
      saveResume()
    }

    if (reduce) {
      finish()
      return
    }

    let step = 0
    transferRef.current = setInterval(() => {
      step += 1
      if (step >= BAR_STEPS) {
        finish()
        return
      }
      const pct = Math.round((step / BAR_STEPS) * 100)
      setHistory((h) => [...h.slice(0, -1), { type: 'output', spans: progressLine(pct) }])
    }, BAR_INTERVAL)
  }

  useEffect(() => () => clearInterval(transferRef.current), [])

  useEffect(() => {
    function onKey(e) {
      const tag = document.activeElement?.tagName
      const typing = tag === 'INPUT' || tag === 'TEXTAREA'

      if (e.key === '`' && !open && !typing) {
        e.preventDefault()
        openTerminal()
      } else if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    window.addEventListener('open-terminal', openTerminal)
    return () => window.removeEventListener('open-terminal', openTerminal)
  }, [])

  // Autofocus is right on a keyboard and wrong on a phone: it throws up the
  // soft keyboard over the sheet before anything has been read. Phones get the
  // chip rail instead, and the field focuses only when they tap it.
  useEffect(() => {
    if (!open) return
    if (typeof window !== 'undefined' && !window.matchMedia('(min-width: 640px)').matches) return
    inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [history])

  /** The one place a command is executed, whether typed or tapped. */
  const runLine = (raw) => {
    const cmd = raw.trim()
    if (!cmd) return

    const result = runCommand(cmd)
    setCmdHistory((h) => [...h, cmd])
    setHistoryIndex(-1)
    setInput('')

    if (result.type === 'clear') {
      setHistory([])
      return
    }
    if (result.type === 'exit') {
      setOpen(false)
      return
    }

    const echo = { type: 'input', spans: [{ t: cmd, c: 'heading' }] }
    const output = result.lines.map((line) => ({ type: 'output', spans: toSpans(line) }))

    if (result.type === 'download') {
      push([echo, ...output, { type: 'output', spans: progressLine(0) }])
      runTransfer()
      return
    }

    if (result.type === 'open') {
      push([echo, ...output])
      window.open(result.href, '_blank', 'noopener,noreferrer')
      return
    }

    push([echo, ...output])
  }

  const submit = (e) => {
    e.preventDefault()
    runLine(input)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const suggestion = complete(input)
      if (!suggestion) return
      setInput(suggestion.value)
      // Two or more candidates: list them, exactly as a shell would.
      if (suggestion.hits.length > 1) {
        push([
          { type: 'input', spans: [{ t: input.trim(), c: 'heading' }] },
          { type: 'output', spans: [{ t: '  ' + suggestion.hits.join('   '), c: 'accent' }] },
        ])
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.length === 0) return
      const next = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(next)
      setInput(cmdHistory[next])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return
      const next = historyIndex + 1
      if (next >= cmdHistory.length) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        setHistoryIndex(next)
        setInput(cmdHistory[next])
      }
    }
  }

  return (
    <>
      {/* Reads as a line of the shell it opens, so the hint is a sample of the
          thing rather than a label describing it. Clicking it opens the
          terminal — the hint is the affordance, not a sign pointing at one. */}
      <AnimatePresence>
        {hint && !open && (
          <motion.button
            key="terminal-hint"
            type="button"
            onClick={openTerminal}
            aria-label="Open terminal and try whoami"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: duration.base, ease }}
            // The FAB occupies 24–72px from the right edge; 5.25rem leaves a
            // 12px gap so the two read as separate objects.
            className="fixed bottom-6 right-[5.25rem] z-40 flex h-12 items-center gap-2 rounded-full border border-border bg-bg-soft/90 px-4 font-mono text-[11px] whitespace-nowrap shadow-lg backdrop-blur transition-colors hover:border-accent"
          >
            <span className="text-accent">$</span>
            <span className="text-text-heading">whoami</span>
            <span className="inline-block h-3 w-1.5 bg-accent animate-blink" aria-hidden="true" />
            <span className="hidden text-text-muted sm:inline">— press `</span>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={openTerminal}
        aria-label="Open terminal"
        title="Open terminal (`)"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: duration.fast, ease }}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-accent transition-colors hover:border-accent shadow-lg"
      >
        <TerminalSquare size={20} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="terminal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast, ease }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
            onClick={() => setOpen(false)}
          >
            <motion.div
              // Rises from the bottom edge — on mobile it is a sheet, so the
              // entrance should come from where the sheet lives.
              initial={{ opacity: 0, y: 28, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.99 }}
              transition={{ duration: duration.base, ease }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-2xl h-[70vh] sm:h-[30rem] bg-bg-soft border border-border sm:rounded-xl overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                  <span className="ml-3 text-xs text-text-muted font-mono">belal@portfolio — zsh</span>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close terminal"
                  className="text-text-muted transition-colors hover:text-text-heading"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed">
                {history.map((line, i) => (
                  <motion.p
                    // Index-keyed on purpose: the transfer bar rewrites its own
                    // line, and a text-based key would remount (and re-animate)
                    // it on every tick.
                    key={i}
                    // New output lands rather than appearing — the same cue a
                    // real terminal gives you that something just happened.
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: duration.fast, ease }}
                    className="whitespace-pre-wrap min-h-[1.15em]"
                  >
                    {line.type === 'input' && <span className="text-accent">belal@portfolio:~$ </span>}
                    {line.spans.map((span, j) => (
                      <span key={j} className={SPAN_CLASS[span.c] ?? SPAN_CLASS.plain}>
                        {span.t}
                      </span>
                    ))}
                  </motion.p>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Scrolls horizontally rather than wrapping into three rows and
                  eating the output it exists to reveal. */}
              <div className="shrink-0 overflow-x-auto border-t border-border px-4 py-2.5 sm:hidden">
                <div className="flex w-max items-center gap-2">
                  {CHIPS.map((cmd) => (
                    <button
                      key={cmd}
                      type="button"
                      onClick={() => runLine(cmd)}
                      className="rounded-full border border-border bg-surface/60 px-3 py-1.5 font-mono text-[12px] whitespace-nowrap text-text-heading active:border-accent active:text-accent"
                    >
                      <span className="text-accent">$ </span>
                      {cmd}
                    </button>
                  ))}
                </div>
              </div>

              <form
                onSubmit={submit}
                className="flex items-center gap-2 px-4 py-3 border-t border-border shrink-0"
              >
                <span className="text-accent font-mono text-[13px] shrink-0">belal@portfolio:~$</span>
                {/* The ghost sits in the same grid cell as the field so the
                    suggested tail lines up with what has been typed. */}
                <span className="relative flex-1 font-mono text-[13px]">
                  <span aria-hidden className="pointer-events-none absolute inset-0 whitespace-pre text-text-muted/50">
                    <span className="invisible">{input}</span>
                    {ghost}
                  </span>
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="relative w-full bg-transparent outline-none text-text-heading caret-accent"
                    autoComplete="off"
                    spellCheck="false"
                    aria-label="Terminal input"
                  />
                </span>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
