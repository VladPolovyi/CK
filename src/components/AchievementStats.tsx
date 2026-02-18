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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="blood-card rounded-lg p-4 lg:p-6 text-center">
        <Image src="/images/r1.webp" alt="Rank 1" width={48} height={48} className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-2 lg:mb-4" />
        <div className="text-2xl lg:text-3xl font-bold text-white combat-text">{data.stats.rank1Count}</div>
        <div className="text-gray-300 text-sm lg:text-base">R1 3v3</div>
      </div>
      <div className="blood-card rounded-lg p-4 lg:p-6 text-center">
        <Image src="/images/shuffle_r1.webp" alt="Solo Rank 1" width={48} height={48} className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-2 lg:mb-4" />
        <div className="text-2xl lg:text-3xl font-bold text-white combat-text">{data.stats.soloRank1Count}</div>
        <div className="text-gray-300 text-sm lg:text-base">R1 Solo</div>
      </div>
      <div className="blood-card rounded-lg p-4 lg:p-6 text-center">
        <Image src="/images/blitz_r1.webp" alt="Blitz Rank 1" width={48} height={48} className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-2 lg:mb-4" />
        <div className="text-2xl lg:text-3xl font-bold text-white combat-text">{data.stats.blitzRank1Count}</div>
        <div className="text-gray-300 text-sm lg:text-base">R1 Blitz</div>
      </div>
      <div className="blood-card rounded-lg p-4 lg:p-6 text-center">
        <Image src="/images/gladiator.webp" alt="Gladiator" width={48} height={48} className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-2 lg:mb-4" />
        <div className="text-2xl lg:text-3xl font-bold text-white combat-text">{data.stats.gladiatorCount}</div>
        <div className="text-gray-300 text-sm lg:text-base">Gladiator</div>
      </div>
      <div className="blood-card rounded-lg p-4 lg:p-6 text-center">
        <Image src="/images/legend.webp" alt="Legend" width={48} height={48} className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-2 lg:mb-4" />
        <div className="text-2xl lg:text-3xl font-bold text-white combat-text">{data.stats.legendCount}</div>
        <div className="text-gray-300 text-sm lg:text-base">Legend</div>
      </div>
      <div className="blood-card rounded-lg p-4 lg:p-6 text-center">
        <Image src="/images/strategist.webp" alt="Strategist" width={48} height={48} className="h-10 w-10 lg:h-12 lg:w-12 mx-auto mb-2 lg:mb-4" />
        <div className="text-2xl lg:text-3xl font-bold text-white combat-text">{data.stats.strategistCount}</div>
        <div className="text-gray-300 text-sm lg:text-base">Strategist</div>
      </div>
    </div>
  )
}
