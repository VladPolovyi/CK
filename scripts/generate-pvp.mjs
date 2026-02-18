import { config } from 'dotenv'
import { promises as fs } from 'node:fs'

// Load environment variables
config({ path: '.env.local' })
if (!process.env.BLIZZARD_CLIENT_ID) {
  config({ path: '.env' })
}

const REGION = process.env.BLIZZARD_REGION || 'eu'
const REALM = process.env.BLIZZARD_REALM || 'ravencrest'
const GUILD_NAME = process.env.BLIZZARD_GUILD || 'cbitahok-kpobi'
const GUILD_PATH = `/data/wow/guild/${REALM}/${GUILD_NAME}/roster`

// Import manual PvP achievement data
import { GLADIATOR_IDS, LEGEND_IDS, RANK1_IDS, STRATEGIST_IDS, RANK1_BLITZ_IDS, RANK1_SOLO_IDS } from '../src/data/pvp-achievements-manual.js'

async function getToken() {
  const res = await fetch(`https://oauth.battle.net/token`, {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' + Buffer.from(`${process.env.BLIZZARD_CLIENT_ID}:${process.env.BLIZZARD_CLIENT_SECRET}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  })
  if (!res.ok) throw new Error(`Token error ${res.status}`)
  const { access_token } = await res.json()
  return access_token
}

async function bnetGet(token, path, params = {}) {
  const url = new URL(`https://${REGION}.api.blizzard.com${path}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`API error ${res.status}: ${errorText}`)
  }
  
  return res.json()
}

async function getCharacterProfile(token, realm, name) {
  try {
    const data = await bnetGet(token, `/profile/wow/character/${realm}/${name.toLowerCase()}`, {
      namespace: `profile-${REGION}`,
      locale: 'en_US',
    })
    return (data && data.id) ? data : null
  } catch {
    return null
  }
}

async function getCharacterAccountInfo(token, realm, name) {
  const endpoints = [
    `/profile/wow/character/${realm}/${name.toLowerCase()}/account`,
    `/profile/wow/character/${realm}/${name.toLowerCase()}/battlenet-account`,
    `/profile/wow/character/${realm}/${name.toLowerCase()}/user`,
  ]
  for (const endpoint of endpoints) {
    try {
      const data = await bnetGet(token, endpoint, {
        namespace: `profile-${REGION}`,
        locale: 'en_US',
      })
      if (data && Object.keys(data).length > 0) return data
    } catch {
      // continue
    }
  }
  return null
}

async function getCharacterAchievementIds(token, realm, name) {
  try {
    const data = await bnetGet(token, `/profile/wow/character/${realm}/${name.toLowerCase()}/achievements`, {
      namespace: `profile-${REGION}`,
      locale: 'en_US',
    })
    if (!data || !data.achievements) return { earnedIds: new Set(), totalPoints: 0 }

    let earnedIds = new Set()
    const totalPoints = data.total_points || 0

    if (data.achievements && Array.isArray(data.achievements)) {
      earnedIds = new Set(data.achievements.map((a) => a?.id).filter((x) => typeof x === 'number'))
    } else if (data.achievements?.achievements && Array.isArray(data.achievements.achievements)) {
      earnedIds = new Set(data.achievements.achievements.map((a) => a?.id).filter((x) => typeof x === 'number'))
    } else if (data.achievements?.categories) {
      const allAchievements = []
      data.achievements.categories.forEach(category => {
        if (category.achievements && Array.isArray(category.achievements)) {
          allAchievements.push(...category.achievements)
        }
      })
      earnedIds = new Set(allAchievements.map((a) => a?.id).filter((x) => typeof x === 'number'))
    }
    return { earnedIds, totalPoints }
  } catch {
    return { earnedIds: new Set(), totalPoints: 0 }
  }
}

async function main() {
  console.log('Building...')
  const token = await getToken()
  const roster = await bnetGet(token, GUILD_PATH, { namespace: `profile-${REGION}`, locale: 'en_US' })
  const members = Array.isArray(roster?.members) ? roster.members : []

  const characterResults = []
  const MAX_CONCURRENCY = 5
  let i = 0

  async function worker() {
    while (true) {
      const idx = i++
      if (idx >= members.length) break

      const m = members[idx]
      const name = m?.character?.name
      const realmSlug = m?.character?.realm?.slug || REALM
      if (!name) continue

      // Get character profile first (for character ID)
      const profile = await getCharacterProfile(token, realmSlug, name)
      
      // Try to get account information
      const accountInfo = await getCharacterAccountInfo(token, realmSlug, name)
      
      const { earnedIds, totalPoints } = await getCharacterAchievementIds(token, realmSlug, name)
      
      const hasGladiatorEver = GLADIATOR_IDS.some((id) => earnedIds.has(id))
      const hasLegendEver = LEGEND_IDS.some((id) => earnedIds.has(id))
      const hasRank1Ever = RANK1_IDS.some((id) => earnedIds.has(id))
      const hasStrategistEver = STRATEGIST_IDS.some((id) => earnedIds.has(id))
      const hasRank1BlitzEver = RANK1_BLITZ_IDS.some((id) => earnedIds.has(id))
      const hasRank1SoloEver = RANK1_SOLO_IDS.some((id) => earnedIds.has(id))

      // Per-type counts for achievement page (how many of each title the player has)
      const rank1 = RANK1_IDS.filter((id) => earnedIds.has(id)).length
      const rank1solo = RANK1_SOLO_IDS.filter((id) => earnedIds.has(id)).length
      const gladiator = GLADIATOR_IDS.filter((id) => earnedIds.has(id)).length
      const legend = LEGEND_IDS.filter((id) => earnedIds.has(id)).length
      const strategist = STRATEGIST_IDS.filter((id) => earnedIds.has(id)).length
      const blitzRank1 = RANK1_BLITZ_IDS.filter((id) => earnedIds.has(id)).length

      const characterClass = profile?.character_class?.name ?? profile?.playable_class?.name ?? null

      characterResults.push({
        name,
        realmSlug,
        realmName: m?.character?.realm?.name?.en_US || m?.character?.realm?.name?.en_GB || realmSlug,
        rank: m?.rank ?? null,
        characterClass,
        hasGladiatorEver,
        hasLegendEver,
        hasRank1Ever,
        hasStrategistEver,
        hasRank1BlitzEver,
        hasRank1SoloEver,
        rank1,
        rank1solo,
        gladiator,
        legend,
        strategist,
        blitzRank1,
        totalAchievements: earnedIds.size,
        totalPoints,
        characterId: profile?.id || null,
      })

      // Add a small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  await Promise.all(Array.from({ length: MAX_CONCURRENCY }, () => worker()))

  const totalGladiators = characterResults.filter(r => r.hasGladiatorEver).length
  const totalLegends = characterResults.filter(r => r.hasLegendEver).length
  const totalRank1s = characterResults.filter(r => r.hasRank1Ever).length
  const totalStrategists = characterResults.filter(r => r.hasStrategistEver).length
  const totalRank1Blitz = characterResults.filter(r => r.hasRank1BlitzEver).length
  const totalRank1Solo = characterResults.filter(r => r.hasRank1SoloEver).length

  await fs.mkdir('src/data/generated', { recursive: true })

  await fs.writeFile(
    'src/data/generated/pvp-titles.json',
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      rosterCount: members.length,
      achievementCounts: {
        gladiator: GLADIATOR_IDS.length,
        legend: LEGEND_IDS.length,
        rank1: RANK1_IDS.length,
        strategist: STRATEGIST_IDS.length
      },
      foundCounts: {
        gladiator: totalGladiators,
        legend: totalLegends,
        rank1: totalRank1s,
        strategist: totalStrategists,
        blitzRank1: totalRank1Blitz,
        soloRank1: totalRank1Solo
      },
      items: characterResults
    }, null, 2)
  )
  console.log(`✅ PvP titles: ${characterResults.length} characters → pvp-titles.json`)
}

main().catch((err) => {
  console.error('❌ Script failed:', err)
  process.exit(1)
})


