import { Camera, Download, Heart } from 'lucide-react'
import Navigation from '@/components/Navigation'

export default function Gallery() {
  // Mock data for gallery items - replace with your actual screenshots
  const galleryItems = [
    {
      id: 1,
      title: "Blood Victory in Arena",
      description: "Epic 3v3 battle victory",
      image: "/images/gallery/screenshot1.jpg",
      likes: 42,
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Guild Raid Success",
      description: "Downing the final boss",
      image: "/images/gallery/screenshot2.jpg",
      likes: 38,
      date: "2024-01-10"
    },
    {
      id: 3,
      title: "PvP Tournament Win",
      description: "Championship match victory",
      image: "/images/gallery/screenshot3.jpg",
      likes: 55,
      date: "2024-01-08"
    },
    {
      id: 4,
      title: "Blood Brothers",
      description: "Guild members in formation",
      image: "/images/gallery/screenshot4.jpg",
      likes: 67,
      date: "2024-01-05"
    },
    {
      id: 5,
      title: "Epic Battle Scene",
      description: "Intense PvP combat",
      image: "/images/gallery/screenshot5.jpg",
      likes: 29,
      date: "2024-01-03"
    },
    {
      id: 6,
      title: "Victory Celebration",
      description: "Post-battle celebration",
      image: "/images/gallery/screenshot6.jpg",
      likes: 73,
      date: "2024-01-01"
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
              <span className="block text-blood-glow combat-text">Blood Gallery</span>
              <span className="block">CBITAHOK KPOBI</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto">
              Witness the bloodshed and glory of our warriors. Every screenshot tells a story of conquest and dominance.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-4">
                <Camera className="h-6 w-6 text-blood-glow" />
                <span className="text-gray-300">{galleryItems.length} Screenshots</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item) => (
              <div key={item.id} className="blood-card rounded-lg overflow-hidden group">
                <div className="relative aspect-video bg-dark-gray">
                  {/* Placeholder for actual images */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-12 w-12 text-blood-glow mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">{item.title}</p>
                    </div>
                  </div>
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-4">
                      <button className="blood-button px-4 py-2 rounded-md text-sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </button>
                      <button className="border border-blood-glow text-blood-glow px-4 py-2 rounded-md text-sm hover:bg-blood-glow hover:text-white transition-all">
                        <Heart className="h-4 w-4 mr-1" />
                        {item.likes}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">{item.date}</span>
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-blood-glow" />
                      <span className="text-gray-300 text-sm">{item.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="py-12 bg-dark-gray/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            <span className="text-blood-light">Share Your Blood</span>
          </h2>
          <p className="text-gray-300 mb-8">
            Have epic screenshots to share? Upload them to our gallery and let the world see your conquests.
          </p>
          <button className="blood-button px-8 py-3 text-white font-medium rounded-md">
            <Camera className="inline mr-2 h-5 w-5" />
            Upload Screenshot
          </button>
                 </div>
       </div>
     </div>
   </div>
   )
 }
