import { blizzardGet } from '@/lib/blizzard'

type Region = 'us' | 'eu' | 'kr' | 'tw' | 'cn'

type TermCacheEntry = {
  items: { id: number; name: string }[]
  expiresAt: number
}

const achievementsByTermCache = new Map<string, TermCacheEntry>()

function cacheKey(region: Region, term: string) {
  return `${region}::${term.toLowerCase()}`
}

async function searchAchievementsByName(region: Region, term: string): Promise<{ id: number; name: string }[]> {
  const key = cacheKey(region, term)
  const now = Date.now()
  const cached = achievementsByTermCache.get(key)
  if (cached && cached.expiresAt > now) return cached.items

  const collected: { id: number; name: string }[] = []
  const locales = region === 'eu' ? ['en_GB', 'en_US'] : ['en_US']
  const fields = ['title', 'name'] as const
  // Try multiple locales and both possible fields; paginate each
  for (const locale of locales) {
    for (const field of fields) {
      for (let page = 1; page <= 20; page++) {
        const params: Record<string, string> = {
          namespace: `static-${region}`,
          orderby: 'id',
          _page: String(page),
          _pageSize: '100',
          locale,
        }
        ;(params as any)[`${field}.${locale}`] = term
        const res = await blizzardGet(region, `/data/wow/search/achievement`, params)
        if (!res.ok) break
        const data = await res.json()
        const results: any[] = Array.isArray(data?.results) ? data.results : []
        if (results.length === 0) break
        for (const r of results) {
          const id = r?.data?.id
          const name: string | undefined = r?.data?.title?.en_US || r?.data?.title?.en_GB || r?.data?.name?.en_US || r?.data?.name?.en_GB
          if (typeof id === 'number' && typeof name === 'string') collected.push({ id, name })
        }
      }
    }
  }

  achievementsByTermCache.set(key, {
    items: collected,
    // cache for 24h
    expiresAt: now + 24 * 60 * 60 * 1000,
  })
  return collected
}

async function getGladiatorAchievementIds(region: Region): Promise<number[]> {
  // Search broadly without colon; then filter for names starting with "Gladiator:" to avoid search quirks
  const items = await searchAchievementsByName(region, 'Gladiator')
  return items.filter((i) => i.name.startsWith('Gladiator:')).map((i) => i.id)
}

async function getLegendAchievementIds(region: Region): Promise<number[]> {
  // Search broadly without colon; then filter for names starting with "Legend:"
  const items = await searchAchievementsByName(region, 'Legend')
  return items.filter((i) => i.name.startsWith('Legend:')).map((i) => i.id)
}

async function getRank1AchievementIds(region: Region): Promise<number[]> {
  // Rank 1 includes seasonal prefix titles for both 3v3 and Solo Shuffle:
  // e.g., "Forged Gladiator: The War Within Season 1" and "Forged Legend: The War Within Season 1"
  const [gladItems, legendItems] = await Promise.all([
    searchAchievementsByName(region, 'Gladiator'),
    searchAchievementsByName(region, 'Legend'),
  ])
  const rank1Glads = gladItems
    .filter((i) => i.name.includes('Gladiator: ') && !i.name.startsWith('Gladiator:'))
    .map((i) => i.id)
  const rank1Legends = legendItems
    .filter((i) => i.name.includes('Legend: ') && !i.name.startsWith('Legend:'))
    .map((i) => i.id)
  return Array.from(new Set([...rank1Glads, ...rank1Legends]))
}

export async function getCharacterAchievementIds(region: Region, realmSlug: string, characterName: string): Promise<Set<number>> {
  const res = await blizzardGet(region, `/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/achievements`, {
    namespace: `profile-${region}`,
    locale: 'en_US',
  })
  if (!res.ok) return new Set<number>()
  const data = await res.json()
  const list: any[] = data?.achievements?.achievements ?? []
  return new Set<number>(list.map((a: any) => a?.id).filter((x: any) => typeof x === 'number'))
}

export async function getPvpTitlesSummary(region: Region, realmSlug: string, characterName: string) {
  const [earned, gladiatorIds, rank1Ids, legendIds] = await Promise.all([
    getCharacterAchievementIds(region, realmSlug, characterName),
    getGladiatorAchievementIds(region),
    getRank1AchievementIds(region),
    getLegendAchievementIds(region),
  ])


  const hasGladiatorEver = gladiatorIds.some((id) => earned.has(id))
  const hasRank1Ever = rank1Ids.some((id) => earned.has(id))
  const hasLegendEver = legendIds.some((id) => earned.has(id))

  if(characterName === 'shchoor') {
    console.log(gladiatorIds, rank1Ids, legendIds);
  }

  return { hasGladiatorEver, hasRank1Ever, hasLegendEver }
}

// Cached wrapper to avoid repeated upstream calls per character
// Uses Next.js ISR cache; adjust revalidate as needed
export async function getPvpTitlesSummaryCached(region: Region, realmSlug: string, characterName: string) {
  const { unstable_cache } = await import('next/cache')
  const fn = unstable_cache(
    async () => getPvpTitlesSummary(region, realmSlug, characterName),
    ['pvp-titles', region, realmSlug, characterName.toLowerCase()],
    { revalidate: 86400 }
  )
  return fn()
}


