import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getTrack, getPlaybackInfo, youtubeSearchUrl } from '../lib/spotify'
import { askGemini, whoSingsThisLine, explainLyric, guessWhoSings } from '../lib/gemini'
import { members } from '../data/eras'
import './SongPage.css'

export default function SongPage() {
  const { songId } = useParams()
  const navigate = useNavigate()

  const [track, setTrack] = useState(null)
  const [loading, setLoading] = useState(true)
  const [playbackInfo, setPlaybackInfo] = useState(null)

  const [songStory, setSongStory] = useState('')
  const [storyLoading, setStoryLoading] = useState(false)

  const [selectedMember, setSelectedMember] = useState(null)
  const [memberInfo, setMemberInfo] = useState('')
  const [memberLoading, setMemberLoading] = useState(false)

  const [userLyric, setUserLyric] = useState('')
  const [lyricExplanation, setLyricExplanation] = useState('')
  const [lyricLoading, setLyricLoading] = useState(false)

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [voiceResult, setVoiceResult] = useState(null)
  const [voiceLoading, setVoiceLoading] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    setSongStory('')
    setSelectedMember(null)
    setMemberInfo('')
    setUserLyric('')
    setLyricExplanation('')
    setVoiceResult(null)
    setTranscript('')

    getTrack(songId)
      .then(data => {
        setTrack(data)
        setPlaybackInfo(getPlaybackInfo(data))
        loadSongStory(data)
      })
      .finally(() => setLoading(false))
  }, [songId])

  // ── Song story ────────────────────────────────
  async function loadSongStory(trackData) {
    if (!trackData) return
    setStoryLoading(true)
    try {
      const story = await askGemini(`
You are a BTS expert writing for new fans who just discovered this song.

Song: "${trackData.name}"
Artists: ${trackData.artists?.map(a => a.name).join(', ')}
Album: ${trackData.album?.name}
Released: ${trackData.album?.release_date?.slice(0, 4)}

Write a warm engaging story (4-5 sentences) covering:
1. What this song is about emotionally
2. Why BTS made it and what era or moment it belongs to
3. What makes it special or iconic in BTS's discography
4. Why a new fan should listen to it right now

Conversational, warm, accessible for someone brand new to BTS.
No bullet points. No headers. Flowing natural text only.
      `)
      setSongStory(story)
    } catch {
      setSongStory('Could not load the story right now. But the music speaks for itself — press play above.')
    }
    setStoryLoading(false)
  }

  // ── Member spotlight ──────────────────────────
  async function handleMemberClick(memberId) {
    if (!track) return
    setSelectedMember(memberId)
    setMemberInfo('')
    setMemberLoading(true)
    try {
      const info = await askGemini(`
You are a BTS expert helping a new fan learn about a specific member.

Song: "${track.name}"
Member: ${memberId} (real name: ${members[memberId]?.birthName})
Their role in BTS: ${members[memberId]?.role}

Write 3-4 sentences covering:
1. What role ${memberId} plays in this specific song (main vocal, rap, bridge etc.)
2. What makes ${memberId}'s voice or rap style unique and instantly recognizable
3. One personality or fun fact that a brand new fan would find interesting and exciting

Keep it warm, simple, and exciting for a first-time BTS listener.
No bullet points. Flowing natural text only.
      `)
      setMemberInfo(info)
    } catch {
      setMemberInfo('Could not load member info right now. Try again!')
    }
    setMemberLoading(false)
  }

  // ── Lyric: who sings ──────────────────────────
  async function handleWhoSings() {
    if (!userLyric.trim() || !track) return
    setLyricExplanation('')
    setLyricLoading(true)
    try {
      const result = await whoSingsThisLine(userLyric, track.name)
      setLyricExplanation(result)
    } catch {
      setLyricExplanation('Could not identify the singer. Try again!')
    }
    setLyricLoading(false)
  }

  // ── Lyric: meaning ────────────────────────────
  async function handleLyricExplain() {
    if (!userLyric.trim() || !track) return
    setLyricExplanation('')
    setLyricLoading(true)
    try {
      const result = await explainLyric(userLyric, track.name, track.album?.name)
      setLyricExplanation(result)
    } catch {
      setLyricExplanation('Could not explain this lyric right now. Try again!')
    }
    setLyricLoading(false)
  }

  // ── Voice recognition ─────────────────────────
  function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in this browser. Try Chrome!')
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false
    recognitionRef.current = recognition

    recognition.onstart = () => {
      setIsListening(true)
      setTranscript('')
      setVoiceResult(null)
    }
    recognition.onresult = async (e) => {
      const text = e.results[0][0].transcript
      setTranscript(text)
      setIsListening(false)
      if (!track) return
      setVoiceLoading(true)
      try {
        const result = await guessWhoSings(text, track.name)
        setVoiceResult(result)
      } catch {
        setVoiceResult({
          member: 'Unknown',
          confidence: 'low',
          explanation: 'Could not process that. Try speaking more clearly!'
        })
      }
      setVoiceLoading(false)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognition.start()
  }

  function stopListening() {
    recognitionRef.current?.stop()
    setIsListening(false)
  }

  // ── Render ────────────────────────────────────
  if (loading) return (
    <div className="song-loading"><p>loading song...</p></div>
  )

  if (!track) return (
    <div className="song-loading">
      <p>song not found</p>
      <button onClick={() => navigate('/')}>back home</button>
    </div>
  )

  const ytUrl = youtubeSearchUrl(track.name, track.artists?.[0]?.name ?? 'BTS')

  return (
    <main className="song-page">

      <button className="song-back" onClick={() => navigate(-1)}>← back</button>

      {/* ── Hero ── */}
      <div className="song-hero">
        {track.album?.images?.[0]?.url && (
          <img
            src={track.album.images[0].url}
            alt={track.album.name}
            className="song-album-art"
          />
        )}
        <div className="song-meta">
          <h1 className="song-title">{track.name}</h1>
          <p className="song-artists">{track.artists?.map(a => a.name).join(', ')}</p>
          <p className="song-album-name">{track.album?.name}</p>
          <p className="song-year">{track.album?.release_date?.slice(0, 4)}</p>
          <div className="song-listen-btns">
            {playbackInfo?.spotifyUrl && (
              <a
                href={playbackInfo.spotifyUrl}
                target="_blank"
                rel="noreferrer"
                className="listen-btn listen-spotify"
              >
                open in spotify
              </a>
            )}
            <a
              href={ytUrl}
              target="_blank"
              rel="noreferrer"
              className="listen-btn listen-youtube"
            >
              watch on youtube
            </a>
          </div>
        </div>
      </div>

      {/* ── Spotify embed ── */}
      {playbackInfo?.embedUrl && (
        <div className="song-embed">
          <iframe
            src={playbackInfo.embedUrl}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ borderRadius: '12px' }}
          />
        </div>
      )}

      <div className="song-content">

        {/* ── Left column ── */}
        <div className="song-left">

          {/* Song Story */}
          <section className="song-section">
            <h2 className="section-label">the story</h2>
            {storyLoading
              ? <p className="ai-loading">generating song story...</p>
              : <p className="song-story-text">{songStory}</p>
            }
          </section>

          {/* Member Spotlight */}
          <section className="song-section">
            <h2 className="section-label">member spotlight</h2>
            <p className="section-hint">tap a member to learn their role in this song</p>
            <div className="member-grid">
              {Object.values(members).map(m => (
                <button
                  key={m.id}
                  className={selectedMember === m.id ? 'member-chip member-chip-active' : 'member-chip'}
                  style={{
                    borderColor: m.color,
                    color: selectedMember === m.id ? '#fff' : m.color,
                    background: selectedMember === m.id ? m.color : m.bg,
                  }}
                  onClick={() => handleMemberClick(m.id)}
                >
                  {m.id}
                </button>
              ))}
            </div>

            {selectedMember && (
              <div
                className="member-info-box"
                style={{ borderColor: members[selectedMember]?.color + '44' }}
              >
                <div className="member-info-header">
                  <span
                    className="member-info-name"
                    style={{ color: members[selectedMember]?.color }}
                  >
                    {selectedMember}
                  </span>
                  <span className="member-info-role">
                    {members[selectedMember]?.birthName} · {members[selectedMember]?.role}
                  </span>
                </div>
                {memberLoading
                  ? <p className="ai-loading">loading...</p>
                  : <p className="member-info-text">{memberInfo}</p>
                }
              </div>
            )}
          </section>

          {/* User Lyric Input */}
          <section className="song-section">
            <h2 className="section-label">got a lyric?</h2>
            <p className="section-hint">
              find a line on Google · paste it here · we'll explain everything about it
            </p>
            <textarea
              className="lyric-input"
              placeholder="paste a lyric line here..."
              value={userLyric}
              onChange={e => setUserLyric(e.target.value)}
              rows={2}
            />
            <div className="lyric-btns">
              <button
                className="lyric-btn lyric-btn-primary"
                onClick={handleWhoSings}
                disabled={!userLyric.trim() || lyricLoading}
              >
                who sings this?
              </button>
              <button
                className="lyric-btn lyric-btn-secondary"
                onClick={handleLyricExplain}
                disabled={!userLyric.trim() || lyricLoading}
              >
                what does it mean?
              </button>
            </div>
            {lyricLoading && <p className="ai-loading">asking gemini...</p>}
            {lyricExplanation && !lyricLoading && (
              <div className="lyric-result"><p>{lyricExplanation}</p></div>
            )}
          </section>

        </div>

        {/* ── Right column ── */}
        <div className="song-right">

          {/* Voice Challenge */}
          <section className="song-section">
            <h2 className="section-label">voice challenge</h2>
            <p className="section-hint">
              find a lyric on Google · read it out loud · we'll guess who sings it
            </p>
            <button
              className={isListening ? 'voice-btn voice-btn-listening' : 'voice-btn'}
              onClick={isListening ? stopListening : startListening}
            >
              {isListening
                ? <><span className="voice-pulse" /> listening... tap to stop</>
                : 'tap to speak a lyric'
              }
            </button>

            {transcript && (
              <div className="voice-transcript">
                <span className="voice-transcript-label">you said</span>
                <p>"{transcript}"</p>
              </div>
            )}

            {voiceLoading && <p className="ai-loading">figuring out who sings this...</p>}

            {voiceResult && !voiceLoading && (
              <div className="voice-result">
                <div className="voice-result-header">
                  <span
                    className="voice-member-name"
                    style={{ color: members[voiceResult.member]?.color ?? 'var(--purple-light)' }}
                  >
                    {voiceResult.member}
                  </span>
                  <span className={
                    voiceResult.confidence === 'high' ? 'voice-confidence confidence-high'
                    : voiceResult.confidence === 'medium' ? 'voice-confidence confidence-mid'
                    : 'voice-confidence confidence-low'
                  }>
                    {voiceResult.confidence} confidence
                  </span>
                </div>
                <p className="voice-explanation">{voiceResult.explanation}</p>
              </div>
            )}
          </section>

          {/* The Seven */}
          <section className="song-section">
            <h2 className="section-label">the seven</h2>
            <p className="section-hint">tap any member to learn about them</p>
            <div className="member-legend">
              {Object.values(members).map(m => (
                <div
                  key={m.id}
                  className="legend-item"
                  onClick={() => handleMemberClick(m.id)}
                >
                  <span className="legend-dot" style={{ background: m.color }} />
                  <span className="legend-name" style={{ color: m.color }}>{m.id}</span>
                  <span className="legend-role">{m.role}</span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </main>
  )
}