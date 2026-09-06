import { useEffect, useRef, useState } from 'react'

// Full-screen detail modal with a Before/After comparison toggle.
// A11y: focus trap inside the dialog + focus restore to the trigger on close.
const steps = {
  before: { label: '草稿版', note: '初步發想、零散重點、尚無視覺編排。' },
  after: { label: '最終版', note: '重新梳理結構，加入視覺層次與結論共鳴。' },
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export default function ProjectModal({ work, onClose, motionOn }) {
  const [view, setView] = useState('after')
  const panelRef = useRef(null)
  const titleId = `pmodal-title-${work.id}`

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return undefined

    // Remember what had focus before the modal opened (the triggering card).
    const previouslyFocused = document.activeElement

    // Lock body scroll.
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Move focus into the dialog (first focusable = close button).
    const focusables = () =>
      Array.from(panel.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null && !el.hasAttribute('disabled'),
      )
    const first = focusables()[0]
    first?.focus()

    // Trap Tab / Shift+Tab so focus stays inside the dialog.
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) {
        e.preventDefault()
        panel.focus?.()
        return
      }
      const current = document.activeElement
      const idx = items.indexOf(current)
      if (e.shiftKey && (idx <= 0)) {
        e.preventDefault()
        items[items.length - 1].focus()
      } else if (!e.shiftKey && (idx === items.length - 1 || idx === -1)) {
        e.preventDefault()
        items[0].focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
      // Restore focus to whatever opened the modal.
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [onClose, work.id])

  const s = steps[view]

  return (
    <div className="pmodal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button className="pmodal__backdrop" onClick={onClose} aria-label="關閉" tabIndex={-1} />
      <div
        ref={panelRef}
        className={`pmodal__panel ${motionOn ? '' : 'pmodal__panel--static'}`}
      >
        <button
          className="pmodal__close"
          onClick={onClose}
          aria-label="關閉彈窗"
          autoFocus
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>

        <span className="pmodal__num">0{work.id.replace('w', '')}</span>
        <h3 id={titleId}>{work.title}</h3>
        <p>{work.body}</p>

        {/* Before/After toggle */}
        <div className="ba">
          <div className="ba__tabs" role="tablist" aria-label="草稿與最終對比">
            {Object.entries(steps).map(([k, v]) => (
              <button
                key={k}
                role="tab"
                aria-selected={view === k}
                aria-controls="ba-stage"
                className={`ba__tab ${view === k ? 'ba__tab--on' : ''}`}
                onClick={() => setView(k)}
              >
                {v.label}
              </button>
            ))}
          </div>
          <div id="ba-stage" className="ba__stage" role="tabpanel">
            <span className={`ba__pill ${view === 'before' ? 'ba__pill--before' : 'ba__pill--after'}`}>
              {s.label}
            </span>
            <p>{s.note}</p>
          </div>
        </div>

        <a href={work.file} download className="pmodal__download">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          下載簡報（{work.file.split('/').pop()}）
        </a>
      </div>
    </div>
  )
}
