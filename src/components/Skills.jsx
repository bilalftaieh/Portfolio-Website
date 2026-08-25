import { motion, useReducedMotion } from 'framer-motion'
import Section from './Section'
import FadeIn from './FadeIn'
import Credentials from './Credentials'
import { skills } from '../data/profile'
import { duration, inView, orchestrate, slideIn, stagger } from '../lib/motion'

export default function Skills() {
  const reduce = useReducedMotion()
  const list = orchestrate(reduce, { each: stagger.tight })
  const item = slideIn(reduce, { x: -8, d: duration.base })

  return (
    <Section id="skills" index="04" eyebrow="Services" title="Skills & certifications">
      <FadeIn>
        <div className="cellgrid sm:grid-cols-3">
          {skills.map((group, i) => (
            <div key={group.group} className="cell group p-7">
              <div className="flex items-baseline justify-between gap-3 mb-6">
                <h3 className="font-display text-lg font-semibold text-text-heading">{group.group}</h3>
                <span className="meta text-text-muted/50">{String(i + 1).padStart(2, '0')}</span>
              </div>

              <motion.ul
                variants={list}
                initial="hidden"
                whileInView="show"
                viewport={inView}
                className="space-y-2.5"
              >
                {group.items.map((skill) => (
                  <motion.li
                    key={skill}
                    variants={item}
                    className="flex items-start gap-2.5 text-sm text-text-muted"
                  >
                    <span className="mt-[0.5em] h-px w-2.5 shrink-0 bg-border-hi transition-colors group-hover:bg-accent" />
                    {skill}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          ))}
        </div>
      </FadeIn>

      <div className="mt-20 flex items-center gap-4">
        <span className="meta text-accent">04.1</span>
        <span className="meta">Verified credentials</span>
        <span className="rule-sub flex-1" />
      </div>

      <FadeIn delay={stagger.base} className="mt-8">
        <Credentials />
      </FadeIn>
    </Section>
  )
}
