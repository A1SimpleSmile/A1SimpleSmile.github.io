import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMotionPreference } from './useMotionPreference'

gsap.registerPlugin(ScrollTrigger)

const works = [
  { id: 'w1', title: '荒島求生', body: '在荒島上用英語描述生存策略', file: '/work1.pptx' },
  { id: 'w2', title: '大學生活', body: '用英語分享大學生活的觀察與體驗', file: '/work2.pptx' },
  { id: 'w3', title: '澎湖獨立自治', body: '用英語探討澎湖獨立議題的模擬報告', file: '/work3.pptx' },
]

export default function Works() {
  const { enabled } = useMotionPreference()
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const headingRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    if (!enabled) return undefined

    const section = sectionRef.current
    const pin = pinRef.current
    if (!section || !pin) return undefined

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=300%',
      pin,
      scrub: true,
    })

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: section,
        start: 'top 40%',
        end: '+=65%',
        scrub: true,
      },
    })

    tl.fromTo(headingRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0 }, 0)
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      tl.fromTo(
        card,
        { opacity: 0, y: 80, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1 },
        0.2 + i * 0.2,
      )
    })

    const handlers = cardRefs.current.map((card) => {
      if (!card) return null
      const onEnter = () =>
        gsap.to(card, { scale: 1.04, duration: 0.4, ease: 'elastic.out(1, 0.5)' })
      const onLeave = () =>
        gsap.to(card, { scale: 1, duration: 0.5, ease: 'power2.out' })
      card.addEventListener('mouseenter', onEnter)
      card.addEventListener('mouseleave', onLeave)
      return { card, onEnter, onLeave }
    })

    return () => {
      st.kill()
      tl.kill()
      handlers.forEach((h) => {
        if (h) {
          h.card.removeEventListener('mouseenter', h.onEnter)
          h.card.removeEventListener('mouseleave', h.onLeave)
        }
      })
    }
  }, [enabled])

  return (
    <section ref={sectionRef} id="works" className="works">
      <div ref={pinRef} className="works__pin">
        <h2 ref={headingRef}>作品集</h2>
        <div className="works__grid">
          {works.map((w, i) => (
            <div
              key={w.id}
              ref={(el) => { cardRefs.current[i] = el }}
              className="works__card"
            >
              <h3>{w.title}</h3>
              <p>{w.body}</p>
              <a href={w.file} download className="works__btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="works__icon" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                下載簡報
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}