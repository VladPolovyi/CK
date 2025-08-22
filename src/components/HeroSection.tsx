interface HeroSectionProps {
  title: string
  subtitle: string
  backgroundImage: string
}

export default function HeroSection({ title, subtitle, backgroundImage }: HeroSectionProps) {
  return (
    <div className="relative py-36 bg-cover bg-center bg-no-repeat bg-gray-800" style={{ 
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/70"></div>
      
      {/* Hero content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 combat-text">
          {title}
        </h1>
        <p className="text-xl text-gray-200 max-w-3xl mx-auto">
          {subtitle}
        </p>
      </div>
    </div>
  )
}
