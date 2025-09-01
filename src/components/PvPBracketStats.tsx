'use client'

import { Trophy, Sword, Target, Users, TrendingUp } from 'lucide-react'
import type { PvPBracketSummary } from '@/types/pvp-activity'

interface PvPBracketStatsProps {
  bracket: PvPBracketSummary
}

const bracketIcons = {
  '2v2': Users,
  '3v3': Target,
  'rbg': Sword,
  'solo-shuffle': Trophy,
  'solo-blitz': TrendingUp
}

const bracketColors = {
  '2v2': 'text-blue-400',
  '3v3': 'text-purple-400', 
  'rbg': 'text-red-400',
  'solo-shuffle': 'text-yellow-400',
  'solo-blitz': 'text-green-400'
}

const bracketNames = {
  '2v2': '2v2 Arena',
  '3v3': '3v3 Arena',
  'rbg': 'Rated Battlegrounds',
  'solo-shuffle': 'Solo Shuffle',
  'solo-blitz': 'Solo Blitz'
}

// WoW Class Colors (exact hex values from official game)
const classColors = {
  'Warrior': '#C69B6D',      // Tan
  'Paladin': '#F48CBA',      // Pink
  'Hunter': '#AAD372',       // Pistachio
  'Rogue': '#FFF468',        // Yellow
  'Priest': '#FFFFFF',       // White
  'Death Knight': '#C41E3A', // Red
  'Shaman': '#0070DD',       // Blue
  'Mage': '#3FC7EB',         // Light Blue
  'Warlock': '#8788EE',      // Purple
  'Monk': '#00FF98',         // Spring Green
  'Druid': '#FF7C0A',        // Orange
  'Demon Hunter': '#A330C9', // Dark Magenta
  'Evoker': '#33937F'        // Dark Emerald
}

export default function PvPBracketStats({ bracket }: PvPBracketStatsProps) {
  const Icon = bracketIcons[bracket.bracketType]
  const iconColor = bracketColors[bracket.bracketType]
  const bracketName = bracketNames[bracket.bracketType]
  
  const winRate = bracket.totalGames > 0 ? (bracket.totalWins / bracket.totalGames) * 100 : 0

  return (
    <div className="blood-card rounded-lg p-6">
      {/* Header with Stats */}
      <div className="flex items-center mb-6">
        <div className="flex items-center space-x-3 w-2/5">
          <Icon className={`h-8 w-8 ${iconColor}`} />
          <div>
            <h3 className="text-xl font-bold text-white">{bracketName}</h3>
            <p className="text-gray-400 text-sm">{bracket.members.length} active members</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 w-3/5">
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">{bracket.totalWins}</div>
            <div className="text-xs text-gray-400">Wins</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-400">{bracket.totalLosses}</div>
            <div className="text-xs text-gray-400">Losses</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blood-glow">{winRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-400">Win Rate</div>
          </div>
        </div>
      </div>

      {/* Top Members */}
      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Top Performers</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {bracket.members
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3)
            .map((member, index) => (
              <div key={`${member.name}-${member.realmSlug}`} className="flex items-center justify-between py-2 px-3 bg-black/20 rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 flex items-center justify-center text-xs font-bold text-yellow-400">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="font-medium"
                        style={{ 
                          color: member.characterClass 
                            ? classColors[member.characterClass as keyof typeof classColors] || '#FFFFFF'
                            : '#FFFFFF'
                        }}
                      >
                        {member.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {member.wins}W-{member.losses}L ({member.winRate.toFixed(1)}%)
                      </div>
                    </div>
                    {member.specialization && (
                      <div className="text-xs text-gray-400">{member.specialization}</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                                      <div className="text-yellow-200 font-bold">{member.rating}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
