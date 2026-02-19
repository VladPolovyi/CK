import { AlertCircle } from 'lucide-react'
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import ReadyToBleed from '@/components/ReadyToBleed'
import LeaderboardTabs from '@/components/LeaderboardTabs'
import { getPvPActivityData, generateBracketSummaries } from '@/lib/pvp-activity'

export default async function LeaderboardsPage() {
  const pvpData = await getPvPActivityData()

  if (!pvpData) {
    return (
      <div className="min-h-screen bg-[#101010]">
        <Navigation />
        <div className="pt-20">
          <HeroSection
            title="Leaderboards"
            subtitle="PvP rankings by bracket"
            backgroundImage="/images/maldr.jpg"
          />
          <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="blood-card rounded-lg p-12">
                <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-6" />
                <h2 className="text-3xl font-extrabold text-white mb-4">
                  <span className="text-red-400">PvP Data Not Available</span>
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  PvP activity data has not been generated yet. Run the build to generate data.
                </p>
                <code className="text-blood-light text-sm">npm run build</code>
              </div>
            </div>
          </div>
          <ReadyToBleed />
        </div>
      </div>
    )
  }

  const bracketSummaries = generateBracketSummaries(pvpData)

  return (
    <div className="min-h-screen bg-[#101010]">
      <Navigation />
      <div className="pt-20">
        <HeroSection
          title="Leaderboards"
          subtitle="PvP rankings by bracket — all members"
          backgroundImage="/images/maldr.jpg"
        />

        <div className="py-6 md:py-8">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                <span className="text-blood-light">Bracket Leaderboards</span>
              </h2>
              <p className="mt-4 text-lg text-gray-300">
                Ranked by rating. Data from current season.
              </p>
            </div>

            {bracketSummaries.length > 0 ? (
              <LeaderboardTabs brackets={bracketSummaries} />
            ) : (
              <div className="text-gray-400 text-sm py-2">No bracket data available.</div>
            )}
          </div>
        </div>

        <ReadyToBleed />
      </div>
    </div>
  )
}
