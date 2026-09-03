import { useMotionPreference } from './useMotionPreference'

export default function Navbar() {
  const { enabled, toggle } = useMotionPreference()

  return (
    <header className="navbar">
      <nav className="navbar__inner" aria-label="主要導覽">
        <a href="#home" className="navbar__brand">Lai Yi Xun</a>
        <div className="navbar__links">
          <a href="#about" className="navbar__link">關於</a>
          <a href="#works" className="navbar__link">作品</a>
          <a href="#contact" className="navbar__link">聯絡</a>
          <button
            type="button"
            aria-pressed={enabled}
            onClick={toggle}
            className="navbar__toggle"
          >
            <span className="navbar__dot" aria-hidden="true" />
            動效：{enabled ? '開' : '關'}
          </button>
        </div>
      </nav>
    </header>
  )
}