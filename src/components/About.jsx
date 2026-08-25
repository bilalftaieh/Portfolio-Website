import { motion, useReducedMotion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import Section from './Section'
import FadeIn from './FadeIn'
import TechSnippet from './TechSnippet'
import Counter from './Counter'
import { aboutNarrative, stats, education } from '../data/profile'
import { duration, ease, inView, orchestrate, riseIn, stagger } from '../lib/motion'

export default function About() {
  const reduce = useReducedMotion()
  const rise = riseIn(reduce, { y: 18, d: duration.reveal })

  // The gutter rule grows down alongside the lead paragraph.
  const drawGutter = {
    hidden: reduce ? { opacity: 0 } : { scaleY: 0 },
    show: {
      scaleY: 1,
      opacity: 1,
      transition: { duration: reduce ? duration.base : duration.draw, ease },
    },
  }

  return (
    <Section
      id="about"
      index="02"
      eyebrow="About"
      title="From database internals to cloud-scale APIs"
    >
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-14 lg:gap-20 items-start">
        {/* One cascade for the whole column, instead of four hand-set delays
            that had to be re-tuned whenever the copy changed. */}
        <motion.div
          variants={orchestrate(reduce, { each: stagger.base })}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="min-w-0"
        >
          {aboutNarrative.map((paragraph, i) =>
            i === 0 ? (
              <motion.p
                key={paragraph.slice(0, 24)}
                variants={rise}
                className="relative pl-6 text-xl leading-relaxed text-text-heading mb-6"
              >
                <motion.span
                  variants={drawGutter}
                  style={{ transformOrigin: 'top' }}
                  className="absolute left-0 top-[0.6em] h-[calc(100%-1.2em)] w-px bg-gradient-to-b from-accent to-transparent"
                />
                {paragraph}
              </motion.p>
            ) : (
              <motion.p
                key={paragraph.slice(0, 24)}
                variants={rise}
                className="text-[1.0625rem] leading-relaxed text-text mb-5 last:mb-0"
              >
                {paragraph}
              </motion.p>
            ),
          )}

          <motion.div variants={rise} className="mt-12">
            <div className="cellgrid grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="cell px-5 py-6">
                  <Counter
                    value={stat.value}
                    className="display block text-4xl sm:text-5xl text-text-heading"
                  />
                  <p className="meta mt-3 leading-snug normal-case tracking-[0.12em]">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={rise} className="mt-6">
            <div className="flex items-center gap-3 font-mono text-xs text-text-muted">
              <GraduationCap size={15} className="text-accent shrink-0" />
              <span>
                {education.degree} · {education.school} · {education.period}
              </span>
            </div>
          </motion.div>
        </motion.div>

        <FadeIn delay={stagger.loose} y={16} className="min-w-0 lg:sticky lg:top-28">
          <TechSnippet />
        </FadeIn>
      </div>
    </Section>
  )
}
