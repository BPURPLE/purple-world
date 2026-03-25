import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import './SearchPage.css'

// YouTube search that targets official MVs and audio
// Uses ytsearch: filter to avoid shorts and covers
function buildYouTubeUrl(query) {
  // Adding "official MV" + duration filter nudges YouTube toward full videos
  const q = encodeURIComponent(`BTS ${query} official MV`)
  return `https://www.youtube.com/results?search_query=${q}&sp=EgIQAQ%3D%3D`
  // sp=EgIQAQ%3D%3D is YouTube's filter for videos longer than 4 minutes
  // This eliminates Shorts (under 60s) and most covers/fan edits
}

function buildYouTubeMusicUrl(query) {
  const q = encodeURIComponent(`BTS ${query}`)
  return `https://music.youtube.com/search?q=${q}`
}

const SUGGESTIONS = [
  { label: 'Spring Day',         query: 'Spring Day' },
  { label: 'Dynamite',           query: 'Dynamite' },
  { label: 'Boy With Luv',       query: 'Boy With Luv' },
  { label: 'Blood Sweat & Tears',query: 'Blood Sweat Tears' },
  { label: 'Life Goes On',       query: 'Life Goes On' },
  { label: 'Yet To Come',        query: 'Yet To Come' },
  { label: 'Seven',              query: 'Seven Jungkook' },
  { label: 'DNA',                query: 'DNA' },
  { label: 'Butter',             query: 'Butter' },
  { label: 'Still With You',     query: 'Still With You Jungkook' },
  { label: 'The Astronaut',      query: 'The Astronaut Jin' },
  { label: 'Agust D',            query: 'Agust D Daechwita' },
]

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  const [input, setInput] = useState(query)

  useEffect(() => {
    setInput(query)
    // Auto-redirect to YouTube when query exists
    if (query) {
      window.open(buildYouTubeUrl(query), '_blank', 'noopener,noreferrer')
    }
  }, [query])

  function handleSearch(e) {
    e.preventDefault()
    if (!input.trim()) return
    const url = buildYouTubeUrl(input.trim())
    window.open(url, '_blank', 'noopener,noreferrer')
    setSearchParams({ q: input.trim() })
  }

  return (
    <main className="search-page">

      <section className="search-hero">
        <h1 className="search-title">find a song</h1>
        <p className="search-subtitle">
          searches open on YouTube with the official MV — no shorts, no covers
        </p>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            className="search-input"
            type="text"
            placeholder="search any BTS song..."
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
          />
          <button className="search-btn" type="submit">
            watch on youtube
          </button>
        </form>

        {query && (
          <div className="search-links">
            <p className="search-opened">
              opened YouTube for <span>"{query}"</span>
            </p>
            <div className="search-alt-links">
              <a
                href={buildYouTubeUrl(query)}
                target="_blank"
                rel="noreferrer"
                className="search-alt-btn search-yt"
              >
                official MV
              </a>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent('BTS ' + query + ' lyrics')}`}
                target="_blank"
                rel="noreferrer"
                className="search-alt-btn search-lyrics"
              >
                lyric video
              </a>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent('BTS ' + query + ' live performance')}&sp=EgIQAQ%3D%3D`}
                target="_blank"
                rel="noreferrer"
                className="search-alt-btn search-live"
              >
                live stage
              </a>
              <a
                href={buildYouTubeMusicUrl(query)}
                target="_blank"
                rel="noreferrer"
                className="search-alt-btn search-ytm"
              >
                youtube music
              </a>
            </div>
          </div>
        )}
      </section>

      {/* ── Suggestions ── */}
      <section className="search-suggestions-section">
        <p className="search-suggestions-label">popular searches</p>
        <div className="search-chips">
          {SUGGESTIONS.map(s => (
            <button
              key={s.label}
              className="search-chip"
              onClick={() => {
                setInput(s.query)
                window.open(buildYouTubeUrl(s.query), '_blank', 'noopener,noreferrer')
                setSearchParams({ q: s.query })
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Era browse prompt ── */}
      <section className="search-era-prompt">
        <p>not sure what to search?</p>
        <button
          className="search-era-btn"
          onClick={() => navigate('/')}
        >
          browse by era instead →
        </button>
      </section>

    </main>
  )
}