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

export default function MemberLists({ data }: MemberListsProps) {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* R1 3v3 (live from roster) */}
          <div className="blood-card rounded-lg p-6 hover:border-orange-400/50 hover:bg-orange-900/20 transition-all duration-200 border border-orange-500/30">
            <div className="flex items-center mb-6">
              <img src="/images/r1.webp" alt="Rank 1" className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-bold text-white">R1 3v3</h2>
            </div>
            <div className="space-y-4">
              {data.members.rank1Members.map((m, idx) => (
                <div key={`${m.id ?? idx}-r1`} className="flex items-center p-4 bg-dark-gray/50 rounded-lg border border-orange-500/30 hover:border-orange-400/50 hover:bg-orange-900/20 transition-all duration-200">
                  <img src="/images/r1.webp" alt="Rank 1" className="h-8 w-8 mr-3" />
                  <div className="flex-1">
                    <div className="text-white font-bold">{m.name ?? 'Unknown'}</div>
                    <div className="text-gray-300 text-sm">{m.realm?.name?.en_US ?? ''}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-400 text-sm font-medium">Rank {m.rank}</div>
                  </div>
                </div>
              ))}
              {data.members.rank1Members.length === 0 && (
                <div className="text-gray-400">No Rank 1 3v3 players found.</div>
              )}
            </div>
          </div>

          {/* R1 Solo (live from roster) */}
          <div className="blood-card rounded-lg p-6 hover:border-orange-400/50 hover:bg-orange-900/20 transition-all duration-200 border border-orange-500/30">
            <div className="flex items-center mb-6">
              <img src="/images/shuffle_r1.webp" alt="Solo Rank 1" className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-bold text-white">R1 Solo</h2>
            </div>
            <div className="space-y-4">
              {data.members.soloRank1Members.map((m, idx) => (
                <div key={`${m.id ?? idx}-solo`} className="flex items-center p-4 bg-dark-gray/50 rounded-lg border border-orange-500/30 hover:border-orange-400/50 hover:bg-orange-900/20 transition-all duration-200">
                  <img src="/images/shuffle_r1.webp" alt="Solo Rank 1" className="h-8 w-8 mr-3" />
                  <div className="flex-1">
                    <div className="text-white font-bold">{m.name ?? 'Unknown'}</div>
                    <div className="text-gray-300 text-sm">{m.realm?.name?.en_US ?? ''}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-400 text-sm font-medium">Rank {m.rank}</div>
                  </div>
                </div>
              ))}
              {data.members.soloRank1Members.length === 0 && (
                <div className="text-gray-400">No R1 Solo players found.</div>
              )}
            </div>
          </div>

          {/* R1 Blitz (live from roster) */}
          <div className="blood-card rounded-lg p-6 hover:border-green-400/50 hover:bg-green-900/20 transition-all duration-200 border border-green-500/30">
            <div className="flex items-center mb-6">
              <img src="/images/blitz_r1.webp" alt="Blitz Rank 1" className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-bold text-white">R1 Blitz</h2>
            </div>
            <div className="space-y-4">
              {data.members.blitzRank1Members.map((m, idx) => (
                <div key={`${m.id ?? idx}-blitz`} className="flex items-center p-4 bg-dark-gray/50 rounded-lg border border-green-500/30 hover:border-green-400/50 hover:bg-green-900/20 transition-all duration-200">
                  <img src="/images/blitz_r1.webp" alt="Blitz Rank 1" className="h-8 w-8 mr-3" />
                  <div className="flex-1">
                    <div className="text-white font-bold">{m.name ?? 'Unknown'}</div>
                    <div className="text-gray-300 text-sm">{m.realm?.name?.en_US ?? ''}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 text-sm font-medium">Rank {m.rank}</div>
                  </div>
                </div>
              ))}
              {data.members.blitzRank1Members.length === 0 && (
                <div className="text-gray-400">No R1 Blitz players found.</div>
              )}
            </div>
          </div>

          {/* Gladiators (live from roster) */}
          <div className="blood-card rounded-lg p-6 hover:border-purple-400/50 hover:bg-purple-900/20 transition-all duration-200 border border-purple-500/30">
            <div className="flex items-center mb-6">
              <img src="/images/gladiator.webp" alt="Gladiator" className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-bold text-white">Gladiators</h2>
            </div>
            <div className="space-y-4">
              {data.members.gladiatorMembers.map((m, idx) => (
                <div key={`${m.id ?? idx}-glad`} className="flex items-center p-4 bg-dark-gray/50 rounded-lg border border-purple-500/30 hover:border-purple-400/50 hover:bg-purple-900/20 transition-all duration-200">
                  <img src="/images/gladiator.webp" alt="Gladiator" className="h-8 w-8 mr-3" />
                  <div className="flex-1">
                    <div className="text-white font-bold">{m.name ?? 'Unknown'}</div>
                    <div className="text-gray-300 text-sm">{m.realm?.name?.en_US ?? ''}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-purple-400 text-sm font-medium">Rank {m.rank}</div>
                  </div>
                </div>
              ))}
              {data.members.gladiatorMembers.length === 0 && (
                <div className="text-gray-400">No Gladiators found.</div>
              )}
            </div>
          </div>

          {/* Legends (live from roster) */}
          <div className="blood-card rounded-lg p-6 hover:border-yellow-400/50 hover:bg-yellow-900/20 transition-all duration-200 border border-yellow-500/30">
            <div className="flex items-center mb-6">
              <img src="/images/legend.webp" alt="Legend" className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-bold text-white">Legends</h2>
            </div>
            <div className="space-y-4">
              {data.members.legendMembers.map((m, idx) => (
                <div key={`${m.id ?? idx}-legend`} className="flex items-center p-4 bg-dark-gray/50 rounded-lg border border-yellow-500/30 hover:border-yellow-400/50 hover:bg-yellow-900/20 transition-all duration-200">
                  <img src="/images/legend.webp" alt="Legend" className="h-8 w-8 mr-3" />
                  <div className="flex-1">
                    <div className="text-white font-bold">{m.name ?? 'Unknown'}</div>
                    <div className="text-gray-300 text-sm">{m.realm?.name?.en_US ?? ''}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 text-sm font-medium">Rank {m.rank}</div>
                  </div>
                </div>
              ))}
              {data.members.legendMembers.length === 0 && (
                <div className="text-gray-400">No Legends found.</div>
              )}
            </div>
          </div>

          {/* Strategists (live from roster) */}
          <div className="blood-card rounded-lg p-6 hover:border-green-700/50 hover:bg-green-900/20 transition-all duration-200 border border-green-700/30">
            <div className="flex items-center mb-6">
              <img src="/images/strategist.webp" alt="Strategist" className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-bold text-white">Strategists</h2>
            </div>
            <div className="space-y-4">
              {data.members.strategistMembers.map((m, idx) => (
                <div key={`${m.id ?? idx}-strat`} className="flex items-center p-4 bg-dark-gray/50 rounded-lg border border-green-700/30 hover:border-green-600/50 hover:bg-green-900/20 transition-all duration-200">
                  <img src="/images/strategist.webp" alt="Strategist" className="h-8 w-8 mr-3" />
                  <div className="flex-1">
                    <div className="text-white font-bold">{m.name ?? 'Unknown'}</div>
                    <div className="text-gray-300 text-sm">{m.realm?.name?.en_US ?? ''}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-600 text-sm font-medium">Rank {m.rank}</div>
                  </div>
                </div>
              ))}
              {data.members.strategistMembers.length === 0 && (
                <div className="text-gray-400">No Strategists found.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
