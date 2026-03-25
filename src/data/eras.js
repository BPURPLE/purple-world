// src/data/eras.js
// Single source of truth for the entire app.

export const members = {
  RM: {
    id: "RM",
    birthName: "Kim Namjoon",
    role: "Leader · Main Rapper",
    color: "#9C7EC4",
    bg: "rgba(156,126,196,0.15)",
    soloAlbum: "Indigo",
    soloYear: 2022,
    soloMood: "artistic, introspective, Seoul",
    spotifyArtist: "RM",
    soloSpotifyAlbumId: "6pCMvQFBfFxHJARCPdPnWN",
  },
  Jin: {
    id: "Jin",
    birthName: "Kim Seokjin",
    role: "Vocalist · Worldwide Handsome",
    color: "#F48FB1",
    bg: "rgba(244,143,177,0.15)",
    soloAlbum: "The Astronaut",
    soloYear: 2022,
    soloMood: "emotional, farewell, stars",
    spotifyArtist: "Jin",
    soloSpotifyAlbumId: null,
  },
  Suga: {
    id: "Suga",
    birthName: "Min Yoongi",
    role: "Lead Rapper · Producer",
    color: "#80CBC4",
    bg: "rgba(128,203,196,0.15)",
    soloAlbum: "D-Day",
    soloYear: 2023,
    soloMood: "cathartic, rap, healing",
    spotifyArtist: "Agust D",
    soloSpotifyAlbumId: null,
  },
  JHope: {
    id: "JHope",
    birthName: "Jung Hoseok",
    role: "Main Dancer · Rapper",
    color: "#FFD54F",
    bg: "rgba(255,213,79,0.15)",
    soloAlbum: "Jack In The Box",
    soloYear: 2022,
    soloMood: "dark, festival, experimental",
    spotifyArtist: "j-hope",
    soloSpotifyAlbumId: null,
  },
  Jimin: {
    id: "Jimin",
    birthName: "Park Jimin",
    role: "Main Dancer · Vocalist",
    color: "#B0BEC5",
    bg: "rgba(176,190,197,0.15)",
    soloAlbum: "FACE",
    soloYear: 2023,
    soloMood: "identity, pop perfection, raw",
    spotifyArtist: "Jimin",
    soloSpotifyAlbumId: null,
  },
  V: {
    id: "V",
    birthName: "Kim Taehyung",
    role: "Vocalist · Visual",
    color: "#4DB6AC",
    bg: "rgba(77,182,172,0.15)",
    soloAlbum: "Layover",
    soloYear: 2023,
    soloMood: "jazz, vintage, cinematic",
    spotifyArtist: "V",
    soloSpotifyAlbumId: null,
  },
  Jungkook: {
    id: "Jungkook",
    birthName: "Jeon Jungkook",
    role: "Main Vocalist · Golden Maknae",
    color: "#7986CB",
    bg: "rgba(121,134,203,0.15)",
    soloAlbum: "Golden",
    soloYear: 2023,
    soloMood: "pop, global, euphoric",
    spotifyArtist: "Jungkook",
    soloSpotifyAlbumId: null,
  },
}

export const membersArray = Object.values(members)

export const eras = [

  // ── CHAPTER 1 ────────────────────────────

  {
    id: "school-trilogy",
    chapter: 1,
    name: "School Trilogy",
    koreanName: null,
    years: "2013 – 2014",
    palette: {
      primary: "#C084B0",
      accent: "#F0C4E4",
      dark: "#1a0a16",
      card: "rgba(192,132,176,0.07)",
    },
    mood: ["rebellious", "youth", "identity", "raw"],
    theme:
      "BTS debuted as underdogs — young boys from small towns questioning society's obsession with grades and success. Raw, honest, and unapologetically loud. This is where it all began.",
    aesthetic:
      "Street style. Graffiti walls. School uniforms torn open. Bold and unpolished on purpose.",
    startWith: "No More Dream",
    startWithReason:
      "The song that started everything. Aggressive, young, and asking one question: what's your dream?",
    albums: ["2 Cool 4 Skool", "O!RUL8,2?", "Skool Luv Affair"],
    spotifyAlbumIds: [
      "6egaEe9JaULuUCkihSnYlH",
      "6rWmdSJIaGTVtdMJQ35Lvf",
      "5r35iS0uSSoQBKzQj0IeI3",
    ],
    spotifyQuery: "No More Dream BTS",
    isUpcoming: false,
  },

  {
    id: "hyyh",
    chapter: 1,
    name: "The Most Beautiful Moment in Life",
    koreanName: "화양연화",
    years: "2015 – 2016",
    palette: {
      primary: "#7B9E87",
      accent: "#C8E6C9",
      dark: "#0a1a0f",
      card: "rgba(123,158,135,0.07)",
    },
    mood: ["nostalgic", "bittersweet", "youth", "friendship", "fleeting"],
    theme:
      "Seven boys on the edge of adulthood, chasing the last golden moments before growing up changes everything. Cinematic, emotional, and deeply human. The era that made millions cry.",
    aesthetic:
      "Golden hour light. Empty highways. Convenience stores at midnight. Youth slipping through your fingers.",
    startWith: "I Need U",
    startWithReason:
      "Haunting and beautiful. The MV shocked everyone — BTS had never been this emotionally raw before.",
    albums: ["HYYH Pt.1", "HYYH Pt.2", "Young Forever"],
    spotifyAlbumIds: [
      "0mEeCuKJQ8Xh9tQ5dMm89X",
      "2ds8iT4wkaN1Q1gZe1qcOD",
      "1k5bJ8l5oL5xxVBVHjil09",
    ],
    spotifyQuery: "Spring Day BTS",
    isUpcoming: false,
  },

  {
    id: "wings",
    chapter: 1,
    name: "Wings",
    koreanName: null,
    years: "2016 – 2017",
    palette: {
      primary: "#6B4FA0",
      accent: "#B39DDB",
      dark: "#0d0a1a",
      card: "rgba(107,79,160,0.10)",
    },
    mood: ["dark", "temptation", "artistic", "literary", "growth"],
    theme:
      "Inspired by Hermann Hesse's novel Demian — each member confronts their own darkness and inner demons. The most artistic and literary era. BTS proved they were not just a pop group.",
    aesthetic:
      "Dark academia. Feathered wings. Cracked mirrors. Symbolism layered on symbolism.",
    startWith: "Blood Sweat & Tears",
    startWithReason:
      "Seductive, cinematic, and packed with art history references. Nothing prepares you for this MV.",
    albums: ["Wings", "You Never Walk Alone"],
    spotifyAlbumIds: [
      "1vhNGBTFoaSTLbHjPGFIlF",
      "6THpewjqJ15ORBJkh5CEYb",
    ],
    spotifyQuery: "Blood Sweat Tears BTS",
    isUpcoming: false,
  },

  {
    id: "love-yourself",
    chapter: 1,
    name: "Love Yourself",
    koreanName: null,
    years: "2017 – 2018",
    palette: {
      primary: "#E57FA0",
      accent: "#F8BBD9",
      dark: "#1a0a10",
      card: "rgba(229,127,160,0.07)",
    },
    mood: ["love", "self-acceptance", "healing", "global", "emotional"],
    theme:
      "The era that took BTS to the world stage. A journey from desperately seeking love from others to finding love within yourself. Ended with a legendary UN speech that moved millions.",
    aesthetic:
      "Soft pastels. Cherry blossoms. Emotional cinematography. Hope in every frame.",
    startWith: "Spring Day",
    startWithReason:
      "Many fans call this the greatest BTS song ever made. About longing, loss, and waiting for warmth to return.",
    albums: ["Love Yourself: Her", "Love Yourself: Tear", "Love Yourself: Answer"],
    spotifyAlbumIds: [
      "07Rq17GzCnIdWJcyVHb57G",
      "4NIqCxqP9o8Tp6tGLBqd8O",
      "43wFM1HquliY3iwKWzPN4y",
    ],
    spotifyQuery: "DNA BTS",
    isUpcoming: false,
  },

  {
    id: "mots",
    chapter: 1,
    name: "Map of the Soul",
    koreanName: null,
    years: "2019 – 2020",
    palette: {
      primary: "#B8960C",
      accent: "#FFF176",
      dark: "#1a1500",
      card: "rgba(184,150,12,0.07)",
    },
    mood: ["philosophical", "shadow", "persona", "ego", "introspective"],
    theme:
      "Inspired by Carl Jung's psychology — exploring the persona we show the world versus the shadow we hide. BTS at their most philosophical. Stadium concerts, global domination, and deep self-questioning all at once.",
    aesthetic:
      "Gold and shadow. Masks and mirrors. Duality everywhere. Stadium-sized ambition.",
    startWith: "Boy With Luv",
    startWithReason:
      "Bright, joyful, dedicated to ARMY. The perfect gateway before going deeper into the shadows of this era.",
    albums: ["Map of the Soul: Persona", "Map of the Soul: 7"],
    spotifyAlbumIds: [
      "2KqlAl1Kl5fZvbFgJ0qFB6",
      "5W1XY5ucNATjTULERvXx9j",
    ],
    spotifyQuery: "Boy With Luv BTS",
    isUpcoming: false,
  },

  {
    id: "be",
    chapter: 1,
    name: "BE",
    koreanName: null,
    years: "2020 – 2021",
    palette: {
      primary: "#5C8A6E",
      accent: "#A5D6A7",
      dark: "#071a0d",
      card: "rgba(92,138,110,0.07)",
    },
    mood: ["comforting", "hopeful", "pandemic", "honest", "home"],
    theme:
      "Made entirely during COVID-19 lockdown. BTS processed the world's collective grief and offered something rare — genuine comfort. Their most personal album, produced and directed by the members themselves.",
    aesthetic:
      "Warm home interiors. Simple rooms. Honest faces. The world outside, paused.",
    startWith: "Life Goes On",
    startWithReason:
      "Written for the pandemic generation. The gentlest reminder that life continues, even when everything stops.",
    albums: ["BE"],
    spotifyAlbumIds: [
      "6nYfHQnvkvOTNHnOhDT3sr",
    ],
    spotifyQuery: "Life Goes On BTS",
    isUpcoming: false,
  },

  // ── CHAPTER 2 ────────────────────────────

  {
    id: "proof",
    chapter: 2,
    name: "Proof",
    koreanName: null,
    years: "2022",
    palette: {
      primary: "#78909C",
      accent: "#CFD8DC",
      dark: "#0a0f12",
      card: "rgba(120,144,156,0.07)",
    },
    mood: ["reflective", "milestone", "anthology", "nine-years", "identity"],
    theme:
      "A love letter to nine years of BTS. An anthology collecting their journey — unreleased demos, b-sides, and a message: this is who we were, who we are, and the proof we existed together.",
    aesthetic:
      "Archive photographs. Silver and slate. Documentary stillness. Evidence of a life lived.",
    startWith: "Yet To Come",
    startWithReason:
      "The thesis of Chapter 2 — the best moment is yet to come. A promise, not a goodbye.",
    albums: ["Proof"],
    spotifyAlbumIds: [
      "6al2VdKbb6FIz9d7lU7WRB",
    ],
    spotifyQuery: "Yet To Come BTS",
    chapterNote:
      "This album opened Chapter 2 — members preparing for mandatory military service while promising ARMY they would return.",
    isUpcoming: false,
  },

  {
    id: "solo-era",
    chapter: 2,
    name: "The Solo Era",
    koreanName: null,
    years: "2022 – 2024",
    palette: {
      primary: "#8E6EA6",
      accent: "#CE93D8",
      dark: "#120a1a",
      card: "rgba(142,110,166,0.07)",
    },
    mood: ["individual", "growth", "diverse", "exploration", "seven-voices"],
    theme:
      "For the first time, each member stepped fully into their own spotlight. Seven solo albums, seven completely different worlds. Baby ARMY: this is your chance to find your bias through music alone.",
    aesthetic:
      "Seven aesthetics, seven worlds. No single look — each member claimed their own visual universe.",
    startWith: "Seven",
    startWithReason:
      "Jungkook's most-streamed solo ever. Infectious, emotional, and the perfect entry point into the solo era.",
    albums: membersArray.map(m => `${m.soloAlbum} — ${m.id}`),
    spotifyAlbumIds: [],
    spotifyQuery: "Golden Jungkook BTS",
    chapterNote:
      "Members began enlisting for military service during this era. Jin enlisted first in December 2022.",
    soloMembers: membersArray,
    isUpcoming: false,
  },

  {
    id: "military",
    chapter: 2,
    name: "The Wait · Military Service",
    koreanName: null,
    years: "2023 – 2025",
    palette: {
      primary: "#546E7A",
      accent: "#90A4AE",
      dark: "#080d0f",
      card: "rgba(84,110,122,0.07)",
    },
    mood: ["patience", "growth", "trust", "anticipation", "reunion"],
    theme:
      "All seven members fulfilled South Korea's mandatory military service. Not an ending. A pause. Each member grew quietly, and ARMY waited — together, across the world. They all came back.",
    aesthetic:
      "Quiet. Steady. The calm before a reunion that shook the world.",
    startWith: "The Astronaut",
    startWithReason:
      "Jin's farewell before enlisting first. He wrote it knowing he would be gone — but promising to return.",
    albums: [],
    spotifyAlbumIds: [],
    spotifyQuery: "Astronaut Jin BTS",
    chapterNote:
      "All seven members have completed their mandatory military service and returned. The reunion is here.",
    enlistmentTimeline: [
      { member: "Jin",      enlisted: "Dec 2022", discharge: "Jun 2024", status: "returned" },
      { member: "JHope",    enlisted: "Apr 2023", discharge: "Oct 2024", status: "returned" },
      { member: "Suga",     enlisted: "Sep 2023", discharge: "Feb 2025", status: "returned" },
      { member: "RM",       enlisted: "Dec 2023", discharge: "Jun 2025", status: "returned" },
      { member: "V",        enlisted: "Dec 2023", discharge: "Jun 2025", status: "returned" },
      { member: "Jimin",    enlisted: "Dec 2023", discharge: "Jun 2025", status: "returned" },
      { member: "Jungkook", enlisted: "Dec 2023", discharge: "Jun 2025", status: "returned" },
    ],
    isUpcoming: false,
  },

  {
    id: "arirang",
    chapter: 2,
    name: "Arirang",
    koreanName: "아리랑",
    years: "2025 – present",
    palette: {
      primary: "#7B5EA7",
      accent: "#E1BEE7",
      dark: "#0d0a1a",
      card: "rgba(123,94,167,0.10)",
    },
    mood: ["reunion", "longing", "love", "mature", "evolved", "together again"],
    theme:
      "Named after Korea's most beloved folk song — a melody of longing and reunion sung across centuries. Seven men returned from service, older and changed, with something to say that only distance could teach them.",
    aesthetic:
      "Traditional Korea meets modern sound. Mature. Cinematic. The weight of time carried lightly.",
    startWith: "SWIM",
    startWithReason:
      "The title track — co-produced with Diplo and Flume. The first official sound of the reunion era.",
    albums: ["Arirang"],
    spotifyAlbumIds: [],
    tracklist: [
      "Body to Body",
      "Hooligan",
      "Aliens",
      "FYA",
      "2.0",
      "No. 29",
      "SWIM",
      "Merry Go Round",
      "NORMAL",
      "Like Animals",
      "they don't know 'bout us",
      "One More Night",
      "Please",
      "Into the Sun",
    ],
    titleTrack: "SWIM",
    producers: ["Diplo", "Flume", "Kevin Parker", "Mike WiLL Made-It", "JPEGMAFIA", "Ryan Tedder"],
    releaseDate: "2025-03-20",
    concertStream: "Netflix — March 21, Gwanghwamun Square, Seoul",
    documentary: "BTS: The Return — Netflix, March 27",
    worldTour: "Arirang World Tour — April 2026 to March 2027",
    spotifyQuery: "SWIM BTS",
    chapterNote:
      "Every track co-written by a BTS member. Suga described it as a more mature side of BTS you have never heard before.",
    isUpcoming: true,
  },
]

// ── Helpers ───────────────────────────────────

export const getEra         = (id) => eras.find(e => e.id === id)
export const chapter1Eras   = eras.filter(e => e.chapter === 1)
export const chapter2Eras   = eras.filter(e => e.chapter === 2)
export const arirangEra     = eras.find(e => e.id === "arirang")
export const getMemberColor = (name) => members[name]?.color ?? "#B39DDB"
export const allMoods       = [...new Set(eras.flatMap(e => e.mood))].sort()

export const ARIRANG_RELEASE = new Date("2025-03-20T00:00:00+09:00")
export const isArirangOut    = () => new Date() >= ARIRANG_RELEASE