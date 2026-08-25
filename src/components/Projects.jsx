import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import Section from './Section'
import FadeIn from './FadeIn'
import { catalog, syncedAt } from '../lib/catalog'
import { duration, inView, orchestrate, slideIn, stagger } from '../lib/motion'

// A mono-hue ramp rather than a colour per language: the palette allows one
// accent, and a stacked bar only needs enough separation to read as segments.
const SLICE = ['bg-accent', 'bg-accent-soft', 'bg-accent-deep', 'bg-border-hi']

function LanguageBar({ languages }) {
  if (languages.length === 0) return null

  return (
    <div className="min-w-0">
      <div className="flex h-1 w-full overflow-hidden rounded-full bg-border">
        {languages.map((lang, i) => (
          <span
            key={lang.name}
            className={SLICE[i] ?? SLICE[SLICE.length - 1]}
            style={{ width: `${lang.percent}%` }}
            title={`${lang.name} ${lang.percent.toFixed(1)}%`}
          />
        ))}
      </div>
      <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
        {languages.map((lang, i) => (
          <span key={lang.name} className="flex items-center gap-1.5 font-mono text-[11px]">
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${SLICE[i] ?? SLICE[SLICE.length - 1]}`}
            />
            <span className="text-text">{lang.name}</span>
            <span className="text-text-muted">{Math.round(lang.percent)}%</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function Spec({ label, children }) {
  if (!children) return null
  return (
    <span className="flex items-baseline gap-1.5 font-mono text-[11px]">
      <span className="text-text-muted/55">{label}</span>
      <span className="text-text">{children}</span>
    </span>
  )
}

export default function Projects() {
  const reduce = useReducedMotion()
  const row = slideIn(reduce, { x: -14, d: duration.reveal })

  return (
    <Section
      id="projects"
      index="05"
      eyebrow="Service catalog"
      title="Projects"
      lede="Four repositories, described the way a catalog describes a service — language mix, size, and commit dates read from the GitHub API at build time rather than claimed here."
    >
      {/* Rows cascade off the shared spine instead of each fading in on its own
          timer — one list arriving, not four independent blocks. */}
      <motion.div
        variants={orchestrate(reduce, { each: stagger.base })}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="border-t border-border"
      >
        {catalog.map((service) => (
          <motion.a
            key={service.title}
            variants={row}
            href={service.href}
            target="_blank"
            rel="noreferrer"
            className="group relative grid items-start gap-x-8 gap-y-5 border-b border-border px-2 py-9 transition-colors hover:bg-surface/50 sm:grid-cols-[3.5rem_1fr_14rem]"
          >
            <span className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-accent transition-transform duration-500 group-hover:scale-y-100" />

            <span className="meta text-text-muted/50 transition-colors group-hover:text-accent">
              {service.index}
            </span>

            <div className="min-w-0 transition-transform group-hover:translate-x-1.5">
              <h3 className="font-display text-2xl font-semibold tracking-tight text-text-heading sm:text-[1.75rem]">
                {service.title}
              </h3>

              {/* The repo path is the identifier the rest of the row describes,
                  so it sits directly under the name like a service ID. */}
              <p className="mt-2 truncate font-mono text-[11px] text-text-muted">
                {service.owner}/<span className="text-text">{service.repo}</span>
              </p>

              <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-text-muted">
                {service.description}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                <Spec label="runtime">{service.runtime}</Spec>
                <Spec label="branch">{service.branch}</Spec>
                <Spec label="size">{service.size}</Spec>
                <Spec label="first commit">{service.firstCommit}</Spec>
                <Spec label="last commit">{service.lastCommit}</Spec>
              </div>
            </div>

            <div className="flex items-start justify-between gap-4 sm:flex-col sm:items-stretch">
              <LanguageBar languages={service.languages} />
              <ArrowUpRight
                size={22}
                className="shrink-0 self-start text-text-muted/50 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent sm:self-end"
              />
            </div>
          </motion.a>
        ))}
      </motion.div>

      <FadeIn delay={stagger.loose} className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <a
            href="https://github.com/bilalftaieh"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 font-mono text-xs text-text-muted transition-colors hover:text-accent"
          >
            More on GitHub
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>

          {/* Freshness belongs next to data that claims to be fresh. */}
          {syncedAt && (
            <p className="font-mono text-[11px] text-text-muted/70">
              {catalog.length} services · facts synced from GitHub {syncedAt}
            </p>
          )}
        </div>
      </FadeIn>
    </Section>
  )
}
