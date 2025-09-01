'use client'

import { Trophy, Users, TrendingUp, Target, Activity } from 'lucide-react'
import type { GuildPvPSummary } from '@/types/pvp-activity'

interface GuildPvPOverviewProps {
  data: GuildPvPSummary
}

export default function GuildPvPOverview({ data }: GuildPvPOverviewProps) {
  const guildWinRate = data.guildStats.totalGames > 0
    ? (data.guildStats.totalWins / data.guildStats.totalGames) * 100
    : 0

  // Calculate interesting statistics
  const classCounts: Record<string, number> = {}
  const bracketCounts = { '2v2': 0, '3v3': 0, 'rbg': 0, 'solo-shuffle': 0, 'solo-blitz': 0 }

  data.members.forEach(member => {
    // Class distribution
    if (member.profile?.characterClass) {
      classCounts[member.profile.characterClass] = (classCounts[member.profile.characterClass] || 0) + 1
    }

    // Bracket participation
    if (member.brackets.arena2v2) bracketCounts['2v2']++
    if (member.brackets.arena3v3) bracketCounts['3v3']++
    if (member.brackets.rbg) bracketCounts['rbg']++
    if (member.brackets.soloShuffle && member.brackets.soloShuffle.length > 0) bracketCounts['solo-shuffle']++
    if (member.brackets.soloBlitz && member.brackets.soloBlitz.length > 0) bracketCounts['solo-blitz']++
  })

  const mostPopularClass = Object.entries(classCounts).sort((a, b) => b[1] - a[1])[0]
  const mostActiveBracket = Object.entries(bracketCounts).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Active Members */}
      <div className="blood-card rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
                            <p className="text-gray-400 text-sm">Active PvP Characters</p>
            <p className="text-3xl font-bold text-white">
              {data.activePvPMembers}
            </p>
          </div>
          <Users className="h-8 w-8 text-blood-glow" />
        </div>
        <div className="mt-4">
                      <p className="text-sm text-gray-400">
              Season 40 characters
            </p>
        </div>
      </div>


      {/* Total Games Played */}
      <div className="blood-card rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Games Played</p>
            <p className="text-3xl font-bold text-blue-400">
              {data.guildStats.totalGames.toLocaleString()}
            </p>
          </div>
          <Activity className="h-8 w-8 text-blue-400" />
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-400">
            Season 40 total matches
          </p>
        </div>
      </div>

      {/* Total Wins */}
      <div className="blood-card rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Wins</p>
            <p className="text-3xl font-bold text-green-400">
              {data.guildStats.totalWins.toLocaleString()}
            </p>
          </div>
          <TrendingUp className="h-8 w-8 text-green-400" />
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-400">
            Season 40 victories
          </p>
        </div>
      </div>

      {/* Total Losses */}
      <div className="blood-card rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Total Losses</p>
            <p className="text-3xl font-bold text-red-400">
              {data.guildStats.totalLosses.toLocaleString()}
            </p>
          </div>
          <TrendingUp className="h-8 w-8 text-red-400 rotate-180" />
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-400">
            Season 40 defeats
          </p>
        </div>
      </div>
    </div>
  )
}
