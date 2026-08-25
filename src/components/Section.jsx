import { motion, useReducedMotion } from 'framer-motion'
import SectionSeam from './SectionSeam'
import { duration, inView, orchestrate, riseIn, stagger } from '../lib/motion'

export default function Section({ id, index, eyebrow, title, lede, children, className = '' }) {
  const reduce = useReducedMotion()
  const rise = riseIn(reduce, { y: 16, d: duration.slow })

  // The section number and name live on the seam above, not in the header —
  // one rule per boundary instead of a rule inside every header competing
  // with the one before it.
  return (
    <section id={id} className="plate scroll-mt-24">
      <SectionSeam index={index} label={eyebrow} />

      <div className={`max-w-6xl mx-auto px-6 pb-28 pt-16 sm:pb-36 sm:pt-20 ${className}`}>
        {title && (
          <motion.header
            variants={orchestrate(reduce, { each: stagger.base })}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="mb-14"
          >
            <motion.h2 variants={rise} className="display text-[clamp(2rem,5.5vw,3.75rem)] max-w-3xl">
              {title}
            </motion.h2>
            {lede && (
              <motion.p variants={rise} className="mt-5 max-w-xl text-text-muted leading-relaxed">
                {lede}
              </motion.p>
            )}
          </motion.header>
        )}
        {children}
      </div>
    </section>
  )
}

