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
    console.log(`Fetching profile for ${name} on ${realm}...`)
    
    const data = await bnetGet(token, `/profile/wow/character/${realm}/${name.toLowerCase()}`, {
      namespace: `profile-${REGION}`,
      locale: 'en_US',
    })

    if (!data || !data.id) {
      console.log(`  ❌ No profile data for ${name} on ${realm}`)
      return null
    }

    // Debug: Log all available fields in character profile
    console.log(`  ✅ Profile found: ${name} (ID: ${data.id})`)
    console.log(`  🔍 Available profile fields:`, Object.keys(data))
    
    // Check for account-related fields
    if (data.account) {
      console.log(`  💳 Account info found:`, Object.keys(data.account))
    }
    if (data.battlenet_account) {
      console.log(`  🌐 Battle.net account info found:`, Object.keys(data.account))
    }
    
    return data
  } catch (error) {
    console.log(`  ❌ Error fetching profile for ${name} on ${realm}: ${error.message}`)
    return null
  }
}

async function getCharacterAccountInfo(token, realm, name) {
  try {
    console.log(`Fetching account info for ${name} on ${realm}...`)
    
    // Try different endpoints that might give account information
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
        
        if (data && Object.keys(data).length > 0) {
          console.log(`  ✅ Account info found via ${endpoint}:`, Object.keys(data))
          return data
        }
      } catch (endpointError) {
        console.log(`  ⚠️  Endpoint ${endpoint} failed:`, endpointError.message)
      }
    }
    
    console.log(`  ❌ No account info found for ${name}`)
    return null
  } catch (error) {
    console.log(`  ❌ Error fetching account info for ${name}: ${error.message}`)
    return null
  }
}

async function getCharacterAchievementIds(token, realm, name) {
  try {
    console.log(`Fetching achievements for ${name} on ${realm}...`)
    
    const data = await bnetGet(token, `/profile/wow/character/${realm}/${name.toLowerCase()}/achievements`, {
      namespace: `profile-${REGION}`,
      locale: 'en_US',
    })

    if (!data || !data.achievements) {
      console.log(`  ❌ No achievements data for ${name} on ${realm}`)
      return { earnedIds: new Set(), totalPoints: 0 }
    }

    // The API returns achievements in a different structure than expected
    // Let's check what we actually got
    console.log(`  📊 Response structure for ${name}:`)
    console.log(`    - Has achievements: ${!!data.achievements}`)
    console.log(`    - Total points: ${data.total_points || 'N/A'}`)
    
    let earnedIds = new Set()
    const totalPoints = data.total_points || 0
    
    if (data.achievements && Array.isArray(data.achievements)) {
      // Direct array of achievements
      earnedIds = new Set(data.achievements.map((a) => a?.id).filter((x) => typeof x === 'number'))
      console.log(`  ✅ Found ${earnedIds.size} achievements (direct array)`)
    } else if (data.achievements && data.achievements.achievements && Array.isArray(data.achievements.achievements)) {
      // Nested structure: data.achievements.achievements
      earnedIds = new Set(data.achievements.achievements.map((a) => a?.id).filter((x) => typeof x === 'number'))
      console.log(`  ✅ Found ${earnedIds.size} achievements (nested structure)`)
    } else if (data.achievements && data.achievements.categories) {
      // Categories structure - achievements are spread across categories
      const allAchievements = []
      data.achievements.categories.forEach(category => {
        if (category.achievements && Array.isArray(category.achievements)) {
          allAchievements.push(...category.achievements)
        }
      })
      earnedIds = new Set(allAchievements.map((a) => a?.id).filter((x) => typeof x === 'number'))
      console.log(`  ✅ Found ${earnedIds.size} achievements (categories structure)`)
    } else {
      console.log(`  ❌ Unknown achievements structure for ${name}`)
      console.log(`    Available keys: ${Object.keys(data.achievements || {}).join(', ')}`)
      return { earnedIds: new Set(), totalPoints: 0 }
    }

    console.log(`  📈 ${name} on ${realm}: Found ${earnedIds.size} achievements, ${totalPoints} points`)

    // Log if they have any of our PvP achievements
    const hasGlad = GLADIATOR_IDS.some(id => earnedIds.has(id))
    const hasLegend = LEGEND_IDS.some(id => earnedIds.has(id))
    const hasRank1 = RANK1_IDS.some(id => earnedIds.has(id))
    const hasStrategist = STRATEGIST_IDS.some(id => earnedIds.has(id))
    const hasRank1Blitz = RANK1_BLITZ_IDS.some(id => earnedIds.has(id))
    const hasRank1Solo = RANK1_SOLO_IDS.some(id => earnedIds.has(id))

    if (hasGlad || hasLegend || hasRank1 || hasStrategist || hasRank1Blitz || hasRank1Solo) {
      console.log(`  🎯 ${name} has PvP achievements!`)
      if (hasGlad) {
        const gladIds = GLADIATOR_IDS.filter(id => earnedIds.has(id))
        console.log(`    🏆 Gladiator: ${gladIds.join(', ')}`)
      }
      if (hasLegend) {
        const legendIds = LEGEND_IDS.filter(id => earnedIds.has(id))
        console.log(`    👑 Legend: ${legendIds.join(', ')}`)
      }
      if (hasRank1) {
        const rank1Ids = RANK1_IDS.filter(id => earnedIds.has(id))
        console.log(`    🥇 Rank 1: ${rank1Ids.join(', ')}`)
      }
      if (hasStrategist) {
        const strategistIds = STRATEGIST_IDS.filter(id => earnedIds.has(id))
        console.log(`    🎯 Strategist: ${strategistIds.join(', ')}`)
      }
      if (hasRank1Blitz) {
        const blitzIds = RANK1_BLITZ_IDS.filter(id => earnedIds.has(id))
        console.log(`    ⚡ Blitz Rank 1: ${blitzIds.join(', ')}`)
      }
      if (hasRank1Solo) {
        const soloIds = RANK1_SOLO_IDS.filter(id => earnedIds.has(id))
        console.log(`    🏆 Solo Rank 1: ${soloIds.join(', ')}`)
      }
    } else {
      console.log(`  ❌ ${name} has no PvP achievements from our list`)
    }

    return { earnedIds, totalPoints }
  } catch (error) {
    console.log(`  ❌ Error fetching achievements for ${name} on ${realm}: ${error.message}`)
    return { earnedIds: new Set(), totalPoints: 0 }
  }
}

async function main() {
  const token = await getToken()
  console.log('🚀 Fetching guild roster and checking PvP achievements by character ID...')
  console.log(`📍 Guild: ${GUILD_NAME} on ${REALM} (${REGION})`)

  const roster = await bnetGet(token, GUILD_PATH, { namespace: `profile-${REGION}`, locale: 'en_US' })
  const members = Array.isArray(roster?.members) ? roster.members : []

  // Debug: Log the structure of the first member to see available fields
  if (members.length > 0) {
    console.log('\n🔍 Debug: First guild member structure:')
    console.log(JSON.stringify(members[0], null, 2))
  }

  console.log(`\n📋 Using ${GLADIATOR_IDS.length} Gladiator, ${LEGEND_IDS.length} Legend, ${RANK1_IDS.length} Rank 1, ${STRATEGIST_IDS.length} Strategist, ${RANK1_BLITZ_IDS.length} Blitz Rank 1, and ${RANK1_SOLO_IDS.length} Solo Rank 1 achievement IDs`)
  console.log(`🏆 Gladiator IDs: ${GLADIATOR_IDS.join(', ')}`)
  console.log(`👑 Legend IDs: ${LEGEND_IDS.join(', ')}`)
  console.log(`🥇 Rank 1 IDs: ${RANK1_IDS.join(', ')}`)
  console.log(`🎯 Strategist IDs: ${STRATEGIST_IDS.join(', ')}`)
  console.log(`⚡ Blitz Rank 1 IDs: ${RANK1_BLITZ_IDS.join(', ')}`)
  console.log(`🏆 Solo Rank 1 IDs: ${RANK1_SOLO_IDS.join(', ')}`)
  console.log(`\n👥 Processing ${members.length} guild members...`)

  const characterResults = []
  const MAX_CONCURRENCY = 5 // Reduced to avoid rate limits
  let i = 0
  
  async function worker() {
    while (true) {
      const idx = i++
      if (idx >= members.length) break
      
      const m = members[idx]
      const name = m?.character?.name
      const realmSlug = m?.character?.realm?.slug || REALM
      
      if (!name) continue

      // Debug: Log all available fields for this member
      if (idx === 0) {
        console.log('\n🔍 Debug: Available fields in guild member:')
        console.log('Member object keys:', Object.keys(m))
        console.log('Character object keys:', Object.keys(m?.character || {}))
        if (m?.character?.realm) {
          console.log('Realm object keys:', Object.keys(m.character.realm))
        }
      }

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
      
      characterResults.push({
        name,
        realmSlug,
        realmName: m?.character?.realm?.name?.en_US || m?.character?.realm?.name?.en_GB || realmSlug,
        rank: m?.rank ?? null,
        hasGladiatorEver,
        hasLegendEver,
        hasRank1Ever,
        hasStrategistEver,
        hasRank1BlitzEver,
        hasRank1SoloEver,
        totalAchievements: earnedIds.size,
        totalPoints,
        characterId: profile?.id || null,
      })

      // Add a small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  await Promise.all(Array.from({ length: MAX_CONCURRENCY }, () => worker()))

  // Group characters by character ID to handle duplicates
  const characterIdGroups = new Map()
  
  characterResults.forEach(char => {
    const characterId = char.characterId
    if (!characterIdGroups.has(characterId)) {
      characterIdGroups.set(characterId, [])
    }
    characterIdGroups.get(characterId).push(char)
  })

  // Count achievements found (by unique character)
  const uniqueCharacterIds = new Set(characterResults.map(r => r.characterId))
  const totalGladiators = characterResults.filter(r => r.hasGladiatorEver).length
  const totalLegends = characterResults.filter(r => r.hasLegendEver).length
  const totalRank1s = characterResults.filter(r => r.hasRank1Ever).length
  const totalStrategists = characterResults.filter(r => r.hasStrategistEver).length
  const totalRank1Blitz = characterResults.filter(r => r.hasRank1BlitzEver).length
  const totalRank1Solo = characterResults.filter(r => r.hasRank1SoloEver).length

  console.log(`\n📊 Final Results:`)
  console.log(`Total characters processed: ${characterResults.length}`)
  console.log(`Unique character IDs: ${uniqueCharacterIds.size}`)
  console.log(`Characters with Gladiator: ${totalGladiators}`)
  console.log(`Characters with Legend: ${totalLegends}`)
  console.log(`Characters with Rank 1: ${totalRank1s}`)
  console.log(`Characters with Strategist: ${totalStrategists}`)
  console.log(`Characters with Blitz Rank 1: ${totalRank1Blitz}`)
  console.log(`Characters with Solo Rank 1: ${totalRank1Solo}`)

  // Show characters with achievements
  if (totalGladiators > 0 || totalLegends > 0 || totalRank1s > 0 || totalStrategists > 0 || totalRank1Blitz > 0 || totalRank1Solo > 0) {
    console.log(`\n🏆 Characters with PvP Achievements:`)
    characterResults.forEach(character => {
      const achievements = []
      if (character.hasGladiatorEver) achievements.push('Gladiator')
      if (character.hasLegendEver) achievements.push('Legend')
      if (character.hasRank1Ever) achievements.push('Rank 1')
      if (character.hasStrategistEver) achievements.push('Strategist')
      if (character.hasRank1BlitzEver) achievements.push('Blitz Rank 1')
      if (character.hasRank1SoloEver) achievements.push('Solo Rank 1')
      
      console.log(`  Character: ${character.name} (${character.realmSlug})`)
      console.log(`    Character ID: ${character.characterId}`)
      console.log(`    Achievements: ${achievements.join(', ')}`)
      console.log(`    Total points: ${character.totalPoints}`)
    })
  }

  await fs.mkdir('src/data/generated', { recursive: true })
  
  // Save character-level data
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
  
  console.log(`\n✅ Generated PvP titles for ${characterResults.length} characters.`)
  console.log(`📁 Output saved to: src/data/generated/pvp-titles.json`)
}

main().catch((err) => {
  console.error('❌ Script failed:', err)
  process.exit(1)
})


