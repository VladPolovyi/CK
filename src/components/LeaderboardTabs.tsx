'use client'

import { useState } from 'react'
import type { PvPBracketSummary } from '@/types/pvp-activity'

const CHECK_PVP_BASE = 'https://check-pvp.fr/eu'

function checkPvpUrl(realmSlug: string, characterName: string): string {
  const realm = (realmSlug || 'Ravencrest').replace(/-/g, ' ')
  return `${CHECK_PVP_BASE}/${encodeURIComponent(realm)}/${encodeURIComponent(characterName)}`
}

const bracketNames: Record<PvPBracketSummary['bracketType'], string> = {
  '2v2': '2v2 Arena',
  '3v3': '3v3 Arena',
  'rbg': 'Rated Battlegrounds',
  'solo-shuffle': 'Solo Shuffle',
  'solo-blitz': 'Solo Blitz'
}

const classColors: Record<string, string> = {
  'Warrior': '#C69B6D',
  'Paladin': '#F48CBA',
  'Hunter': '#AAD372',
  'Rogue': '#FFF468',
  'Priest': '#FFFFFF',
  'Death Knight': '#C41E3A',
  'Shaman': '#0070DD',
  'Mage': '#3FC7EB',
  'Warlock': '#8788EE',
  'Monk': '#00FF98',
  'Druid': '#FF7C0A',
  'Demon Hunter': '#A330C9',
  'Evoker': '#33937F'
}

interface LeaderboardTabsProps {
  brackets: PvPBracketSummary[]
}

const TAB_ORDER: PvPBracketSummary['bracketType'][] = ['2v2', '3v3', 'solo-shuffle', 'solo-blitz', 'rbg']

export default function LeaderboardTabs({ brackets }: LeaderboardTabsProps) {
  const sortedBrackets = [...brackets].sort(
    (a, b) => TAB_ORDER.indexOf(a.bracketType) - TAB_ORDER.indexOf(b.bracketType)
  )
  const [activeTab, setActiveTab] = useState<PvPBracketSummary['bracketType']>(sortedBrackets[0]?.bracketType ?? '2v2')
  const activeBracket = brackets.find(b => b.bracketType === activeTab)
  const sortedMembers = activeBracket
    ? [...activeBracket.members].sort((a, b) => b.rating - a.rating)
    : []
  const borderColor = '#2e2e31'

  return (
    <div className="w-full">
      {/* Tabs - pill style */}
      <div className="flex flex-wrap gap-2 mb-6">
        {sortedBrackets.map((bracket) => (
          <button
            key={bracket.bracketType}
            onClick={() => setActiveTab(bracket.bracketType)}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors border ${
              activeTab === bracket.bracketType
                ? 'bg-blood-glow/15 text-white border-[#2e2e31]'
                : 'text-gray-400 border-[#2e2e31]'
            }`}
          >
            {bracketNames[bracket.bracketType]} ({bracket.members.length})
          </button>
        ))}
      </div>

      {/* List of rows - same structure as achievements list */}
      {activeBracket && (
        <div className="rounded-lg space-y-2">
          {sortedMembers.length === 0 ? (
            <div className="text-gray-400 text-sm py-2">No members in this bracket.</div>
          ) : (
            sortedMembers.map((member, index) => {
              const realmDisplay = (member.realmSlug || '').replace(/-/g, ' ')
              const url = checkPvpUrl(member.realmSlug, member.name)
              return (
                <div
                  key={`${member.name}-${member.realmSlug}-${member.specialization ?? index}`}
                  className="grid grid-cols-[1fr_auto] grid-rows-[auto_auto] md:grid-cols-[1fr_1fr_1fr] md:grid-rows-1 gap-x-4 gap-y-3 md:gap-x-4 md:gap-y-0 items-center py-4 px-5 md:py-3 md:px-4 rounded-md border hover:bg-white/5 transition-colors"
                  style={{ borderColor }}
                >
                  {/* Rank + Name - Realm (name links to Check PvP) */}
                  <div className="min-w-0 col-start-1 row-start-1 flex items-center gap-3">
                    <span className="text-gray-400 font-medium shrink-0 w-6 text-right">{index + 1}</span>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-base truncate"
                      style={{
                        color: member.characterClass
                          ? (classColors[member.characterClass] ?? '#FFFFFF')
                          : '#FFFFFF'
                      }}
                    >
                      {member.name}
                      <span className="text-gray-400"> - {realmDisplay}</span>
                    </a>
                  </div>

                  {/* Stats: equal columns on desktop; flex row on mobile */}
                  <div className="col-span-2 col-start-1 row-start-2 pt-2 flex flex-wrap items-center gap-x-4 md:contents">
                    <span className="font-bold text-white text-sm tabular-nums md:text-left md:block">{member.rating}</span>
                    <span className="text-sm inline-flex items-center gap-1.5">
                      <span className="text-green-500 font-medium">{member.wins}W</span>
                      <span className="text-gray-500">/</span>
                      <span className="text-red-500 font-medium">{member.losses}L</span>
                      <span className="text-gray-400 ml-1">{member.winRate.toFixed(1)}%</span>
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
