import { MotionConfig } from 'framer-motion'
import Nav from './components/Nav'
import ScrollProgress from './components/ScrollProgress'
import Atmosphere from './components/Atmosphere'
import TerminalWidget from './components/TerminalWidget'
import CommandPalette from './components/CommandPalette'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Resume from './components/Resume'
import Contact from './components/Contact'
import Footer from './components/Footer'
import NotFound from './components/NotFound'
import { duration, ease } from './lib/motion'

// Unmatched paths are served 404.html — a byte copy of index.html emitted by
// the portfolio-data plugin — so the response carries a real 404 status and
// this same bundle boots to render NotFound. Static files (the PDF,
// /llms.txt, /api/v1/resume.json) match on disk first and never reach here.
function isKnownPath(pathname) {
  return pathname === '/' || pathname === '/index.html'
}

function App() {
  const pathname = typeof window === 'undefined' ? '/' : window.location.pathname

  if (!isKnownPath(pathname)) {
    return (
      <MotionConfig reducedMotion="user" transition={{ duration: duration.base, ease }}>
        <div className="bg-bg text-text min-h-screen">
          <Atmosphere />
          <NotFound path={pathname} />
        </div>
      </MotionConfig>
    )
  }

  return (
    // `reducedMotion="user"` is the safety net: framer drops transform and
    // layout animations for anyone who asks, including in components that
    // don't check useReducedMotion themselves. The default transition means
    // any animation that omits one still lands on the house curve.
    <MotionConfig reducedMotion="user" transition={{ duration: duration.base, ease }}>
      <div className="bg-bg text-text min-h-screen">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Atmosphere />
        <ScrollProgress />
        <Nav />
        <main id="main">
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Resume />
          <Contact />
        </main>
        <Footer />
        <TerminalWidget />
        <CommandPalette />
      </div>
    </MotionConfig>
  )
}

export default App
