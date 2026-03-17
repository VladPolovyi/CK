"use client"

import { useState } from 'react'
import { Camera, Heart } from 'lucide-react'
import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import ReadyToBleed from '@/components/ReadyToBleed'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import styles from './gallery.module.scss'
import { WOW_CLASS_COLORS } from '@/lib/wow-class-colors'

const typeIcons: Record<string, { src: string; alt: string }> = {
  gladiator: { src: '/images/gladiator.webp', alt: 'Gladiator' },
  r1solo: { src: '/images/shuffle_r1.webp', alt: 'R1 Solo' },
}

const typeLabels: Record<string, string> = {
  gladiator: 'Gladiator',
  r1solo: 'R1 Solo',
}

const typeOrder = ['gladiator', 'r1solo']

const expansionLogos: Record<string, string> = {
  'The War Within': '/images/tww_logo.webp',
}

// Spec icons (same paths as PvPActivityTable); ambiguous specs use "Class-Spec"
const SPEC_ICONS: Record<string, string> = {
  'Arms': '/images/specs/71.jpg',
  'Fury': '/images/specs/72.jpg',
  'Protection': '/images/specs/73.jpg',
  'Holy Paladin': '/images/specs/65.jpg',
  'Protection Paladin': '/images/specs/66.jpg',
  'Retribution': '/images/specs/70.jpg',
  'Beast Mastery': '/images/specs/253.jpg',
  'Marksmanship': '/images/specs/254.jpg',
  'Survival': '/images/specs/255.jpg',
  'Assassination': '/images/specs/259.jpg',
  'Outlaw': '/images/specs/260.jpg',
  'Subtlety': '/images/specs/261.jpg',
  'Discipline': '/images/specs/256.jpg',
  'Holy Priest': '/images/specs/257.jpg',
  'Shadow': '/images/specs/258.jpg',
  'Blood': '/images/specs/250.jpg',
  'Frost Death Knight': '/images/specs/251.jpg',
  'Unholy': '/images/specs/252.jpg',
  'Elemental': '/images/specs/262.jpg',
  'Enhancement': '/images/specs/263.jpg',
  'Restoration': '/images/specs/264.jpg',
  'Shaman-Restoration': '/images/specs/264.jpg',
  'Restoration Druid': '/images/specs/105.jpg',
  'Druid-Restoration': '/images/specs/105.jpg',
  'Arcane': '/images/specs/62.jpg',
  'Fire': '/images/specs/63.jpg',
  'Frost Mage': '/images/specs/64.jpg',
  'Affliction': '/images/specs/265.jpg',
  'Demonology': '/images/specs/266.jpg',
  'Destruction': '/images/specs/267.jpg',
  'Brewmaster': '/images/specs/268.jpg',
  'Mistweaver': '/images/specs/270.jpg',
  'Windwalker': '/images/specs/269.jpg',
  'Balance': '/images/specs/102.jpg',
  'Feral': '/images/specs/103.jpg',
  'Guardian': '/images/specs/104.jpg',
  'Havoc': '/images/specs/577.jpg',
  'Vengeance': '/images/specs/581.jpg',
  'Devastation': '/images/specs/1467.jpg',
  'Preservation': '/images/specs/1468.jpg',
  'Augmentation': '/images/specs/1473.jpg',
  // Ambiguous specs: class-spec key for lookup when spec is "Holy" or "Protection" etc.
  'Priest-Holy': '/images/specs/257.jpg',
  'Paladin-Holy': '/images/specs/65.jpg',
  'Paladin-Protection': '/images/specs/66.jpg',
  'Warrior-Protection': '/images/specs/73.jpg',
}

function getSpecIconPath(spec: string | undefined, characterClass: string | undefined): string | null {
  if (!spec) return null
  const cls = characterClass ?? ''
  if (cls && (spec === 'Restoration' || spec === 'Holy' || spec === 'Protection')) {
    const key = `${cls}-${spec}` as keyof typeof SPEC_ICONS
    if (SPEC_ICONS[key]) return SPEC_ICONS[key]
  }
  return SPEC_ICONS[spec] ?? null
}

/** Combine title, title2, title3, ... with " & " for display */
function getDisplayTitle(item: { title?: string; title2?: string; title3?: string; [k: string]: unknown }): string {
  const titles = [item.title, item.title2, item.title3].filter(Boolean) as string[]
  return titles.join(' & ') || ''
}

export default function Gallery() {
  // Real gallery items based on files in public/images
  const galleryItems = [
    {
      title: "Shchoor",
      description: "Win 50 games with more than 2400 arena rating during the The War Within",
      image: "/images/shchoor_glad_s1.jpg",
      type: "gladiator",
      expansion:"The War Within",
      season:1,
      class: "Warrior",
      spec: "Arms",
    },
    {
      title: "Morok",
      description: "Win 50 games with more than 2400 arena rating during the The War Within",
      image: "/images/morok_glad_S1.jpg",
      type: "gladiator",
      expansion:"The War Within",
      season:1,
      class: "Priest",
      spec: "Shadow",
    },
    {
      title: "Shchoor",
      description: "Win 50 games with more than 2400 arena rating during the The War Within",
      image: "/images/idoru_glad.jpg",
      type: "gladiator",
      expansion:"The War Within",
      season:2,
      class: "Warrior",
      spec: "Arms",
    },
    {
      title: "Jazzcore",
      description: "Win 50 games with more than 2400 arena rating during the The War Within",
      image: "/images/jazzcore_glad.jpg",
      type: "gladiator",
      expansion:"The War Within",
      season:2,
      class: "Shaman",
      spec: "Restoration",
    },
    {
      title: "Ebobola",
      description: "Win 50 games with more than 2400 arena rating during the The War Within",
      image: "/images/ebo_glad.jpg",
      type: "gladiator",
      expansion:"The War Within",
      season:2,
      class: "Shaman",
      spec: "Restoration",
    },
    {
      title: "Etazis",
      description: "Win 50 games with more than 2400 arena rating during the The War Within",
      image: "/images/etazis_glad_s2.jpg",
      type: "gladiator",
      expansion:"The War Within",
      season:2, 
      class: "Evoker",
      spec: "Devastation",
    },
    // {
    //   title: "Idoru & Shchoor R1 Solo",
    //   description: "Idoru & Shchoor R1 Solo",
    //   image: "/images/etazis_glad_s2.jpg",
    //   type: "r1solo",
    //   expansion: "The War Within",
    //   season: 2,
    // },
   
    {
      title: "Shchoor",
      description: "Win 50 games with more than 2400 arena rating during the The War Within",
      image: "/images/idoru_shchoor_glad_s3.jpg",
      type: "gladiator",
      expansion:"The War Within",
      season:3,
      class: "Warrior",
      spec: "Arms",
    },
    {
      title: "Morok",
      description: "Win 50 games with more than 2400 arena rating during the The War Within",
      image: "/images/morok_s3.jpg",
      type: "gladiator",
      expansion:"The War Within",
      season:3,
      class: "Paladin",
      spec: "Retribution",
    },
    {
      title: "Etazis",
      description: "Win 50 games with more than 2400 arena rating during the The War Within",
      image: "/images/etazis_s3.png",
      type: "gladiator",
      expansion:"The War Within",
      season:3, 
      class: "Evoker",
      spec: "Devastation",
    },
    {
      title: "Ebobola",
      description: "Win 50 games with more than 2400 arena rating during the The War Within",
      image: "/images/karesh_glad_butthurtx.png",
      type: "gladiator",
      expansion:"The War Within",
      season:3,
      class: "Shaman",
      spec: "Restoration",
    },
    {
      title: "Butthurtx",
      description: "Win 50 games with more than 2400 arena rating during the The War Within",
      image: "/images/karesh_glad_butthurtx.png",
      type: "gladiator",
      expansion:"The War Within",
      season:3,
      class: "Death Knight",
      spec: "Unholy",
    },
    {
      title: "Honta",
      description: "Win 50 games with more than 2400 arena rating during the The War Within",
      image: "/images/honta_s3.png",
      type: "gladiator",
      expansion:"The War Within",
      season:3,
      class: "Shaman",
      spec: "Restoration",
    },
    {
      title: "Nickrosh",
      description: "Win 50 games with more than 2400 arena rating during the The War Within",
      image: "/images/nickrosh_s3.jpg",
      type: "gladiator",
      expansion:"The War Within",
      season:3,
      class: "Warlock",
      spec: "Destruction",
    },
    {
      title: "Abcypd",
      description: "Win 50 games with more than 2400 arena rating during the The War Within",
      image: "/images/abcypd_s3.png",
      type: "gladiator",
      expansion:"The War Within",
      season:3,
      class: "Shaman",
      spec: "Restoration",
    },
    {
      title: "Hetman",
      description: "Win 50 games with more than 2400 arena rating during the The War Within",
      image: "/images/hetman_s3.png",
      type: "gladiator",
      expansion:"The War Within",
      season:3, 
      class: "Evoker",
      spec: "Devastation",
    },
    {
      title: "Spamplague",
      description: "Win 50 games with more than 2400 arena rating during the The War Within",
      image: "/images/spam_s3.png",
      type: "gladiator",
      expansion:"The War Within",
      season:3, 
      class: "Priest",
      spec: "Holy",
    },
  ]

  // Group by expansion (big), then by season (smaller)
  type GalleryItem = (typeof galleryItems)[number]
  const byExpansion = galleryItems.reduce<Record<string, Record<number, GalleryItem[]>>>((acc, item) => {
    const exp = item.expansion ?? 'Other'
    const sea = item.season ?? 0
    if (!acc[exp]) acc[exp] = {}
    if (!acc[exp][sea]) acc[exp][sea] = []
    acc[exp][sea].push(item)
    return acc
  }, {})
  const expansionOrder = Array.from(new Set(galleryItems.map((i) => i.expansion ?? 'Other'))).filter(Boolean) as string[]
  const orderedItems: GalleryItem[] = []
  expansionOrder.forEach((exp) => {
    const seasons = Object.keys(byExpansion[exp] || {})
      .map(Number)
      .sort((a, b) => (b === 0 ? 1 : b) - (a === 0 ? 1 : a))
    seasons.forEach((sea) => {
      const items = [...(byExpansion[exp]?.[sea] || [])].reverse()
      orderedItems.push(...items)
    })
  })
  const slides = orderedItems.map((item) => ({ src: item.image }))
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  return (
    <div className="min-h-screen bg-[#101010]">
      <Navigation />
      <div className="pt-20">
      {/* Hero Section */}
      <HeroSection 
        title="Gallery"
        subtitle="View screenshots and achievements from our guild members' PvP victories and memorable moments."
        backgroundImage="/images/etazis_s3.png"
      />

      {/* Gallery: big group by expansion, smaller group by season */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(() => {
            let lightboxOffset = 0
            return expansionOrder.map((exp) => {
              const seasons = Object.keys(byExpansion[exp] || {})
                .map(Number)
                .sort((a, b) => (b === 0 ? 1 : b) - (a === 0 ? 1 : a))
              if (seasons.length === 0) return null
              return (
                <section key={exp} className="mb-16 last:mb-0">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white">{exp}</h2>
                  </div>
                  {seasons.map((sea) => {
                    const items = [...(byExpansion[exp]?.[sea] || [])].reverse()
                    if (items.length === 0) return null
                    const startIndex = lightboxOffset
                    lightboxOffset += items.length
                    return (
                      <div key={`${exp}-${sea}`} className="mb-10 last:mb-0">
                        <h3 className="text-lg font-semibold text-gray-300 mb-4">
                          {sea === 0 ? 'Other' : `Season ${sea}`}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px]">
                          {items.map((item, idx) => (
                            <div key={`${exp}-${sea}-${getDisplayTitle(item)}-${item.image}`} className="rounded-lg bg-black/20 border border-[#2e2e31] overflow-hidden transition-shadow hover:shadow-lg group">
                              <div
                                className={`relative aspect-video bg-dark-gray cursor-pointer rounded-none ${styles.imageContainer} ${styles.cardHoverOverlay} ${styles.cardHoverScale}`}
                                onClick={() => {
                                  setLightboxIndex(startIndex + idx)
                                  setLightboxOpen(true)
                                }}
                              >
                                {item.type && typeIcons[item.type] && item.type !== 'gladiator' && (
                                  <div className="absolute top-2 left-2 z-10">
                                    <Image
                                      src={typeIcons[item.type].src}
                                      alt={typeIcons[item.type].alt}
                                      width={40}
                                      height={40}
                                      className="h-10 w-10 drop-shadow-md"
                                    />
                                  </div>
                                )}
                                {item.type === 'gladiator' && expansionLogos[exp] && (
                                  <div className="absolute top-2 left-2 z-10">
                                    <Image
                                      src={expansionLogos[exp]}
                                      alt=""
                                      width={64}
                                      height={64}
                                      className="h-16 w-16 drop-shadow-md object-contain"
                                    />
                                  </div>
                                )}
                                <Image
                                  src={item.image}
                                  alt={getDisplayTitle(item)}
                                  width={400}
                                  height={225}
                                  quality={85}
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  className={`object-cover ${styles.image}`}
                                  priority={startIndex + idx === 0}
                                />
                              </div>
                              <div className="p-4 md:p-3">
                                {(() => {
                                  const it = item as { title?: string; title2?: string; spec?: string; spec2?: string; class?: string; class2?: string }
                                  const specPath = getSpecIconPath(it.spec, it.class)
                                  const spec2Path = getSpecIconPath(it.spec2, it.class2)
                                  const color1 = it.class ? WOW_CLASS_COLORS[it.class] ?? '#FFFFFF' : '#FFFFFF'
                                  const color2 = it.class2 ? WOW_CLASS_COLORS[it.class2] ?? '#FFFFFF' : '#FFFFFF'
                                  return (
                                    <div className="flex items-center justify-between gap-2 mb-3 min-w-0">
                                      <div className="flex items-center gap-2 min-w-0 shrink">
                                        <h3 className="text-lg font-bold truncate">
                                          {it.title2 ? (
                                            <>
                                              <span style={{ color: color1 }}>{it.title}</span>
                                              <span className="text-gray-400"> & </span>
                                              <span style={{ color: color2 }}>{it.title2}</span>
                                            </>
                                          ) : (
                                            <span style={{ color: color1 }}>{it.title}</span>
                                          )}
                                        </h3>
                                        {specPath && (
                                          <Image
                                            src={specPath}
                                            alt={it.spec ?? ''}
                                            width={20}
                                            height={20}
                                            className="h-5 w-5 rounded-sm shrink-0"
                                          />
                                        )}
                                        {spec2Path && (
                                          <Image
                                            src={spec2Path}
                                            alt={it.spec2 ?? ''}
                                            width={20}
                                            height={20}
                                            className="h-5 w-5 rounded-sm shrink-0"
                                          />
                                        )}
                                      </div>
                                      {/* {item.type === 'gladiator' && item.season && typeIcons.gladiator && (
                                        <div className="flex items-center gap-1.5 text-sm text-gray-400 shrink-0">
                                          <Image
                                            src={typeIcons.gladiator.src}
                                            alt=""
                                            width={18}
                                            height={18}
                                            className="h-[18px] w-[18px] object-contain"
                                          />
                                          <span>Gladiator : Season {item.season}</span>
                                        </div>
                                      )} */}
                                    </div>
                                  )
                                })()}
                                <div className="border-b border-[#2e2e31] mb-3" />
                                <div className="flex items-center gap-3">
                                  {item.type === 'gladiator' && typeIcons.gladiator && (
                                    <div className="shrink-0">
                                      <Image
                                        src={typeIcons.gladiator.src}
                                        alt={typeIcons.gladiator.alt}
                                        width={56}
                                        height={56}
                                        className="h-14 w-14 drop-shadow-md"
                                      />
                                    </div>
                                  )}
                                  <div className="min-w-0 flex-1">
                                    {(item.type || item.season) && (
                                      <p className="text-gray-300 text-base font-bold mb-1">
                                        {(typeLabels[item.type] ?? item.type) + (item.season ? ` : Season ${item.season}` : '')}
                                      </p>
                                    )}
                                    <p className="text-gray-400 text-xs">{item.description}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </section>
              )
            })
          })()}
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
