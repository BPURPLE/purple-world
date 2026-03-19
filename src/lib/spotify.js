// src/lib/spotify.js

const CLIENT_ID     = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET

let accessToken = null
let tokenExpiry  = null

async function getToken() {
  if (accessToken && tokenExpiry && new Date() < tokenExpiry) {
    return accessToken
  }

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
    },
    body: 'grant_type=client_credentials',
  })

  const data = await res.json()
  accessToken = data.access_token
  tokenExpiry = new Date(new Date().getTime() + (data.expires_in - 60) * 1000)
  return accessToken
}

export async function searchSongs(query, limit = 10) {
  const token = await getToken()
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await res.json()
  return data.tracks?.items ?? []
}

export async function getTrack(id) {
  const token = await getToken()
  const res = await fetch(
    `https://api.spotify.com/v1/tracks/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.json()
}

export async function getEraSongs(spotifyQuery, limit = 6) {
  return searchSongs(`${spotifyQuery} BTS`, limit)
}

// ── Fallback helpers ──────────────────────────

// YouTube search URL for a song
export function youtubeSearchUrl(songName, artist = 'BTS') {
  const query = encodeURIComponent(`${artist} ${songName} official`)
  return `https://www.youtube.com/results?search_query=${query}`
}

// YouTube Music URL (slightly cleaner for music)
export function youtubeMusicUrl(songName, artist = 'BTS') {
  const query = encodeURIComponent(`${artist} ${songName}`)
  return `https://music.youtube.com/search?q=${query}`
}

// Call this on any track — returns the right action
// If Spotify has a preview → use Spotify embed
// If no preview → fall back to YouTube Music search
export function getPlaybackInfo(track) {
  if (!track) return null

  const hasPreview = !!track.preview_url

  return {
    hasPreview,
    spotifyUrl:   track.external_urls?.spotify,
    embedUrl:     `https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0`,
    youtubeUrl:   youtubeMusicUrl(track.name, track.artists?.[0]?.name ?? 'BTS'),
    fallbackLabel: 'listen on youtube music →',
  }
}