import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, Menu, Search, X } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './icons/Brands'
import { profile } from '../data/profile'
import useActiveSection from '../hooks/useActiveSection'
import { duration, easeInOut, spring } from '../lib/motion'

const links = [
  { href: '#about', id: 'about', label: 'About', index: '02' },
  { href: '#experience', id: 'experience', label: 'Experience', index: '03' },
  { href: '#skills', id: 'skills', label: 'Skills', index: '04' },
  { href: '#projects', id: 'projects', label: 'Projects', index: '05' },
  { href: '#resume', id: 'resume', label: 'Résumé', index: '06' },
  { href: '#contact', id: 'contact', label: 'Contact', index: '07' },
]

const linkIds = links.map((l) => l.id)
const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform)

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(linkIds)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? 'border-b border-border bg-bg/70 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      {/* The bar tightens once you leave the fold — a small acknowledgement
          that reading has started, rather than a static frame. */}
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 transition-[padding] duration-300 ${
          scrolled ? 'py-2.5' : 'py-4'
        }`}
      >
        <a href="#top" className="group flex items-center gap-2.5" aria-label="Back to top">
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border-hi font-display text-[13px] font-bold text-text-heading transition-colors group-hover:border-accent group-hover:text-accent">
            B
          </span>
          <span className="font-display text-sm font-semibold tracking-tight text-text-heading">
            Alfutayh<span className="text-accent">.</span>
          </span>
        </a>

        {/* Seven links plus the logo and the icon cluster stop fitting well
            before 1024px, so the inline list waits for lg and the sheet menu
            covers everything below it — six links were already cramped at sm. */}
        <ul className="hidden items-center gap-0.5 text-sm lg:flex">
          {links.map((l) => {
            const isActive = active === l.id
            return (
              <li key={l.href} className="relative">
                <a
                  href={l.href}
                  className={`relative block rounded-full px-3 py-1.5 transition-colors ${
                    isActive ? 'text-text-heading' : 'text-text-muted hover:text-text-heading'
                  }`}
                >
                  {/* One pill slides between sections, rather than five
                      backgrounds independently fading in and out. */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={spring.pill}
                      className="absolute inset-0 rounded-full border border-border bg-surface"
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </a>
              </li>
            )
          })}
        </ul>

        <div className="hidden items-center gap-3 text-text-muted lg:flex">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
            className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs transition-colors hover:border-accent hover:text-text-heading"
          >
            <Search size={13} />
            <kbd className="font-mono text-[11px]">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
          </button>
          <span className="h-4 w-px bg-border" />
          <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="transition-colors hover:text-accent">
            <GithubIcon size={17} />
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-accent">
            <LinkedinIcon size={17} />
          </a>
          <a href={`mailto:${profile.email}`} aria-label="Email" className="transition-colors hover:text-accent">
            <Mail size={17} />
          </a>
        </div>

        {/* The palette is keyboard-summoned on desktop, which leaves phones
            with no way in at all — so it gets a real button here, next to the
            menu, rather than being desktop-only. */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              window.dispatchEvent(new CustomEvent('open-command-palette'))
            }}
            aria-label="Search"
            className="flex h-11 w-11 items-center justify-center text-text-heading"
          >
            <Search size={20} />
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center text-text-heading"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* AnimatePresence owns the exit, replacing a hand-rolled unmount timer
          that could strand the menu mid-collapse when toggled quickly. */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: duration.base, ease: easeInOut }}
            className="overflow-hidden border-t border-border lg:hidden"
          >
            <ul className="flex flex-col px-6 py-4">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-baseline gap-4 border-b border-border py-4 text-lg transition-colors last:border-0 ${
                      active === l.id ? 'text-accent' : 'text-text-heading'
                    }`}
                  >
                    <span className="meta">{l.index}</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-6 px-6 pb-6 text-text-muted">
              <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="transition-colors hover:text-accent">
                <GithubIcon size={20} />
              </a>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-accent">
                <LinkedinIcon size={20} />
              </a>
              <a href={`mailto:${profile.email}`} aria-label="Email" className="transition-colors hover:text-accent">
                <Mail size={20} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
