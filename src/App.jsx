import './App.css'

function App() {
  return (
    <div className="site">
      <header className="header">
        <h1>賴俋勳</h1>
        <p>你好</p>
      </header>

      <main className="main">
        <section className="works">
          <h2>作品</h2>
          <ul className="work-list">
            <li className="work-card">
              <span className="work-title">000</span>
            </li>
            <li className="work-card">
              <span className="work-title">001</span>
            </li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <h2>聯絡方式</h2>
        <ul className="contact-list">
          <li>
            <a href="mailto:spider960523@gmail.com">spider960523@gmail.com</a>
          </li>
          <li>
            <a href="tel:+886975079147">0975-079-147</a>
          </li>
        </ul>
      </footer>
    </div>
  )
}

export default App
