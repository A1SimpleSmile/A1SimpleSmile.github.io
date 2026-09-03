import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMotionPreference } from './useMotionPreference'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const { enabled } = useMotionPreference()
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const headingRef = useRef(null)
  const textRef = useRef(null)
  const linkRef = useRef(null)

  useEffect(() => {
    if (!enabled) return undefined

    // Clip-path wipe entrance
    const wipeTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        end: 'top 30%',
        scrub: true,
      },
    })
    wipeTl.fromTo(
      contentRef.current,
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', ease: 'power2.inOut' },
    )

    // Text + CTA reveal
    const revealTl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 60%',
        end: '+=25%',
        scrub: true,
      },
    })
    revealTl
      .fromTo(headingRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0)
      .fromTo(textRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, 0.2)
      .fromTo(linkRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.4)

    return () => { wipeTl.kill(); revealTl.kill() }
  }, [enabled])

  return (
    <section ref={sectionRef} id="contact" className="contact">
      <div ref={contentRef} className="contact__content">
        <h2 ref={headingRef}>聯絡我</h2>
        <p ref={textRef}>有任何想法或合作機會，歡迎寫信給我。</p>
        <a ref={linkRef} href="mailto:spider960523@gmail.com" className="contact__cta">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="contact__icon" aria-hidden="true">
            <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 3 8 6 8-6" />
          </svg>
          spider960523@gmail.com
        </a>
      </div>
    </section>
  )
}