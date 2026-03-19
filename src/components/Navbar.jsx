import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './Navbar.css'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Purple World
      </Link>

      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="search any song or member..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit">→</button>
      </form>

      <div className="navbar-links">
        <Link to="/">eras</Link>
        <Link to="/mood">mood</Link>
        <Link to="/wall">memory wall</Link>
      </div>
    </nav>
  )
}