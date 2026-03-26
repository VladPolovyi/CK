import { blizzardGet, type Region } from '@/lib/blizzard'

function normalizeRegion(r?: string | null): Region {
  const x = (r || 'eu').toLowerCase()
  if (x === 'us' || x === 'eu' || x === 'kr' || x === 'tw' || x === 'cn') return x
  return 'eu'
}

type PvpSeasonIndex = {
  seasons?: Array<{ id: number }>
}

type PvpSeasonDetail = {
  id: number
  season_start_timestamp: number
  season_end_timestamp?: number
}

type PvpRewardIndex = {
  rewards?: Array<{
    bracket?: { type?: string }
    rating_cutoff?: number
    specialization?: { id?: number }
  }>
}

/** Resolves the season that is active now (no end date, or now between start and end). */
async function getActivePvpSeasonId(region: Region): Promise<number | null> {
  const indexRes = await blizzardGet(region, '/data/wow/pvp-season/index', {
    namespace: `dynamic-${region}`,
    locale: 'en_US',
  })
  if (!indexRes.ok) return null
  const index = (await indexRes.json()) as PvpSeasonIndex
  const ids = (index.seasons ?? []).map((s) => s.id).sort((a, b) => b - a)
  const now = Date.now()

  for (const id of ids) {
    const res = await blizzardGet(region, `/data/wow/pvp-season/${id}`, {
      namespace: `dynamic-${region}`,
      locale: 'en_US',
    })
    if (!res.ok) continue
    const season = (await res.json()) as PvpSeasonDetail
    const start = season.season_start_timestamp
    const end = season.season_end_timestamp
    if (now >= start && (end == null || now <= end)) return id
  }

  return ids[0] ?? null
}

/** Fallback when season auto-detect fails; bump when a new season starts. */
const DEFAULT_PVP_SEASON_ID = 41

function resolvePvpSeasonIdFromEnv(): number | null {
  const raw = process.env.BLIZZARD_PVP_SEASON_ID
  if (raw == null || raw === '') return null
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) && n > 0 ? n : null
}

/**
 * Blizzard Game Data API: solo shuffle Rank-1 threshold per spec (`rating_cutoff` on SHUFFLE rewards).
 * Map key = playable specialization id (matches profile pvp-bracket specialization.id).
 *
 * Season: `BLIZZARD_PVP_SEASON_ID` env overrides; else auto-detect active season; else **41** (current retail).
 */
export async function fetchShuffleR1CutoffsBySpecId(rawRegion?: string | null): Promise<Record<number, number> | null> {
  const region = normalizeRegion(rawRegion)
  try {
    const seasonId =
      resolvePvpSeasonIdFromEnv() ??
      (await getActivePvpSeasonId(region)) ??
      DEFAULT_PVP_SEASON_ID

    const rewardRes = await blizzardGet(region, `/data/wow/pvp-season/${seasonId}/pvp-reward/index`, {
      namespace: `dynamic-${region}`,
      locale: 'en_US',
    })
    if (!rewardRes.ok) return null

    const data = (await rewardRes.json()) as PvpRewardIndex
    const out: Record<number, number> = {}

    for (const r of data.rewards ?? []) {
      if (r.bracket?.type !== 'SHUFFLE') continue
      const sid = r.specialization?.id
      const cutoff = r.rating_cutoff
      if (typeof sid === 'number' && typeof cutoff === 'number') {
        out[sid] = cutoff
      }
    }

    return Object.keys(out).length > 0 ? out : null
  } catch {
    return null
  }
}
