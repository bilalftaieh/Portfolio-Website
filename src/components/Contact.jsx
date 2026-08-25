import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './icons/Brands'
import FadeIn from './FadeIn'
import SectionSeam from './SectionSeam'
import { profile } from '../data/profile'
import { clipUp, duration, ease, inView, orchestrate, stagger } from '../lib/motion'

const socials = [
  { label: 'GitHub', href: profile.links.github, Icon: GithubIcon },
  { label: 'LinkedIn', href: profile.links.linkedin, Icon: LinkedinIcon },
]

export default function Contact() {
  const reduce = useReducedMotion()
  const word = clipUp(reduce, { d: 0.85 })

  return (
    <section id="contact" className="plate scroll-mt-24">
      <SectionSeam index="07" label="Get in touch" />

      <div className="mx-auto max-w-6xl px-6 pb-28 pt-16 sm:pb-36 sm:pt-20">
        <motion.div
          variants={orchestrate(reduce, { each: stagger.base })}
          initial="hidden"
          whileInView="show"
          viewport={inView}
        >

          {/* The closing line lands the same way the name opened the page —
              bookending the document with one gesture. */}
          <motion.h2
            variants={orchestrate(reduce, { each: stagger.tight })}
            className="display text-[clamp(2.5rem,8vw,6rem)] max-w-4xl"
          >
            <span className="block overflow-hidden py-[0.06em]">
              <motion.span variants={word} className="block">
                Let&rsquo;s build something
              </motion.span>
            </span>
            <span className="block overflow-hidden py-[0.06em]">
              <motion.span variants={word} className="block text-gradient">
                scalable.
              </motion.span>
            </span>
          </motion.h2>
        </motion.div>

        <FadeIn delay={0.12}>
          <div className="mt-12 grid gap-10 border-t border-border pt-10 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-md leading-relaxed text-text-muted">
              Open to conversations about cloud architecture, API platforms, or new
              opportunities. Reach out any time — I read everything.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {socials.map(({ label, href, Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ duration: duration.fast, ease }}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
              <motion.a
                href={`mailto:${profile.email}`}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: duration.fast, ease }}
                className="group inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-bg transition-[filter] hover:brightness-110"
              >
                <Mail size={16} />
                <span className="font-mono text-[13px]">{profile.email}</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </motion.a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
