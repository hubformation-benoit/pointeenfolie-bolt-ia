import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useLang } from '../LanguageContext'
import { siteInfo, openHours } from '../data'

export default function Header() {
  const { lang, setLang, t } = useLang()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = [
    { to: '/', label: t('nav.home') },
    { to: '/menu', label: t('nav.menu') },
    { to: '/order', label: t('nav.order') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-cream-50 shadow-lg' : 'bg-cream-50/95 backdrop-blur-sm shadow-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/images/iu/logo.svg" alt="Pointe en folie" className="h-12 w-auto" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-brand-green bg-olive-100'
                      : 'text-olive-700 hover:text-brand-green hover:bg-olive-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side: phone, hours, language */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right">
              <a href={`tel:${siteInfo.phone}`} className="text-brand-green font-bold text-lg hover:text-brand-green-dark transition-colors">
                {siteInfo.phone}
              </a>
              <div className="text-xs text-olive-600">
                {openHours.map((h, i) => (
                  <span key={i}>
                    {i > 0 && ' · '}
                    {h.days[lang]} {h.hours}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 bg-olive-100 rounded-full p-1">
              <button
                onClick={() => setLang('fr')}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                  lang === 'fr' ? 'bg-brand-green text-white' : 'text-olive-600 hover:text-brand-green'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                  lang === 'en' ? 'bg-brand-green text-white' : 'text-olive-600 hover:text-brand-green'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Mobile: language + hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            <div className="flex items-center gap-1 bg-olive-100 rounded-full p-0.5">
              <button
                onClick={() => setLang('fr')}
                className={`px-2 py-1 rounded-full text-xs font-semibold transition-all ${
                  lang === 'fr' ? 'bg-brand-green text-white' : 'text-olive-600'
                }`}
              >
                FR
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 rounded-full text-xs font-semibold transition-all ${
                  lang === 'en' ? 'bg-brand-green text-white' : 'text-olive-600'
                }`}
              >
                EN
              </button>
            </div>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-olive-700 hover:bg-olive-100 transition-colors"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="lg:hidden pb-4 animate-slide-up">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive ? 'text-brand-green bg-olive-100' : 'text-olive-700 hover:bg-olive-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 px-4 py-2 border-t border-olive-100">
              <a href={`tel:${siteInfo.phone}`} className="text-brand-green font-bold">
                {siteInfo.phone}
              </a>
              <div className="text-xs text-olive-600 mt-1">
                {openHours.map((h, i) => (
                  <div key={i}>{h.days[lang]} {h.hours}</div>
                ))}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
