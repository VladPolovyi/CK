'use client'

import { useState } from 'react'
import Image from 'next/image'
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

// Class icons: WoW class ID -> /images/classes/{id}.webp (1=Warrior … 13=Evoker)
const CLASS_ICONS: Record<string, string> = {
  'Warrior': '/images/classes/1.webp',
  'Paladin': '/images/classes/2.webp',
  'Hunter': '/images/classes/3.webp',
  'Rogue': '/images/classes/4.webp',
  'Priest': '/images/classes/5.webp',
  'Death Knight': '/images/classes/6.webp',
  'Shaman': '/images/classes/7.webp',
  'Mage': '/images/classes/8.webp',
  'Warlock': '/images/classes/9.webp',
  'Monk': '/images/classes/10.webp',
  'Druid': '/images/classes/11.webp',
  'Demon Hunter': '/images/classes/12.webp',
  'Evoker': '/images/classes/13.webp',
}

// Spec icons (same keys as PvPActivityTable); ambiguous specs use "Class-Spec"
const SPEC_ICONS: Record<string, string> = {
  'Arms': '/images/specs/71.jpg', 'Fury': '/images/specs/72.jpg', 'Protection': '/images/specs/73.jpg',
  'Holy Paladin': '/images/specs/65.jpg', 'Protection Paladin': '/images/specs/66.jpg', 'Retribution': '/images/specs/70.jpg',
  'Beast Mastery': '/images/specs/253.jpg', 'Marksmanship': '/images/specs/254.jpg', 'Survival': '/images/specs/255.jpg',
  'Assassination': '/images/specs/259.jpg', 'Outlaw': '/images/specs/260.jpg', 'Subtlety': '/images/specs/261.jpg',
  'Discipline': '/images/specs/256.jpg', 'Holy Priest': '/images/specs/257.jpg', 'Shadow': '/images/specs/258.jpg',
  'Blood': '/images/specs/250.jpg', 'Frost Death Knight': '/images/specs/251.jpg', 'Unholy': '/images/specs/252.jpg',
  'Elemental': '/images/specs/262.jpg', 'Enhancement': '/images/specs/263.jpg', 'Restoration': '/images/specs/264.jpg',
  'Shaman-Restoration': '/images/specs/264.jpg', 'Restoration Druid': '/images/specs/105.jpg', 'Druid-Restoration': '/images/specs/105.jpg',
  'Arcane': '/images/specs/62.jpg', 'Fire': '/images/specs/63.jpg', 'Frost Mage': '/images/specs/64.jpg',
  'Affliction': '/images/specs/265.jpg', 'Demonology': '/images/specs/266.jpg', 'Destruction': '/images/specs/267.jpg',
  'Brewmaster': '/images/specs/268.jpg', 'Mistweaver': '/images/specs/270.jpg', 'Windwalker': '/images/specs/269.jpg',
  'Balance': '/images/specs/102.jpg', 'Feral': '/images/specs/103.jpg', 'Guardian': '/images/specs/104.jpg',
  'Havoc': '/images/specs/577.jpg', 'Vengeance': '/images/specs/581.jpg',
  'Devastation': '/images/specs/1467.jpg', 'Preservation': '/images/specs/1468.jpg', 'Augmentation': '/images/specs/1473.jpg',
  'Paladin-Holy': '/images/specs/65.jpg', 'Priest-Holy': '/images/specs/257.jpg', 'Paladin-Protection': '/images/specs/66.jpg', 'Warrior-Protection': '/images/specs/73.jpg',
}

function getSpecIconPath(spec: string | undefined, characterClass: string | undefined): string | null {
  if (!spec) return null
  const cls = characterClass ?? ''
  if (cls && (spec === 'Restoration' || spec === 'Holy' || spec === 'Protection')) {
    const key = `${cls}-${spec}` as keyof typeof SPEC_ICONS
    if (SPEC_ICONS[key]) return SPEC_ICONS[key]
  }
  return SPEC_ICONS[spec] ?? null
}

interface LeaderboardTabsProps {
  brackets: PvPBracketSummary[]
  /** Blizzard `pvp-reward` SHUFFLE `rating_cutoff` keyed by playable specialization id */
  shuffleR1Cutoffs?: Record<number, number> | null
}

const TAB_ORDER: PvPBracketSummary['bracketType'][] = ['2v2', '3v3', 'solo-shuffle', 'solo-blitz']

export default function LeaderboardTabs({ brackets, shuffleR1Cutoffs = null }: LeaderboardTabsProps) {
  const bracketsWithoutRbg = brackets.filter(b => b.bracketType !== 'rbg')
  const sortedBrackets = [...bracketsWithoutRbg].sort(
    (a, b) => TAB_ORDER.indexOf(a.bracketType) - TAB_ORDER.indexOf(b.bracketType)
  )
  const defaultTab =
    sortedBrackets.find((b) => b.bracketType === 'solo-shuffle')?.bracketType ??
    sortedBrackets[0]?.bracketType ??
    'solo-shuffle'
  const [activeTab, setActiveTab] = useState<PvPBracketSummary['bracketType']>(defaultTab)
  const activeBracket = bracketsWithoutRbg.find(b => b.bracketType === activeTab)
  const sortedMembers = activeBracket
    ? [...activeBracket.members].sort((a, b) => b.rating - a.rating)
    : []
  const borderColor = '#2e2e31'

  return (
    <div className="w-full">
      {/* Tabs - centered, pill style */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {sortedBrackets.map((bracket) => (
          <button
            key={bracket.bracketType}
            onClick={() => setActiveTab(bracket.bracketType)}
            className={`min-w-[7rem] px-5 py-3 rounded-lg font-semibold text-base transition-all border ${
              activeTab === bracket.bracketType
                ? 'bg-blood-glow/20 text-white border-blood-glow/40 shadow-md shadow-blood-glow/10'
                : 'text-gray-400 border-[#2e2e31] bg-white/5 hover:text-gray-200 hover:bg-white/10 hover:border-gray-500/60'
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
              const cutoff =
                shuffleR1Cutoffs != null &&
                member.specializationId != null &&
                shuffleR1Cutoffs[member.specializationId] != null
                  ? shuffleR1Cutoffs[member.specializationId]
                  : undefined
              const isShuffleR1 =
                activeTab === 'solo-shuffle' && cutoff != null && member.rating >= cutoff
              const nameColor = member.characterClass
                ? (classColors[member.characterClass] ?? '#FFFFFF')
                : '#FFFFFF'
              return (
                <div
                  key={`${member.name}-${member.realmSlug}-${member.specialization ?? index}`}
                  className="grid grid-cols-[1fr_auto] grid-rows-[auto_auto] md:grid-cols-[1fr_1fr_1fr] md:grid-rows-1 gap-x-4 gap-y-3 md:gap-x-4 md:gap-y-0 items-center py-4 px-5 md:py-3 md:px-4 rounded-md border hover:bg-white/5 transition-colors"
                  style={{ borderColor }}
                >
                  {/* Rank + Class icon + Spec icon + Name - Realm (name links to Check PvP) */}
                  <div className="min-w-0 col-start-1 row-start-1 flex items-center gap-2 md:gap-3">
                    <span className="text-gray-400 font-medium shrink-0 w-6 text-right">{index + 1}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      {member.characterClass && (
                        CLASS_ICONS[member.characterClass] ? (
                          <Image
                            src={CLASS_ICONS[member.characterClass]}
                            alt={member.characterClass}
                            width={20}
                            height={20}
                            className="h-5 w-5 rounded shrink-0 object-cover"
                            title={member.characterClass}
                          />
                        ) : (
                          <div
                            className="h-5 w-5 rounded shrink-0 border border-white/20"
                            style={{ backgroundColor: classColors[member.characterClass] ?? '#4a4a4a' }}
                            title={member.characterClass}
                          />
                        )
                      )}
                      {(() => {
                        const specPath = getSpecIconPath(member.specialization, member.characterClass)
                        return specPath ? (
                          <Image
                            src={specPath}
                            alt={member.specialization ?? ''}
                            width={20}
                            height={20}
                            className="h-5 w-5 rounded shrink-0 object-cover"
                            title={member.specialization}
                          />
                        ) : member.specialization ? (
                          <div className="h-5 w-5 rounded bg-gray-600 shrink-0 flex items-center justify-center" title={member.specialization}>
                            <span className="text-[10px] text-gray-300">?</span>
                          </div>
                        ) : null
                      })()}
                    </div>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-base truncate min-w-0"
                      style={{ color: nameColor }}
                    >
                      {member.name}
                      <span className="text-gray-400"> - {realmDisplay}</span>
                    </a>
                  </div>

                  {/* Stats: equal columns on desktop; flex row on mobile */}
                  <div className="col-span-2 col-start-1 row-start-2 pt-2 flex flex-wrap items-center gap-x-4 md:contents">
                    <span className={`text-base md:text-lg tabular-nums md:text-left md:block ${isShuffleR1 ? 'font-bold text-orange-400' : 'font-bold text-white'}`}>
                      {member.rating}
                    </span>
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
