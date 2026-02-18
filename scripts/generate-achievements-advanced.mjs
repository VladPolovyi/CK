import { writeFile, mkdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: '.env.local' })

// Get current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Simple Blizzard API implementation for build scripts
async function getBlizzardAccessToken(region) {
  const clientId = process.env.BLIZZARD_CLIENT_ID
  const clientSecret = process.env.BLIZZARD_CLIENT_SECRET
  
  if (!clientId || !clientSecret) {
    throw new Error('Missing BLIZZARD_CLIENT_ID or BLIZZARD_CLIENT_SECRET environment variables')
  }

  const url = `https://${region}.battle.net/oauth/token`
  const body = new URLSearchParams({ grant_type: 'client_credentials' })

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`Blizzard token error ${response.status}: ${text}`)
  }

  const data = await response.json()
  return data.access_token
}

async function blizzardGet(region, path, searchParams = {}) {
  if (!path.startsWith('/')) path = '/' + path
  const token = await getBlizzardAccessToken(region)
  const url = new URL(`https://${region}.api.blizzard.com${path}`)
  
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === 'string' && v.length > 0) url.searchParams.set(k, v)
  }
  
  return fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
}

async function fetchGuildRoster() {
  try {
    const res = await blizzardGet('eu', '/data/wow/guild/ravencrest/cbitahok-kpobi/roster', {
      namespace: 'profile-eu',
      locale: 'en_US',
    })
    const data = await res.json()
    const rosterMembers = Array.isArray(data?.members) ? data.members : []
    return rosterMembers
  } catch (error) {
    console.error('❌ Error fetching guild roster:', error.message)
    return []
  }
}

async function loadPvpTitles() {
  try {
    const titlesPath = join(__dirname, '..', 'src', 'data', 'generated', 'pvp-titles.json')
    const titlesData = await readFile(titlesPath, 'utf-8')
    return JSON.parse(titlesData)
  } catch (error) {
    console.error('❌ Error loading PvP titles:', error.message)
    return { items: [] }
  }
}

async function generateAchievementData() {
  try {
    // Fetch guild roster and PvP titles
    const [rosterMembers, titles] = await Promise.all([
      fetchGuildRoster(),
      loadPvpTitles()
    ])
    
    // Sort roster by rank
    const sortedRoster = rosterMembers
      .slice()
      .sort((a, b) => {
        const ra = typeof a?.rank === 'number' ? a.rank : Number.POSITIVE_INFINITY
        const rb = typeof b?.rank === 'number' ? b.rank : Number.POSITIVE_INFINITY
        return ra - rb
      })
    
    // Create map for PvP data lookup
    const byNameAndRealm = new Map(
      Array.isArray(titles?.items)
        ? titles.items.map((t) => [`${t.name?.toLowerCase?.() || ''}-${t.realmSlug?.toLowerCase?.() || ''}`, t])
        : []
    )
    
    // Build one list of players (rank <= 5) with per-type achievement counts
    const players = sortedRoster
      .filter((m) => (m?.rank ?? 99) <= 5)
      .map((m) => {
        const key = `${(m?.character?.name ?? '').toLowerCase()}-${(m?.character?.realm?.slug ?? '').toLowerCase()}`
        const memberData = byNameAndRealm.get(key)
        return {
          id: m.character?.id,
          name: m.character?.name,
          realm: {
            name: { en_US: m.character?.realm?.name || m.character?.realm?.slug || 'Unknown' },
            slug: m.character?.realm?.slug || 'unknown'
          },
          rank: m.rank,
          characterClass: memberData?.characterClass ?? m.character?.playable_class?.name ?? null,
          rank1: memberData?.rank1 ?? 0,
          rank1solo: memberData?.rank1solo ?? 0,
          gladiator: memberData?.gladiator ?? 0,
          legend: memberData?.legend ?? 0,
          strategist: memberData?.strategist ?? 0,
          blitzRank1: memberData?.blitzRank1 ?? 0
        }
      })

    // Stats: count of players with at least one of each type (for summary cards)
    const achievementData = {
      generatedAt: new Date().toISOString(),
      stats: {
        gladiatorCount: players.filter((p) => p.gladiator > 0).length,
        rank1Count: players.filter((p) => p.rank1 > 0).length,
        legendCount: players.filter((p) => p.legend > 0).length,
        strategistCount: players.filter((p) => p.strategist > 0).length,
        blitzRank1Count: players.filter((p) => p.blitzRank1 > 0).length,
        soloRank1Count: players.filter((p) => p.rank1solo > 0).length
      },
      players
    }
    
    // Ensure the generated directory exists
    const generatedDir = join(__dirname, '..', 'src', 'data', 'generated')
    if (!existsSync(generatedDir)) {
      await mkdir(generatedDir, { recursive: true })
    }
    
    // Write achievement data
    const achievementDataPath = join(generatedDir, 'achievements-data.json')
    await writeFile(achievementDataPath, JSON.stringify(achievementData, null, 2))

    const statsData = {
      generatedAt: new Date().toISOString(),
      stats: achievementData.stats
    }
    const statsDataPath = join(generatedDir, 'main-page-stats.json')
    await writeFile(statsDataPath, JSON.stringify(statsData, null, 2))

    console.log('✅ Achievements data saved')
    
  } catch (error) {
    console.error('❌ Error generating achievement data:', error)
    process.exit(1)
  }
}

// Run the generation
generateAchievementData()
