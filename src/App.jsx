import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionProvider, useMotionPreference } from './useMotionPreference'
import Navbar from './Navbar'
import Hero from './Hero'
import About from './About'
import Works from './Works'
import Contact from './Contact'
import Footer from './Footer'

gsap.registerPlugin(ScrollTrigger)

function AppInner() {
  const { enabled } = useMotionPreference()

  useEffect(() => {
    // Fallback: kill all ScrollTriggers and kill animations when motion is off
    if (!enabled) {
      ScrollTrigger.getAll().forEach((st) => st.kill())
      gsap.globalTimeline.clear()
    } else {
      // Refresh ScrollTrigger when toggled back on so pins re-measure
      ScrollTrigger.refresh()
    }
  }, [enabled])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Works />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <MotionProvider>
      <AppInner />
    </MotionProvider>
  )
}