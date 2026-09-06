import { useEffect, useState } from 'react'

// Automatic performance degradation assessment.
//
// Returns true when the device/environment should drop expensive effects:
//   - prefers-reduced-motion: reduce
//   - low CPU count (navigator.hardwareConcurrency <= 4)
//   - sustained low scroll/render frame rate (rolling FPS sample < threshold)
//
// When degraded, App sets a `data-degrade` attribute on <html> so CSS can swap
// e.g. backdrop-filter blur for solid high-opacity backgrounds, and components
// can pause background canvas drawing.
//
// Degradation is one-way: once triggered we stop sampling (saves battery) since
// we never re-enable effects, which matches the "extreme-scenario fallback"
// production convention.
export function useAutoDegrade({ fpsThreshold = 45, enable = true } = {}) {
  const [degraded, setDegraded] = useState(enable)

  useEffect(() => {
    if (!enable) return undefined

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const lowCpu = (navigator.hardwareConcurrency || 8) <= 4

    let raf = 0
    let stopped = false
    let fpsDegraded = false
    let frames = 0
    let last = performance.now()
    let lowBumps = 0

    const apply = () => {
      const on = mq.matches || lowCpu || fpsDegraded
      setDegraded(on)
      document.documentElement.toggleAttribute('data-degrade', on)
      document.documentElement.classList.toggle('is-degraded', on)
      if (on) stopped = true
    }

    const sample = () => {
      if (stopped) return
      frames += 1
      const now = performance.now()
      if (now - last >= 2000) {
        const fps = (frames * 1000) / (now - last)
        if (fps < fpsThreshold) lowBumps += 1
        else lowBumps = 0
        fpsDegraded = lowBumps >= 3 // ~6s of sustained low FPS
        frames = 0
        last = now
        apply()
      }
      if (!stopped) raf = requestAnimationFrame(sample)
    }

    const onChange = () => apply()
    mq.addEventListener?.('change', onChange)

    apply()
    if (!mq.matches && !lowCpu) raf = requestAnimationFrame(sample)

    return () => {
      stopped = true
      cancelAnimationFrame(raf)
      mq.removeEventListener?.('change', onChange)
    }
  }, [fpsThreshold, enable])

  return degraded
}
