import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { chapter1Eras, chapter2Eras, ARIRANG_RELEASE, isArirangOut } from '../data/eras'
import EraCard from '../components/EraCard'
import Countdown from '../components/Countdown'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const [released, setReleased] = useState(isArirangOut())

  useEffect(() => {
    const timer = setInterval(() => {
      setReleased(isArirangOut())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <main className="home">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-rings">
          <div className="ring ring-1" />
          <div className="ring ring-2" />
          <div className="ring ring-3" />
        </div>
        <div className="orb-center" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <h1 className="hero-title">Purple World</h1>
        <p className="hero-sub">a bts museum · for every army</p>
        <p className="hero-hint">explore every era · discover every song</p>
      </section>

      {/* ── Arirang Banner ── */}
      <section className="arirang-banner">
        {released ? (
          <div className="banner-released">
            <span className="banner-label">out now</span>
            <h2 className="banner-title">아리랑 · Arirang</h2>
            <p className="banner-sub">BTS is back. 14 tracks. The reunion era begins.</p>
            <button
              className="banner-btn"
              onClick={() => navigate('/era/arirang')}
            >
              explore the era →
            </button>
          </div>
        ) : (
          <div className="banner-countdown">
            <span className="banner-label">dropping soon</span>
            <h2 className="banner-title">아리랑 · Arirang</h2>
            <Countdown target={ARIRANG_RELEASE} />
            <p className="banner-sub">14 tracks · every song co-written by BTS · title track SWIM</p>
          </div>
        )}
      </section>

      {/* ── Chapter 1 ── */}
      <section className="era-section">
        <div className="chapter-divider">
          <div className="chapter-line" />
          <span className="chapter-label">Chapter One · 2013 – 2021</span>
          <div className="chapter-line" />
        </div>
        <div className="era-grid">
          {chapter1Eras.map((era, i) => (
            <EraCard key={era.id} era={era} index={i} />
          ))}
        </div>
      </section>

      {/* ── Chapter 2 ── */}
      <section className="era-section">
        <div className="chapter-divider">
          <div className="chapter-line" />
          <span className="chapter-label">Chapter Two · 2022 – Present</span>
          <div className="chapter-line" />
        </div>
        <div className="era-grid">
          {chapter2Eras.map((era, i) => (
            <EraCard key={era.id} era={era} index={i} />
          ))}
        </div>
      </section>

    </main>
  )
}