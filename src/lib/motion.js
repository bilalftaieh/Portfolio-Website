// Single source of truth for motion. Before this existed the codebase had five
// separate timing vocabularies (two copies of a bezier, `easeInOut`, two spring
// configs, and Tailwind's default 150ms) which is why nothing felt related.

/** Decelerate hard, settle soft. The house curve for anything entering. */
export const ease = [0.16, 1, 0.3, 1]

/** Symmetric — for things that both open and close (menus, panels). */
export const easeInOut = [0.65, 0, 0.35, 1]

/** Slight overshoot. Reserved for small elements that should feel springy. */
export const easeOut = [0.34, 1.24, 0.64, 1]

export const duration = {
  fast: 0.18,
  base: 0.32,
  slow: 0.6,
  reveal: 0.75,
  draw: 1.1,
}

export const spring = {
  /** Snappy, no wobble — the nav pill, layout shifts. */
  pill: { type: 'spring', stiffness: 380, damping: 32, mass: 0.6 },
  /** Loose and heavy — scroll-linked values, so they lag the scroll slightly. */
  scroll: { type: 'spring', stiffness: 160, damping: 28, restDelta: 0.001 },
}

/** Interval between siblings in a stagger. Keep groups under ~0.5s total. */
export const stagger = {
  tight: 0.04,
  base: 0.07,
  loose: 0.11,
}

// ── Variant factories ──────────────────────────────────────────────────────
// Each returns a {hidden, show} pair. `reduce` collapses the motion to a plain
// opacity fade rather than disabling it — the content still announces itself,
// it just stops moving.

/** Rise and fade. The default for blocks of content. */
export const riseIn = (reduce, { y = 20, d = duration.reveal } = {}) => ({
  hidden: reduce ? { opacity: 0 } : { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: reduce ? duration.base : d, ease } },
})

/** Slide in from the leading edge. For list items sharing a spine. */
export const slideIn = (reduce, { x = -8, d = duration.slow } = {}) => ({
  hidden: reduce ? { opacity: 0 } : { opacity: 0, x },
  show: { opacity: 1, x: 0, transition: { duration: reduce ? duration.base : d, ease } },
})

/** A word or line pushed up out of its own clip box. Needs an overflow-hidden parent. */
export const clipUp = (reduce, { d = 0.9 } = {}) => ({
  hidden: reduce ? { opacity: 0 } : { y: '110%' },
  show: {
    y: '0%',
    opacity: 1,
    transition: { duration: reduce ? duration.base : d, ease },
  },
})

/** Container that hands timing to its children. Pairs with any variant above. */
export const orchestrate = (reduce, { each = stagger.base, delay = 0 } = {}) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: reduce ? 0 : each,
      delayChildren: reduce ? 0 : delay,
    },
  },
})

/** Shared `whileInView` viewport config, so every reveal triggers at one line. */
export const inView = { once: true, margin: '-90px' }
