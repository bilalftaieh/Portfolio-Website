import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { codeSnippets } from '../data/profile'
import { duration, ease, orchestrate, slideIn, spring, stagger } from '../lib/motion'

const toneClass = {
  tag: 'text-accent-soft',
  plain: 'text-text',
  string: 'text-code-string',
  number: 'text-code-number',
  bool: 'text-accent',
  muted: 'text-text-muted',
}

export default function TechSnippet() {
  const [active, setActive] = useState(0)
  const snippet = codeSnippets[active]
  const reduce = useReducedMotion()
  const list = orchestrate(reduce, { each: stagger.tight, delay: 0.06 })
  const line = slideIn(reduce, { x: -6, d: duration.base })

  return (
    <div className="card min-w-0 overflow-hidden">
      {/* Tabs instead of the usual three traffic-light dots — this is a file
          switcher, so it should look like one. */}
      <div className="flex items-stretch border-b border-border bg-bg-soft/80">
        {codeSnippets.map((s, i) => (
          <button
            key={s.filename}
            type="button"
            onClick={() => setActive(i)}
            className={`relative border-r border-border px-4 py-3 font-mono text-[11px] transition-colors ${
              i === active
                ? 'bg-surface text-text-heading'
                : 'text-text-muted hover:text-text'
            }`}
          >
            {i === active && (
              <motion.span
                layoutId="snippet-tab"
                transition={spring.pill}
                className="absolute inset-x-0 top-0 h-px bg-accent"
              />
            )}
            {s.filename}
          </button>
        ))}
      </div>

      {/* The snippets differ in length, so the panel resizes as you switch
          files. Animating that height stops the tab bar from snapping. */}
      <motion.div layout transition={{ duration: duration.base, ease }}>
        <motion.div
          key={snippet.filename}
          variants={list}
          initial="hidden"
          animate="show"
          className="overflow-x-auto py-5 font-mono text-[13px] leading-[1.85]"
        >
          {snippet.lines.map((tokens, i) => (
            <motion.p key={i} variants={line} className="flex whitespace-pre px-5">
              <span className="mr-5 w-4 shrink-0 select-none text-right text-text-muted/35">
                {i + 1}
              </span>
              <span>
                {tokens.map((tok, j) => (
                  <span key={j} className={toneClass[tok.c]}>
                    {tok.t}
                  </span>
                ))}
              </span>
            </motion.p>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
