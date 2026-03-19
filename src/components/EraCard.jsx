import { useNavigate } from 'react-router-dom'
import './EraCard.css'

export default function EraCard({ era, index }) {
  const navigate = useNavigate()

  return (
    <div
      className="era-card"
      style={{
        background: era.palette.card,
        animationDelay: `${index * 0.08}s`,
        borderColor: era.isUpcoming
          ? `rgba(179,157,219,0.3)`
          : 'rgba(255,255,255,0.05)',
      }}
      onClick={() => navigate(`/era/${era.id}`)}
    >
      {era.isUpcoming && (
        <span className="era-new-badge">new</span>
      )}

      <div className="era-years" style={{ color: era.palette.primary }}>
        {era.years}
      </div>

      <h3 className="era-name">
        {era.name}
        {era.koreanName && (
          <span className="era-korean"> · {era.koreanName}</span>
        )}
      </h3>

      <div className="era-moods">
        {era.mood.slice(0, 3).map(m => (
          <span
            key={m}
            className="era-mood-tag"
            style={{ color: era.palette.accent }}
          >
            {m}
          </span>
        ))}
      </div>

      <p className="era-start">
        start with <strong>{era.startWith}</strong>
      </p>
    </div>
  )
}