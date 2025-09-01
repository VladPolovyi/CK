import { Activity, AlertCircle } from 'lucide-react'
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import ReadyToBleed from '@/components/ReadyToBleed'
import GuildPvPOverview from '@/components/GuildPvPOverview'
import PvPBracketStats from '@/components/PvPBracketStats'
import PvPActivityTable from '@/components/PvPActivityTable'
import type { GuildPvPSummary, PvPBracketSummary } from '@/types/pvp-activity'

// Import the generated PvP activity data
async function getPvPActivityData(): Promise<GuildPvPSummary | null> {
  try {
    // Try to load the generated data file
    const pvpActivityData = await import('@/data/generated/pvp-activity.json')
    return pvpActivityData.default
  } catch (error) {
    console.error('Failed to load PvP activity data:', error)
    return null
  }
}

function generateBracketSummaries(data: GuildPvPSummary): PvPBracketSummary[] {
  const bracketTypes: Array<'2v2' | '3v3' | 'rbg' | 'solo-shuffle' | 'solo-blitz'> = ['2v2', '3v3', 'rbg', 'solo-shuffle', 'solo-blitz']
  
  return bracketTypes.map(bracketType => {
    const members: PvPBracketSummary['members'] = []
    
    data.members.forEach(member => {
      const getBracketData = () => {
        switch (bracketType) {
          case '2v2':
            return member.brackets.arena2v2 ? [member.brackets.arena2v2] : []
          case '3v3':
            return member.brackets.arena3v3 ? [member.brackets.arena3v3] : []
          case 'rbg':
            return member.brackets.rbg ? [member.brackets.rbg] : []
          case 'solo-shuffle':
            return member.brackets.soloShuffle || []
          case 'solo-blitz':
            return member.brackets.soloBlitz || []
        }
      }
      
      const bracketDataArray = getBracketData()
      
      bracketDataArray.forEach((bracketData, index) => {
          // Data is already filtered to Season 40 at build time, so just check for valid data
        if (bracketData && bracketData.rating > 0) {
          // For Solo Shuffle, use round statistics; for other brackets, use match statistics
          const isSoloShuffle = bracketType === 'solo-shuffle'
          const wins = isSoloShuffle ? (bracketData.seasonRoundWins || 0) : (bracketData.seasonWins || 0)
          const losses = isSoloShuffle ? (bracketData.seasonRoundLosses || 0) : (bracketData.seasonLosses || 0)
          const totalGames = wins + losses
          const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0
          
          members.push({
            name: member.characterName,
            realmSlug: member.realmSlug,
            rating: bracketData.rating,
            wins,
            losses,
            winRate,
            tier: bracketData.tier?.id?.toString(),
            specialization: bracketData.specialization?.name,
            characterClass: member.profile?.characterClass
          })
        }
      })
    })
    
    const totalGames = members.reduce((sum, m) => sum + m.wins + m.losses, 0)
    const totalWins = members.reduce((sum, m) => sum + m.wins, 0)
    const totalLosses = members.reduce((sum, m) => sum + m.losses, 0)
    const averageRating = members.length > 0 
      ? Math.round(members.reduce((sum, m) => sum + m.rating, 0) / members.length)
      : 0
    
    return {
      bracketType,
      members,
      averageRating,
      totalGames,
      totalWins,
      totalLosses
    }
  }).filter(bracket => bracket.members.length > 0)
}

export default async function GuildActivity() {
  const pvpData = await getPvPActivityData()

  // Handle case where no data is available
  if (!pvpData) {
    return (
      <div className="min-h-screen blood-gradient">
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

  // Generate bracket summaries from the data
  const bracketSummaries = generateBracketSummaries(pvpData)

  return (
    <div className="min-h-screen blood-gradient">
      <Navigation />
      <div className="pt-20">
        {/* Hero Section */}
        <HeroSection 
          title="Guild Activity"
          subtitle="Monitor PvP performance and track guild member statistics across all competitive brackets."
          backgroundImage="/images/maldr.jpg"
        />

        {/* Main Content */}
        <div className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
       

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



            
            {/* Member Activity Table - 3v3 Recent Activity */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-6">Arena Activity <span className="text-red-400">(Weekly)</span></h3>
              <PvPActivityTable members={pvpData.members} showRecentActivity={true} />
            </div>

             {/* Stats Summary */}
             <div className="text-center text-gray-400 text-sm">
              <p>
                Showing PvP data for {pvpData.activePvPMembers} out of {pvpData.memberCount} guild characters
              </p>
              <p className="mt-1">
                Data includes 2v2, 3v3 and Solo Shuffle statistics where available
              </p>
            </div>

       

            {/* Bracket Statistics */}
            {bracketSummaries.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-white mb-6">Bracket Performance</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {bracketSummaries.map((bracket) => (
                    <PvPBracketStats key={bracket.bracketType} bracket={bracket} />
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Ready to Bleed Section */}
        <ReadyToBleed />
      </div>
    </div>
  )
}
