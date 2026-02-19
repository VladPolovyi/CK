import { Activity, AlertCircle } from 'lucide-react'
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import ReadyToBleed from '@/components/ReadyToBleed'
import GuildPvPOverview from '@/components/GuildPvPOverview'
import { getPvPActivityData, generateWeeklyBracketSummaries } from '@/lib/pvp-activity'
import LeaderboardTabs from '@/components/LeaderboardTabs'

export default async function GuildActivity() {
  const pvpData = await getPvPActivityData()

  // Handle case where no data is available
  if (!pvpData) {
    return (
      <div className="min-h-screen bg-[#101010]">
        <Navigation />
        <div className="pt-20">
          <HeroSection 
            title="Guild Activity"
            subtitle="Monitor PvP performance and track guild member statistics across all competitive brackets."
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
                  PvP activity data has not been generated yet. Please run the build script to generate this data.
                </p>
                <div className="text-sm text-gray-400 bg-black/20 rounded p-4 mt-4">
                  <p className="font-medium mb-2">To generate PvP activity data:</p>
                  <code className="text-blood-light">npm run generate:pvp-activity</code>
                </div>
              </div>
            </div>
          </div>
          <ReadyToBleed />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#101010]">
      <Navigation />
      <div className="pt-20">
        {/* Hero Section */}
        <HeroSection 
          title="Guild Activity"
          subtitle="Monitor PvP performance and track guild member statistics across all competitive brackets."
          backgroundImage="/images/maldr.jpg"
        />

        {/* Main Content */}
        <div>
          {/* Arena Activity (Weekly) - full width, same look as leaderboards */}
          <div className="w-full bg-[#101010] py-6 md:py-8">
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-extrabold text-white sm:text-4xl">
                  <span className="text-blood-light">Arena Activity (Weekly)</span>
                </h3>
                <p className="mt-4 text-lg text-gray-300">
                  Members with activity this week. Ranked by rating.
                </p>
              </div>
              {(() => {
                const weeklyBrackets = generateWeeklyBracketSummaries(pvpData)
                return weeklyBrackets.length > 0 ? (
                  <LeaderboardTabs brackets={weeklyBrackets} />
                ) : (
                  <div className="text-gray-400 text-sm py-2">No weekly activity this week.</div>
                )
              })()}
            </div>
          </div>

          {/* PvP Activity Dashboard section - previous background, last on page */}
          <div className="bg-black/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-white">
                  PvP Activity Dashboard
                </h2>
                <p className="text-gray-400 mt-2">
                  Last updated: {new Date(pvpData.generatedAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Data generated at build time • {pvpData.activePvPMembers} active PvP characters
                </p>
              </div>

              {/* Guild Overview */}
              <GuildPvPOverview data={pvpData} />

              {/* Stats Summary */}
              <div className="text-center text-gray-400 text-sm">
                <p>
                  Showing PvP data for {pvpData.activePvPMembers} out of {pvpData.memberCount} guild characters
                </p>
                <p className="mt-1">
                  Data includes 2v2, 3v3 and Solo Shuffle statistics where available
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ready to Bleed Section */}
        <ReadyToBleed />
      </div>
    </div>
  )
}
