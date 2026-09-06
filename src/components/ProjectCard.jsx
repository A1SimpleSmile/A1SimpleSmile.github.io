import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// Apple-style project card: rounded, translucent border, 3D tilt,
// fluid glow that follows cursor, magnetic floating label.
export default function ProjectCard({ work, index, innerRef, onOpen, motionOn }) {
  const cardRef = useRef(null)
  const glowRef = useRef(null)
  const labelRef = useRef(null)

  // Merge external ref
  const setRef = (el) => {
    cardRef.current = el
    innerRef?.(el)
  }

  useEffect(() => {
    if (!motionOn) return
    const card = cardRef.current
    const glow = glowRef.current
    const label = labelRef.current
    if (!card || !glow || !label) return

    const onMove = (e) => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      const px = e.clientX - rect.left
      const py = e.clientY - rect.top

      glow.style.setProperty('--gx', `${px}px`)
      glow.style.setProperty('--gy', `${py}px`)

      gsap.to(card, {
        rotateY: (x - 0.5) * 14,
        rotateX: -(y - 0.5) * 14,
        duration: 0.35,
        ease: 'power2.out',
      })
      gsap.to(label, {
        x: (x - 0.5) * 16,
        y: (y - 0.5) * 10,
        transformPerspective: 600,
        rotateX: -(y - 0.5) * 8,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
    const onLeave = () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1,0.5)' })
      label.classList.add('is-hidden')
    }
    const onEnter = () => {
      label.classList.remove('is-hidden')
      gsap.to(label, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' })
    }

    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseenter', onEnter)
    card.addEventListener('mouseleave', onLeave)
    return () => {
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseenter', onEnter)
      card.removeEventListener('mouseleave', onLeave)
    }
  }, [motionOn])

  return (
    <article
      ref={setRef}
      className="pcard fx-card"
      style={{ transformStyle: 'preserve-3d' }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onOpen() }}
    >
      <span ref={glowRef} className="pcard__glow" aria-hidden="true" />
      <span className="pcard__num" aria-hidden="true">0{index + 1}</span>
      <div className="pcard__top">
        <h3>{work.title}</h3>
        <p>{work.body}</p>
      </div>
      <div className="pcard__tags">
        {work.tags.map((t) => (
          <span key={t} className="pcard__tag">{t}</span>
        ))}
      </div>
      <div className="pcard__actions">
        <a
          href={work.file}
          download
          onClick={(e) => e.stopPropagation()}
          className="pcard__download"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          下載簡報
        </a>
      </div>
      <span ref={labelRef} className="pcard__label" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        檢視專案
      </span>
    </article>
  )
}