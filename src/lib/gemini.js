// src/lib/gemini.js
// All AI features powered by Google Gemini (free)

const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

// ── Core text call ────────────────────────────

async function ask(prompt) {
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_KEY,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    }),
  })
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

// ── Core JSON call ────────────────────────────

async function askJSON(prompt) {
  const fullPrompt = `${prompt}

IMPORTANT: Your response must be valid JSON only. No markdown, no backticks, no explanation. Just the raw JSON object.`

  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_KEY,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      },
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error('Gemini API error:', res.status, errText)
    throw new Error(`Gemini API returned ${res.status}`)
  }

  const data = await res.json()
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

  if (!raw) {
    console.error('Gemini returned empty text. Full response:', JSON.stringify(data))
    throw new Error('Empty response from Gemini')
  }

  // Strip ALL variations of markdown code fences, then trim
  const clean = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  // Find the first { and last } to extract just the JSON object
  // (handles cases where Gemini adds a sentence before/after)
  const firstBrace = clean.indexOf('{')
  const lastBrace = clean.lastIndexOf('}')

  if (firstBrace === -1 || lastBrace === -1) {
    console.error('No JSON object found in Gemini response:', clean)
    throw new Error('No JSON object in Gemini response')
  }

  const jsonStr = clean.slice(firstBrace, lastBrace + 1)

  try {
    return JSON.parse(jsonStr)
  } catch (e) {
    console.error('Gemini JSON parse failed. Raw:', raw, '\nExtracted:', jsonStr, '\nError:', e)
    throw new Error('Failed to parse Gemini JSON response')
  }
}

// ── General purpose call ──────────────────────

export async function askGemini(prompt) {
  return ask(prompt)
}

// ── 1. Who's singing (known member) ──────────

export async function whoIsSinging(lyricLine, songName, memberName) {
  return ask(`
You are a BTS expert helping a new fan understand a song.

Song: "${songName}"
Lyric: "${lyricLine}"
Listed singer(s): ${memberName}

Write 3-4 warm friendly sentences covering:
1. Who sings this — if solo name them, if a group moment describe it warmly as such
2. What makes their voice or the blend of voices recognizable in this moment
3. Why this moment in the song is special emotionally
4. One fun fact about the member or members involved

Simple enough for someone who just discovered BTS today.
No bullet points. Flowing natural text only.
  `)
}

// ── 2. Who sings this (unknown member) ───────

export async function whoSingsThisLine(lyricLine, songName) {
  return ask(`
You are a BTS expert helping a new fan.

Song: "${songName}"
Lyric line the fan found: "${lyricLine}"

Write 3-4 warm friendly sentences covering:
1. Which BTS member or members sing this line:
   - If solo, name the one member clearly
   - If multiple members sing together, name all of them
   - If it is a full group chorus, say so warmly
2. What makes their voice or the blend of voices recognizable
3. What this line means emotionally in context of the song

If unsure which member, make your best educated guess.
No bullet points. Flowing natural text only.
  `)
}

// ── 3. Lyric meaning explainer ────────────────

export async function explainLyric(lyricLine, songName, albumName) {
  return ask(`
You are a BTS expert helping a new fan understand song lyrics.

Song: "${songName}" from the album "${albumName}"
Lyric: "${lyricLine}"

Explain in 3-4 sentences:
1. The literal meaning of the line
2. The deeper emotional or thematic meaning
3. How it connects to the song or BTS's overall message

Warm, simple, accessible for someone new to BTS.
No bullet points. Flowing natural text only.
  `)
}

// ── 4. Voice recognition judge ────────────────

export async function guessWhoSings(transcribedLyric, songName) {
  return askJSON(`
You are a BTS expert.

The user read a lyric out loud and the app transcribed it as:
"${transcribedLyric}"

This is from the song: "${songName}"

Which BTS member or members most likely sing this line?

Return this exact JSON object:
{
  "member": "member name or BTS (all) or member1 and member2",
  "confidence": "high or medium or low",
  "explanation": "two sentences explaining who sings this and what makes their voice recognizable"
}

Only pick from: RM, Jin, Suga, j-hope, Jimin, V, Jungkook, BTS (all)
  `)
}

// ── 5. Mood recommender ───────────────────────

export async function getMoodRecommendations(input) {
  return askJSON(`
You are a BTS music expert and empathetic friend.

The user is feeling: "${input}"

Return this exact JSON object with BTS song recommendations:
{
  "userMood": "one sentence describing their emotional state",
  "meetYouThere": [
    { "song": "song name", "member": "main member or BTS", "reason": "one sentence why this fits" },
    { "song": "song name", "member": "main member or BTS", "reason": "one sentence why this fits" },
    { "song": "song name", "member": "main member or BTS", "reason": "one sentence why this fits" }
  ],
  "gentleShift": [
    { "song": "song name", "member": "main member or BTS", "reason": "one sentence" },
    { "song": "song name", "member": "main member or BTS", "reason": "one sentence" }
  ],
  "flipIt": [
    { "song": "song name", "member": "main member or BTS", "reason": "one sentence" },
    { "song": "song name", "member": "main member or BTS", "reason": "one sentence" }
  ],
  "wildcard": { "song": "song name", "member": "main member or BTS", "reason": "one unexpected sentence" }
}

Rules:
- Only BTS or BTS member solo songs
- meetYouThere = matches current mood exactly
- gentleShift = one step away, transitional energy
- flipIt = complete opposite energy
- wildcard = surprising pick that somehow works
  `)
}

// ── 6. Energy-based recommendations ──────────

export async function getEnergyRecommendations(songName) {
  return askJSON(`
You are a BTS music expert.

The user is listening to: "${songName}" by BTS

Return this exact JSON object:
{
  "currentEnergy": "one sentence describing the vibe and energy of ${songName}",
  "keepItUp": [
    { "song": "song name", "reason": "one sentence" },
    { "song": "song name", "reason": "one sentence" },
    { "song": "song name", "reason": "one sentence" }
  ],
  "windDown": [
    { "song": "song name", "reason": "one sentence" },
    { "song": "song name", "reason": "one sentence" }
  ],
  "completeOpposite": [
    { "song": "song name", "reason": "one sentence" },
    { "song": "song name", "reason": "one sentence" }
  ]
}

Rules:
- Only BTS or BTS member solo songs
- keepItUp = same energy as ${songName}
- windDown = one step calmer, gentle transition
- completeOpposite = completely different vibe
  `)
}

// ── 7. Memory wall moderation ─────────────────
// Only hard-rejects truly offensive content.
// Returns { approved, flagged, reason }
// approved:true, flagged:false  → publish immediately
// approved:true, flagged:true   → publish but visible to admin for review
// approved:false, flagged:false → hard reject (slurs, hate, explicit only)

export async function moderateMemory({ displayName, message, era }) {
  return askJSON(`
You are a lenient content moderator for Purple World, a BTS fan museum for new fans.

Your job is to APPROVE almost everything. ARMY memories come in all forms — short, long,
emotional, simple, multilingual, excited, tearful. All of these are welcome.

SUBMISSION:
- Display name: "${displayName}"
- Era: "${era}"  
- Message: "${message}"

ONLY hard reject (approved: false, flagged: false) if the message contains:
- Racial slurs or hate speech targeting any group
- Explicit sexual content
- Direct harassment or threats toward a real person
- Spam (pure gibberish or promotional links with no fan content)

For EVERYTHING ELSE set approved: true.
This includes: short messages, simple statements like "BTS saved my life",
emotional messages, messages in any language, messages about personal struggles,
messages that mention BTS helping with healing or mental health — all approved.

Return this exact JSON:
{
  "approved": true,
  "flagged": false,
  "reason": "one short sentence"
}
  `)
}