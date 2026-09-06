import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useReducedMotion } from '../useSectionFx.jsx'
import { useMotionPreference } from '../useMotionPreference.jsx'

// Apple-style magnetic pointer: a translucent glow ring follows the cursor
// with spring physics, and gently adheres (magnets) to interactive targets,
// tilting the element toward the pointer.
//
// Graceful downgrade: automatically disabled on touch-only / coarse-pointer
// devices and when the OS prefers-reduced-motion (or the manual toggle is off).
export default function MagneticCursor() {
  // Only mount on capable desktops
  const [canHover, setCanHover] = useState(
    () => typeof window !== 'undefined'
      && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const onChange = () => setCanHover(mq.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  const activeRef = useRef(null)
  const cursorRef = useRef(null)
  const ringRef = useRef(null)

  const { enabled } = useMotionPreference()
  const reduced = useReducedMotion()

  const motionOn = canHover && enabled && !reduced

  useEffect(() => {
    if (!motionOn) return undefined

    const cursor = cursorRef.current
    const ring = ringRef.current
    if (!cursor || !ring) return undefined
    cursor.classList.add('mcursor--on')

    // Burst-friendly followers (no per-frame layout reads)
    const moveTo = gsap.quickTo(ring, 'x', { duration: 0.4, ease: 'power3.out' })
    const moveY = gsap.quickTo(ring, 'y', { duration: 0.4, ease: 'power3.out' })

    const INTERACTIVE = 'a, button, .fx-card, [role="button"], .mcursor-magnet'

    const onMove = (e) => {
      const t = e.target
      const target = t.closest?.(INTERACTIVE)
      const el = target || t.closest?.('[data-magnetic]')
      activeRef.current = el || null

      if (el) {
        // Magnet: snap the ring to the element's centre + enlarge
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        moveTo(cx)
        moveY(cy)
        gsap.to(ring, { scale: 2.2, opacity: 0.9, duration: 0.3, ease: 'power2.out' })
        // Tilt the element gently toward the pointer
        const nx = (e.clientX - rect.left) / rect.width - 0.5
        const ny = (e.clientY - rect.top) / rect.height - 0.5
        gsap.to(el, {
          rotateX: -ny * 6,
          rotateY: nx * 6,
          transformPerspective: 600,
          duration: 0.3,
          ease: 'power2.out',
        })
        el.classList.add('is-magnetic')
      } else {
        moveTo(e.clientX)
        moveY(e.clientY)
        gsap.to(ring, { scale: 1, opacity: 0.55, duration: 0.3, ease: 'power2.out' })
      }
    }

    const onLeave = () => {
      activeRef.current = null
      gsap.to(ring, { scale: 1, opacity: 0, duration: 0.4, ease: 'power2.out' })
    }

    const onScrollReset = () => {
      const el = activeRef.current
      if (el) gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' })
      activeRef.current = null
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('scroll', onScrollReset, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      cursor.classList.remove('mcursor--on')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScrollReset)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [motionOn])

  if (!canHover) return null

  return (
    <div
      ref={cursorRef}
      className="mcursor"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <span ref={ringRef} className="mcursor__ring" />
    </div>
  )
}
