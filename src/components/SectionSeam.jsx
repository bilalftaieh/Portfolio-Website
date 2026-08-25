import { motion, useReducedMotion } from 'framer-motion'
import { duration, ease, inView } from '../lib/motion'

// Sections used to be separated by whitespace alone, with a decorative rule
// floating inside each header. This turns the boundary itself into the
// element: a full-bleed hairline, registered to the content column with two
// crop ticks, carrying the section's number and name where a plate mark would
// sit on a printed sheet. One gesture per boundary, nothing duplicated inside.
export default function SectionSeam({ index, label }) {
  const reduce = useReducedMotion()

  const draw = {
    hidden: reduce ? { opacity: 0 } : { scaleX: 0, opacity: 1 },
    show: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: reduce ? duration.base : duration.draw, ease },
    },
  }
  const fade = {
    hidden: { opacity: 0, y: reduce ? 0 : 4 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: duration.base, ease, delay: reduce ? 0 : 0.22 },
    },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={inView}
      aria-hidden="true"
      className="relative"
    >
      {/* The line runs edge to edge and dies before either edge, so the page
          never looks cropped by the viewport. */}
      <motion.div
        variants={draw}
        style={{ transformOrigin: 'center' }}
        className="seam-line"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Crop ticks: the seam is registered to the text column, which is
            what makes the boundary feel measured rather than drawn. */}
        <span className="seam-tick left-6" />
        <span className="seam-tick right-6" />

        {(index || label) && (
          <motion.div variants={fade} className="seam-mark">
            {index && <span className="text-accent">{index}</span>}
            {index && label && <span className="text-border-hi">/</span>}
            {label && <span>{label}</span>}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
