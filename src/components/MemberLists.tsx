import Image from 'next/image'

const CHECK_PVP_BASE = 'https://check-pvp.fr/eu'

function checkPvpUrl(realmNameOrSlug: string, characterName: string): string {
  // Check PvP expects realm with spaces (e.g. "twisting nether"), not slug ("twisting-nether")
  const realm = (realmNameOrSlug || 'Ravencrest').replace(/-/g, ' ')
  const name = characterName || ''
  return `${CHECK_PVP_BASE}/${encodeURIComponent(realm)}/${encodeURIComponent(name)}`
}

interface Member {
  id: number
  name: string
  realm: {
    name: {
      en_US: string
    }
    slug: string
  }
  rank: number
}

interface MemberListsProps {
  data: {
    members: {
      gladiatorMembers: Member[]
      rank1Members: Member[]
      legendMembers: Member[]
      strategistMembers: Member[]
      blitzRank1Members: Member[]
      soloRank1Members: Member[]
    }
  }
}

function MemberRow({
  m,
  idx,
  iconSrc,
  iconAlt,
  borderClass,
  keySuffix,
}: {
  m: Member
  idx: number
  iconSrc: string
  iconAlt: string
  borderClass: string
  keySuffix: string
}) {
  const realmDisplayName = m.realm?.name?.en_US ?? m.realm?.slug ?? 'Ravencrest'
  const url = checkPvpUrl(realmDisplayName, m.name ?? '')
  return (
    <div
      key={`${m.id ?? idx}-${keySuffix}`}
      className={`flex items-center gap-3 py-2 px-3 rounded-md border ${borderClass} hover:opacity-90 transition-opacity`}
    >
      <Image src={iconSrc} alt={iconAlt} width={24} height={24} className="h-6 w-6 shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="text-white font-medium">{m.name ?? 'Unknown'}</span>
        <span className="text-gray-400 text-sm ml-1.5">· {realmDisplayName}</span>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-sm font-medium px-3 py-1.5 rounded border border-current text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
      >
        Check PvP
      </a>
    </div>
  )
}

export default function MemberLists({ data }: MemberListsProps) {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* R1 3v3 */}
          <div className="blood-card rounded-lg p-4 border border-orange-500/30">
            <div className="flex items-center mb-3">
              <Image src="/images/r1.webp" alt="Rank 1" width={24} height={24} className="h-6 w-6 mr-2" />
              <h2 className="text-lg font-bold text-white">R1 3v3</h2>
            </div>
            <div className="space-y-1.5">
              {data.members.rank1Members.map((m, idx) => (
                <MemberRow m={m} idx={idx} iconSrc="/images/r1.webp" iconAlt="Rank 1" borderClass="border-orange-500/30" keySuffix="r1" />
              ))}
              {data.members.rank1Members.length === 0 && <div className="text-gray-400 text-sm py-2">No Rank 1 3v3 players found.</div>}
            </div>
          </div>

          {/* R1 Solo */}
          <div className="blood-card rounded-lg p-4 border border-orange-500/30">
            <div className="flex items-center mb-3">
              <Image src="/images/shuffle_r1.webp" alt="Solo Rank 1" width={24} height={24} className="h-6 w-6 mr-2" />
              <h2 className="text-lg font-bold text-white">R1 Solo</h2>
            </div>
            <div className="space-y-1.5">
              {data.members.soloRank1Members.map((m, idx) => (
                <MemberRow m={m} idx={idx} iconSrc="/images/shuffle_r1.webp" iconAlt="Solo Rank 1" borderClass="border-orange-500/30" keySuffix="solo" />
              ))}
              {data.members.soloRank1Members.length === 0 && <div className="text-gray-400 text-sm py-2">No R1 Solo players found.</div>}
            </div>
          </div>

          {/* R1 Blitz */}
          <div className="blood-card rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center mb-3">
              <Image src="/images/blitz_r1.webp" alt="Blitz Rank 1" width={24} height={24} className="h-6 w-6 mr-2" />
              <h2 className="text-lg font-bold text-white">R1 Blitz</h2>
            </div>
            <div className="space-y-1.5">
              {data.members.blitzRank1Members.map((m, idx) => (
                <MemberRow m={m} idx={idx} iconSrc="/images/blitz_r1.webp" iconAlt="Blitz Rank 1" borderClass="border-green-500/30" keySuffix="blitz" />
              ))}
              {data.members.blitzRank1Members.length === 0 && <div className="text-gray-400 text-sm py-2">No R1 Blitz players found.</div>}
            </div>
          </div>

          {/* Gladiators */}
          <div className="blood-card rounded-lg p-4 border border-purple-500/30">
            <div className="flex items-center mb-3">
              <Image src="/images/gladiator.webp" alt="Gladiator" width={24} height={24} className="h-6 w-6 mr-2" />
              <h2 className="text-lg font-bold text-white">Gladiators</h2>
            </div>
            <div className="space-y-1.5">
              {data.members.gladiatorMembers.map((m, idx) => (
                <MemberRow m={m} idx={idx} iconSrc="/images/gladiator.webp" iconAlt="Gladiator" borderClass="border-purple-500/30" keySuffix="glad" />
              ))}
              {data.members.gladiatorMembers.length === 0 && <div className="text-gray-400 text-sm py-2">No Gladiators found.</div>}
            </div>
          </div>

          {/* Legends */}
          <div className="blood-card rounded-lg p-4 border border-yellow-500/30">
            <div className="flex items-center mb-3">
              <Image src="/images/legend.webp" alt="Legend" width={24} height={24} className="h-6 w-6 mr-2" />
              <h2 className="text-lg font-bold text-white">Legends</h2>
            </div>
            <div className="space-y-1.5">
              {data.members.legendMembers.map((m, idx) => (
                <MemberRow m={m} idx={idx} iconSrc="/images/legend.webp" iconAlt="Legend" borderClass="border-yellow-500/30" keySuffix="legend" />
              ))}
              {data.members.legendMembers.length === 0 && <div className="text-gray-400 text-sm py-2">No Legends found.</div>}
            </div>
          </div>

          {/* Strategists */}
          <div className="blood-card rounded-lg p-4 border border-green-700/30">
            <div className="flex items-center mb-3">
              <Image src="/images/strategist.webp" alt="Strategist" width={24} height={24} className="h-6 w-6 mr-2" />
              <h2 className="text-lg font-bold text-white">Strategists</h2>
            </div>
            <div className="space-y-1.5">
              {data.members.strategistMembers.map((m, idx) => (
                <MemberRow m={m} idx={idx} iconSrc="/images/strategist.webp" iconAlt="Strategist" borderClass="border-green-700/30" keySuffix="strat" />
              ))}
              {data.members.strategistMembers.length === 0 && <div className="text-gray-400 text-sm py-2">No Strategists found.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
