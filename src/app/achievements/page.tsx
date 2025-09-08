import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import AchievementStats from '@/components/AchievementStats'
import MemberLists from '@/components/MemberLists'
import ReadyToBleed from '@/components/ReadyToBleed'
import achievementData from '@/data/generated/achievements-data.json'

export default function Achievements() {
  return (
    <div className="blood-gradient">
      <Navigation />
      <div className="pt-20">
        {/* Hero Section */}
        <HeroSection 
          title="PvP Achievements"
          subtitle="Unique players who have ever achieved these PvP titles"
          backgroundImage="/images/ebo_glad.jpg"
        />

        {/* Achievement Stats */}
        <div className="py-12 bg-black/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                <span className="text-blood-light">All Our Achievements</span>
              </h2>
              <p className="mt-4 text-lg text-gray-300">
                Complete overview of all PvP achievements earned by our guild members.
              </p>
            </div>
            <AchievementStats data={achievementData} />
          </div>
        </div>

        {/* Member Lists */}
        <MemberLists data={achievementData} />

        {/* Ready to Bleed Section */}
        <ReadyToBleed />
      </div>
    </div>
  )
}
