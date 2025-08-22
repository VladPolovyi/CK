import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })
if (!process.env.BLIZZARD_CLIENT_ID) {
  config({ path: '.env' })
}

const REGION = process.env.BLIZZARD_REGION || 'eu'

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

async function testAPI() {
  const token = await getToken()
  console.log('Testing Blizzard API with different approaches...\n')

  // Test 1: Try the character that we know worked before
  console.log('1. Testing "chørt" on ravencrest (known working character)...')
  try {
    const url = `https://${REGION}.api.blizzard.com/profile/wow/character/ravencrest/chørt/achievements?namespace=profile-${REGION}&locale=en_US`
    console.log(`URL: ${url}`)
    
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    console.log(`Status: ${res.status}`)
    
    if (res.ok) {
      const data = await res.json()
      const achievementCount = data.achievements?.achievements?.length || 0
      console.log(`✅ Achievements found: ${achievementCount}`)
      
      if (achievementCount > 0) {
        console.log(`   Total points: ${data.total_points}`)
        console.log(`   First few achievements: ${data.achievements.achievements.slice(0, 3).map(a => a.id).join(', ')}`)
      }
    } else {
      const errorText = await res.text()
      console.log(`❌ Error: ${errorText}`)
    }
  } catch (error) {
    console.log(`❌ Exception: ${error.message}`)
  }

  console.log('\n2. Testing "shchoor" on tarren-mill (your character)...')
  try {
    const url = `https://${REGION}.api.blizzard.com/profile/wow/character/tarren-mill/shchoor/achievements?namespace=profile-${REGION}&locale=en_US`
    console.log(`URL: ${url}`)
    
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    console.log(`Status: ${res.status}`)
    
    if (res.ok) {
      const data = await res.json()
      const achievementCount = data.achievements?.achievements?.length || 0
      console.log(`✅ Achievements found: ${achievementCount}`)
      
      if (achievementCount > 0) {
        console.log(`   Total points: ${data.total_points}`)
        console.log(`   First few achievements: ${data.achievements.achievements.slice(0, 3).map(a => a.id).join(', ')}`)
      } else {
        console.log(`   ❌ No achievements returned`)
        console.log(`   Response structure: ${JSON.stringify(data, null, 2)}`)
      }
    } else {
      const errorText = await res.text()
      console.log(`❌ Error: ${errorText}`)
    }
  } catch (error) {
    console.log(`❌ Exception: ${error.message}`)
  }

  console.log('\n3. Testing different API approach...')
  console.log('   The issue might be:')
  console.log('   - API key permissions (need "wow.profile" scope)')
  console.log('   - Character achievements are only accessible for recently played characters')
  console.log('   - Need user authentication instead of client credentials')
  console.log('   - Blizzard changed the API behavior')
  
  console.log('\n4. Next Steps:')
  console.log('   - Check your Blizzard API key permissions')
  console.log('   - Verify the API key has "wow.profile" scope')
  console.log('   - Try with a different API key if available')
  console.log('   - Consider using user authentication instead of client credentials')
}

testAPI().catch(console.error)
