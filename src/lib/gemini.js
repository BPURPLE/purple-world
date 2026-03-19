// src/lib/gemini.js
// All AI features powered by Google Gemini 2.5 Flash (free)

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
        maxOutputTokens: 2000,
        responseMimeType: 'application/json',
      },
    }),
  })
  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'
  try { return JSON.parse(text) }
  catch { return {} }
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
1. Who sings this — if solo name them clearly, if it is a group or chorus moment describe it warmly as such
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
   - If it is a solo line, name the one member clearly
   - If multiple members sing together, name all of them and describe it as a shared or harmonized moment
   - If it is a chorus sung by the whole group, say so warmly and describe the energy
2. What makes their voice or the blend of voices recognizable in this moment
3. What this line means emotionally in the context of the song

If unsure which member, make your best educated guess based on the song structure.
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
3. How it connects to the song or BTS's overall message at that point in their journey

Warm, simple, accessible for someone completely new to BTS.
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
Consider:
- If it sounds like a solo line, pick one member
- If it sounds like a chorus or group line, say BTS (all) or list the main members

Respond in exactly this JSON format:
{
  "member": "member name or BTS (all) or member1 and member2",
  "confidence": "high or medium or low",
  "explanation": "two sentences explaining who sings this, why, and what makes their voice recognizable"
}

Only pick from: RM, Jin, Suga, j-hope, Jimin, V, Jungkook, BTS (all)
  `)
}

// ── 5. Mood recommender ───────────────────────

export async function getMoodRecommendations(input) {
  return askJSON(`
You are a BTS music expert and empathetic friend.

The user is feeling: "${input}"

Recommend BTS songs in exactly this JSON format:
{
  "userMood": "one sentence describing their emotional state",
  "meetYouThere": [
    { "song": "song name", "member": "main member or BTS", "reason": "one sentence" },
    { "song": "song name", "member": "main member or BTS", "reason": "one sentence" },
    { "song": "song name", "member": "main member or BTS", "reason": "one sentence" }
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
- wildcard = surprising pick that somehow works anyway
  `)
}

// ── 6. Energy-based recommendations ──────────

export async function getEnergyRecommendations(songName) {
  return askJSON(`
You are a BTS music expert.

The user is listening to: "${songName}" by BTS

Recommend songs based on energy level in exactly this JSON format:
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
- keepItUp = same energy and vibe as ${songName}
- windDown = one step calmer, gentle transition out of this mood
- completeOpposite = completely different energy and vibe
  `)
}

// ── 7. Memory wall moderation ─────────────────

export async function moderateMemory(text) {
  return askJSON(`
You are a content moderator for Purple World, a BTS fan community for all ages.

Review this fan memory submission:
"${text}"

Respond in exactly this JSON format:
{
  "approved": true or false,
  "reason": "one sentence explanation"
}

Approve if: genuine BTS fan memory, positive, nostalgic, emotional, supportive, or funny in a kind way.
Reject if: hate speech, slurs, harassment of members or other fans, spam, explicit content, or personal attacks.
Be generous — most genuine ARMY memories should be approved.
  `)
}