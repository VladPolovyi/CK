'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Trophy, Users, Target, Sword, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import type { PvPActivityData } from '@/types/pvp-activity'

interface PvPActivityTableProps {
  members: PvPActivityData[]
  bracketFilter?: '2v2' | '3v3' | 'rbg' | 'solo-shuffle' | 'solo-blitz'
  showRecentActivity?: boolean
}

type SortField = 'name' | 'rating' | 'winRate' | 'totalGames' | 'totalWins'
type SortDirection = 'asc' | 'desc'

const bracketIcons = {
  arena2v2: Users,
  arena3v3: Target,
  rbg: Sword,
  soloShuffle: Trophy,
  soloBlitz: TrendingUp
}

const bracketNames = {
  arena2v2: '2v2',
  arena3v3: '3v3',
  rbg: 'RBG',
  soloShuffle: 'Shuffle',
  soloBlitz: 'Blitz'
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

// Specialization Icons (using official WoW specialization IDs)
const specIcons = {
  // Warrior
  'Arms': '/images/specs/71.jpg',           // Arms Warrior
  'Fury': '/images/specs/72.jpg',           // Fury Warrior
  'Protection': '/images/specs/73.jpg',     // Protection Warrior
  
  // Paladin
  'Holy Paladin': '/images/specs/65.jpg',           // Holy Paladin
  'Protection Paladin': '/images/specs/66.jpg',     // Protection Paladin
  'Retribution': '/images/specs/70.jpg',    // Retribution Paladin
  
  // Hunter
  'Beast Mastery': '/images/specs/253.jpg', // Beast Mastery Hunter
  'Marksmanship': '/images/specs/254.jpg',  // Marksmanship Hunter
  'Survival': '/images/specs/255.jpg',      // Survival Hunter
  
  // Rogue
  'Assassination': '/images/specs/259.jpg', // Assassination Rogue
  'Outlaw': '/images/specs/260.jpg',        // Outlaw Rogue
  'Subtlety': '/images/specs/261.jpg',      // Subtlety Rogue
  
  // Priest
  'Discipline': '/images/specs/256.jpg',    // Discipline Priest
  'Holy Priest': '/images/specs/257.jpg',          // Holy Priest
  'Shadow': '/images/specs/258.jpg',        // Shadow Priest
  
  // Death Knight
  'Blood': '/images/specs/250.jpg',         // Blood Death Knight
  'Frost Death Knight': '/images/specs/251.jpg',         // Frost Death Knight
  'Unholy': '/images/specs/252.jpg',        // Unholy Death Knight
  
  // Shaman
  'Elemental': '/images/specs/262.jpg',     // Elemental Shaman
  'Enhancement': '/images/specs/263.jpg',   // Enhancement Shaman
  'Restoration': '/images/specs/264.jpg',   // Restoration Shaman
  
  // Mage
  'Arcane': '/images/specs/62.jpg',         // Arcane Mage
  'Fire': '/images/specs/63.jpg',           // Fire Mage
  'Frost Mage': '/images/specs/64.jpg',          // Frost Mage
  
  // Warlock
  'Affliction': '/images/specs/265.jpg',    // Affliction Warlock
  'Demonology': '/images/specs/266.jpg',    // Demonology Warlock
  'Destruction': '/images/specs/267.jpg',   // Destruction Warlock
  
  // Monk
  'Brewmaster': '/images/specs/268.jpg',    // Brewmaster Monk
  'Mistweaver': '/images/specs/270.jpg',    // Mistweaver Monk
  'Windwalker': '/images/specs/269.jpg',    // Windwalker Monk
  
  // Druid
  'Balance': '/images/specs/102.jpg',       // Balance Druid
  'Feral': '/images/specs/103.jpg',         // Feral Druid
  'Guardian': '/images/specs/104.jpg',      // Guardian Druid
  'Restoration Druid': '/images/specs/105.jpg',   // Restoration Druid
  
  // Demon Hunter
  'Havoc': '/images/specs/577.jpg',         // Havoc Demon Hunter
  'Vengeance': '/images/specs/581.jpg',     // Vengeance Demon Hunter
  
  // Evoker
  'Devastation': '/images/specs/1467.jpg',  // Devastation Evoker
  'Preservation': '/images/specs/1468.jpg', // Preservation Evoker
  'Augmentation': '/images/specs/1473.jpg'  // Augmentation Evoker
}

export default function PvPActivityTable({ members, bracketFilter, showRecentActivity = false }: PvPActivityTableProps) {
  const [sortField, setSortField] = useState<SortField>('rating')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'2v2' | '3v3' | 'solo-shuffle' | 'solo-blitz'>('3v3')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  // Filter members based on active tab and recent activity
  const filteredMembers = members.filter(member => {
    // Apply bracket filter based on active tab
    let hasBracketData = false
    switch (activeTab) {
      case '2v2':
        hasBracketData = !!(member.brackets.arena2v2 && member.brackets.arena2v2.rating > 0)
        break
      case '3v3':
        hasBracketData = !!(member.brackets.arena3v3 && member.brackets.arena3v3.rating > 0)
        break
      case 'solo-shuffle':
        hasBracketData = !!(member.brackets.soloShuffle && member.brackets.soloShuffle.length > 0)
        break
      case 'solo-blitz':
        hasBracketData = !!(member.brackets.soloBlitz && member.brackets.soloBlitz.length > 0 && 
          member.brackets.soloBlitz.some(spec => (spec.seasonWins + spec.seasonLosses) > 0))
        break
    }

    if (!hasBracketData) return false

    // Apply recent activity filter if enabled
    if (showRecentActivity) {
      switch (activeTab) {
        case '2v2':
          const stats2v2 = member.brackets.arena2v2
          return stats2v2 && (stats2v2.weeklyWins > 0 || stats2v2.weeklyLosses > 0)
        case '3v3':
          const stats3v3 = member.brackets.arena3v3
          return stats3v3 && (stats3v3.weeklyWins > 0 || stats3v3.weeklyLosses > 0)
        case 'solo-shuffle':
          const statsSoloShuffle = member.brackets.soloShuffle
          return statsSoloShuffle && statsSoloShuffle.some(spec => (spec.weeklyRoundWins || 0) > 0 || (spec.weeklyRoundLosses || 0) > 0)
        case 'solo-blitz':
          const statsSoloBlitz = member.brackets.soloBlitz
          return statsSoloBlitz && statsSoloBlitz.some(spec => (spec.weeklyWins || 0) > 0 || (spec.weeklyLosses || 0) > 0)
        default:
          return true
      }
    }

    return true
  })

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    let aValue: number | string
    let bValue: number | string

    // Get bracket-specific values when filtering
    const getBracketValue = (member: PvPActivityData, field: SortField) => {
      if (activeTab === 'solo-shuffle') {
        const soloShuffleStats = member.brackets.soloShuffle
        if (!soloShuffleStats || soloShuffleStats.length === 0) return 0
        
        // For solo shuffle, get the highest rating and aggregate stats
        const highestRating = Math.max(...soloShuffleStats.map(spec => spec.rating))
        const totalWins = soloShuffleStats.reduce((sum, spec) => sum + (showRecentActivity ? (spec.weeklyRoundWins || 0) : (spec.seasonRoundWins || 0)), 0)
        const totalLosses = soloShuffleStats.reduce((sum, spec) => sum + (showRecentActivity ? (spec.weeklyRoundLosses || 0) : (spec.seasonRoundLosses || 0)), 0)
        const totalGames = totalWins + totalLosses

        switch (field) {
          case 'rating': return highestRating
          case 'winRate': return totalGames > 0 ? (totalWins / totalGames) * 100 : 0
          case 'totalGames': return totalGames
          case 'totalWins': return totalWins
          default: return 0
        }
      } else if (activeTab === 'solo-blitz') {
        const soloBlitzStats = member.brackets.soloBlitz
        if (!soloBlitzStats || soloBlitzStats.length === 0) return 0
        
        // For solo blitz, get the highest rating and aggregate stats (using match statistics, not rounds)
        const highestRating = Math.max(...soloBlitzStats.map(spec => spec.rating))
        const totalWins = soloBlitzStats.reduce((sum, spec) => sum + (showRecentActivity ? (spec.weeklyWins || 0) : (spec.seasonWins || 0)), 0)
        const totalLosses = soloBlitzStats.reduce((sum, spec) => sum + (showRecentActivity ? (spec.weeklyLosses || 0) : (spec.seasonLosses || 0)), 0)
        const totalGames = totalWins + totalLosses

        switch (field) {
          case 'rating': return highestRating
          case 'winRate': return totalGames > 0 ? (totalWins / totalGames) * 100 : 0
          case 'totalGames': return totalGames
          case 'totalWins': return totalWins
          default: return 0
        }
      } else {
        const getStats = (bracket: '2v2' | '3v3') => {
          switch (bracket) {
            case '2v2': return member.brackets.arena2v2
            case '3v3': return member.brackets.arena3v3
          }
        }

        const stats = getStats(activeTab as '2v2' | '3v3')
        if (!stats) return 0

        // Use weekly data for recent activity, season data otherwise
        const wins = showRecentActivity ? stats.weeklyWins : stats.seasonWins
        const losses = showRecentActivity ? stats.weeklyLosses : stats.seasonLosses
        const totalGames = wins + losses

        switch (field) {
          case 'rating': return stats.rating
          case 'winRate': return totalGames > 0 ? (wins / totalGames) * 100 : 0
          case 'totalGames': return totalGames
          case 'totalWins': return wins
          default: return 0
        }
      }
    }

    switch (sortField) {
      case 'name':
        aValue = a.characterName.toLowerCase()
        bValue = b.characterName.toLowerCase()
        break
      case 'rating':
        aValue = getBracketValue(a, 'rating')
        bValue = getBracketValue(b, 'rating')
        break
      case 'winRate':
        aValue = getBracketValue(a, 'winRate')
        bValue = getBracketValue(b, 'winRate')
        break
      case 'totalGames':
        aValue = getBracketValue(a, 'totalGames')
        bValue = getBracketValue(b, 'totalGames')
        break
      case 'totalWins':
        aValue = getBracketValue(a, 'totalWins')
        bValue = getBracketValue(b, 'totalWins')
        break
      default:
        aValue = 0
        bValue = 0
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    return sortDirection === 'asc' 
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number)
  })

  // Pagination logic
  const totalPages = Math.ceil(sortedMembers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPageMembers = sortedMembers.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    setExpandedRows(new Set()) // Clear expanded rows when changing pages
  }

  // Reset to first page when tab changes
  React.useEffect(() => {
    setCurrentPage(1)
    setExpandedRows(new Set())
  }, [activeTab])

  const toggleRow = (memberKey: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(memberKey)) {
      newExpanded.delete(memberKey)
    } else {
      newExpanded.add(memberKey)
    }
    setExpandedRows(newExpanded)
  }

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th 
      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </th>
  )

  return (
    <div className="blood-card rounded-lg overflow-hidden">
      {/* Tabs for 2v2/3v3 */}
      <div className="border-b border-gray-600">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('2v2')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === '2v2'
                ? 'border-blood-glow text-blood-glow'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>2v2 Arena</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('3v3')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === '3v3'
                ? 'border-blood-glow text-blood-glow'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>3v3 Arena</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('solo-shuffle')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'solo-shuffle'
                ? 'border-blood-glow text-blood-glow'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Solo Shuffle</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('solo-blitz')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'solo-blitz'
                ? 'border-blood-glow text-blood-glow'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Solo Blitz</span>
            </div>
          </button>
        </nav>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-black/30">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider w-16">
                <span>Details</span>
              </th>
              <SortHeader field="name">Member</SortHeader>
              <SortHeader field="rating">Highest Rating</SortHeader>
              <SortHeader field="totalWins">{showRecentActivity ? 'Recent Wins' : 'Total Wins'}</SortHeader>
              <SortHeader field="totalGames">Games</SortHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {currentPageMembers.map((member) => {
              const memberKey = `${member.characterName}-${member.realmSlug}`
              const isExpanded = expandedRows.has(memberKey)
              
              return (
                <React.Fragment key={memberKey}>
                  <tr className="hover:bg-black/20 transition-colors">
                    <td className="px-4 py-2 w-16">
                      <button
                        onClick={() => toggleRow(memberKey)}
                        className="text-blood-glow hover:text-blood-light transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </td>
                    <td className="pl-2 pr-4 py-2">
                      <div className="flex items-center space-x-2">
                        {(() => {
                          const spec = member.profile?.activeSpec
                          const characterClass = member.profile?.characterClass
                          
                          // Create a unique key combining class and spec to avoid conflicts
                          const specKey = characterClass && spec ? `${characterClass}-${spec}` : spec
                          
                          // Special handling for specs that exist in multiple classes
                          let iconPath = null
                          if (specKey) {
                            if (specKey === 'Shaman-Restoration') {
                              iconPath = '/images/specs/264.jpg'  // Restoration Shaman
                            } else if (specKey === 'Druid-Restoration') {
                              iconPath = '/images/specs/105.jpg'  // Restoration Druid
                            } else if (specKey === 'Paladin-Holy') {
                              iconPath = '/images/specs/65.jpg'   // Holy Paladin
                            } else if (specKey === 'Priest-Holy') {
                              iconPath = '/images/specs/257.jpg'  // Holy Priest
                            } else if (specKey === 'Paladin-Protection') {
                              iconPath = '/images/specs/66.jpg'   // Protection Paladin
                            } else if (specKey === 'Warrior-Protection') {
                              iconPath = '/images/specs/73.jpg'   // Protection Warrior
                            } else {
                              // For specs that don't have conflicts, use the original mapping
                              iconPath = specIcons[spec as keyof typeof specIcons]
                            }
                          }
                          
                          return iconPath ? (
                            <Image 
                              src={iconPath} 
                              alt={spec} 
                              width={16}
                              height={16}
                              className="h-4 w-4" 
                              title={spec}
                            />
                          ) : (
                            <div className="h-4 w-4 rounded-full bg-gray-600 flex items-center justify-center">
                              <span className="text-xs text-gray-300">?</span>
                            </div>
                          )
                        })()}
                        <span 
                          className="font-medium"
                          style={{ 
                            color: member.profile?.characterClass 
                              ? classColors[member.profile.characterClass as keyof typeof classColors] || '#FFFFFF'
                              : '#FFFFFF'
                          }}
                        >
                          {member.characterName}
                        </span>
                        <span className="text-gray-400 text-sm capitalize">- {member.realmSlug}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {(() => {
                        if (activeTab === '3v3' && member.brackets.arena3v3) {
                          const stats = member.brackets.arena3v3
                          return (
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-bold text-lg">{stats.rating}</span>
                              <span className="text-gray-400 text-sm">3v3</span>
                            </div>
                          )
                        } else if (activeTab === '2v2' && member.brackets.arena2v2) {
                          const stats = member.brackets.arena2v2
                          return (
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-bold text-lg">{stats.rating}</span>
                              <span className="text-gray-400 text-sm">2v2</span>
                            </div>
                          )
                        } else if (activeTab === 'solo-shuffle' && member.brackets.soloShuffle && member.brackets.soloShuffle.length > 0) {
                          const highestRating = Math.max(...member.brackets.soloShuffle.map(spec => spec.rating))
                          return (
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-bold text-lg">{highestRating}</span>
                              <span className="text-gray-400 text-sm">Shuffle</span>
                            </div>
                          )
                        } else if (activeTab === 'solo-blitz' && member.brackets.soloBlitz && member.brackets.soloBlitz.length > 0) {
                          const highestRating = Math.max(...member.brackets.soloBlitz.map(spec => spec.rating))
                          return (
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-bold text-lg">{highestRating}</span>
                              <span className="text-gray-400 text-sm">Blitz</span>
                            </div>
                          )
                        } else {
                          return (
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-bold text-lg">0</span>
                              <span className="text-gray-400 text-sm">No Data</span>
                            </div>
                          )
                        }
                      })()}
                    </td>

                    <td className="px-4 py-2">
                      {(() => {
                        if (activeTab === '3v3' && member.brackets.arena3v3) {
                          const stats = member.brackets.arena3v3
                          const wins = showRecentActivity ? stats.weeklyWins : stats.seasonWins
                          const losses = showRecentActivity ? stats.weeklyLosses : stats.seasonLosses
                          const totalGames = wins + losses
                          const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0
                          return (
                            <div className="flex items-center">
                              <div className="text-white font-medium">
                                <span className="text-green-400">{wins.toLocaleString()}</span>
                                <span className="text-gray-400 mx-1">/</span>
                                <span className="text-red-400">{losses.toLocaleString()}</span>
                              </div>
                              <div className="text-gray-500 text-sm ml-1">{winRate.toFixed(1)}%</div>
                            </div>
                          )
                        } else if (activeTab === '2v2' && member.brackets.arena2v2) {
                          const stats = member.brackets.arena2v2
                          const wins = showRecentActivity ? stats.weeklyWins : stats.seasonWins
                          const losses = showRecentActivity ? stats.weeklyLosses : stats.seasonLosses
                          const totalGames = wins + losses
                          const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0
                          return (
                            <div className="flex items-center">
                              <div className="text-white font-medium">
                                <span className="text-green-400">{wins.toLocaleString()}</span>
                                <span className="text-gray-400 mx-1">/</span>
                                <span className="text-red-400">{losses.toLocaleString()}</span>
                              </div>
                              <div className="text-gray-500 text-sm ml-1">{winRate.toFixed(1)}%</div>
                            </div>
                          )
                        } else if (activeTab === 'solo-shuffle' && member.brackets.soloShuffle && member.brackets.soloShuffle.length > 0) {
                          const totalWins = member.brackets.soloShuffle.reduce((sum, spec) => sum + (showRecentActivity ? (spec.weeklyRoundWins || 0) : (spec.seasonRoundWins || 0)), 0)
                          const totalLosses = member.brackets.soloShuffle.reduce((sum, spec) => sum + (showRecentActivity ? (spec.weeklyRoundLosses || 0) : (spec.seasonRoundLosses || 0)), 0)
                          const totalGames = totalWins + totalLosses
                          const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0
                          return (
                            <div className="flex items-center">
                              <div className="text-white font-medium">
                                <span className="text-green-400">{totalWins.toLocaleString()}</span>
                                <span className="text-gray-400 mx-1">/</span>
                                <span className="text-red-400">{totalLosses.toLocaleString()}</span>
                              </div>
                              <div className="text-gray-500 text-sm ml-1">{winRate.toFixed(1)}%</div>
                            </div>
                          )
                        } else if (activeTab === 'solo-blitz' && member.brackets.soloBlitz && member.brackets.soloBlitz.length > 0) {
                          const totalWins = member.brackets.soloBlitz.reduce((sum, spec) => sum + (showRecentActivity ? (spec.weeklyWins || 0) : (spec.seasonWins || 0)), 0)
                          const totalLosses = member.brackets.soloBlitz.reduce((sum, spec) => sum + (showRecentActivity ? (spec.weeklyLosses || 0) : (spec.seasonLosses || 0)), 0)
                          const totalGames = totalWins + totalLosses
                          const winRate = totalGames > 0 ? (totalWins / totalGames) * 100 : 0
                          return (
                            <div className="flex items-center">
                              <div className="text-white font-medium">
                                <span className="text-green-400">{totalWins.toLocaleString()}</span>
                                <span className="text-gray-400 mx-1">/</span>
                                <span className="text-red-400">{totalLosses.toLocaleString()}</span>
                              </div>
                              <div className="text-gray-500 text-sm ml-1">{winRate.toFixed(1)}%</div>
                            </div>
                          )
                        } else {
                          return (
                            <div className="flex items-center">
                              <div className="text-white font-medium">
                                <span className="text-gray-500">0</span>
                                <span className="text-gray-400 mx-1">/</span>
                                <span className="text-gray-500">0</span>
                              </div>
                              <div className="text-gray-500 text-sm ml-1">0.0%</div>
                            </div>
                          )
                        }
                      })()}
                    </td>
                    <td className="px-4 py-2">
                      {(() => {
                        if (activeTab === '3v3' && member.brackets.arena3v3) {
                          const stats = member.brackets.arena3v3
                          const wins = showRecentActivity ? stats.weeklyWins : stats.seasonWins
                          const losses = showRecentActivity ? stats.weeklyLosses : stats.seasonLosses
                          return <div className="text-white font-medium">{(wins + losses).toLocaleString()}</div>
                        } else if (activeTab === '2v2' && member.brackets.arena2v2) {
                          const stats = member.brackets.arena2v2
                          const wins = showRecentActivity ? stats.weeklyWins : stats.seasonWins
                          const losses = showRecentActivity ? stats.weeklyLosses : stats.seasonLosses
                          return <div className="text-white font-medium">{(wins + losses).toLocaleString()}</div>
                        } else if (activeTab === 'solo-shuffle' && member.brackets.soloShuffle && member.brackets.soloShuffle.length > 0) {
                          const totalWins = member.brackets.soloShuffle.reduce((sum, spec) => sum + (showRecentActivity ? (spec.weeklyRoundWins || 0) : (spec.seasonRoundWins || 0)), 0)
                          const totalLosses = member.brackets.soloShuffle.reduce((sum, spec) => sum + (showRecentActivity ? (spec.weeklyRoundLosses || 0) : (spec.seasonRoundLosses || 0)), 0)
                          return <div className="text-white font-medium">{(totalWins + totalLosses).toLocaleString()}</div>
                        } else if (activeTab === 'solo-blitz' && member.brackets.soloBlitz && member.brackets.soloBlitz.length > 0) {
                          const totalWins = member.brackets.soloBlitz.reduce((sum, spec) => sum + (showRecentActivity ? (spec.weeklyWins || 0) : (spec.seasonWins || 0)), 0)
                          const totalLosses = member.brackets.soloBlitz.reduce((sum, spec) => sum + (showRecentActivity ? (spec.weeklyLosses || 0) : (spec.seasonLosses || 0)), 0)
                          return <div className="text-white font-medium">{(totalWins + totalLosses).toLocaleString()}</div>
                        } else {
                          return <div className="text-white font-medium">0</div>
                        }
                      })()}
                    </td>

                  </tr>
                  
                  {isExpanded && (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 bg-black/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {(() => {
                            if (activeTab === '3v3' && member.brackets.arena3v3) {
                                const stats = member.brackets.arena3v3
                                return (
                                  <div className="bg-black/20 rounded-lg p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <Target className="h-4 w-4 text-blood-glow" />
                                      <span className="text-white font-medium">3v3 Arena</span>
                                      {showRecentActivity && (
                                        <span className="text-xs text-blood-glow bg-black/30 px-2 py-1 rounded">Recent Activity</span>
                                      )}
                                    </div>
                                    <div className="space-y-1 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Rating:</span>
                                        <span className="text-white font-bold">{stats.rating}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Season:</span>
                                        <span className="text-white">{stats.seasonWins}W-{stats.seasonLosses}L</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Weekly:</span>
                                        <span className={`${showRecentActivity ? 'text-blood-glow font-bold' : 'text-white'}`}>
                                          {stats.weeklyWins}W-{stats.weeklyLosses}L
                                        </span>
                                      </div>
                                      {stats.tier && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">Tier:</span>
                                          <span className="text-blue-400">Tier {stats.tier.id}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              } else if (activeTab === '2v2' && member.brackets.arena2v2) {
                                const stats = member.brackets.arena2v2
                                return (
                                  <div className="bg-black/20 rounded-lg p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <Users className="h-4 w-4 text-blood-glow" />
                                      <span className="text-white font-medium">2v2 Arena</span>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Rating:</span>
                                        <span className="text-white font-bold">{stats.rating}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Season:</span>
                                        <span className="text-white">{stats.seasonWins}W-{stats.seasonLosses}L</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-400">Weekly:</span>
                                        <span className="text-white">{stats.weeklyWins}W-{stats.weeklyLosses}L</span>
                                      </div>
                                      {stats.tier && (
                                        <div className="flex justify-between">
                                          <span className="text-gray-400">Tier:</span>
                                          <span className="text-blue-400">Tier {stats.tier.id}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              } else if (activeTab === 'solo-shuffle' && member.brackets.soloShuffle && member.brackets.soloShuffle.length > 0) {
                                return (
                                  <div className="bg-black/20 rounded-lg p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <Trophy className="h-4 w-4 text-blood-glow" />
                                      <span className="text-white font-medium">Solo Shuffle</span>
                                    </div>
                                    <div className="space-y-2">
                                      {member.brackets.soloShuffle.map((spec, index) => (
                                        <div key={index} className="text-sm">
                                          <div className="flex justify-between">
                                            <span className="text-gray-400">Rating ({spec.specialization?.name || 'Unknown'}):</span>
                                            <span className="text-white font-bold">{spec.rating}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-400">Season (Rounds):</span>
                                            <span className="text-white">{(spec.seasonRoundWins || 0)}W-{(spec.seasonRoundLosses || 0)}L</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-400">Weekly (Rounds):</span>
                                            <span className="text-white">{(spec.weeklyRoundWins || 0)}W-{(spec.weeklyRoundLosses || 0)}L</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-400">Season (Matches):</span>
                                            <span className="text-white">{spec.seasonWins}W-{spec.seasonLosses}L</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-400">Weekly (Matches):</span>
                                            <span className="text-white">{spec.weeklyWins}W-{spec.weeklyLosses}L</span>
                                          </div>
                                          {spec.tier && (
                                            <div className="flex justify-between">
                                              <span className="text-gray-400">Tier:</span>
                                              <span className="text-blue-400">Tier {spec.tier.id}</span>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )
                              } else if (activeTab === 'solo-blitz' && member.brackets.soloBlitz && member.brackets.soloBlitz.length > 0) {
                                return (
                                  <div className="bg-black/20 rounded-lg p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <TrendingUp className="h-4 w-4 text-blood-glow" />
                                      <span className="text-white font-medium">Solo Blitz</span>
                                    </div>
                                    <div className="space-y-2">
                                      {member.brackets.soloBlitz.map((spec, index) => (
                                        <div key={index} className="text-sm">
                                          <div className="flex justify-between">
                                            <span className="text-gray-400">Rating ({spec.specialization?.name || 'Unknown'}):</span>
                                            <span className="text-white font-bold">{spec.rating}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-400">Season (Matches):</span>
                                            <span className="text-white">{spec.seasonWins}W-{spec.seasonLosses}L</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-gray-400">Weekly (Matches):</span>
                                            <span className="text-white">{spec.weeklyWins}W-{spec.weeklyLosses}L</span>
                                          </div>
                                          {spec.tier && (
                                            <div className="flex justify-between">
                                              <span className="text-gray-400">Tier:</span>
                                              <span className="text-blue-400">Tier {spec.tier.id}</span>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )
                              } else {
                                return (
                                  <div className="bg-black/20 rounded-lg p-4">
                                    <div className="text-gray-400 text-center">
                                      No {activeTab} data available
                                    </div>
                                  </div>
                                )
                              }
                            })()}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-600 bg-black/20">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing {startIndex + 1} to {Math.min(endIndex, sortedMembers.length)} of {sortedMembers.length} members
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-black/30 text-gray-300 rounded hover:bg-black/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blood-glow text-white'
                          : 'bg-black/30 text-gray-300 hover:bg-black/50 hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-black/30 text-gray-300 rounded hover:bg-black/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
