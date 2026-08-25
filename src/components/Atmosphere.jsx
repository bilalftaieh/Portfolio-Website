import { useEffect, useRef } from 'react'

// A 24px minor / 96px major engineering grid, drawn purely with gradients so
// there is no canvas loop running behind every scroll.
const GRID = `
  repeating-linear-gradient(to right, var(--g) 0 1px, transparent 1px 24px),
  repeating-linear-gradient(to bottom, var(--g) 0 1px, transparent 1px 24px),
  repeating-linear-gradient(to right, var(--G) 0 1px, transparent 1px 96px),
  repeating-linear-gradient(to bottom, var(--G) 0 1px, transparent 1px 96px)
`

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

export default function Atmosphere() {
  const spotRef = useRef(null)

  // The cursor lifts the grid out of the dark rather than spawning particles —
  // the page reacts, but the reaction is the material, not a widget on top.
  useEffect(() => {
    const el = spotRef.current
    if (!el) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let frame = 0
    let x = 0
    let y = 0

    const apply = () => {
      frame = 0
      el.style.setProperty('--mx', `${x}px`)
      el.style.setProperty('--my', `${y}px`)
    }

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      el.style.opacity = '1'
      if (!frame) frame = requestAnimationFrame(apply)
    }
    const onLeave = () => {
      el.style.opacity = '0'
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Resting grid — barely there, enough to give the page a substrate. */}
      <div
        className="absolute inset-0"
        style={{
          '--g': 'rgba(148, 170, 214, 0.028)',
          '--G': 'rgba(148, 170, 214, 0.05)',
          backgroundImage: GRID,
          maskImage: 'radial-gradient(120% 90% at 50% 0%, #000 25%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(120% 90% at 50% 0%, #000 25%, transparent 85%)',
        }}
      />

      {/* Same grid, warmed and revealed only under the cursor. */}
      <div
        ref={spotRef}
        className="absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          '--g': 'rgba(255, 157, 77, 0.16)',
          '--G': 'rgba(255, 157, 77, 0.3)',
          '--mx': '50vw',
          '--my': '40vh',
          backgroundImage: GRID,
          maskImage: 'radial-gradient(circle 240px at var(--mx) var(--my), #000, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(circle 240px at var(--mx) var(--my), #000, transparent 72%)',
        }}
      />

      {/* Two washes, warm high and cold low, so the page has a light direction. */}
      <div
        className="absolute -top-[22rem] -right-[14rem] h-[46rem] w-[46rem] rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(closest-side, rgba(255,157,77,0.16), transparent 70%)' }}
      />
      <div
        className="absolute top-[65%] -left-[18rem] h-[42rem] w-[42rem] rounded-full blur-[140px]"
        style={{ background: 'radial-gradient(closest-side, rgba(76,110,190,0.14), transparent 70%)' }}
      />

      {/* Grain. Kills the plastic flatness of large dark gradients. */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
    </div>
  )
}
