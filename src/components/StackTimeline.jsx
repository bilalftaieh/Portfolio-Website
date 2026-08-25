import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { buildTimeline, formatMonth, scale } from '../lib/stackTimeline'
import { duration, ease, inView, orchestrate, stagger } from '../lib/motion'

// The changelog above lists what shipped per role. This says what the roles
// were *made of*, on one time axis — the handoff from database work to cloud
// work as a shape rather than a claim in a paragraph.
//
// Form: a Gantt, coloured by emphasis rather than by category. The story is
// "these four are what I use now, those seven are where I came from", and that
// is one accent plus a de-emphasis gray — not eleven hues. Eleven categorical
// colours would bury the only point the chart has to make.
//
// Rows are ordered by first appearance, so the drawing steps down and to the
// right and the career's shape is the chart's shape.

const timeline = buildTimeline()

// Whether a role's name fits inside its block is a question in pixels, not in
// percent of the domain: 16% of a wide desktop track holds "iSolution"
// comfortably and 16% of a phone doesn't. So the lane measures itself and only
// draws a label that actually fits — a clipped name is worse than none, and the
// table view carries every label regardless.
const LABEL_CHAR_PX = 6.3 // JetBrains Mono advance at 10.5px
const LABEL_PAD_PX = 14

function fitsInside(label, blockPx) {
  return blockPx >= label.length * LABEL_CHAR_PX + LABEL_PAD_PX
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] text-text-muted">
      <span className="flex items-center gap-2">
        <span className="h-2.5 w-4 rounded-sm bg-accent" />
        in the current stack
      </span>
      <span className="flex items-center gap-2">
        <span className="h-2.5 w-4 rounded-sm bg-chart-mute" />
        earlier roles
      </span>
    </div>
  )
}

export default function StackTimeline() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(null)
  const [lanePx, setLanePx] = useState(0)
  const laneRef = useRef(null)

  // Measured in a layout effect as well as on resize, so the first paint
  // already knows the width rather than deciding with nothing to go on.
  useLayoutEffect(() => {
    const el = laneRef.current
    if (!el) return undefined
    const read = () => setLanePx(el.getBoundingClientRect().width)
    read()
    if (typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(read)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  if (!timeline) return null
  const { rows, companies, domain, ticks } = timeline

  // Bars grow from their own start edge, in row order, so the chart assembles
  // left to right the way the years run.
  const grow = {
    hidden: reduce ? { opacity: 0 } : { scaleX: 0, opacity: 1 },
    show: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: reduce ? duration.base : duration.reveal, ease },
    },
  }

  const readout = active ?? null

  return (
    <figure className="m-0">
      <Legend />

      <motion.div
        variants={orchestrate(reduce, { each: stagger.tight })}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        role="img"
        aria-label={`Timeline of the ${rows.length} technologies listed across ${companies.length} roles, from ${formatMonth(domain.start)} to now. The four in the current stack are ${rows.filter((r) => r.current).map((r) => r.tech).join(', ')}.`}
        className="mt-7 grid gap-y-0.5"
        style={{ gridTemplateColumns: 'minmax(6rem, 8.5rem) 1fr' }}
      >
        {/* Year gridlines: one layer spanning every row, so a line is one
            element rather than one per row with gaps punched through it.
            Percentages resolve against the track column because the layer is
            placed in it. */}
        <div
          aria-hidden="true"
          className="relative"
          style={{ gridColumn: 2, gridRow: '1 / -1' }}
        >
          {ticks.map((year) => (
            <span
              key={year}
              className="absolute inset-y-0 w-px bg-border"
              style={{ left: `${scale(domain, year)}%` }}
            />
          ))}
        </div>

        {/* Axis. Solid hairlines and plain numbers — the chrome stays quiet. */}
        <div className="meta pb-2 pr-3 text-right tracking-[0.12em] normal-case">
          stack
        </div>
        <div className="relative h-5" style={{ gridColumn: 2 }}>
          {ticks.map((year) => (
            <span
              key={year}
              className="absolute -translate-x-1/2 font-mono text-[11px] text-text-muted"
              style={{ left: `${scale(domain, year)}%` }}
            >
              {year}
            </span>
          ))}
        </div>

        {rows.map((row) => {
          const isActive = readout?.tech === row.tech
          return (
            <div key={row.tech} className="contents">
              <div
                className={`truncate py-1.5 pr-3 text-right font-mono text-[11.5px] transition-colors ${
                  row.current ? 'text-text-heading' : 'text-text-muted'
                } ${isActive ? 'text-accent' : ''}`}
                title={row.tech}
              >
                {row.tech}
              </div>

              <div
                className="relative z-10 h-7"
                style={{ gridColumn: 2 }}
                onMouseEnter={() => setActive(row)}
                onMouseLeave={() => setActive(null)}
              >
                {row.segments.map((seg) => {
                  const left = scale(domain, seg.start)
                  const width = scale(domain, seg.end) - left
                  return (
                    <motion.span
                      key={`${row.tech}-${seg.start}`}
                      variants={grow}
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        minWidth: 4,
                        transformOrigin: 'left',
                      }}
                      className={`absolute top-1/2 h-3 -translate-y-1/2 rounded-[3px] transition-[filter,opacity] ${
                        row.current ? 'bg-accent' : 'bg-chart-mute'
                      } ${isActive ? 'brightness-125' : ''} ${
                        readout && !isActive ? 'opacity-45' : 'opacity-100'
                      }`}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* The roles themselves, on the same axis — the bands above are
            segmented by these boundaries, so the reader can see why. */}
        <div className="meta pt-3 pr-3 text-right tracking-[0.12em] normal-case">
          role
        </div>
        <div ref={laneRef} className="relative mt-3 h-6" style={{ gridColumn: 2 }}>
          {companies.map((company) => {
            const left = scale(domain, company.start)
            const width = scale(domain, company.end) - left
            return (
              <span
                key={company.label}
                className="absolute inset-y-0 flex items-center justify-center rounded-[3px] border border-border bg-surface/70 px-2"
                style={{ left: `${left}%`, width: `${width}%` }}
              >
                {fitsInside(company.label, (width / 100) * lanePx) && (
                  <span className="truncate font-mono text-[10.5px] text-text-muted">
                    {company.label}
                  </span>
                )}
              </span>
            )
          })}
        </div>
      </motion.div>

      {/* One readout rather than a floating tooltip: it never covers the chart,
          and it holds still long enough to actually be read. */}
      <div className="mt-6 min-h-[2.75rem] border-t border-border pt-4 font-mono text-[11.5px]">
        {readout ? (
          <p className="text-text">
            <span className="text-text-heading">{readout.tech}</span>
            <span className="text-text-muted"> · listed by </span>
            {readout.segments.map((seg, i) => (
              <span key={seg.company}>
                {i > 0 && <span className="text-text-muted"> and </span>}
                <span className="text-accent-soft">{seg.company}</span>
                <span className="text-text-muted">
                  {' '}
                  ({formatMonth(seg.start)} — {seg.open ? 'present' : formatMonth(seg.end)})
                </span>
              </span>
            ))}
            {readout.segments.length > 1 && (
              <span className="text-text-muted"> · two spans, not one — the gap is real</span>
            )}
          </p>
        ) : (
          <p className="text-text-muted/80">
            Hover a row for the roles that listed it. Every date is parsed from the
            same career entries the changelog above renders.
          </p>
        )}
      </div>

      <details className="group mt-4">
        <summary className="cursor-pointer font-mono text-[11px] text-text-muted transition-colors hover:text-accent">
          the same data as a table
        </summary>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse font-mono text-[11.5px]">
            <caption className="sr-only">
              Every technology listed in a role&rsquo;s stack, with the months it was
              listed and whether it is in the current stack.
            </caption>
            <thead>
              <tr className="text-left text-text-muted">
                <th scope="col" className="border-b border-border py-2 pr-4 font-normal">technology</th>
                <th scope="col" className="border-b border-border py-2 pr-4 font-normal">first listed</th>
                <th scope="col" className="border-b border-border py-2 pr-4 font-normal">last listed</th>
                <th scope="col" className="border-b border-border py-2 pr-4 font-normal">roles</th>
                <th scope="col" className="border-b border-border py-2 font-normal">status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.tech}>
                  <th scope="row" className="border-b border-border py-2 pr-4 text-left font-normal text-text-heading">
                    {row.tech}
                  </th>
                  <td className="border-b border-border py-2 pr-4 text-text">{formatMonth(row.firstUsed)}</td>
                  <td className="border-b border-border py-2 pr-4 text-text">
                    {row.stillOpen ? 'present' : formatMonth(row.lastUsed)}
                  </td>
                  <td className="border-b border-border py-2 pr-4 text-text-muted">
                    {row.segments.map((s) => s.company).join(', ')}
                  </td>
                  <td className="border-b border-border py-2">
                    <span className={row.current ? 'text-accent' : 'text-text-muted'}>
                      {row.current ? 'current' : 'earlier'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

    </figure>
  )
}
