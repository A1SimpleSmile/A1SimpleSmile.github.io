import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useReducedMotion } from '../useSectionFx.jsx'
import { useMotionPreference } from '../useMotionPreference.jsx'

// Production Liquid Glass card.
//  - Spotlight refraction: a bright radial highlight follows the cursor,
//    simulating light passing through translucent glass.
//  - Layered parallax tilt: the card tilts in 3D on hover while inner
//    content sits on higher translateZ layers (text floats above glass).
//  - Reduced-motion fallback: tilt/parallax disabled -> static high-contrast border.
export default function GlassCard({ children, className = '' }) {
  const { enabled } = useMotionPreference()
  const reduced = useReducedMotion()
  const motionOn = enabled && !reduced

  const cardRef = useRef(null)
  const spotRef = useRef(null)

  useEffect(() => {
    if (!motionOn) return undefined
    const card = cardRef.current
    const spot = spotRef.current
    if (!card || !spot) return undefined

    const onMove = (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      // Move spotlight with the cursor (refraction highlight)
      spot.style.setProperty('--sx', `${x}px`)
      spot.style.setProperty('--sy', `${y}px`)

      // 3D tilt with a fixed perspective
      const nx = (e.clientX - rect.left) / rect.width - 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5
      gsap.to(card, {
        rotateY: nx * 8,
        rotateX: -ny * 8,
        transformPerspective: 1000,
        duration: 0.4,
        ease: 'power2.out',
      })
    }
    const onLeave = () => {
      spot.style.setProperty('--sx', '50%')
      spot.style.setProperty('--sy', '0%')
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.9, ease: 'elastic.out(1,0.55)' })
    }

    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    return () => {
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [motionOn])

  return (
    <div
      ref={cardRef}
      className={`glass-bubble ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <span ref={spotRef} className="glass-bubble__spot" aria-hidden="true" />
      {children}
    </div>
  )
}
