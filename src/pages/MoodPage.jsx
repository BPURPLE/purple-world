import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMoodRecommendations, getEnergyRecommendations } from '../lib/gemini'
import './MoodPage.css'

const MOODS = [
  { emoji: '😢', label: 'sad',          query: 'I am feeling sad and emotional' },
  { emoji: '😭', label: 'heartbroken',  query: 'I am heartbroken and missing someone' },
  { emoji: '🌧️', label: 'nostalgic',    query: 'I feel nostalgic and reminiscent' },
  { emoji: '😤', label: 'frustrated',   query: 'I am frustrated and need to let it out' },
  { emoji: '🔥', label: 'hype',         query: 'I am hyped up and feeling energetic' },
  { emoji: '💜', label: 'grateful',     query: 'I feel grateful and full of love' },
  { emoji: '🌙', label: 'calm',         query: 'I want something calm and peaceful' },
  { emoji: '✨', label: 'hopeful',      query: 'I feel hopeful and inspired' },
  { emoji: '😎', label: 'confident',    query: 'I feel confident and unstoppable' },
  { emoji: '🤔', label: 'lost',         query: 'I feel lost and need direction' },
  { emoji: '🎉', label: 'celebrating',  query: 'I am celebrating and want to party' },
  { emoji: '😴', label: 'tired',        query: 'I am tired and need something soothing' },
]

const ENERGY_SONGS = [
  'Fire', 'Spine Breaker', 'Dope', 'IDOL',
  'Dynamite', 'DNA', 'Boy With Luv', 'Butter',
  'Spring Day', 'Life Goes On', 'Stay', 'Epiphany',
  'Black Swan', 'Blood Sweat & Tears', 'Magic Shop',
]

export default function MoodPage() {
  const navigate = useNavigate()

  const [mode, setMode] = useState('mood') // 'mood' or 'energy'
  const [selectedMood, setSelectedMood] = useState(null)
  const [customMood, setCustomMood] = useState('')
  const [selectedSong, setSelectedSong] = useState(null)

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [energyResult, setEnergyResult] = useState(null)
  const [error, setError] = useState('')

  // ── Mood recommendations ──
  async function handleMoodSubmit() {
    const query = customMood.trim() || selectedMood?.query
    if (!query) return
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const data = await getMoodRecommendations(query)
      // Validate the shape we need before setting
      if (!data || typeof data !== 'object' || !data.meetYouThere) {
        console.error('Unexpected mood data shape:', data)
        setError('Got an unexpected response. Please try again!')
      } else {
        setResult(data)
      }
    } catch (err) {
      console.error('Mood fetch error:', err)
      setError(`Could not load recommendations: ${err.message}. Check the console for details.`)
    }
    setLoading(false)
  }

  // ── Energy recommendations ──
  async function handleEnergySubmit() {
    if (!selectedSong) return
    setLoading(true)
    setEnergyResult(null)
    setError('')
    try {
      const data = await getEnergyRecommendations(selectedSong)
      // Validate the shape we need before setting
      if (!data || typeof data !== 'object' || !data.keepItUp) {
        console.error('Unexpected energy data shape:', data)
        setError('Got an unexpected response. Please try again!')
      } else {
        setEnergyResult(data)
      }
    } catch (err) {
      console.error('Energy fetch error:', err)
      setError(`Could not load recommendations: ${err.message}. Check the console for details.`)
    }
    setLoading(false)
  }

  function youtubeUrl(songName) {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent('BTS ' + songName + ' official MV')}&sp=EgIQAQ%3D%3D`
  }

  return (
    <main className="mood-page">

      {/* ── Header ── */}
      <section className="mood-header">
        <h1 className="mood-title">how are you feeling?</h1>
        <p className="mood-subtitle">
          tell us your mood — we'll find the perfect BTS songs for you
        </p>

        {/* Mode toggle */}
        <div className="mood-toggle">
          <button
            className={mode === 'mood' ? 'toggle-btn toggle-active' : 'toggle-btn'}
            onClick={() => { setMode('mood'); setResult(null); setEnergyResult(null) }}
          >
            by mood
          </button>
          <button
            className={mode === 'energy' ? 'toggle-btn toggle-active' : 'toggle-btn'}
            onClick={() => { setMode('energy'); setResult(null); setEnergyResult(null) }}
          >
            by song energy
          </button>
        </div>
      </section>

      {/* ── Mood mode ── */}
      {mode === 'mood' && (
        <section className="mood-section">

          {/* Emoji grid */}
          <div className="mood-grid">
            {MOODS.map(m => (
              <button
                key={m.label}
                className={selectedMood?.label === m.label ? 'mood-chip mood-chip-active' : 'mood-chip'}
                onClick={() => {
                  setSelectedMood(m)
                  setCustomMood('')
                  setResult(null)
                }}
              >
                <span className="mood-emoji">{m.emoji}</span>
                <span className="mood-label">{m.label}</span>
              </button>
            ))}
          </div>

          {/* Custom mood input */}
          <div className="mood-custom">
            <p className="mood-custom-label">or describe your mood in your own words</p>
            <div className="mood-custom-form">
              <input
                className="mood-custom-input"
                type="text"
                placeholder="e.g. I just finished exams and feel free..."
                value={customMood}
                onChange={e => {
                  setCustomMood(e.target.value)
                  setSelectedMood(null)
                  setResult(null)
                }}
              />
              <button
                className="mood-submit-btn"
                onClick={handleMoodSubmit}
                disabled={(!selectedMood && !customMood.trim()) || loading}
              >
                {loading ? 'finding songs...' : 'find my songs →'}
              </button>
            </div>
          </div>

          {selectedMood && !customMood && (
            <div className="mood-selected-prompt">
              <p>feeling <strong>{selectedMood.label}</strong> today</p>
              <button
                className="mood-submit-btn"
                onClick={handleMoodSubmit}
                disabled={loading}
              >
                {loading ? 'finding songs...' : 'find my songs →'}
              </button>
            </div>
          )}

        </section>
      )}

      {/* ── Energy mode ── */}
      {mode === 'energy' && (
        <section className="mood-section">
          <p className="mood-energy-hint">
            pick a song you're currently listening to — we'll recommend what to play next
          </p>
          <div className="energy-grid">
            {ENERGY_SONGS.map(s => (
              <button
                key={s}
                className={selectedSong === s ? 'energy-chip energy-chip-active' : 'energy-chip'}
                onClick={() => {
                  setSelectedSong(s)
                  setEnergyResult(null)
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {selectedSong && (
            <div className="mood-selected-prompt">
              <p>currently listening to <strong>{selectedSong}</strong></p>
              <button
                className="mood-submit-btn"
                onClick={handleEnergySubmit}
                disabled={loading}
              >
                {loading ? 'finding songs...' : 'what should I play next? →'}
              </button>
            </div>
          )}
        </section>
      )}

      {/* ── Error ── */}
      {error && <p className="mood-error">{error}</p>}

      {/* ── Mood results ── */}
      {result && mode === 'mood' && (
        <section className="mood-results">

          <div className="mood-result-header">
            <p className="mood-user-mood">{result.userMood}</p>
          </div>

          {/* Meet you there */}
          {result.meetYouThere?.length > 0 && (
            <div className="result-category">
              <div className="result-category-header">
                <span className="result-emoji">🌧️</span>
                <div>
                  <h3 className="result-category-title">songs that get it</h3>
                  <p className="result-category-sub">these understand exactly how you feel</p>
                </div>
              </div>
              <div className="result-songs">
                {result.meetYouThere.map((s, i) => (
                  <SongRecommendation key={i} song={s} youtubeUrl={youtubeUrl} />
                ))}
              </div>
            </div>
          )}

          {/* Gentle shift */}
          {result.gentleShift?.length > 0 && (
            <div className="result-category">
              <div className="result-category-header">
                <span className="result-emoji">🌤️</span>
                <div>
                  <h3 className="result-category-title">when you're ready to shift</h3>
                  <p className="result-category-sub">a gentle move in a different direction</p>
                </div>
              </div>
              <div className="result-songs">
                {result.gentleShift.map((s, i) => (
                  <SongRecommendation key={i} song={s} youtubeUrl={youtubeUrl} />
                ))}
              </div>
            </div>
          )}

          {/* Flip it */}
          {result.flipIt?.length > 0 && (
            <div className="result-category">
              <div className="result-category-header">
                <span className="result-emoji">⚡</span>
                <div>
                  <h3 className="result-category-title">flip it completely</h3>
                  <p className="result-category-sub">complete opposite energy — when you need a reset</p>
                </div>
              </div>
              <div className="result-songs">
                {result.flipIt.map((s, i) => (
                  <SongRecommendation key={i} song={s} youtubeUrl={youtubeUrl} />
                ))}
              </div>
            </div>
          )}

          {/* Wildcard */}
          {result.wildcard && (
            <div className="result-category result-wildcard">
              <div className="result-category-header">
                <span className="result-emoji">🎲</span>
                <div>
                  <h3 className="result-category-title">wildcard</h3>
                  <p className="result-category-sub">doesn't fit either — but somehow works</p>
                </div>
              </div>
              <div className="result-songs">
                <SongRecommendation song={result.wildcard} youtubeUrl={youtubeUrl} />
              </div>
            </div>
          )}

          <button
            className="mood-reset-btn"
            onClick={() => { setResult(null); setSelectedMood(null); setCustomMood('') }}
          >
            try another mood
          </button>
        </section>
      )}

      {/* ── Energy results ── */}
      {energyResult && mode === 'energy' && (
        <section className="mood-results">

          <div className="mood-result-header">
            <p className="mood-user-mood">{energyResult.currentEnergy}</p>
          </div>

          {energyResult.keepItUp?.length > 0 && (
            <div className="result-category">
              <div className="result-category-header">
                <span className="result-emoji">🔥</span>
                <div>
                  <h3 className="result-category-title">keep the energy</h3>
                  <p className="result-category-sub">same vibe as {selectedSong}</p>
                </div>
              </div>
              <div className="result-songs">
                {energyResult.keepItUp.map((s, i) => (
                  <SongRecommendation key={i} song={s} youtubeUrl={youtubeUrl} />
                ))}
              </div>
            </div>
          )}

          {energyResult.windDown?.length > 0 && (
            <div className="result-category">
              <div className="result-category-header">
                <span className="result-emoji">🌙</span>
                <div>
                  <h3 className="result-category-title">wind it down</h3>
                  <p className="result-category-sub">one step calmer — gentle transition</p>
                </div>
              </div>
              <div className="result-songs">
                {energyResult.windDown.map((s, i) => (
                  <SongRecommendation key={i} song={s} youtubeUrl={youtubeUrl} />
                ))}
              </div>
            </div>
          )}

          {energyResult.completeOpposite?.length > 0 && (
            <div className="result-category">
              <div className="result-category-header">
                <span className="result-emoji">🌊</span>
                <div>
                  <h3 className="result-category-title">complete opposite</h3>
                  <p className="result-category-sub">completely different energy</p>
                </div>
              </div>
              <div className="result-songs">
                {energyResult.completeOpposite.map((s, i) => (
                  <SongRecommendation key={i} song={s} youtubeUrl={youtubeUrl} />
                ))}
              </div>
            </div>
          )}

          <button
            className="mood-reset-btn"
            onClick={() => { setEnergyResult(null); setSelectedSong(null) }}
          >
            try another song
          </button>
        </section>
      )}

    </main>
  )
}

// ── Song recommendation card ──────────────────

function SongRecommendation({ song, youtubeUrl }) {
  if (!song) return null
  return (
    <a
      href={youtubeUrl(song.song)}
      target="_blank"
      rel="noreferrer"
      className="rec-card"
    >
      <div className="rec-info">
        <span className="rec-song">{song.song}</span>
        {song.member && (
          <span className="rec-member">{song.member}</span>
        )}
        {song.reason && (
          <span className="rec-reason">{song.reason}</span>
        )}
      </div>
      <span className="rec-arrow">→</span>
    </a>
  )
}