import { Trophy, Medal, Award, Target, Users, Calendar } from 'lucide-react'
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import ReadyToBleed from '@/components/ReadyToBleed'
import { legends, recentAchievements } from '@/data/achievements'
import { blizzardGet } from '@/lib/blizzard'
import titles from '@/data/generated/pvp-titles.json'

export const revalidate = 86400

export default async function Achievements() {
  // Live guild roster (server-side)
  let rosterMembers: any[] = []
  try {
    const res = await blizzardGet('eu', '/data/wow/guild/ravencrest/cbitahok-kpobi/roster', {
      namespace: 'profile-eu',
      locale: 'en_US',
    })
    const data = await res.json()
    rosterMembers = Array.isArray(data?.members) ? data.members : []
  } catch {
    rosterMembers = []
  }

  const sortedRoster = rosterMembers
    .slice()
    .sort((a: any, b: any) => {
      const ra = typeof a?.rank === 'number' ? a.rank : Number.POSITIVE_INFINITY
      const rb = typeof b?.rank === 'number' ? b.rank : Number.POSITIVE_INFINITY
      return ra - rb
    })

  // Use pre-generated PvP titles (build-time) to avoid runtime calls
  // Create a map with name+realm as key to avoid conflicts
  const byNameAndRealm = new Map<string, any>(
    Array.isArray((titles as any)?.items)
      ? (titles as any).items.map((t: any) => [`${t.name?.toLowerCase?.() || ''}-${t.realmSlug?.toLowerCase?.() || ''}`, t])
      : []
  )
  
  // Get members with PvP achievements - include ranks 0-5 (exclude ranks 6+)
  // Members are only included if they actually have the specific achievements
  const gladiatorMembers = sortedRoster.filter((m: any) => {
    const memberData = byNameAndRealm.get(`${(m?.character?.name ?? '').toLowerCase()}-${(m?.character?.realm?.slug ?? '').toLowerCase()}`)
    return memberData && memberData.hasGladiatorEver && m.rank <= 5
  })
  const rank1Members = sortedRoster.filter((m: any) => {
    const memberData = byNameAndRealm.get(`${(m?.character?.name ?? '').toLowerCase()}-${(m?.character?.realm?.slug ?? '').toLowerCase()}`)
    return memberData && memberData.hasRank1Ever && m.rank <= 5
  })
  const legendMembers = sortedRoster.filter((m: any) => {
    const memberData = byNameAndRealm.get(`${(m?.character?.name ?? '').toLowerCase()}-${(m?.character?.realm?.slug ?? '').toLowerCase()}`)
    return memberData && memberData.hasLegendEver && m.rank <= 5
  })
  
  const strategistMembers = sortedRoster.filter((m: any) => {
    const memberData = byNameAndRealm.get(`${(m?.character?.name ?? '').toLowerCase()}-${(m?.character?.realm?.slug ?? '').toLowerCase()}`)
    
    // Debug: Log what fields are available for the first few members
    if (m.rank <= 2 && memberData) {
      console.log(`Member ${m.character?.name} data:`, Object.keys(memberData))
    }
    
    return memberData && memberData.hasStrategistEver && m.rank <= 5
  })
  
  const blitzRank1Members = sortedRoster.filter((m: any) => {
    const memberData = byNameAndRealm.get(`${(m?.character?.name ?? '').toLowerCase()}-${(m?.character?.realm?.slug ?? '').toLowerCase()}`)
    return memberData && memberData.hasRank1BlitzEver && m.rank <= 5
  })
  
  const soloRank1Members = sortedRoster.filter((m: any) => {
    const memberData = byNameAndRealm.get(`${(m?.character?.name ?? '').toLowerCase()}-${(m?.character?.realm?.slug ?? '').toLowerCase()}`)
    return memberData && memberData.hasRank1SoloEver && m.rank <= 5
  })
  
  // Debug: Show what fields are available in the first member data
  const firstMemberData = byNameAndRealm.values().next().value
  if (firstMemberData) {
    console.log('Available fields in member data:', Object.keys(firstMemberData))
  }

  // Filter members to only include those with max rank 5 (including rank 0 for guild master) for display purposes
  const maxRank5Members = sortedRoster.filter((m: any) => {
    return m.rank <= 5
  })

  return (
    <div className="min-h-screen blood-gradient">
      <Navigation />
      <div className="pt-20">
          
    

      {/* Hero Section */}
      <HeroSection 
        title="PvP Achievements"
        subtitle="Unique players who have ever achieved these PvP titles"
        backgroundImage="/images/ebo_glad.jpg"
      />

      {/* Achievement Stats */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="blood-card rounded-lg p-6 text-center">
                <img src="/images/r1.webp" alt="Rank 1" className="h-12 w-12 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white combat-text">{rank1Members.length}</div>
                <div className="text-gray-300">R1 3v3</div>
              </div>
              <div className="blood-card rounded-lg p-6 text-center">
                <img src="/images/shuffle_r1.webp" alt="Solo Rank 1" className="h-12 w-12 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white combat-text">{soloRank1Members.length}</div>
                <div className="text-gray-300">R1 Solo</div>
              </div>
              <div className="blood-card rounded-lg p-6 text-center">
                <img src="/images/blitz_r1.webp" alt="Blitz Rank 1" className="h-12 w-12 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white combat-text">{blitzRank1Members.length}</div>
                <div className="text-gray-300">R1 Blitz</div>
              </div>
            </div>
            
            {/* Second Row: Gladiator - Legend - Strategist */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="blood-card rounded-lg p-6 text-center">
                <img src="/images/gladiator.webp" alt="Gladiator" className="h-12 w-12 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white combat-text">{gladiatorMembers.length}</div>
                <div className="text-gray-300">Gladiator</div>
              </div>
              <div className="blood-card rounded-lg p-6 text-center">
                <img src="/images/legend.webp" alt="Legend" className="h-12 w-12 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white combat-text">{legendMembers.length}</div>
                <div className="text-gray-300">Legend</div>
              </div>
              <div className="blood-card rounded-lg p-6 text-center">
                <img src="/images/strategist.webp" alt="Strategist" className="h-12 w-12 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white combat-text">{strategistMembers.length}</div>
                <div className="text-gray-300">Strategist</div>
              </div>
            </div>
        </div>
      </div>
      

             {/* Main Content */}
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
                  {rank1Members.map((m: any, idx: number) => {
                    const memberData = byNameAndRealm.get(`${(m?.character?.name ?? '').toLowerCase()}-${(m?.character?.realm?.slug ?? '').toLowerCase()}`)
                    return (
                      <div key={`${m?.character?.id ?? idx}-r1`} className="flex items-center p-4 bg-dark-gray/50 rounded-lg border border-orange-500/30 hover:border-orange-400/50 hover:bg-orange-900/20 transition-all duration-200">
                        <img src="/images/r1.webp" alt="Rank 1" className="h-8 w-8 mr-3" />
                        <div className="flex-1">
                          <div className="text-white font-bold">{m?.character?.name ?? 'Unknown'}</div>
                          <div className="text-gray-300 text-sm">{m?.character?.realm?.name?.en_US ?? ''}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-orange-400 text-sm font-medium">{memberData?.realmName ?? ''}</div>
                        </div>
                      </div>
                    )
                  })}
                  {rank1Members.length === 0 && (
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
                  {soloRank1Members.map((m: any, idx: number) => {
                    const memberData = byNameAndRealm.get(`${(m?.character?.name ?? '').toLowerCase()}-${(m?.character?.realm?.slug ?? '').toLowerCase()}`)
                    return (
                      <div key={`${m?.character?.id ?? idx}-solo`} className="flex items-center p-4 bg-dark-gray/50 rounded-lg border border-orange-500/30 hover:border-orange-400/50 hover:bg-orange-900/20 transition-all duration-200">
                        <img src="/images/shuffle_r1.webp" alt="Solo Rank 1" className="h-8 w-8 mr-3" />
                        <div className="flex-1">
                          <div className="text-white font-bold">{m?.character?.name ?? 'Unknown'}</div>
                          <div className="text-gray-300 text-sm">{m?.character?.realm?.name?.en_US ?? ''}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-orange-400 text-sm font-medium">{memberData?.realmName ?? ''}</div>
                        </div>
                      </div>
                    )
                  })}
                  {soloRank1Members.length === 0 && (
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
                  {blitzRank1Members.map((m: any, idx: number) => {
                    const memberData = byNameAndRealm.get(`${(m?.character?.name ?? '').toLowerCase()}-${(m?.character?.realm?.slug ?? '').toLowerCase()}`)
                    return (
                      <div key={`${m?.character?.id ?? idx}-blitz`} className="flex items-center p-4 bg-dark-gray/50 rounded-lg border border-green-500/30 hover:border-green-400/50 hover:bg-green-900/20 transition-all duration-200">
                        <img src="/images/blitz_r1.webp" alt="Blitz Rank 1" className="h-8 w-8 mr-3" />
                        <div className="flex-1">
                          <div className="text-white font-bold">{m?.character?.name ?? 'Unknown'}</div>
                          <div className="text-gray-300 text-sm">{m?.character?.realm?.name?.en_US ?? ''}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 text-sm font-medium">{memberData?.realmName ?? ''}</div>
                        </div>
                      </div>
                    )
                  })}
                  {blitzRank1Members.length === 0 && (
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
                  {gladiatorMembers.map((m: any, idx: number) => {
                    const memberData = byNameAndRealm.get(`${(m?.character?.name ?? '').toLowerCase()}-${(m?.character?.realm?.slug ?? '').toLowerCase()}`)
                    return (
                      <div key={`${m?.character?.id ?? idx}-glad`} className="flex items-center p-4 bg-dark-gray/50 rounded-lg border border-purple-500/30 hover:border-purple-400/50 hover:bg-purple-900/20 transition-all duration-200">
                        <img src="/images/gladiator.webp" alt="Gladiator" className="h-8 w-8 mr-3" />
                        <div className="flex-1">
                          <div className="text-white font-bold">{m?.character?.name ?? 'Unknown'}</div>
                          <div className="text-gray-300 text-sm">{m?.character?.realm?.name?.en_US ?? ''}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-purple-400 text-sm font-medium">{memberData?.realmName ?? ''}</div>
                        </div>
                      </div>
                    )
                  })}
                  {gladiatorMembers.length === 0 && (
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
                  {legendMembers.map((m: any, idx: number) => {
                    const memberData = byNameAndRealm.get(`${(m?.character?.name ?? '').toLowerCase()}-${(m?.character?.realm?.slug ?? '').toLowerCase()}`)
                    return (
                      <div key={`${m?.character?.id ?? idx}-legend`} className="flex items-center p-4 bg-dark-gray/50 rounded-lg border border-yellow-500/30 hover:border-yellow-400/50 hover:bg-yellow-900/20 transition-all duration-200">
                        <img src="/images/legend.webp" alt="Legend" className="h-8 w-8 mr-3" />
                        <div className="flex-1">
                          <div className="text-white font-bold">{m?.character?.name ?? 'Unknown'}</div>
                          <div className="text-gray-300 text-sm">{m?.character?.realm?.name?.en_US ?? ''}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-400 text-sm font-medium">{memberData?.realmName ?? ''}</div>
                        </div>
                      </div>
                    )
                  })}
                  {legendMembers.length === 0 && (
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
                   {strategistMembers.map((m: any, idx: number) => {
                     const memberData = byNameAndRealm.get(`${(m?.character?.name ?? '').toLowerCase()}-${(m?.character?.realm?.slug ?? '').toLowerCase()}`)
                     return (
                       <div key={`${m?.character?.id ?? idx}-strat`} className="flex items-center p-4 bg-dark-gray/50 rounded-lg border border-green-700/30 hover:border-green-600/50 hover:bg-green-900/20 transition-all duration-200">
                         <img src="/images/strategist.webp" alt="Strategist" className="h-8 w-8 mr-3" />
                         <div className="flex-1">
                           <div className="text-white font-bold">{m?.character?.name ?? 'Unknown'}</div>
                           <div className="text-gray-300 text-sm">{m?.character?.realm?.name?.en_US ?? ''}</div>
                         </div>
                         <div className="text-right">
                           <div className="text-green-600 text-sm font-medium">{memberData?.realmName ?? ''}</div>
                         </div>
                       </div>
                     )
                   })}
                   {strategistMembers.length === 0 && (
                     <div className="text-gray-400">No Strategists found.</div>
                   )}
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ready to Bleed Section */}
      <ReadyToBleed />
    </div>
    )
  }
