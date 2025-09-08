import Image from 'next/image'

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
    <div>
        {/* First Row: R1 3v3 - R1 Solo - R1 Blitz */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="blood-card rounded-lg p-6 text-center">
            <Image src="/images/r1.webp" alt="Rank 1" width={48} height={48} className="h-12 w-12 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white combat-text">{data.stats.rank1Count}</div>
            <div className="text-gray-300">R1 3v3</div>
          </div>
          <div className="blood-card rounded-lg p-6 text-center">
            <Image src="/images/shuffle_r1.webp" alt="Solo Rank 1" width={48} height={48} className="h-12 w-12 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white combat-text">{data.stats.soloRank1Count}</div>
            <div className="text-gray-300">R1 Solo</div>
          </div>
          <div className="blood-card rounded-lg p-6 text-center">
            <Image src="/images/blitz_r1.webp" alt="Blitz Rank 1" width={48} height={48} className="h-12 w-12 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white combat-text">{data.stats.blitzRank1Count}</div>
            <div className="text-gray-300">R1 Blitz</div>
          </div>
        </div>
        
        {/* Second Row: Gladiator - Legend - Strategist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="blood-card rounded-lg p-6 text-center">
            <Image src="/images/gladiator.webp" alt="Gladiator" width={48} height={48} className="h-12 w-12 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white combat-text">{data.stats.gladiatorCount}</div>
            <div className="text-gray-300">Gladiator</div>
          </div>
          <div className="blood-card rounded-lg p-6 text-center">
            <Image src="/images/legend.webp" alt="Legend" width={48} height={48} className="h-12 w-12 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white combat-text">{data.stats.legendCount}</div>
            <div className="text-gray-300">Legend</div>
          </div>
          <div className="blood-card rounded-lg p-6 text-center">
            <Image src="/images/strategist.webp" alt="Strategist" width={48} height={48} className="h-12 w-12 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white combat-text">{data.stats.strategistCount}</div>
            <div className="text-gray-300">Strategist</div>
          </div>
        </div>
    </div>
  )
}
