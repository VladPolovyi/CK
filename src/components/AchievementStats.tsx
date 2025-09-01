interface AchievementStatsProps {
  data: {
    stats: {
      gladiatorCount: number
      rank1Count: number
      legendCount: number
      strategistCount: number
      blitzRank1Count: number
      soloRank1Count: number
    }
  }
}

export default function AchievementStats({ data }: AchievementStatsProps) {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* First Row: R1 3v3 - R1 Solo - R1 Blitz */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="blood-card rounded-lg p-6 text-center">
            <img src="/images/r1.webp" alt="Rank 1" className="h-12 w-12 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white combat-text">{data.stats.rank1Count}</div>
            <div className="text-gray-300">R1 3v3</div>
          </div>
          <div className="blood-card rounded-lg p-6 text-center">
            <img src="/images/shuffle_r1.webp" alt="Solo Rank 1" className="h-12 w-12 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white combat-text">{data.stats.soloRank1Count}</div>
            <div className="text-gray-300">R1 Solo</div>
          </div>
          <div className="blood-card rounded-lg p-6 text-center">
            <img src="/images/blitz_r1.webp" alt="Blitz Rank 1" className="h-12 w-12 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white combat-text">{data.stats.blitzRank1Count}</div>
            <div className="text-gray-300">R1 Blitz</div>
          </div>
        </div>
        
        {/* Second Row: Gladiator - Legend - Strategist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="blood-card rounded-lg p-6 text-center">
            <img src="/images/gladiator.webp" alt="Gladiator" className="h-12 w-12 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white combat-text">{data.stats.gladiatorCount}</div>
            <div className="text-gray-300">Gladiator</div>
          </div>
          <div className="blood-card rounded-lg p-6 text-center">
            <img src="/images/legend.webp" alt="Legend" className="h-12 w-12 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white combat-text">{data.stats.legendCount}</div>
            <div className="text-gray-300">Legend</div>
          </div>
          <div className="blood-card rounded-lg p-6 text-center">
            <img src="/images/strategist.webp" alt="Strategist" className="h-12 w-12 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white combat-text">{data.stats.strategistCount}</div>
            <div className="text-gray-300">Strategist</div>
          </div>
        </div>
      </div>
    </div>
  )
}
