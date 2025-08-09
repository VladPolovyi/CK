import type { LucideIcon } from 'lucide-react'
import { Crown, Star, Medal, Trophy, Award, Target } from 'lucide-react'

export type Gladiator = {
  id: number
  name: string
  title: string
  season: string
  rating: number
  spec: string
  date: string
  icon: LucideIcon
}

export type RankOnePlayer = {
  id: number
  name: string
  title: string
  bracket: string
  spec: string
  season: string
  date: string
  icon: LucideIcon
}

export type Legend = {
  id: number
  name: string
  title: string
  achievement: string
  spec: string
  date: string
  icon: LucideIcon
}

export type RecentAchievement = {
  id: number
  player: string
  achievement: string
  date: string
  icon: LucideIcon
}

export const gladiators: Gladiator[] = [
  {
    id: 1,
    name: 'BloodKnight',
    title: 'Gladiator',
    season: 'Season 3',
    rating: 2450,
    spec: 'Paladin',
    date: '2024-01-15',
    icon: Crown,
  },
  {
    id: 2,
    name: 'ShadowReaper',
    title: 'Gladiator',
    season: 'Season 2',
    rating: 2380,
    spec: 'Death Knight',
    date: '2023-12-20',
    icon: Crown,
  },
  {
    id: 3,
    name: 'DarkMage',
    title: 'Gladiator',
    season: 'Season 1',
    rating: 2320,
    spec: 'Mage',
    date: '2023-11-10',
    icon: Crown,
  },
]

export const r1Players: RankOnePlayer[] = [
  {
    id: 1,
    name: 'BloodKnight',
    title: 'Rank 1',
    bracket: '3v3',
    spec: 'Paladin',
    season: 'Season 3',
    date: '2024-01-10',
    icon: Star,
  },
  {
    id: 2,
    name: 'ShadowReaper',
    title: 'Rank 1',
    bracket: '2v2',
    spec: 'Death Knight',
    season: 'Season 2',
    date: '2023-12-15',
    icon: Star,
  },
]

export const legends: Legend[] = [
  {
    id: 1,
    name: 'BloodKnight',
    title: 'Legend',
    achievement: 'Arena Master',
    spec: 'Paladin',
    date: '2024-01-05',
    icon: Medal,
  },
  {
    id: 2,
    name: 'DarkMage',
    title: 'Legend',
    achievement: 'PvP Master',
    spec: 'Mage',
    date: '2023-12-01',
    icon: Medal,
  },
]

export const recentAchievements: RecentAchievement[] = [
  {
    id: 1,
    player: 'BloodPriest',
    achievement: 'Reached 2400 Rating',
    date: '2 days ago',
    icon: Target,
  },
  {
    id: 2,
    player: 'DeathKnight',
    achievement: 'Won 100 Arena Matches',
    date: '3 days ago',
    icon: Trophy,
  },
  {
    id: 3,
    player: 'BloodWarrior',
    achievement: 'Completed All PvP Achievements',
    date: '1 week ago',
    icon: Award,
  },
]


