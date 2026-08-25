import { motion, useReducedMotion } from 'framer-motion'
import Section from './Section'
import FadeIn from './FadeIn'
import StackTimeline from './StackTimeline'
import { experience } from '../data/profile'
import { duration, ease, easeOut, inView, orchestrate, slideIn, stagger } from '../lib/motion'

export default function Experience() {
  const total = experience.length
  const reduce = useReducedMotion()

  const bullet = slideIn(reduce, { x: -10, d: duration.slow })
  const bullets = orchestrate(reduce, { each: stagger.tight, delay: 0.2 })

  // The spine draws itself as each release scrolls in — the section is a
  // deployment history, so it should assemble top-down like one.
  const spine = {
    hidden: reduce ? {} : { scaleY: 0 },
    show: { scaleY: 1, transition: { duration: reduce ? 0 : 0.9, ease } },
  }
  const node = {
    hidden: reduce ? {} : { scale: 0 },
    show: { scale: 1, transition: { duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.18, ease: easeOut } },
  }

  return (
    <Section
      id="experience"
      index="03"
      eyebrow="Changelog"
      title="Deployment history"
      lede="Three releases, each one a layer further up the stack."
    >
      <div>
        {experience.map((job, i) => {
          const version = total - i
          const isLatest = i === 0
          const isLast = i === total - 1

          return (
            <FadeIn
              key={job.company}
              delay={i * stagger.base}
              className="grid sm:grid-cols-[9rem_1fr] gap-x-8"
            >
              <div className="mb-4 sm:mb-0 sm:pt-0.5 sm:text-right">
                <p className="font-mono text-sm text-accent">v{version}.0.0</p>
                <p className="meta mt-1.5 tracking-[0.12em]">{job.period}</p>
                <p className="meta mt-1 tracking-[0.12em] text-text-muted/60 normal-case">
                  {job.duration}
                </p>
                {isLatest && (
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-signal/35 px-2 py-0.5 text-[10px] uppercase tracking-wider text-signal">
                    <span className="h-1 w-1 rounded-full bg-signal" />
                    latest
                  </span>
                )}
              </div>

              <div className={`relative min-w-0 pl-8 ${isLast ? 'pb-0' : 'pb-16'}`}>
                <motion.span
                  variants={spine}
                  initial="hidden"
                  whileInView="show"
                  viewport={inView}
                  style={{ originY: 0 }}
                  className={`absolute left-0 top-2 w-px ${
                    isLast ? 'h-24 bg-gradient-to-b from-border to-transparent' : 'bottom-0 bg-border'
                  }`}
                />
                <motion.span
                  variants={node}
                  initial="hidden"
                  whileInView="show"
                  viewport={inView}
                  className="absolute -left-[3.5px] top-2 h-2 w-2 rounded-full bg-accent shadow-[0_0_0_4px_var(--color-bg),0_0_0_6px_color-mix(in_srgb,var(--color-accent)_22%,transparent)]"
                />

                <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-text-heading">
                  {job.role}
                </h3>
                <p className="mt-1 mb-5 text-sm text-text-muted">
                  <span className="text-accent-soft">{job.company}</span> · {job.location}
                </p>

                <motion.ul
                  variants={bullets}
                  initial="hidden"
                  whileInView="show"
                  viewport={inView}
                  className="space-y-2.5 mb-6"
                >
                  {job.points.map((point) => (
                    <motion.li
                      key={point}
                      variants={bullet}
                      className="flex gap-3 text-sm leading-relaxed text-text"
                    >
                      <span className="mt-px font-mono text-signal shrink-0">+</span>
                      {point}
                    </motion.li>
                  ))}
                </motion.ul>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="meta mr-1">deps</span>
                  {job.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-text-muted transition-colors hover:border-border-hi hover:text-text"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>
          )
        })}
      </div>

      {/* The changelog says what each release shipped. The chart says what the
          releases were made of — same data, one time axis. */}
      <div className="mt-24 flex items-center gap-4">
        <span className="meta text-accent">03.1</span>
        <span className="meta">Stack over time</span>
        <span className="rule-sub flex-1" />
      </div>

      <FadeIn delay={stagger.base} className="mt-10">
        <StackTimeline />
      </FadeIn>
    </Section>
  )
}
