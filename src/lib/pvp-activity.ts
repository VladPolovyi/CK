import type { GuildPvPSummary, PvPBracketSummary } from '@/types/pvp-activity'

export async function getPvPActivityData(): Promise<GuildPvPSummary | null> {
  try {
    const pvpActivityData = await import('@/data/generated/pvp-activity.json')
    return pvpActivityData.default
  } catch (error) {
    console.error('Failed to load PvP activity data:', error)
    return null
  }
}

export function generateBracketSummaries(data: GuildPvPSummary): PvPBracketSummary[] {
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

      bracketDataArray.forEach((bracketData) => {
        if (bracketData && bracketData.rating > 0) {
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

/** Like generateBracketSummaries but only members with weekly activity; wins/losses/winRate are weekly. */
export function generateWeeklyBracketSummaries(data: GuildPvPSummary): PvPBracketSummary[] {
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

      bracketDataArray.forEach((bracketData) => {
        if (!bracketData || bracketData.rating <= 0) return
        const isSoloShuffle = bracketType === 'solo-shuffle'
        const wins = isSoloShuffle ? (bracketData.weeklyRoundWins || 0) : (bracketData.weeklyWins || 0)
        const losses = isSoloShuffle ? (bracketData.weeklyRoundLosses || 0) : (bracketData.weeklyLosses || 0)
        if (wins === 0 && losses === 0) return

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
