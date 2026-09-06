import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMotionPreference } from './useMotionPreference'

gsap.registerPlugin(ScrollTrigger)

export default function Hero({ degraded = false }) {
  const { enabled } = useMotionPreference()
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const canvasRef = useRef(null)
  const nameRef = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    if (!enabled) return undefined

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return undefined

    let raf = 0
    let progress = 0
    let lastTime = 0
    const RINGS = 26
    const SIZE = 480
    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      canvas.width = SIZE * DPR
      canvas.height = SIZE * DPR
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      drawFrame(progress)
    }

    const drawFrame = (t) => {
      ctx.clearRect(0, 0, SIZE, SIZE)
      const cx = SIZE / 2
      const cy = SIZE / 2
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.strokeStyle = 'hsla(200, 80%, 70%, 0.55)'

      for (let i = 0; i < RINGS; i++) {
        const local = ((i / RINGS + t) % 1)
        const radius = 18 + local * (SIZE * 0.42)
        const alpha = Math.pow(1 - local, 1.6) * 0.5
        const hue = 200 + local * 60 + t * 60
        ctx.fillStyle = ctx.strokeStyle =
          `hsla(${hue}, 75%, 66%, ${alpha})`
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      const coreR = 30 + (1 - t) * 26
      const coreA = 0.25 + t * 0.25
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2)
      grad.addColorStop(0, `hsla(222, 90%, 74%, ${coreA})`)
      grad.addColorStop(1, 'hsla(222, 90%, 74%, 0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(cx, cy, coreR * 2, 0, Math.PI * 2)
      ctx.fill()
    }

    const autoDrift = (time) => {
      if (time - lastTime > 50) {
        progress += 0.0015
        if (progress > 1) progress = 0
        drawFrame(progress)
        lastTime = time
      }
      raf = requestAnimationFrame(autoDrift)
    }
    // Pin hero and scrub canvas sequence as user scrolls
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=220%',
      pin: pinRef.current,
      scrub: 1,
      onUpdate: (self) => {
        progress = self.progress
        drawFrame(progress)
      },
    })

    // Text entrance timeline while pinned
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 40%',
        end: '+=60%',
        scrub: true,
      },
    })
    tl.fromTo(nameRef.current, { opacity: 0, y: 80, scale: 0.9 }, { opacity: 1, y: 0, scale: 1 }, 0)
      .fromTo(subRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, 0.3)
      .fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.6)

    resize()
    // Degraded devices: render a single static frame, skip the auto-drift loop
    // to save battery/CPU. Scroll-scrub still redraws a frame on demand.
    if (!degraded) {
      raf = requestAnimationFrame(autoDrift)
    }
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      st.kill()
      tl.kill()
    }
  }, [enabled, degraded])

  return (
    <section ref={sectionRef} id="home" className="hero">
      <div ref={pinRef} className="hero__pin">
        <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />
        <div ref={nameRef} className="hero__title">
          <h1>Lai Yi Xun</h1>
        </div>
        <p ref={subRef} className="hero__lede">
          Imagination is your superpower.
        </p>
        <a ref={ctaRef} href="#about" className="hero__cta">
          認識我
        </a>
      </div>
    </section>
  )
}