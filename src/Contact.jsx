import { useRef, useState } from 'react'
import GlassCard from './components/GlassCard'
import { useMouseGlow } from './useSectionFx.jsx'

// 真實聯絡資料（非 Placeholder）
const EMAIL = 'spider960523@gmail.com'

const socialLinks = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/A1SimpleSmile',
    path: 'M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.66.41.36.78 1.06.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .3.2.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/wind_05_23?igsi=eGV4NWtzZWxxamp1&utm_source=qr',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z',
  },
]

export default function Contact() {
  const sectionRef = useRef(null)
  const [isCopied, setIsCopied] = useState(false)
  const copyTimer = useRef(null)

  const { glowEl } = useMouseGlow(sectionRef)

  // 一鍵複製 Email（原生 Web API + 錯誤處理）
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setIsCopied(true)
      window.clearTimeout(copyTimer.current)
      copyTimer.current = window.setTimeout(() => setIsCopied(false), 2000)
    } catch {
      // 不支援 Clipboard API 時降級為 select + execCommand，仍不 Crash
      try {
        const ta = document.createElement('textarea')
        ta.value = EMAIL
        ta.setAttribute('readonly', '')
        ta.style.position = 'fixed'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        setIsCopied(true)
        window.clearTimeout(copyTimer.current)
        copyTimer.current = window.setTimeout(() => setIsCopied(false), 2000)
      } catch (fallbackErr) {
        console.error('複製失敗：', fallbackErr)
      }
    }
  }

  return (
    <section ref={sectionRef} id="contact" className="section contact-aurora">
      {glowEl}
      <div className="contact-aurora__orb contact-aurora__orb--1" aria-hidden="true" />
      <div className="contact-aurora__orb contact-aurora__orb--2" aria-hidden="true" />
      <div className="contact-aurora__orb contact-aurora__orb--3" aria-hidden="true" />

      <GlassCard>
        <h2 className="glass-bubble__layer contact-aurora__title" data-depth="2">聯絡我</h2>
        <p className="glass-bubble__layer contact-aurora__lead" data-depth="1.6">
          有任何想法或合作機會，歡迎直接寫信給我。
        </p>

        {/* 一鍵複製 Email — 深度拉高，優先 hit-test，高於標題/說明層 */}
        <div className="glass-bubble__layer" data-depth="5">
          <div className="copy">
            <div className="copy__row">
              <span className="copy__email">{EMAIL}</span>
              <button
                type="button"
                className={`copy__btn ${isCopied ? 'copy__btn--ok' : ''}`}
                onClick={handleCopy}
                aria-label="一鍵複製 Email"
              >
                {isCopied ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                )}
                {isCopied ? '已複製 Email！' : '複製'}
              </button>
            </div>
            {isCopied && (
              <div className="copy__ripple" aria-hidden="true">
                <span className="copy__wave copy__wave--1" />
                <span className="copy__wave copy__wave--2" />
                <span className="copy__wave copy__wave--3" />
              </div>
            )}
          </div>
        </div>

        {/* 外連社交按鈕：真實 href + 新分頁 + 安全防護 */}
        <div className="glass-bubble__layer" data-depth="1">
          <div className="social" role="list" aria-label="社群連結">
            {socialLinks.map((l) => (
              <a
                key={l.id}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social__link"
                aria-label={l.label}
                role="listitem"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={l.path} /></svg>
                <span>{l.label}</span>
              </a>
            ))}
          </div>
        </div>
      </GlassCard>
    </section>
  )
}
