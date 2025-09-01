// PvP Activity Types for Guild Members

export interface PvPBracketStats {
  rating: number
  seasonWins: number
  seasonLosses: number
  weeklyWins: number
  weeklyLosses: number
  // Round statistics for Solo Shuffle
  seasonRoundWins?: number
  seasonRoundLosses?: number
  weeklyRoundWins?: number
  weeklyRoundLosses?: number
  season?: number
  tier?: {
    key: {
      href: string
    }
    id: number
  }
  specialization?: {
    key: {
      href: string
    }
    name: string
    id: number
  }
}

export interface PvPActivityData {
  characterName: string
  realmSlug: string
  lastUpdated: string
  profile?: {
    lastLoginTimestamp: number
    level: number
    characterClass: string
    race: string
    guild: string
    activeSpec: string
    pvpSummary: {
      href: string
    }
    statistics: {
      href: string
    }
  }
  brackets: {
    arena2v2?: PvPBracketStats
    arena3v3?: PvPBracketStats
    rbg?: PvPBracketStats
    soloShuffle?: PvPBracketStats[]  // Array because it's spec-based
    soloBlitz?: PvPBracketStats[]    // Array because it's spec-based
  }
  totalStats: {
    totalWins: number
    totalLosses: number
    totalGames: number
    winRate: number
    highestRating: number
    highestBracket: string
  }
}

export interface GuildPvPSummary {
  generatedAt: string
  guildName: string
  realmSlug: string
  memberCount: number
  activePvPMembers: number
  guildStats: {
    totalGames: number
    totalWins: number
    totalLosses: number
    averageRating: number
    highestRatedMember: {
      name: string
      rating: number
      bracket: string
    }
  }
  members: PvPActivityData[]
}

export interface PvPBracketSummary {
  bracketType: '2v2' | '3v3' | 'rbg' | 'solo-shuffle' | 'solo-blitz'
  members: Array<{
    name: string
    realmSlug: string
    rating: number
    wins: number
    losses: number
    winRate: number
    tier?: string
    specialization?: string
    characterClass?: string
  }>
  averageRating: number
  totalGames: number
  totalWins: number
  totalLosses: number
}

// API Response types from Blizzard
export interface BlizzardPvPSummaryResponse {
  honor: {
    level: number
    raw: number
    max: number
  }
  pvp_map_statistics: Array<{
    world_map: {
      name: string
      id: number
    }
    match_statistics: {
      played: number
      won: number
      lost: number
    }
  }>
  honor_level: number
}

export interface BlizzardPvPBracketResponse {
  specialization?: {
    key: {
      href: string
    }
    name: string
    id: number
  }
  rating: number
  season_match_statistics: {
    played: number
    won: number
    lost: number
  }
  weekly_match_statistics: {
    played: number
    won: number
    lost: number
  }
  tier?: {
    key: {
      href: string
    }
    id: number
  }
}

export interface BlizzardCharacterResponse {
  id: number
  name: string
  realm: {
    key: {
      href: string
    }
    name: string
    id: number
    slug: string
  }
  character_class: {
    key: {
      href: string
    }
    name: string
    id: number
  }
  active_spec: {
    key: {
      href: string
    }
    name: string
    id: number
  }
  level: number
}
