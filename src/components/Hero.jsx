import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { GithubIcon } from './icons/Brands'
import SystemStatus from './SystemStatus'
import { profile } from '../data/profile'
import { clipUp, duration, ease, orchestrate, riseIn, stagger } from '../lib/motion'

export default function Hero() {
  const words = profile.name.split(' ')
  const reduce = useReducedMotion()
  const ref = useRef(null)

  // The fold doesn't just scroll away — it recedes. Content lifts slightly and
  // dims as it leaves, so the next section arrives on a clean plate.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, -70])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  // One cascade, ordered by DOM position, instead of six hand-tuned delays.
  const sequence = orchestrate(reduce, { each: stagger.loose, delay: 0.15 })
  const rise = riseIn(reduce, { y: 14, d: duration.slow })
  const word = clipUp(reduce)

  const drawRule = {
    hidden: reduce ? { opacity: 0 } : { scaleX: 0 },
    show: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: reduce ? duration.base : duration.draw, ease },
    },
  }

  return (
    <section
      id="top"
      ref={ref}
      className="relative min-h-screen flex flex-col justify-center px-6 pt-32 pb-28"
    >
      <motion.div
        variants={sequence}
        initial="hidden"
        animate="show"
        style={reduce ? undefined : { y, opacity }}
        className="w-full max-w-6xl mx-auto"
      >
        <motion.div variants={rise} className="flex items-center gap-4 mb-10">
          <span className="meta text-accent">01</span>
          <span className="h-px w-10 bg-border-hi" />
          <span className="meta">{profile.location}</span>
        </motion.div>

        {/* The h1 is itself a stagger container, so the words cascade after the
            kicker rather than racing it. */}
        <motion.h1
          variants={orchestrate(reduce, { each: stagger.base })}
          className="display text-[clamp(3.25rem,13vw,10rem)] text-text-heading"
        >
          {words.map((w) => (
            <span key={w} className="block overflow-hidden py-[0.06em]">
              <motion.span variants={word} className="block">
                {w}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.div
          variants={drawRule}
          style={{ transformOrigin: 'left' }}
          className="mt-8 h-px bg-gradient-to-r from-accent via-accent/40 to-transparent"
        />

        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <motion.div variants={rise} className="min-w-0">
            <p className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-gradient">
              {profile.title}
            </p>
            <p className="meta mt-3">{profile.tagline}</p>
          </motion.div>

          <motion.p variants={rise} className="max-w-sm text-text-muted leading-relaxed md:text-right">
            I design and run the API layer that lets large systems talk to each
            other — on Apigee, on Google Cloud, in production.
          </motion.p>
        </div>

        <motion.div variants={rise} className="mt-12 flex flex-wrap items-center gap-3">
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-bg font-medium text-sm transition hover:brightness-110"
          >
            Get in touch
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border text-text-heading text-sm transition-colors hover:border-accent hover:text-accent"
          >
            <GithubIcon size={16} /> GitHub
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        variants={rise}
        initial="hidden"
        animate="show"
        transition={{ ...rise.show.transition, delay: reduce ? 0 : 0.9 }}
        className="absolute inset-x-0 bottom-0 border-t border-border"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <SystemStatus />
          <a
            href="#about"
            className="hidden sm:flex items-center gap-2 meta transition-colors hover:text-accent"
            aria-label="Scroll to About"
          >
            Scroll
            <ArrowDown size={13} className="animate-drift" />
          </a>
        </div>
      </motion.div>
    </section>
  )
}
