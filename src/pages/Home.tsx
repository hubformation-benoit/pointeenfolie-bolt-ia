import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../LanguageContext'
import { carouselPizzas, weeklyEvent, promotions, openHours, siteInfo, galleryImages } from '../data'

function Carousel() {
  const { lang } = useLang()
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => setCurrent(c => (c + 1) % carouselPizzas.length), [])
  const prev = () => setCurrent(c => (c - 1 + carouselPizzas.length) % carouselPizzas.length)

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [paused, next])

  return (
    <div
      className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl shadow-xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {carouselPizzas.map((pizza, i) => (
        <div
          key={pizza.id}
          className={`carousel-slide absolute inset-0 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            <div className="max-w-xl">
              <h3 className="font-display text-2xl sm:text-4xl text-white mb-2 uppercase tracking-wide drop-shadow-lg">
                {pizza.name}
              </h3>
              <p className="text-cream-100 text-sm sm:text-base line-clamp-2 drop-shadow-md">
                {pizza.description[lang]}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 text-white transition-all"
        aria-label="Previous"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 text-white transition-all"
        aria-label="Next"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 right-4 z-20 flex gap-2">
        {carouselPizzas.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all ${i === current ? 'w-8 bg-brand-gold' : 'w-2 bg-white/60'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

function EventBlock() {
  const { lang, t } = useLang()
  const eventDate = new Date(weeklyEvent.date + 'T' + weeklyEvent.time)
  const dateStr = eventDate.toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
  const timeStr = eventDate.toLocaleTimeString(lang === 'fr' ? 'fr-CA' : 'en-US', {
    hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="card overflow-hidden group">
      <div className="relative h-64 overflow-hidden">
        <img src={weeklyEvent.image} alt={weeklyEvent.bandName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-brick-900/80 to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="badge bg-brand-gold text-white">
            {t('home.weeklyEvent')}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-display text-2xl text-brick-600 mb-3 uppercase tracking-wide">{weeklyEvent.bandName}</h3>
        <p className="text-olive-700 mb-4">{weeklyEvent.description[lang]}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="font-semibold text-olive-800">{dateStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span className="font-semibold text-olive-800">{timeStr}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function PromotionsBlock() {
  const { lang } = useLang()
  return (
    <div className="space-y-4">
      {promotions.map((promo, i) => (
        <div key={promo.id} className="card p-5 border-l-4 border-brand-gold animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
          <h3 className="font-display text-lg text-brand-green uppercase tracking-wide mb-1">{promo.title[lang]}</h3>
          <p className="text-olive-700 text-sm">{promo.description[lang]}</p>
        </div>
      ))}
    </div>
  )
}

function HoursAddressBlock() {
  const { lang, t } = useLang()
  return (
    <div className="card p-6">
      <h3 className="font-display text-xl text-brand-green uppercase tracking-wide mb-4">{t('home.hoursAddress')}</h3>
      <div className="space-y-2 mb-4">
        {openHours.map((h, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-olive-700 font-medium">{h.days[lang]}</span>
            <span className="text-olive-600">{h.hours}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-olive-100 pt-4">
        <p className="text-olive-700 text-sm">{siteInfo.address[lang]}</p>
        <a href={`tel:${siteInfo.phone}`} className="text-brand-green font-semibold hover:text-brand-green-dark transition-colors">{siteInfo.phone}</a>
      </div>
    </div>
  )
}

function MasonryGallery() {
  const { lang, t } = useLang()
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-8">
        <h2 className="section-title">{t('home.gallery')}</h2>
        <p className="section-subtitle">{t('home.galleryDesc')}</p>
      </div>
      <div className="masonry">
        {galleryImages.map((img, i) => (
          <div key={i} className="masonry-item group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <img
              src={img.url}
              alt={img.alt[lang]}
              className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="text-white text-sm font-medium">{img.alt[lang]}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const { t } = useLang()
  return (
    <div>
      {/* Hero with carousel */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="grid lg:grid-cols-5 gap-6 items-center">
          <div className="lg:col-span-2 space-y-4 animate-slide-up">
            <p className="text-brand-gold font-semibold uppercase tracking-widest text-sm">{t('home.welcome')}</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-brand-green uppercase tracking-wide leading-tight">
              Pointe en folie
            </h1>
            <p className="text-olive-700 text-lg">{t('home.tagline')}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/order" className="btn-primary">{t('home.orderNow')}</Link>
              <Link to="/menu" className="btn-outline">{t('home.viewMenu')}</Link>
            </div>
          </div>
          <div className="lg:col-span-3">
            <Carousel />
          </div>
        </div>
      </section>

      {/* Event + Promotions + Hours */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <EventBlock />
          </div>
          <div className="lg:col-span-1">
            <h2 className="section-title text-2xl">{t('home.promotions')}</h2>
            <PromotionsBlock />
          </div>
          <div className="lg:col-span-1">
            <HoursAddressBlock />
          </div>
        </div>
      </section>

      {/* Fresh from oven intro */}
      <section className="bg-olive-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img src="/images/contenu/chef.png" alt="Chef Louis" className="w-48 h-48 rounded-full border-8 border-olive-200 object-cover shrink-0" />
            <div>
              <h2 className="section-title">{t('home.freshFromOven')}</h2>
              <p className="text-olive-700 text-lg">{t('home.freshFromOvenDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Masonry gallery */}
      <MasonryGallery />
    </div>
  )
}
