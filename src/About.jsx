import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMotionPreference } from './useMotionPreference'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const { enabled } = useMotionPreference()
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const titleRef = useRef(null)
  const p1Ref = useRef(null)
  const p2Ref = useRef(null)
  const p3Ref = useRef(null)
  const dividerRef = useRef(null)

  useEffect(() => {
    if (!enabled) return undefined

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=250%',
      pin: pinRef.current,
      scrub: true,
    })

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 40%',
        end: '+=55%',
        scrub: true,
      },
    })

    tl.fromTo(titleRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1 }, 0)
      .fromTo(p1Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0 }, 0.25)
      .fromTo(p2Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0 }, 0.45)
      .fromTo(p3Ref.current, { opacity: 0, y: 50, color: '#8fd8ff' }, { opacity: 1, y: 0, color: '#9aa3b2' }, 0.65)
      .fromTo(dividerRef.current, { scaleX: 0 }, { scaleX: 1 }, 0.5)

    return () => { st.kill(); tl.kill() }
  }, [enabled])

  return (
    <section ref={sectionRef} id="about" className="about">
      <div ref={pinRef} className="about__pin">
        <div className="about__content">
          <h2 ref={titleRef}>About Me</h2>
          <p ref={p1Ref}>
            Hi, I'm <strong>Yi Xun</strong>.
          </p>
          <p ref={p2Ref}>
            我是一位擁抱 Vibe Coding 的開發者，擅長結合 AI 助手快速將想法轉化為實體作品。
          </p>
          <p ref={p3Ref} className="about__joke">
            （騙你的）
          </p>
          <div ref={dividerRef} className="about__divider" />
        </div>
      </div>
    </section>
  )
}