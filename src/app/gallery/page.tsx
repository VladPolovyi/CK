"use client"

import { useState } from 'react'
import { Camera, Download, Heart } from 'lucide-react'
import Navigation from '@/components/Navigation'
import ReadyToBleed from '@/components/ReadyToBleed'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import styles from './gallery.module.scss'

export default function Gallery() {
  // Real gallery items based on files in public/images
  const galleryItems = [
    {
      id: 1,
      title: "TWW S2 Morok Gladiator",
      description: "Gladiator-season triumph by Morok",
      image: "/images/morok_glad.jpg",
      likes: 42,
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "TWW S2 Ebo Gladiator",
      description: "Ebo's arena dominance",
      image: "/images/ebo_glad.jpg",
      likes: 38,
      date: "2024-01-10",
    },
    {
      id: 3,
      title: "TWW S2 Jazzcore Gladiator",
      description: "Jazzcore's path to glory",
      image: "/images/jazzcore_glad.jpg",
      likes: 55,
      date: "2024-01-08",
    },
    {
      id: 4,
      title: "TWW S2 Idoru Gladiator",
      description: "Idoru claims the title",
      image: "/images/idoru_glad.jpg",
      likes: 67,
      date: "2024-01-05",
    },
    {
      id: 5,
      title: "TWW S2 Etazis Gladiator",
      description: "Season 2 ascent by Etazis",
      image: "/images/etazis_glad_s2.jpg",
      likes: 29,
      date: "2024-01-03",
    },
    {
      id: 6,
      title: "TWW S1 Morok Gladiator",
      description: "Season 1 highlight for Morok",
      image: "/images/morok_glad_S1.jpg",
      likes: 73,
      date: "2024-01-01",
    },
  ]

  const slides = galleryItems.map((item) => ({ src: item.image }))
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  return (
    <div className="min-h-screen blood-gradient">
      <Navigation />
      <div className="pt-20">
      {/* Hero Section */}
      <div className="blood-hero relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              <span className="block text-blood-glow combat-text">CBITAHOK KPOBI</span>
              <span className="block">Blood Gallery</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px]">
            {galleryItems.map((item, idx) => (
              <div key={item.id} className="blood-card group">
                <div
                  className={`relative aspect-video bg-dark-gray cursor-pointer rounded-none ${styles.imageContainer} ${styles.cardHoverOverlay} ${styles.cardHoverScale}`}
                  onClick={() => {
                    setLightboxIndex(idx)
                    setLightboxOpen(true)
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={`object-cover ${styles.image}`}
                    priority={item.id === 1}
                  />
                </div>
                
                <div className="p-4 md:p-3">
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">{item.date}</span>
                    <div className="flex items-center space-x-2">
                      <a
                        href={item.image}
                        download
                        className="blood-button px-3 py-1.5 rounded-md text-xs flex items-center transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </a>
                      <button className="border border-blood-glow text-blood-glow px-3 py-1.5 rounded-md text-xs hover:bg-blood-glow hover:text-white transition-all flex items-center">
                        <Heart className="h-3 w-3 mr-1" />
                        {item.likes}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={lightboxIndex}
            slides={slides}
            plugins={[Zoom, Thumbnails]}
          />
        </div>
      </div>


      {/* Ready to Bleed Section */}
      <ReadyToBleed />
    </div>
  </div>
  )
}
