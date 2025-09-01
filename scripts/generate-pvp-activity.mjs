import { config } from 'dotenv'
import { promises as fs } from 'node:fs'
import path from 'node:path'

// Load environment variables
config({ path: '.env.local' })
if (!process.env.BLIZZARD_CLIENT_ID) {
  config({ path: '.env' })
}

const REGION = process.env.BLIZZARD_REGION || 'eu'
const REALM = process.env.BLIZZARD_REALM || 'ravencrest'
const GUILD_NAME = process.env.BLIZZARD_GUILD || 'cbitahok-kpobi'

// PvP bracket identifiers for Blizzard API
const PVP_BRACKETS = {
  '2v2': '2v2',
  '3v3': '3v3', 
  'rbg': 'rbg'
  // Note: Solo Shuffle brackets are specialization-specific and discovered dynamically
}

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

async function blizzardGet(path, searchParams = {}) {
  if (!path.startsWith('/')) path = '/' + path
  const token = await getToken()
  const url = new URL(`https://${REGION}.api.blizzard.com${path}`)
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === 'string' && v.length > 0) url.searchParams.set(k, v)
  }
  
  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  })
  
  return response
}

async function fetchCharacterProfile(realmSlug, characterName) {
  try {
    const profileRes = await blizzardGet(
      `/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}`,
      { namespace: `profile-${REGION}`, locale: 'en_US' }
    )

    if (profileRes.ok) {
      const profileData = await profileRes.json()
      console.log(`      ✅ Profile data fields for ${characterName}:`, Object.keys(profileData))
      
      // Log PvP summary data for investigation
      if (characterName.toLowerCase() === 'shchoor') {
        console.log(`      🔍 PvP Summary data for ${characterName}:`, profileData.pvp_summary)
        console.log(`      📊 Statistics data for ${characterName}:`, profileData.statistics)
        
        // Fetch the actual PvP summary data
        if (profileData.pvp_summary?.href) {
          try {
            const pvpSummaryRes = await fetch(profileData.pvp_summary.href, {
              headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (pvpSummaryRes.ok) {
              const pvpSummaryData = await pvpSummaryRes.json()
              console.log(`      🎯 PvP Summary actual data:`, JSON.stringify(pvpSummaryData, null, 2))
            }
          } catch (error) {
            console.log(`      ❌ Error fetching PvP summary:`, error.message)
          }
        }
        
        // Fetch the actual statistics data
        if (profileData.statistics?.href) {
          try {
            const statsRes = await fetch(profileData.statistics.href, {
              headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (statsRes.ok) {
              const statsData = await statsRes.json()
              console.log(`      📈 Statistics actual data:`, JSON.stringify(statsData, null, 2))
            }
          } catch (error) {
            console.log(`      ❌ Error fetching statistics:`, error.message)
          }
        }
      }
      
      return {
        lastLoginTimestamp: profileData.last_login_timestamp || null,
        level: profileData.level || null,
        characterClass: profileData.character_class?.name || null,
        race: profileData.race?.name || null,
        guild: profileData.guild?.name || null,
        activeSpec: profileData.active_spec?.name || null,
        pvpSummary: profileData.pvp_summary || null,
        statistics: profileData.statistics || null
      }
    } else {
      console.log(`      ⚠️ No profile data for ${characterName} (${profileRes.status})`)
      return null
    }
  } catch (error) {
    console.log(`      ❌ Error fetching profile for ${characterName}:`, error.message)
    return null
  }
}

async function fetchCharacterPvPData(realmSlug, characterName) {
  try {
    console.log(`    📊 Fetching PvP data for ${characterName}...`)
    
    const characterData = {
      characterName,
      realmSlug,
      lastUpdated: new Date().toISOString(),
      profile: null,
      brackets: {},
      totalStats: {
        totalWins: 0,
        totalLosses: 0,
        totalGames: 0,
        winRate: 0,
        highestRating: 0,
        highestBracket: ''
      }
    }

    // Fetch character profile data first
    const profileData = await fetchCharacterProfile(realmSlug, characterName)
    if (profileData) {
      characterData.profile = profileData
    }

    // Small delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 100))

    // First, fetch PvP summary to discover available brackets (including Solo Shuffle)
    const pvpSummaryRes = await blizzardGet(
      `/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/pvp-summary`,
      { namespace: `profile-${REGION}`, locale: 'en_US' }
    )

    let availableBrackets = { ...PVP_BRACKETS }
    
    if (pvpSummaryRes.ok) {
      const pvpSummaryData = await pvpSummaryRes.json()
      
      // Discover Solo Shuffle and Solo Blitz brackets from the summary
      if (pvpSummaryData.brackets) {
        pvpSummaryData.brackets.forEach(bracket => {
          const bracketId = bracket.href.split('/').pop().split('?')[0] // Extract bracket ID from URL
          if (bracketId.startsWith('shuffle-') || bracketId.startsWith('blitz-')) {
            availableBrackets[bracketId] = bracketId
          }
        })
      }
    }

    // Fetch bracket-specific data
    for (const [bracketKey, bracketId] of Object.entries(availableBrackets)) {
      try {
        const bracketRes = await blizzardGet(
          `/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/pvp-bracket/${bracketId}`,
          { namespace: `profile-${REGION}`, locale: 'en_US' }
        )

        if (bracketRes.ok) {
          const bracketData = await bracketRes.json()
          
          // Log all available fields to see what timestamp data exists
          if (characterName.toLowerCase() === 'shchoor') {
            console.log(`      🔍 All fields in ${bracketKey} data for ${characterName}:`, Object.keys(bracketData))
            console.log(`      📅 Full ${bracketKey} data:`, JSON.stringify(bracketData, null, 2))
          }
          
          const stats = {
            rating: bracketData.rating || 0,
            seasonWins: bracketData.season_match_statistics?.won || 0,
            seasonLosses: bracketData.season_match_statistics?.lost || 0,
            weeklyWins: bracketData.weekly_match_statistics?.won || 0,
            weeklyLosses: bracketData.weekly_match_statistics?.lost || 0,
            // Add round statistics for Solo Shuffle
            seasonRoundWins: bracketData.season_round_statistics?.won || 0,
            seasonRoundLosses: bracketData.season_round_statistics?.lost || 0,
            weeklyRoundWins: bracketData.weekly_round_statistics?.won || 0,
            weeklyRoundLosses: bracketData.weekly_round_statistics?.lost || 0,
            tier: bracketData.tier,
            specialization: bracketData.specialization,
            // Include season information
            season: bracketData.season?.id || null,
            // Include any timestamp fields if they exist
            lastUpdated: bracketData.last_updated || null,
            seasonStart: bracketData.season_start || null,
            seasonEnd: bracketData.season_end || null
          }

          // Handle Solo Shuffle and Solo Blitz brackets (specialization-specific)
          if (bracketKey.startsWith('shuffle-')) {
            if (!characterData.brackets.soloShuffle) {
              characterData.brackets.soloShuffle = []
            }
            characterData.brackets.soloShuffle.push(stats)
          } else if (bracketKey.startsWith('blitz-')) {
            if (!characterData.brackets.soloBlitz) {
              characterData.brackets.soloBlitz = []
            }
            characterData.brackets.soloBlitz.push(stats)
          } else {
            // Regular brackets
            const bracketName = bracketKey === '2v2' ? 'arena2v2' : 
                              bracketKey === '3v3' ? 'arena3v3' : 'rbg'
            characterData.brackets[bracketName] = stats
          }

          // Update totals and highest rating
          characterData.totalStats.totalWins += stats.seasonWins
          characterData.totalStats.totalLosses += stats.seasonLosses
          
          if (stats.rating > characterData.totalStats.highestRating) {
            characterData.totalStats.highestRating = stats.rating
            characterData.totalStats.highestBracket = bracketKey
          }
        } else {
          console.log(`      ⚠️ No ${bracketKey} data for ${characterName} (${bracketRes.status})`)
        }
      } catch (error) {
        console.log(`      ❌ Error fetching ${bracketKey} data for ${characterName}:`, error.message)
      }
    }

    // Calculate total stats
    characterData.totalStats.totalGames = characterData.totalStats.totalWins + characterData.totalStats.totalLosses
    characterData.totalStats.winRate = characterData.totalStats.totalGames > 0 
      ? (characterData.totalStats.totalWins / characterData.totalStats.totalGames) * 100 
      : 0

    return characterData.totalStats.totalGames > 0 ? characterData : null

  } catch (error) {
    console.log(`    ❌ Error fetching PvP data for ${characterName}:`, error.message)
    return null
  }
}

async function loadGuildMembers() {
  try {
    // Load existing PvP titles data which contains guild members
    const pvpTitlesPath = path.join(process.cwd(), 'src/data/generated/pvp-titles.json')
    const pvpTitlesData = JSON.parse(await fs.readFile(pvpTitlesPath, 'utf-8'))
    
    // Include all guild members from all servers
    const guildMembers = pvpTitlesData.items
    
    console.log(`📋 Found ${pvpTitlesData.rosterCount} total guild members`)
    console.log(`🎯 Found ${guildMembers.length} guild members to process (all servers)`)
    
    return {
      members: guildMembers,
      totalCount: pvpTitlesData.rosterCount
    }
  } catch (error) {
    console.error('❌ Error loading guild members from PvP titles data:', error.message)
    throw error
  }
}

async function main() {
  console.log('🚀 Starting PvP activity data generation...')
  console.log(`🌍 Region: ${REGION}`)
  console.log(`🏰 Realm: ${REALM}`)
  console.log(`⚔️ Guild: ${GUILD_NAME}`)
  
  try {
    // Load guild members from existing data
    const { members: guildMembers, totalCount } = await loadGuildMembers()
    
    // Process all guild members with season filtering
    const membersToProcess = guildMembers
    
    console.log(`🔥 Processing all ${membersToProcess.length} guild members`)
    
    // Process members in batches to respect rate limits
    const batchSize = 5
    const pvpDataResults = []
    
    for (let i = 0; i < membersToProcess.length; i += batchSize) {
      const batch = membersToProcess.slice(i, i + batchSize)
      console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(membersToProcess.length / batchSize)}`)
      
      const batchPromises = batch.map(member => 
        fetchCharacterPvPData(member.realmSlug, member.name)
      )
      
      const batchResults = await Promise.all(batchPromises)
      pvpDataResults.push(...batchResults)
      
      // Delay between batches
      if (i + batchSize < membersToProcess.length) {
        console.log('    ⏳ Waiting 2 seconds before next batch...')
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
    
    // Filter out null results (characters with no PvP activity)
    const pvpMembers = pvpDataResults.filter(data => data !== null)
    
    // Filter based on current season (40) - exclude players from previous seasons
    const CURRENT_SEASON = 40
    const activePvPMembers = pvpMembers.filter(member => {
      // Check if the character has any PvP data from the current season
      let hasCurrentSeasonData = false
      
      // Check 2v2 data
      if (member.brackets.arena2v2 && member.brackets.arena2v2.season === CURRENT_SEASON) {
        hasCurrentSeasonData = true
      }
      
      // Check 3v3 data
      if (member.brackets.arena3v3 && member.brackets.arena3v3.season === CURRENT_SEASON) {
        hasCurrentSeasonData = true
      }
      
      // Check RBG data
      if (member.brackets.rbg && member.brackets.rbg.season === CURRENT_SEASON) {
        hasCurrentSeasonData = true
      }
      
      // Check Solo Shuffle data
      if (member.brackets.soloShuffle && Array.isArray(member.brackets.soloShuffle)) {
        member.brackets.soloShuffle.forEach(spec => {
          if (spec.season === CURRENT_SEASON) {
            hasCurrentSeasonData = true
          }
        })
      }
      
      // Check Solo Blitz data (Solo Blitz doesn't have season info, so include if has any data)
      if (member.brackets.soloBlitz && Array.isArray(member.brackets.soloBlitz)) {
        member.brackets.soloBlitz.forEach(spec => {
          if (spec.season === CURRENT_SEASON || (spec.seasonWins > 0 || spec.seasonLosses > 0)) {
            hasCurrentSeasonData = true
          }
        })
      }
      
      if (!hasCurrentSeasonData) {
        console.log(`      🚫 Filtering out ${member.characterName} (no current season ${CURRENT_SEASON} data)`)
        // Debug: show what season data we have
        if (member.brackets.arena2v2) console.log(`        - 2v2 season: ${member.brackets.arena2v2.season}`)
        if (member.brackets.arena3v3) console.log(`        - 3v3 season: ${member.brackets.arena3v3.season}`)
        if (member.brackets.rbg) console.log(`        - RBG season: ${member.brackets.rbg.season}`)
      } else {
        console.log(`      ✅ Including ${member.characterName} (has current season ${CURRENT_SEASON} data)`)
      }
      
      return hasCurrentSeasonData
    })
    
    const filteredOutMembers = pvpMembers.length - activePvPMembers.length
    
    // Filter individual bracket data to only include Season 40 data
    const seasonFilteredMembers = activePvPMembers.map(member => {
      const filteredMember = { ...member }
      
      // Filter 2v2 data
      if (filteredMember.brackets.arena2v2 && filteredMember.brackets.arena2v2.season !== CURRENT_SEASON) {
        delete filteredMember.brackets.arena2v2
      }
      
      // Filter 3v3 data
      if (filteredMember.brackets.arena3v3 && filteredMember.brackets.arena3v3.season !== CURRENT_SEASON) {
        delete filteredMember.brackets.arena3v3
      }
      
      // Filter RBG data
      if (filteredMember.brackets.rbg && filteredMember.brackets.rbg.season !== CURRENT_SEASON) {
        delete filteredMember.brackets.rbg
      }
      
      // Filter Solo Shuffle data
      if (filteredMember.brackets.soloShuffle && Array.isArray(filteredMember.brackets.soloShuffle)) {
        filteredMember.brackets.soloShuffle = filteredMember.brackets.soloShuffle.filter(spec => spec.season === CURRENT_SEASON)
      }
      
      // Filter Solo Blitz data (keep only Season 40 data)
      if (filteredMember.brackets.soloBlitz && Array.isArray(filteredMember.brackets.soloBlitz)) {
        filteredMember.brackets.soloBlitz = filteredMember.brackets.soloBlitz.filter(spec => spec.season === CURRENT_SEASON)
      }
      
      // Recalculate totalStats based on filtered Season 40 data only
      filteredMember.totalStats = {
        totalWins: 0,
        totalLosses: 0,
        totalGames: 0,
        winRate: 0,
        highestRating: 0,
        highestBracket: ''
      }
      
      // Calculate totals from all remaining bracket data
      const allBracketData = [
        filteredMember.brackets.arena2v2,
        filteredMember.brackets.arena3v3,
        filteredMember.brackets.rbg,
        ...(filteredMember.brackets.soloShuffle || []),
        ...(filteredMember.brackets.soloBlitz || [])
      ].filter(Boolean)
      
      allBracketData.forEach(bracketData => {
        filteredMember.totalStats.totalWins += bracketData.seasonWins || 0
        filteredMember.totalStats.totalLosses += bracketData.seasonLosses || 0
        
        if (bracketData.rating > filteredMember.totalStats.highestRating) {
          filteredMember.totalStats.highestRating = bracketData.rating
          // Find the bracket name for this data
          if (filteredMember.brackets.arena2v2 === bracketData) {
            filteredMember.totalStats.highestBracket = '2v2'
          } else if (filteredMember.brackets.arena3v3 === bracketData) {
            filteredMember.totalStats.highestBracket = '3v3'
          } else if (filteredMember.brackets.rbg === bracketData) {
            filteredMember.totalStats.highestBracket = 'rbg'
          } else if (filteredMember.brackets.soloShuffle?.includes(bracketData)) {
            filteredMember.totalStats.highestBracket = `shuffle-${bracketData.specialization?.name?.toLowerCase() || 'unknown'}`
          } else if (filteredMember.brackets.soloBlitz?.includes(bracketData)) {
            filteredMember.totalStats.highestBracket = `blitz-${bracketData.specialization?.name?.toLowerCase() || 'unknown'}`
          }
        }
      })
      
      filteredMember.totalStats.totalGames = filteredMember.totalStats.totalWins + filteredMember.totalStats.totalLosses
      filteredMember.totalStats.winRate = filteredMember.totalStats.totalGames > 0 
        ? (filteredMember.totalStats.totalWins / filteredMember.totalStats.totalGames) * 100 
        : 0
      
      return filteredMember
    })
    
    console.log(`\n✅ Successfully processed ${pvpMembers.length} members with PvP activity`)
    console.log(`🔍 Filtered out ${filteredOutMembers} members (no current season ${CURRENT_SEASON} data)`)
    console.log(`🎯 Final active members: ${seasonFilteredMembers.length}`)
    console.log(`🔧 Filtered bracket data to Season ${CURRENT_SEASON} only`)
    
    // Calculate guild-wide statistics
    const guildStats = {
      totalGames: seasonFilteredMembers.reduce((sum, member) => sum + member.totalStats.totalGames, 0),
      totalWins: seasonFilteredMembers.reduce((sum, member) => sum + member.totalStats.totalWins, 0),
      totalLosses: seasonFilteredMembers.reduce((sum, member) => sum + member.totalStats.totalLosses, 0),
      averageRating: seasonFilteredMembers.length > 0 
        ? Math.round(seasonFilteredMembers.reduce((sum, member) => sum + member.totalStats.highestRating, 0) / seasonFilteredMembers.length)
        : 0,
      highestRatedMember: seasonFilteredMembers.length > 0
        ? seasonFilteredMembers.reduce((highest, current) => 
            current.totalStats.highestRating > highest.totalStats.highestRating ? current : highest
          )
        : null
    }
    
    // Generate final data structure
    const pvpActivityData = {
      generatedAt: new Date().toISOString(),
      guildName: GUILD_NAME,
      realmSlug: REALM,
      region: REGION,
      memberCount: totalCount,
      processedMembers: membersToProcess.length,
      totalPvPMembers: pvpMembers.length,
      activePvPMembers: seasonFilteredMembers.length,
      filteredOutMembers: filteredOutMembers,
      currentSeason: CURRENT_SEASON,
      guildStats: {
        ...guildStats,
        highestRatedMember: guildStats.highestRatedMember ? {
          name: guildStats.highestRatedMember.characterName,
          rating: guildStats.highestRatedMember.totalStats.highestRating,
          bracket: guildStats.highestRatedMember.totalStats.highestBracket
        } : {
          name: '',
          rating: 0,
          bracket: ''
        }
      },
      members: seasonFilteredMembers.sort((a, b) => b.totalStats.highestRating - a.totalStats.highestRating)
    }
    
    // Write to file
    const outputPath = 'src/data/generated/pvp-activity.json'
    await fs.writeFile(outputPath, JSON.stringify(pvpActivityData, null, 2))
    
    console.log(`\n📝 Generated PvP activity data:`)
    console.log(`   📊 Total guild members: ${totalCount}`)
    console.log(`   🎯 Processed members: ${membersToProcess.length}`)
    console.log(`   ⚔️ Total PvP members: ${pvpMembers.length}`)
    console.log(`   🔥 Active PvP members: ${seasonFilteredMembers.length}`)
    console.log(`   🚫 Filtered out: ${filteredOutMembers} (no season ${CURRENT_SEASON} data)`)
    console.log(`   🏆 Average rating: ${guildStats.averageRating}`)
    console.log(`   🥇 Highest rated: ${guildStats.highestRatedMember?.characterName} (${guildStats.highestRatedMember?.totalStats.highestRating})`)
    console.log(`   💾 Saved to: ${outputPath}`)
    
  } catch (error) {
    console.error('❌ Error generating PvP activity data:', error.message)
    process.exit(1)
  }
}

main()
