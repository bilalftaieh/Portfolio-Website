import { motion, useReducedMotion } from 'framer-motion'
import { inView, riseIn, slideIn } from '../lib/motion'

const variants = { rise: riseIn, slide: slideIn }

export default function FadeIn({
  children,
  delay = 0,
  y = 20,
  variant = 'rise',
  className = '',
}) {
  const reduce = useReducedMotion()
  const build = variants[variant] ?? riseIn
  const v = build(reduce, variant === 'slide' ? {} : { y })

  return (
    <motion.div
      className={className}
      variants={v}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      transition={{ ...v.show.transition, delay: reduce ? 0 : delay }}
    >
      {children}
    </motion.div>
  )
}
