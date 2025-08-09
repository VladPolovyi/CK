import { Activity, Calendar, Users, Trophy, Sword, Clock, TrendingUp, Target } from 'lucide-react'
import Navigation from '@/components/Navigation'
import { recentActivity, onlinePlayers, guildStats } from '@/data/activity'

export default function GuildActivity() {
  return (
    <div className="min-h-screen blood-gradient">
      <Navigation />
      <div className="pt-20">
      {/* Hero Section */}
      <div className="blood-hero relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block text-blood-glow combat-text">Guild Activity</span>
              <span className="block">CBITAHOK KPOBI</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto">
              Track the bloodshed and conquests of our warriors. Every victory, every achievement, every drop of blood spilled.
            </p>
          </div>
        </div>
      </div>

      {/* Guild Stats */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guildStats.map((stat, index) => (
              <div key={index} className="blood-card rounded-lg p-6 text-center">
                <stat.icon className="h-8 w-8 text-blood-glow mx-auto mb-2" />
                <div className="text-2xl font-bold text-white combat-text">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="blood-card rounded-lg p-6">
                <div className="flex items-center mb-6">
                  <Activity className="h-6 w-6 text-blood-glow mr-2" />
                  <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                </div>
                
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center p-4 bg-dark-gray/50 rounded-lg border border-blood-glow/20">
                      <activity.icon className={`h-5 w-5 ${activity.color} mr-3`} />
                      <div className="flex-1">
                        <div className="text-white font-medium">{activity.player}</div>
                        <div className="text-gray-300 text-sm">{activity.action}</div>
                      </div>
                      <div className="text-gray-400 text-xs">{activity.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Online Players */}
            <div>
              <div className="blood-card rounded-lg p-6">
                <div className="flex items-center mb-6">
                  <Users className="h-6 w-6 text-blood-glow mr-2" />
                  <h2 className="text-xl font-bold text-white">Online Warriors</h2>
                </div>
                
                <div className="space-y-3">
                  {onlinePlayers.map((player, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-dark-gray/50 rounded-lg border border-blood-glow/20">
                      <div>
                        <div className="text-white font-medium">{player.name}</div>
                        <div className="text-gray-400 text-xs">
                          {player.spec} • Level {player.level}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-blood-glow text-xs font-medium">{player.status}</div>
                        <div className="w-2 h-2 bg-blood-glow rounded-full mt-1 ml-auto"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Calendar */}
      <div className="py-12 bg-dark-gray/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-white mb-4">
              <span className="text-blood-light">Blood Calendar</span>
            </h2>
            <p className="text-gray-300">
              Upcoming events and scheduled bloodshed
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="blood-card rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-blood-glow mr-2" />
                <h3 className="text-lg font-bold text-white">Arena Tournament</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Weekly 3v3 tournament for blood glory
              </p>
              <div className="text-blood-glow text-sm">Tomorrow • 8:00 PM</div>
            </div>
            
            <div className="blood-card rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Sword className="h-6 w-6 text-blood-glow mr-2" />
                <h3 className="text-lg font-bold text-white">Guild Raid</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Mythic raid progression night
              </p>
              <div className="text-blood-glow text-sm">Friday • 7:00 PM</div>
            </div>
            
            <div className="blood-card rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Trophy className="h-6 w-6 text-blood-gold mr-2" />
                <h3 className="text-lg font-bold text-white">Achievement Hunt</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Group achievement completion
              </p>
              <div className="text-blood-glow text-sm">Sunday • 6:00 PM</div>
            </div>
          </div>
                 </div>
       </div>
     </div>
   </div>
   )
 }
