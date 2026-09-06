import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMotionPreference } from './useMotionPreference'

gsap.registerPlugin(ScrollTrigger)

// OS-level reduced-motion preference (independent of the manual toggle)
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  return reduced
}

// Ambient light that follows the mouse across an element.
// Returns { glowRef, glowEl } — put glowEl inside a relatively-positioned parent.
export function useMouseGlow(parentRef, { radius = 320, color = 'rgba(138,125,255,0.18)' } = {}) {
  const glowRef = useRef(null)

  useEffect(() => {
    const parent = parentRef?.current
    const glow = glowRef.current
    if (!parent || !glow) return undefined

    const onMove = (e) => {
      const rect = parent.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      glow.style.left = `${x}px`
      glow.style.top = `${y}px`
    }

    parent.addEventListener('mousemove', onMove)
    return () => parent.removeEventListener('mousemove', onMove)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentRef])

  const glowEl = (
    <span
      ref={glowRef}
      className="glow-orbe"
      style={{ '--glow-radius': `${radius}px`, '--glow-color': color }}
      aria-hidden="true"
    />
  )

  return { glowRef, glowEl }
}

// Shared staggered reveal used by all content sections.
// Returns refs for a heading + a bind() to attach items, plus a section ref.
export function useSectionReveal(itemCount = 3) {
  const { enabled } = useMotionPreference()
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const itemRefs = useRef([])

  // Returns a ref callback that registers the element at given index.
  const bind = (i) => (el) => {
    itemRefs.current[i] = el
  }

  useEffect(() => {
    if (!enabled) return undefined
    const section = sectionRef.current
    if (!section) return undefined

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        end: '+=55%',
        scrub: true,
      },
    })

    // Unified heading: clip-wipe + rise (same everywhere)
    tl.fromTo(
      headingRef.current,
      { opacity: 0, y: 60, clipPath: 'inset(0 100% 0 0)' },
      { opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0)', duration: 1 },
      0,
    )

    // Unified item stagger: fade + rise + slight scale
    itemRefs.current.forEach((el, i) => {
      if (!el) return
      tl.fromTo(
        el,
        { opacity: 0, y: 70, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1 },
        0.25 + i * 0.15,
      )
    })

    return () => tl.kill()
  }, [enabled, itemCount])

  return { enabled, sectionRef, headingRef, itemRefs, bind }
}

// Shared interactive hover: elastic scale + glow. Attach to interactive cards.
export function useCardInteractions(refs, glowClass = 'is-active') {
  const { enabled } = useMotionPreference()

  useEffect(() => {
    if (!enabled) return undefined
    const targets = (Array.isArray(refs) ? refs : [refs])
      .map((r) => r?.current)
      .filter(Boolean)

    const handlers = targets.map((el) => {
      const onEnter = () => {
        gsap.to(el, { scale: 1.03, duration: 0.45, ease: 'elastic.out(1, 0.5)' })
        el.classList.add(glowClass)
      }
      const onLeave = () => {
        gsap.to(el, { scale: 1, duration: 0.6, ease: 'power2.out' })
        el.classList.remove(glowClass)
      }
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
      return { el, onEnter, onLeave }
    })

    return () => {
      handlers.forEach(({ el, onEnter, onLeave }) => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [enabled, refs, glowClass])

  return null
}

// Optional 3D tilt interaction for richer interactivity (accepts ref or array of refs)
export function useTilt(refs) {
  const { enabled } = useMotionPreference()

  useEffect(() => {
    if (!enabled) return undefined
    const targets = (Array.isArray(refs) ? refs : [refs])
      .map((r) => (typeof r === 'function' ? r : r?.current))
      .filter(Boolean)

    const cleanups = targets.map((el) => {
      const onMove = (e) => {
        const rect = el.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        gsap.to(el, {
          rotateY: x * 10,
          rotateX: -y * 10,
          duration: 0.4,
          ease: 'power2.out',
        })
      }
      const onLeave = () => {
        gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' })
      }
      el.addEventListener('mousemove', onMove)
      el.addEventListener('mouseleave', onLeave)
      return () => {
        el.removeEventListener('mousemove', onMove)
        el.removeEventListener('mouseleave', onLeave)
      }
    })

    return () => cleanups.forEach((fn) => fn())
  }, [enabled, refs])

  return null
}
