import { Trophy, Crown, Star, Medal, Award, Target, Users, Calendar } from 'lucide-react'
import Navigation from '@/components/Navigation'

export default function Achievements() {
  // Mock data for achievements
  const gladiators = [
    {
      id: 1,
      name: "BloodKnight",
      title: "Gladiator",
      season: "Season 3",
      rating: 2450,
      spec: "Paladin",
      date: "2024-01-15",
      icon: Crown
    },
    {
      id: 2,
      name: "ShadowReaper",
      title: "Gladiator",
      season: "Season 2",
      rating: 2380,
      spec: "Death Knight",
      date: "2023-12-20",
      icon: Crown
    },
    {
      id: 3,
      name: "DarkMage",
      title: "Gladiator",
      season: "Season 1",
      rating: 2320,
      spec: "Mage",
      date: "2023-11-10",
      icon: Crown
    }
  ]

  const r1Players = [
    {
      id: 1,
      name: "BloodKnight",
      title: "Rank 1",
      bracket: "3v3",
      spec: "Paladin",
      season: "Season 3",
      date: "2024-01-10",
      icon: Star
    },
    {
      id: 2,
      name: "ShadowReaper",
      title: "Rank 1",
      bracket: "2v2",
      spec: "Death Knight",
      season: "Season 2",
      date: "2023-12-15",
      icon: Star
    }
  ]

  const legends = [
    {
      id: 1,
      name: "BloodKnight",
      title: "Legend",
      achievement: "Arena Master",
      spec: "Paladin",
      date: "2024-01-05",
      icon: Medal
    },
    {
      id: 2,
      name: "DarkMage",
      title: "Legend",
      achievement: "PvP Master",
      spec: "Mage",
      date: "2023-12-01",
      icon: Medal
    }
  ]

  const recentAchievements = [
    {
      id: 1,
      player: "BloodPriest",
      achievement: "Reached 2400 Rating",
      date: "2 days ago",
      icon: Target
    },
    {
      id: 2,
      player: "DeathKnight",
      achievement: "Won 100 Arena Matches",
      date: "3 days ago",
      icon: Trophy
    },
    {
      id: 3,
      player: "BloodWarrior",
      achievement: "Completed All PvP Achievements",
      date: "1 week ago",
      icon: Award
    }
  ]

  return (
    <div className="min-h-screen blood-gradient">
      <Navigation />
      <div className="pt-20">
      {/* Hero Section */}
      <div className="blood-hero relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block text-blood-glow combat-text">Blood Achievements</span>
              <span className="block">CBITAHOK KPOBI</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto">
              The legends of blood and conquest. These warriors have proven their worth in battle and earned their place in history.
            </p>
          </div>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="blood-card rounded-lg p-6 text-center">
              <Crown className="h-12 w-12 text-blood-gold mx-auto mb-4" />
              <div className="text-3xl font-bold text-white combat-text">{gladiators.length}</div>
              <div className="text-gray-300">Gladiators</div>
            </div>
            <div className="blood-card rounded-lg p-6 text-center">
              <Star className="h-12 w-12 text-blood-glow mx-auto mb-4" />
              <div className="text-3xl font-bold text-white combat-text">{r1Players.length}</div>
              <div className="text-gray-300">Rank 1 Players</div>
            </div>
            <div className="blood-card rounded-lg p-6 text-center">
              <Medal className="h-12 w-12 text-blood-purple mx-auto mb-4" />
              <div className="text-3xl font-bold text-white combat-text">{legends.length}</div>
              <div className="text-gray-300">Legends</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gladiators */}
            <div className="blood-card rounded-lg p-6">
              <div className="flex items-center mb-6">
                <Crown className="h-6 w-6 text-blood-gold mr-2" />
                <h2 className="text-xl font-bold text-white">Gladiators</h2>
              </div>
              
              <div className="space-y-4">
                {gladiators.map((player) => (
                  <div key={player.id} className="flex items-center p-4 bg-dark-gray/50 rounded-lg border border-blood-gold/20">
                    <player.icon className="h-8 w-8 text-blood-gold mr-3" />
                    <div className="flex-1">
                      <div className="text-white font-bold">{player.name}</div>
                      <div className="text-gray-300 text-sm">
                        {player.title} • {player.season} • {player.spec}
                      </div>
                      <div className="text-blood-gold text-sm font-medium">
                        Rating: {player.rating}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 text-xs">{player.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rank 1 Players */}
            <div className="blood-card rounded-lg p-6">
              <div className="flex items-center mb-6">
                <Star className="h-6 w-6 text-blood-glow mr-2" />
                <h2 className="text-xl font-bold text-white">Rank 1 Players</h2>
              </div>
              
              <div className="space-y-4">
                {r1Players.map((player) => (
                  <div key={player.id} className="flex items-center p-4 bg-dark-gray/50 rounded-lg border border-blood-glow/20">
                    <player.icon className="h-8 w-8 text-blood-glow mr-3" />
                    <div className="flex-1">
                      <div className="text-white font-bold">{player.name}</div>
                      <div className="text-gray-300 text-sm">
                        {player.title} • {player.bracket} • {player.spec}
                      </div>
                      <div className="text-blood-glow text-sm font-medium">
                        {player.season}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-400 text-xs">{player.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legends Section */}
      <div className="py-12 bg-dark-gray/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-white mb-4">
              <span className="text-blood-purple">Blood Legends</span>
            </h2>
            <p className="text-gray-300">
              The ultimate warriors who have achieved legendary status
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {legends.map((legend) => (
              <div key={legend.id} className="blood-card rounded-lg p-6 border border-blood-purple/30">
                <div className="flex items-center mb-4">
                  <legend.icon className="h-8 w-8 text-blood-purple mr-3" />
                  <div>
                    <h3 className="text-xl font-bold text-white">{legend.name}</h3>
                    <div className="text-blood-purple font-medium">{legend.title}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Achievement:</span>
                    <span className="text-white">{legend.achievement}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Class:</span>
                    <span className="text-white">{legend.spec}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Date:</span>
                    <span className="text-white">{legend.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="blood-card rounded-lg p-6">
            <div className="flex items-center mb-6">
              <Award className="h-6 w-6 text-blood-glow mr-2" />
              <h2 className="text-xl font-bold text-white">Recent Achievements</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center p-4 bg-dark-gray/50 rounded-lg border border-blood-glow/20">
                  <achievement.icon className="h-5 w-5 text-blood-glow mr-3" />
                  <div className="flex-1">
                    <div className="text-white font-medium">{achievement.player}</div>
                    <div className="text-gray-300 text-sm">{achievement.achievement}</div>
                  </div>
                  <div className="text-gray-400 text-xs">{achievement.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Progress */}
      <div className="py-12 bg-dark-gray/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            <span className="text-blood-light">Achievement Progress</span>
          </h2>
          <p className="text-gray-300 mb-8">
            Track your progress towards legendary status
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="blood-card rounded-lg p-6">
              <Target className="h-8 w-8 text-blood-glow mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">2400+</div>
              <div className="text-gray-300">Rating Goal</div>
            </div>
            <div className="blood-card rounded-lg p-6">
              <Trophy className="h-8 w-8 text-blood-gold mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">100</div>
              <div className="text-gray-300">Arena Wins</div>
            </div>
            <div className="blood-card rounded-lg p-6">
              <Users className="h-8 w-8 text-blood-purple mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">50</div>
              <div className="text-gray-300">Team Battles</div>
            </div>
            <div className="blood-card rounded-lg p-6">
              <Calendar className="h-8 w-8 text-blood-light mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">30</div>
              <div className="text-gray-300">Days Active</div>
            </div>
          </div>
                 </div>
       </div>
     </div>
   </div>
   )
 }
