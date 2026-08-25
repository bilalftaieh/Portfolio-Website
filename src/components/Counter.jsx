import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import { ease } from '../lib/motion'

// Values in the data are display strings like "2+" — count the numeric part and
// leave any suffix pinned, so the data stays the source of truth.
function parse(value) {
  const match = String(value).match(/^(\d+)(.*)$/)
  return match ? { target: Number(match[1]), suffix: match[2] } : null
}

export default function Counter({ value, className = '' }) {
  const parsed = parse(value)
  const target = parsed?.target
  const rootRef = useRef(null)
  const numRef = useRef(null)
  const seen = useInView(rootRef, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()

  // Written straight to the DOM rather than through state: a count-up is ~60
  // updates a second, and none of them need to re-render React.
  useEffect(() => {
    const el = numRef.current
    if (target === undefined || !seen || !el || reduce) return undefined

    const controls = animate(0, target, {
      duration: 1.1,
      ease,
      onUpdate: (v) => {
        el.textContent = String(Math.round(v))
      },
    })
    return () => controls.stop()
  }, [seen, reduce, target])

  if (!parsed) return <span className={className}>{value}</span>

  return (
    // The final value is what's in the markup, so it reads correctly before the
    // animation runs, with reduced motion, and to a screen reader.
    <span ref={rootRef} className={className}>
      <span ref={numRef} className="tabular-nums">
        {parsed.target}
      </span>
      {parsed.suffix}
    </span>
  )
}
