import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from './useSectionFx.jsx'
import { useMotionPreference } from './useMotionPreference.jsx'
import ProjectCard from './components/ProjectCard'
import ProjectModal from './components/ProjectModal'

gsap.registerPlugin(ScrollTrigger)

const works = [
  {
    id: 'w1',
    title: '荒島求生',
    body: '在荒島上用英語描述生存策略，練習以英文臨場表達與邏輯編排。',
    tags: ['英語口說', '生存策略', '簡報'],
    file: '/work1.pptx',
  },
  {
    id: 'w2',
    title: '大學生活',
    body: '用英語分享大學生活的觀察與體驗，聚焦生活方式與文化差異。',
    tags: ['英語口說', '校園生活', '簡報'],
    file: '/work2.pptx',
  },
  {
    id: 'w3',
    title: '澎湖獨立自治',
    body: '用英語探討澎湖獨立自治議題的模擬報告，練習觀點論述與答辯。',
    tags: ['英語口說', '議題探討', '簡報'],
    file: '/work3.pptx',
  },
]

export default function Works() {
  const { enabled } = useMotionPreference()
  const reduced = useReducedMotion()
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const headingRef = useRef(null)
  const cardRefs = useRef([])
  const [active, setActive] = useState(null)

  const motionOn = enabled && !reduced

  // Horizontal gallery: pin + scrub -> translateX with per-card parallax.
  // Performance: per-frame onUpdate does NOT read the DOM. Card positions are
  // derived arithmetically from geometry cached on mount + debounced resize,
  // eliminating layout thrashing entirely. All transforms run on the GPU.
  useEffect(() => {
    if (!motionOn) return undefined
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return undefined

    const cards = cardRefs.current.filter(Boolean)

    // --- Cached geometry (avoid per-frame reflow) ---
    let cardW = cards[0]?.getBoundingClientRect().width || 340
    const gap = 36
    let padX = 0
    let maxX = 0
    let centres = []

    const measure = () => {
      // Debounced: only runs on mount / window.onresize
      const trackRect = track.getBoundingClientRect()
      padX = trackRect.left - section.getBoundingClientRect().left
      if (cards[0]) cardW = cards[0].getBoundingClientRect().width
      // Total scrollable distance = viewport width - track width
      maxX = section.offsetWidth - track.scrollWidth - 90
      // Precompute each card's centre offset relative to the track's left edge.
      centres = cards.map((_, i) => padX + cardW * (i + 0.5) + gap * i)
    }

    let resizeTimer = 0
    let st = null // assigned below; referenced by onResize after debounce
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        measure()
        st?.update() // recompute current frame with new geometry
      }, 120)
    }
    window.addEventListener('resize', onResize)

    // Measure geometry up-front so onUpdate never reads the DOM.
    measure()

    // Horizontal gallery: pin + scrub -> translateX with per-card parallax.
    st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=280%',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress
        const dx = p * maxX
        // GPU-accelerated composite transform
        gsap.set(track, { x: dx, force3D: true })

        // Parallax focus computed purely from cached centres + progress.
        const cx = section.offsetWidth / 2
        centres.forEach((centre, i) => {
          const card = cards[i]
          if (!card) return
          const rel = centre + dx // card centre relative to section left
          const delta = Math.abs(rel - cx) / cx
          const focus = gsap.utils.clamp(0.82, 1, 1 - delta * 0.55)
          gsap.set(card, {
            scale: focus,
            opacity: 0.35 + (1 - delta) * 0.65,
            force3D: true,
          })
        })
      },
    })

    // Heading fade (runs on its own scrub trigger, not on update)
    const ht = gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 60%', end: '+=30%', scrub: true },
      },
    )

    return () => {
      window.removeEventListener('resize', onResize)
      window.clearTimeout(resizeTimer)
      st.kill()
      ht.kill?.()
    }
  }, [motionOn])

  return (
    <section ref={sectionRef} id="works" className="section works-gallery">
      <div className="works-gallery__viewport">
        <h2 ref={headingRef} className="works-gallery__title">作品集</h2>
        <div ref={trackRef} className="works-gallery__track">
          {works.map((w, i) => (
            <ProjectCard
              key={w.id}
              index={i}
              work={w}
              innerRef={(el) => { cardRefs.current[i] = el }}
              onOpen={() => setActive(w)}
              motionOn={motionOn}
            />
          ))}
          <div className="works-gallery__end" aria-hidden="true">
            <span>往下滾動</span>
          </div>
        </div>
      </div>

      {active && (
        <ProjectModal
          work={active}
          onClose={() => setActive(null)}
          motionOn={motionOn}
        />
      )}
    </section>
  )
}
