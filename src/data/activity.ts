import type { LucideIcon } from 'lucide-react'
import { Trophy, Sword, Target, TrendingUp, Users, Clock } from 'lucide-react'

export type RecentActivity = {
  id: number
  player: string
  action: string
  timestamp: string
  icon: LucideIcon
  color: string
}

export const recentActivity: RecentActivity[] = [
  { id: 1, player: 'BloodKnight', action: 'Achieved Gladiator Title', timestamp: '2 hours ago', icon: Trophy, color: 'text-blood-gold' },
  { id: 2, player: 'ShadowReaper', action: 'Won 3v3 Arena Match', timestamp: '4 hours ago', icon: Sword, color: 'text-blood-glow' },
  { id: 3, player: 'DarkMage', action: 'Completed Mythic+15', timestamp: '6 hours ago', icon: Target, color: 'text-blood-purple' },
  { id: 4, player: 'BloodPriest', action: 'Reached 2400 Rating', timestamp: '8 hours ago', icon: TrendingUp, color: 'text-blood-light' },
  { id: 5, player: 'DeathKnight', action: 'Won 2v2 Tournament', timestamp: '1 day ago', icon: Trophy, color: 'text-blood-gold' },
  { id: 6, player: 'BloodWarrior', action: 'Completed Raid Achievement', timestamp: '2 days ago', icon: Target, color: 'text-blood-purple' },
]

export type OnlinePlayer = {
  name: string
  level: number
  spec: string
  status: string
}

export const onlinePlayers: OnlinePlayer[] = [
  { name: 'BloodKnight', level: 70, spec: 'Paladin', status: 'In Arena' },
  { name: 'ShadowReaper', level: 70, spec: 'Death Knight', status: 'Online' },
  { name: 'DarkMage', level: 70, spec: 'Mage', status: 'In Dungeon' },
  { name: 'BloodPriest', level: 70, spec: 'Priest', status: 'Online' },
  { name: 'DeathKnight', level: 70, spec: 'Death Knight', status: 'In Raid' },
]

export type GuildStat = {
  label: string
  value: string
  icon: LucideIcon
}

export const guildStats: GuildStat[] = [
  { label: 'Online Members', value: '13', icon: Users },
  { label: 'Arena Rating', value: '2,450', icon: Trophy },
  { label: 'Weekly Wins', value: '89', icon: Sword },
  { label: 'Active Hours', value: '156', icon: Clock },
]


