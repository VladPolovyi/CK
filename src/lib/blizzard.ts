type Region = 'us' | 'eu' | 'kr' | 'tw' | 'cn'

type TokenCache = {
  accessToken: string
  expiresAt: number // epoch ms
  region: Region
} | null

let tokenCache: TokenCache = null

function getEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

export async function getBlizzardAccessToken(region: Region): Promise<string> {
  const now = Date.now()
  if (tokenCache && tokenCache.region === region && tokenCache.expiresAt > now) {
    return tokenCache.accessToken
  }

  const clientId = getEnv('BLIZZARD_CLIENT_ID')
  const clientSecret = getEnv('BLIZZARD_CLIENT_SECRET')

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

  const data = (await response.json()) as { access_token: string; expires_in: number }
  tokenCache = {
    accessToken: data.access_token,
    // Refresh 60s early
    expiresAt: Date.now() + Math.max(0, (data.expires_in - 60) * 1000),
    region,
  }
  return tokenCache.accessToken
}

export async function blizzardGet(
  region: Region,
  path: string,
  searchParams: Record<string, string | undefined> = {}
): Promise<Response> {
  if (!path.startsWith('/')) path = '/' + path
  const token = await getBlizzardAccessToken(region)
  const url = new URL(`https://${region}.api.blizzard.com${path}`)
  for (const [k, v] of Object.entries(searchParams)) {
    if (typeof v === 'string' && v.length > 0) url.searchParams.set(k, v)
  }
  return fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    // Avoid Next.js automatic caching limits for large payloads
    cache: 'no-store',
  })
}


