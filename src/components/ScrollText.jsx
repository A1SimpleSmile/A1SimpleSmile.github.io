import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from '../useSectionFx.jsx'
import { useMotionPreference } from '../useMotionPreference.jsx'

gsap.registerPlugin(ScrollTrigger)

// Splits a block of text into tokens. Each token is wrapped in a <span> so it
// can be highlighted individually as the user scrolls (Apple-style reveal).
function splitText(text) {
  return text.split(/(\s+)/).map((part, i) => {
    if (/^\s+$/.test(part)) {
      // Keep whitespace as a non-breaking spacer to preserve line wrapping.
      return { key: `sp-${i}`, node: ` `, space: true }
    }
    return { key: `w-${i}`, node: part, space: false }
  })
}

// Text scroll-driven highlight.
//  - Default dimmed (opacity ~0.28); brightens to pure white top-to-bottom
//    as the section scrolls through the viewport (GSAP scrubbed timeline).
//  - Only GPU-friendly `opacity` is animated per token — no reflow.
export default function ScrollText({ text, className = '' }) {
  const { enabled } = useMotionPreference()
  const reduced = useReducedMotion()
  const sectionRef = useRef(null)
  const tokensRef = useRef([])
  const motionOn = enabled && !reduced

  const tokens = splitText(text)

  useEffect(() => {
    if (!motionOn) return undefined
    const section = sectionRef.current
    const tokensEls = tokensRef.current.filter(Boolean) // populated by this render
    if (!section || tokensEls.length === 0) return undefined

    const tween = gsap.fromTo(
      tokensEls,
      { opacity: 0.28 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.008,
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          end: 'bottom 30%',
          scrub: true,
        },
      },
    )

    return () => {
      tween.scrollTrigger?.kill()
      tokensRef.current = [] // reset so re-runs don't accumulate duplicates
    }
  }, [motionOn])

  return (
    <p ref={sectionRef} className={`scroll-text ${className}`} aria-label={text}>
      {tokens.map((tok) =>
        tok.space ? (
          <span key={tok.key}> </span>
        ) : (
          <span
            key={tok.key}
            ref={(el) => { tokensRef.current.push(el) }}
            className="scroll-text__token"
          >
            {tok.node}
          </span>
        ),
      )}
    </p>
  )
}
