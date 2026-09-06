import { useSectionReveal } from './useSectionFx.jsx'
import ScrollText from './components/ScrollText'

export default function About() {
  const { sectionRef, headingRef, bind } = useSectionReveal(3)

  return (
    <section ref={sectionRef} id="about" className="section about">
      <div className="about__content">
        <h2 ref={headingRef} className="section__title">About Me</h2>
        <ScrollText text="我是一位擁抱 Vibe Coding 的開發者，擅長結合 AI 助手，快速將想法轉化為實體作品。" className="about__declaration" />
        <p ref={bind(0)} className="about__joke">（騙你的）</p>
        <div ref={bind(1)} className="about__divider" />
        <p ref={bind(2)} className="about__sign"><strong>Yi Xun</strong></p>
      </div>
    </section>
  )
}