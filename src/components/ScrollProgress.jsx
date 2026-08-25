import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { spring } from '../lib/motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, spring.scroll)
  // Nothing to report at the very top — the bar fades in once you commit.
  const opacity = useTransform(scrollYProgress, [0, 0.015], [0, 1])

  return (
    <motion.div
      style={{ scaleX, opacity }}
      className="fixed top-0 left-0 right-0 h-px origin-left z-[60] bg-gradient-to-r from-accent-deep via-accent to-accent-soft"
    />
  )
}
