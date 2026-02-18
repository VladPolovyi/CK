import Image from 'next/image'

const CHECK_PVP_BASE = 'https://check-pvp.fr/eu'

// WoW class colors (standard game colors)
const WOW_CLASS_COLORS: Record<string, string> = {
  'Death Knight': '#C41E3A',
  'Demon Hunter': '#A330C9',
  'Druid': '#FF7C0A',
  'Evoker': '#33937F',
  'Hunter': '#AAD372',
  'Mage': '#3FC7EB',
  'Monk': '#00FF98',
  'Paladin': '#F48CBA',
  'Priest': '#FFFFFF',
  'Rogue': '#FFF468',
  'Shaman': '#0070DD',
  'Warlock': '#8788EE',
  'Warrior': '#C69B6D',
}

type CountKey = 'rank1' | 'rank1solo' | 'gladiator' | 'legend' | 'strategist' | 'blitzRank1'

const ACHIEVEMENT_ICONS: Record<CountKey, { src: string; alt: string }> = {
  rank1: { src: '/images/r1.webp', alt: 'R1 3v3' },
  rank1solo: { src: '/images/shuffle_r1.webp', alt: 'R1 Solo' },
  blitzRank1: { src: '/images/blitz_r1.webp', alt: 'R1 Blitz' },
  gladiator: { src: '/images/gladiator.webp', alt: 'Gladiator' },
  legend: { src: '/images/legend.webp', alt: 'Legend' },
  strategist: { src: '/images/strategist.webp', alt: 'Strategist' },
}

// Border color per achievement type (first icon = row border)
const ACHIEVEMENT_BORDER_COLORS: Record<CountKey, string> = {
  rank1: 'rgba(249, 115, 22, 0.6)',      // orange
  rank1solo: 'rgba(251, 146, 60, 0.6)',  // light orange
  blitzRank1: 'rgba(34, 197, 94, 0.6)',  // green
  gladiator: 'rgba(168, 85, 247, 0.6)',  // purple
  legend: 'rgba(234, 179, 8, 0.6)',     // gold/yellow
  strategist: 'rgba(21, 128, 61, 0.6)', // dark green
}

function checkPvpUrl(realmNameOrSlug: string, characterName: string): string {
  // Check PvP expects realm with spaces (e.g. "twisting nether"), not slug ("twisting-nether")
  const realm = (realmNameOrSlug || 'Ravencrest').replace(/-/g, ' ')
  const name = characterName || ''
  return `${CHECK_PVP_BASE}/${encodeURIComponent(realm)}/${encodeURIComponent(name)}`
}

interface Player {
  id?: number | null
  name?: string | null
  characterClass?: string | null
  realm?: {
    name?: { en_US?: string }
    slug?: string
  }
  rank?: number
  rank1?: number
  rank1solo?: number
  gladiator?: number
  legend?: number
  strategist?: number
  blitzRank1?: number
}

type LegacyMember = { id: number; name: string; realm: { name: { en_US: string }; slug: string }; rank: number }

interface MemberListsProps {
  data: {
    players?: Player[]
    /** @deprecated use players with counts instead */
    members?: {
      gladiatorMembers: LegacyMember[]
      rank1Members: LegacyMember[]
      legendMembers: LegacyMember[]
      strategistMembers: LegacyMember[]
      blitzRank1Members: LegacyMember[]
      soloRank1Members: LegacyMember[]
    }
  }
}

function playerKey(m: { name?: string; realm?: { slug?: string } }) {
  return `${(m.name ?? '').toLowerCase()}-${(m.realm?.slug ?? '').toLowerCase()}`
}

/** Build players array from legacy members (counts become 1 per category they appear in) */
function buildPlayersFromLegacy(data: MemberListsProps['data']): Player[] {
  const members = data.members
  if (!members) return []
  const byKey = new Map<string, Player>()
  const add = (arr: LegacyMember[], key: CountKey, value: number) => {
    arr.forEach((m) => {
      const k = playerKey(m)
      const existing = byKey.get(k)
      const base: Player = existing ?? {
        id: m.id,
        name: m.name,
        realm: m.realm ? { name: { en_US: m.realm.name?.en_US ?? m.realm.slug }, slug: m.realm.slug } : { name: { en_US: 'Unknown' }, slug: 'unknown' },
        rank: m.rank,
        rank1: 0,
        rank1solo: 0,
        gladiator: 0,
        legend: 0,
        strategist: 0,
        blitzRank1: 0
      }
      if (!existing) byKey.set(k, base)
      const p = byKey.get(k)!
      const prev = Number(p[key])
      p[key] = Math.max(Number.isFinite(prev) ? prev : 0, value)
    })
  }
  add(members.gladiatorMembers, 'gladiator', 1)
  add(members.rank1Members, 'rank1', 1)
  add(members.legendMembers, 'legend', 1)
  add(members.strategistMembers, 'strategist', 1)
  add(members.blitzRank1Members, 'blitzRank1', 1)
  add(members.soloRank1Members, 'rank1solo', 1)
  return Array.from(byKey.values())
}

const COUNT_KEYS: CountKey[] = ['rank1', 'rank1solo', 'blitzRank1', 'gladiator', 'legend', 'strategist']

function getFirstAchievementKey(player: Player): CountKey | null {
  for (const key of COUNT_KEYS) {
    if (Number(player[key]) > 0) return key
  }
  return null
}

function PlayerCounts({ player }: { player: Player }) {
  return (
    <span className="flex flex-wrap items-center gap-x-4 gap-y-1.5 flex-1 min-w-0">
      {COUNT_KEYS.map((key) => {
        const count = Number(player[key])
        if (!Number.isFinite(count) || count <= 0) return null
        const { src, alt } = ACHIEVEMENT_ICONS[key]
        return (
          <span key={key} className="inline-flex items-center gap-2 text-gray-300 text-base" title={alt}>
            <Image src={src} alt={alt} width={32} height={32} className="h-8 w-8 shrink-0" />
            <span>{count}</span>
          </span>
        )
      })}
    </span>
  )
}

export default function MemberLists({ data }: MemberListsProps) {
  const players: Player[] = data.players?.length ? data.players : buildPlayersFromLegacy(data)

  const hasAnyAchievement = (p: Player) =>
    (Number(p.rank1) > 0) || (Number(p.rank1solo) > 0) || (Number(p.gladiator) > 0) ||
    (Number(p.legend) > 0) || (Number(p.strategist) > 0) || (Number(p.blitzRank1) > 0)

  const sortByAchievementPriority = (a: Player, b: Player) => {
    const keys: CountKey[] = ['rank1', 'rank1solo', 'blitzRank1', 'gladiator', 'legend', 'strategist']
    for (const key of keys) {
      const va = Number(a[key]) || 0
      const vb = Number(b[key]) || 0
      if (vb !== va) return vb - va
    }
    return 0
  }

  const playersWithAchievements = players.filter(hasAnyAchievement).sort(sortByAchievementPriority)

  return (
    <div className="py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="text-blood-light">Achievements by Player</span>
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Complete overview of all PvP achievements earned by our guild members.
          </p>
        </div>
        <div className="blood-card blood-card-no-hover rounded-lg border-0 p-0">
          <div className="space-y-2">
            {playersWithAchievements.length === 0 ? (
              <div className="text-gray-400 text-sm py-2">No players with PvP achievements found.</div>
            ) : (
              <>
                {playersWithAchievements.map((p, idx) => {
                  const realmDisplayName = p.realm?.name?.en_US ?? p.realm?.slug ?? 'Ravencrest'
                  const url = checkPvpUrl(realmDisplayName, p.name ?? '')
                  const firstKey = getFirstAchievementKey(p)
                  const borderColor = firstKey ? ACHIEVEMENT_BORDER_COLORS[firstKey] : 'rgba(255, 0, 0, 0.3)'
                  return (
                    <div
                      key={p.id ?? `${p.name}-${p.realm?.slug}-${idx}`}
                      className="grid grid-cols-[1fr_auto] grid-rows-[auto_auto] md:grid-cols-[20%_1fr_auto] md:grid-rows-1 gap-x-4 gap-y-3 md:gap-y-0 items-center py-4 px-5 md:py-3 md:px-4 rounded-md border hover:bg-white/5 transition-colors"
                      style={{ borderColor }}
                    >
                      <div className="min-w-0 col-start-1 row-start-1">
                        <span
                          className="font-medium text-base"
                          style={{ color: p.characterClass ? (WOW_CLASS_COLORS[p.characterClass] ?? '#9CA3AF') : '#FFFFFF' }}
                        >
                          {p.name ?? 'Unknown'}
                        </span>
                        <span className="text-gray-400"> · {realmDisplayName}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 col-span-2 col-start-1 row-start-2 pt-2 md:pt-0 md:col-span-1 md:col-start-2 md:row-start-1">
                        <PlayerCounts player={p} />
                      </div>
                      <div className="col-start-2 row-start-1 md:col-start-3 md:row-start-1 justify-self-end md:justify-self-auto">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base font-medium px-4 py-2 rounded border text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                          style={{ borderColor }}
                        >
                          Check PvP
                        </a>
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
