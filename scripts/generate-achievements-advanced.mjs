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
    console.log('🔍 Fetching guild roster from Blizzard API...')
    
    const res = await blizzardGet('eu', '/data/wow/guild/ravencrest/cbitahok-kpobi/roster', {
      namespace: 'profile-eu',
      locale: 'en_US',
    })
    
    const data = await res.json()
    const rosterMembers = Array.isArray(data?.members) ? data.members : []
    
    console.log(`✅ Fetched ${rosterMembers.length} guild members`)
    return rosterMembers
  } catch (error) {
    console.error('❌ Error fetching guild roster:', error.message)
    console.log('⚠️  Using empty roster for build')
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
    console.log('🚀 Starting advanced achievement data generation...')
    
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
    
    // Process all the filtering logic that was previously done at runtime
    const gladiatorMembers = sortedRoster.filter((m) => {
      const memberData = byNameAndRealm.get(`${(m?.character?.name ?? '').toLowerCase()}-${(m?.character?.realm?.slug ?? '').toLowerCase()}`)
      return memberData && memberData.hasGladiatorEver && m.rank <= 5
    })
    
    const rank1Members = sortedRoster.filter((m) => {
      const memberData = byNameAndRealm.get(`${(m?.character?.name ?? '').toLowerCase()}-${(m?.character?.realm?.slug ?? '').toLowerCase()}`)
      return memberData && memberData.hasRank1Ever && m.rank <= 5
    })
    
    const legendMembers = sortedRoster.filter((m) => {
      const memberData = byNameAndRealm.get(`${(m?.character?.name ?? '').toLowerCase()}-${(m?.character?.realm?.slug ?? '').toLowerCase()}`)
      return memberData && memberData.hasLegendEver && m.rank <= 5
    })
    
    const strategistMembers = sortedRoster.filter((m) => {
      const memberData = byNameAndRealm.get(`${(m?.character?.name ?? '').toLowerCase()}-${(m?.character?.realm?.slug ?? '').toLowerCase()}`)
      return memberData && memberData.hasStrategistEver && m.rank <= 5
    })
    
    const blitzRank1Members = sortedRoster.filter((m) => {
      const memberData = byNameAndRealm.get(`${(m?.character?.name ?? '').toLowerCase()}-${(m?.character?.realm?.slug ?? '').toLowerCase()}`)
      return memberData && memberData.hasRank1BlitzEver && m.rank <= 5
    })
    
    const soloRank1Members = sortedRoster.filter((m) => {
      const memberData = byNameAndRealm.get(`${(m?.character?.name ?? '').toLowerCase()}-${(m?.character?.realm?.slug ?? '').toLowerCase()}`)
      return memberData && memberData.hasRank1SoloEver && m.rank <= 5
    })
    
    // Create the achievement data structure
    const achievementData = {
      generatedAt: new Date().toISOString(),
      stats: {
        gladiatorCount: gladiatorMembers.length,
        rank1Count: rank1Members.length,
        legendCount: legendMembers.length,
        strategistCount: strategistMembers.length,
        blitzRank1Count: blitzRank1Members.length,
        soloRank1Count: soloRank1Members.length
      },
      members: {
        gladiatorMembers: gladiatorMembers.map(m => ({
          id: m.character?.id,
          name: m.character?.name,
          realm: {
            name: { en_US: m.character?.realm?.name || m.character?.realm?.slug || 'Unknown' },
            slug: m.character?.realm?.slug || 'unknown'
          },
          rank: m.rank
        })),
        rank1Members: rank1Members.map(m => ({
          id: m.character?.id,
          name: m.character?.name,
          realm: {
            name: { en_US: m.character?.realm?.name || m.character?.realm?.slug || 'Unknown' },
            slug: m.character?.realm?.slug || 'unknown'
          },
          rank: m.rank
        })),
        legendMembers: legendMembers.map(m => ({
          id: m.character?.id,
          name: m.character?.name,
          realm: {
            name: { en_US: m.character?.realm?.name || m.character?.realm?.slug || 'Unknown' },
            slug: m.character?.realm?.slug || 'unknown'
          },
          rank: m.rank
        })),
        strategistMembers: strategistMembers.map(m => ({
          id: m.character?.id,
          name: m.character?.name,
          realm: {
            name: { en_US: m.character?.realm?.name || m.character?.realm?.slug || 'Unknown' },
            slug: m.character?.realm?.slug || 'unknown'
          },
          rank: m.rank
        })),
        blitzRank1Members: blitzRank1Members.map(m => ({
          id: m.character?.id,
          name: m.character?.name,
          realm: {
            name: { en_US: m.character?.realm?.name || m.character?.realm?.slug || 'Unknown' },
            slug: m.character?.realm?.slug || 'unknown'
          },
          rank: m.rank
        })),
        soloRank1Members: soloRank1Members.map(m => ({
          id: m.character?.id,
          name: m.character?.name,
          realm: {
            name: { en_US: m.character?.realm?.name || m.character?.realm?.slug || 'Unknown' },
            slug: m.character?.realm?.slug || 'unknown'
          },
          rank: m.rank
        }))
      }
    }
    
    // Ensure the generated directory exists
    const generatedDir = join(__dirname, '..', 'src', 'data', 'generated')
    if (!existsSync(generatedDir)) {
      await mkdir(generatedDir, { recursive: true })
    }
    
    // Write achievement data
    const achievementDataPath = join(generatedDir, 'achievements-data.json')
    await writeFile(achievementDataPath, JSON.stringify(achievementData, null, 2))
    
    console.log('✅ Achievement data generated successfully!')
    console.log(`📁 Saved to: ${achievementDataPath}`)
    console.log('📊 Stats:')
    console.log(`   - Gladiators: ${achievementData.stats.gladiatorCount}`)
    console.log(`   - Rank 1: ${achievementData.stats.rank1Count}`)
    console.log(`   - Legends: ${achievementData.stats.legendCount}`)
    console.log(`   - Strategists: ${achievementData.stats.strategistCount}`)
    console.log(`   - Blitz Rank 1: ${achievementData.stats.blitzRank1Count}`)
    console.log(`   - Solo Rank 1: ${achievementData.stats.soloRank1Count}`)
    
    // Also generate a simple stats file for the main page
    const statsData = {
      generatedAt: new Date().toISOString(),
      stats: achievementData.stats
    }
    
    const statsDataPath = join(generatedDir, 'main-page-stats.json')
    await writeFile(statsDataPath, JSON.stringify(statsData, null, 2))
    
    console.log(`📊 Main page stats saved to: ${statsDataPath}`)
    
  } catch (error) {
    console.error('❌ Error generating achievement data:', error)
    process.exit(1)
  }
}

// Run the generation
generateAchievementData()
