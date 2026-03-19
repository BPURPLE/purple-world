import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEra, membersArray } from '../data/eras'
import { getEraSongs, getPlaybackInfo } from '../lib/spotify'
import './EraPage.css'

export default function EraPage() {
  const { eraId } = useParams()
  const navigate = useNavigate()
  const era = getEra(eraId)
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!era) return
    setLoading(true)
    getEraSongs(era.spotifyQuery, 8)
      .then(setSongs)
      .finally(() => setLoading(false))
  }, [eraId])

  if (!era) return (
    <div style={{ padding: '80px 32px', textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}>Era not found</h2>
      <button onClick={() => navigate('/')} style={{ marginTop: '20px', color: 'var(--purple-light)', cursor: 'pointer' }}>
        back home
      </button>
    </div>
  )

  return (
    <main className="era-page" style={{ '--era-primary': era.palette.primary, '--era-accent': era.palette.accent }}>

      <button className="era-back" onClick={() => navigate('/')}>
        all eras
      </button>

      <header className="era-header">
        <div className="era-header-meta">
          <span className="era-chapter">Chapter {era.chapter}</span>
          <span className="era-years-badge">{era.years}</span>
        </div>
        <h1 className="era-title">
          {era.name}
          {era.koreanName && <span className="era-korean-title"> · {era.koreanName}</span>}
        </h1>
        <div className="era-mood-list">
          {era.mood.map(m => (
            <span key={m} className="era-mood-pill">{m}</span>
          ))}
        </div>
      </header>

      <section className="era-story">
        <div className="era-story-text">
          <h2 className="era-section-title">the story</h2>
          <p className="era-theme">{era.theme}</p>
          <div className="era-aesthetic">
            <span className="era-aesthetic-label">aesthetic</span>
            <p>{era.aesthetic}</p>
          </div>
        </div>

        <div className="era-start-card">
          <span className="era-start-label">start here</span>
          <h3 className="era-start-song">{era.startWith}</h3>
          <p className="era-start-reason">{era.startWithReason}</p>
          <button
            className="era-start-btn"
            onClick={() => navigate('/search?q=' + encodeURIComponent(era.startWith + ' BTS'))}
          >
            listen now
          </button>
        </div>
      </section>

      {era.albums && era.albums.length > 0 && (
        <section className="era-albums">
          <h2 className="era-section-title">albums</h2>
          <div className="era-album-list">
            {era.albums.map(a => (
              <span key={a} className="era-album-tag">{a}</span>
            ))}
          </div>
        </section>
      )}

      {era.id === 'arirang' && era.tracklist && (
        <section className="era-tracklist">
          <h2 className="era-section-title">tracklist</h2>
          <div className="tracklist-grid">
            {era.tracklist.map((track, i) => (
              <div
                key={track}
                className={track === era.titleTrack ? 'track-item track-title' : 'track-item'}
                onClick={() => navigate('/search?q=' + encodeURIComponent(track + ' BTS'))}
              >
                <span className="track-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="track-name">{track}</span>
                {track === era.titleTrack && (
                  <span className="track-badge">title track</span>
                )}
              </div>
            ))}
          </div>
          {era.producers && (
            <p className="era-producers">
              produced with · {era.producers.join(' · ')}
            </p>
          )}
        </section>
      )}

      {era.id === 'military' && era.enlistmentTimeline && (
        <section className="era-timeline">
          <h2 className="era-section-title">enlistment timeline</h2>
          <div className="timeline-grid">
            {era.enlistmentTimeline.map(function(item) {
              const memberData = membersArray.find(function(m) { return m.id === item.member })
              const memberColor = memberData ? memberData.color : 'var(--purple-light)'
              return (
                <div key={item.member} className={'timeline-card timeline-' + item.status}>
                  <span className="timeline-member" style={{ color: memberColor }}>
                    {item.member}
                  </span>
                  <span className="timeline-dates">{item.enlisted} to {item.discharge}</span>
                  <span className="timeline-status">{item.status}</span>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {era.id === 'solo-era' && era.soloMembers && (
        <section className="era-solos">
          <h2 className="era-section-title">seven worlds</h2>
          <div className="solo-grid">
            {era.soloMembers.map(m => (
              <div
                key={m.id}
                className="solo-card"
                style={{ background: m.bg, borderColor: m.color }}
                onClick={() => navigate('/search?q=' + encodeURIComponent(m.soloAlbum + ' ' + m.id))}
              >
                <div className="solo-avatar" style={{ background: m.bg, color: m.color }}>
                  {m.id.slice(0, 2)}
                </div>
                <div className="solo-info">
                  <span className="solo-member-name" style={{ color: m.color }}>{m.id}</span>
                  <span className="solo-album-name">{m.soloAlbum}</span>
                  <span className="solo-mood">{m.soloMood}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="era-songs">
        <h2 className="era-section-title">songs from this era</h2>
        {loading ? (
          <div className="era-loading">loading songs...</div>
        ) : songs.length === 0 ? (
          <div className="era-loading">no songs found</div>
        ) : (
          <div className="song-grid">
            {songs.map(track => {
              const info = getPlaybackInfo(track)
              const ytUrl = info && info.youtubeUrl ? info.youtubeUrl : '#'
              const hasPreview = info && info.hasPreview ? info.hasPreview : false
              return (
                <div
                  key={track.id}
                  className="song-card"
                  onClick={() => navigate('/song/' + track.id)}
                >
                  {track.album && track.album.images && track.album.images[0] && (
                    <img
                      src={track.album.images[0].url}
                      alt={track.album.name}
                      className="song-cover"
                    />
                  )}
                  <div className="song-info">
                    <span className="song-name">{track.name}</span>
                    <span className="song-album">{track.album ? track.album.name : ''}</span>
                    {!hasPreview && (
                      <a
                        href={ytUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="song-yt-link"
                        onClick={e => e.stopPropagation()}
                      >
                        listen on youtube music
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {era.chapterNote && (
        <div className="era-note">
          <span className="era-note-icon">✦</span>
          {era.chapterNote}
        </div>
      )}

    </main>
  )
}