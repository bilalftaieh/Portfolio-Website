import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Download, Mail, Search, TerminalSquare } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './icons/Brands'
import { profile } from '../data/profile'
import { resumeFile } from '../data/resume'
import { duration, ease, spring } from '../lib/motion'

const commands = [
  { id: 'about', label: 'Go to About', group: 'Navigate', action: () => scrollTo('about') },
  { id: 'experience', label: 'Go to Experience', group: 'Navigate', action: () => scrollTo('experience') },
  { id: 'skills', label: 'Go to Skills', group: 'Navigate', action: () => scrollTo('skills') },
  { id: 'projects', label: 'Go to Projects', group: 'Navigate', action: () => scrollTo('projects') },
  { id: 'resume', label: 'Go to Résumé', group: 'Navigate', action: () => scrollTo('resume') },
  { id: 'contact', label: 'Go to Contact', group: 'Navigate', action: () => scrollTo('contact') },
  {
    id: 'github',
    label: 'Open GitHub profile',
    group: 'External',
    icon: GithubIcon,
    action: () => window.open(profile.links.github, '_blank', 'noreferrer'),
  },
  {
    id: 'linkedin',
    label: 'Open LinkedIn profile',
    group: 'External',
    icon: LinkedinIcon,
    action: () => window.open(profile.links.linkedin, '_blank', 'noreferrer'),
  },
  {
    id: 'email',
    label: `Email ${profile.email}`,
    group: 'External',
    icon: Mail,
    action: () => {
      window.location.href = `mailto:${profile.email}`
    },
  },
  {
    id: 'download-cv',
    label: 'Download résumé (PDF)',
    group: 'Utility',
    icon: Download,
    action: () => {
      const a = document.createElement('a')
      a.href = resumeFile.path
      a.download = resumeFile.downloadAs
      document.body.appendChild(a)
      a.click()
      a.remove()
    },
  },
  {
    id: 'terminal',
    label: 'Open terminal',
    group: 'Utility',
    icon: TerminalSquare,
    // The two command surfaces used to be mutually invisible: the nav
    // advertised only ⌘K, the dock button only the console. Whoever finds one
    // should be told the other is there, and which key opens it.
    hint: '`',
    action: () => window.dispatchEvent(new CustomEvent('open-terminal')),
  },
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)

  const openPalette = () => {
    setOpen(true)
    setQuery('')
    setActiveIndex(0)
  }

  const closePalette = () => setOpen(false)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    function onKey(e) {
      const isK = e.key.toLowerCase() === 'k'
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault()
        if (open) {
          closePalette()
        } else {
          openPalette()
        }
      } else if (e.key === 'Escape' && open) {
        closePalette()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    window.addEventListener('open-command-palette', openPalette)
    return () => window.removeEventListener('open-command-palette', openPalette)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q))
  }, [query])

  const onQueryChange = (e) => {
    setQuery(e.target.value)
    setActiveIndex(0)
  }

  const run = (cmd) => {
    cmd.action()
    closePalette()
  }

  const onInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[activeIndex]) run(filtered[activeIndex])
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="palette"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.fast, ease }}
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 sm:pt-32 px-4"
          onClick={closePalette}
        >
          <motion.div
            // Drops in from just above and settles — a palette summoned to the
            // top of the screen, not a box that materialises in place.
            initial={{ opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: duration.base, ease }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg card overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search size={16} className="text-text-muted shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={onQueryChange}
                onKeyDown={onInputKeyDown}
                placeholder="Jump to a section, link, or command…"
                className="flex-1 bg-transparent outline-none text-sm text-text-heading placeholder:text-text-muted"
                autoComplete="off"
                spellCheck="false"
                aria-label="Command palette input"
              />
              <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded border border-border text-text-muted">
                esc
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto py-2">
              {filtered.length === 0 && (
                <p className="px-4 py-6 text-sm text-text-muted text-center">No matching commands.</p>
              )}
              {filtered.map((cmd, i) => {
                const Icon = cmd.icon || ArrowRight
                const active = i === activeIndex
                return (
                  <button
                    key={cmd.id}
                    type="button"
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => run(cmd)}
                    className={`relative w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                      active ? 'text-text-heading' : 'text-text-muted'
                    }`}
                  >
                    {/* The highlight travels between rows as you arrow down,
                        so the selection reads as one moving cursor. */}
                    {active && (
                      <motion.span
                        layoutId="palette-cursor"
                        transition={spring.pill}
                        className="absolute inset-x-1 inset-y-0 rounded-lg bg-accent/10"
                      />
                    )}
                    <Icon size={15} className={`relative ${active ? 'text-accent' : 'text-text-muted'}`} />
                    <span className="relative flex-1">{cmd.label}</span>
                    {cmd.hint && (
                      <kbd className="relative rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
                        {cmd.hint}
                      </kbd>
                    )}
                    <span className="relative text-[10px] uppercase tracking-wider text-text-muted/70">
                      {cmd.group}
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
