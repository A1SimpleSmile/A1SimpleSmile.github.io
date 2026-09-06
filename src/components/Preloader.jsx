import { useEffect, useState } from 'react'
import { useReducedMotion } from '../useSectionFx.jsx'
import { useMotionPreference } from '../useMotionPreference.jsx'

// Minimal preloader: guards against FOUC/CLS by holding a fixed overlay while
// the critical (first-paint) content and fonts settle, then fades it out.
// It never blocks interaction for too long and stays out of the layout flow.
export default function Preloader() {
  const [phase, setPhase] = useState('loading')
  const reduced = useReducedMotion()
  const { enabled } = useMotionPreference()

  useEffect(() => {
    // Choose a small min-hold; longer when motion is on so the fade reads nicely.
    const minHold = enabled && !reduced ? 450 : 60

    let done = false
    const finish = () => {
      if (done) return
      done = true
      setPhase('leaving')
      window.setTimeout(() => setPhase('gone'), reduced ? 0 : 500)
    }

    // Release on window load, or after a hard timeout (never stall the page).
    const timeout = window.setTimeout(finish, minHold + 4000)
    const onLoad = () => {
      window.clearTimeout(timeout)
      window.setTimeout(finish, minHold)
    }
    if (document.readyState === 'complete') {
      onLoad()
    } else {
      window.addEventListener('load', onLoad)
    }

    return () => {
      window.clearTimeout(timeout)
      window.removeEventListener('load', onLoad)
    }
  }, [enabled, reduced])

  if (phase === 'gone') return null

  return (
    <div
      className={`preloader ${phase === 'leaving' ? 'preloader--leave' : ''}`}
      aria-hidden="true"
    >
      <span className="preloader__mark" />
    </div>
  )
}
