// src/lib/spotify.js

const CLIENT_ID     = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET

let accessToken = null
let tokenExpiry  = null

// ── Auth ─────────────────────────────────────

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

// ── Get full album object (includes artwork) ──

async function getAlbum(albumId) {
  const token = await getToken()
  const res = await fetch(
    `https://api.spotify.com/v1/albums/${albumId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.json()
}

// ── Get tracks from one album ─────────────────
// Uses full album endpoint so tracks include artwork

async function getAlbumTracks(albumId, limit = 6) {
  try {
    const album = await getAlbum(albumId)
    if (!album || !album.tracks || !album.tracks.items) return []

    // Inject album info into each track so artwork is available
    return album.tracks.items.slice(0, limit).map(track => ({
      ...track,
      album: {
        id: album.id,
        name: album.name,
        images: album.images,
        release_date: album.release_date,
      },
      external_urls: track.external_urls,
    }))
  } catch {
    return []
  }
}

// ── Get tracks from multiple albums ──────────

async function getTracksFromAlbums(albumIds, limit = 8) {
  if (!albumIds || albumIds.length === 0) return []

  const perAlbum = Math.ceil(limit / albumIds.length)

  const results = await Promise.all(
    albumIds.map(id => getAlbumTracks(id, perAlbum))
  )

  const all = results.flat()

  // Shuffle so we get variety across albums
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]]
  }

  return all.slice(0, limit)
}

// ── Era songs ─────────────────────────────────
// Uses album IDs when available, falls back to search

export async function getEraSongs(spotifyQuery, limit = 8, albumIds = []) {
  if (albumIds && albumIds.length > 0) {
    const tracks = await getTracksFromAlbums(albumIds, limit)
    if (tracks.length > 0) return tracks
  }
  // Fallback to text search
  return searchSongs(spotifyQuery, limit)
}

// ── Text search (fallback) ────────────────────

export async function searchSongs(query, limit = 10) {
  const token = await getToken()
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const data = await res.json()
  return data.tracks?.items ?? []
}

// ── Single track ──────────────────────────────

export async function getTrack(id) {
  const token = await getToken()
  const res = await fetch(
    `https://api.spotify.com/v1/tracks/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.json()
}

// ── Playback info ─────────────────────────────

export function getPlaybackInfo(track) {
  if (!track) return null
  const artistName = track.artists?.[0]?.name ?? 'BTS'
  return {
    hasPreview:    !!track.preview_url,
    previewUrl:    track.preview_url,
    spotifyUrl:    track.external_urls?.spotify,
    embedUrl:      `https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0`,
    youtubeUrl:    youtubeSearchUrl(track.name, artistName),
    fallbackLabel: 'watch on youtube',
  }
}

// ── YouTube fallback ──────────────────────────

export function youtubeSearchUrl(songName, artist = 'BTS') {
  const query = encodeURIComponent(`${artist} ${songName} official`)
  return `https://www.youtube.com/results?search_query=${query}`
}

export function youtubeMVUrl(songName, artist = 'BTS') {
  const query = encodeURIComponent(`${artist} ${songName} MV`)
  return `https://www.youtube.com/results?search_query=${query}`
}