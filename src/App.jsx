import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionProvider, useMotionPreference } from './useMotionPreference'
import { useAutoDegrade } from './useAutoDegrade.jsx'
import Preloader from './components/Preloader'
import MagneticCursor from './components/MagneticCursor'
import Navbar from './Navbar'
import Hero from './Hero'
import About from './About'
import Works from './Works'
import Contact from './Contact'
import Footer from './Footer'

gsap.registerPlugin(ScrollTrigger)

function AppInner() {
  const { enabled } = useMotionPreference()
  const degraded = useAutoDegrade()

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
      <Preloader />
      <MagneticCursor />
      <Navbar />
      <main>
        <Hero degraded={degraded} />
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