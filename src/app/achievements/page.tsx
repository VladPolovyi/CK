import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import AchievementStats from '@/components/AchievementStats'
import MemberLists from '@/components/MemberLists'
import ReadyToBleed from '@/components/ReadyToBleed'
import achievementData from '@/data/generated/achievements-data.json'

export default function Achievements() {
  return (
    <div className="min-h-screen blood-gradient">
      <Navigation />
      <div className="pt-20">
        {/* Hero Section */}
        <HeroSection 
          title="PvP Achievements"
          subtitle="Unique players who have ever achieved these PvP titles"
          backgroundImage="/images/ebo_glad.jpg"
        />

        {/* Achievement Stats */}
        <AchievementStats data={achievementData} />

        {/* Member Lists */}
        <MemberLists data={achievementData} />

        {/* Ready to Bleed Section */}
        <ReadyToBleed />
      </div>
    </div>
  )
}
