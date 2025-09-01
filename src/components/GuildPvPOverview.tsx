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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Members */}
      <div className="blood-card rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Active PvP Members</p>
            <p className="text-3xl font-bold text-white">
              {data.activePvPMembers}
              <span className="text-lg text-gray-400">/{data.memberCount}</span>
            </p>
          </div>
          <Users className="h-8 w-8 text-blood-glow" />
        </div>
        <div className="mt-4">
          <div className="flex items-center text-sm">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blood-glow h-2 rounded-full transition-all duration-300"
                style={{ width: `${(data.activePvPMembers / data.memberCount) * 100}%` }}
              />
            </div>
            <span className="ml-2 text-gray-400">
              {((data.activePvPMembers / data.memberCount) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Average Rating */}
      <div className="blood-card rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Average Rating</p>
            <p className="text-3xl font-bold text-blood-light">
              {data.guildStats.averageRating.toLocaleString()}
            </p>
          </div>
          <Trophy className="h-8 w-8 text-blood-gold" />
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-400">
            Across all active PvP members
          </p>
        </div>
      </div>

      {/* Guild Win Rate */}
      <div className="blood-card rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Guild Win Rate</p>
            <p className="text-3xl font-bold text-green-400">
              {guildWinRate.toFixed(1)}%
            </p>
          </div>
          <TrendingUp className="h-8 w-8 text-green-400" />
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-400">
            {data.guildStats.totalWins}W - {data.guildStats.totalLosses}L
          </p>
        </div>
      </div>

      {/* Highest Rated Member */}
      <div className="blood-card rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Top Rated</p>
            <p className="text-xl font-bold text-white">
              {data.guildStats.highestRatedMember.name}
            </p>
            <p className="text-2xl font-bold text-blood-gold">
              {data.guildStats.highestRatedMember.rating.toLocaleString()}
            </p>
          </div>
          <Target className="h-8 w-8 text-blood-purple" />
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-400 capitalize">
            {data.guildStats.highestRatedMember.bracket.replace('-', ' ')}
          </p>
        </div>
      </div>
    </div>
  )
}
