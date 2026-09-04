import { Link } from 'react-router-dom'
import { useLang } from '../LanguageContext'
import { siteInfo } from '../data'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="bg-olive-900 text-cream-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo */}
          <div>
            <img src="/images/iu/logo-couleur.png" alt="Pointe en folie" className="h-20 w-auto mb-4" />
            <p className="text-cream-200 text-sm">
              {t('home.tagline')}
            </p>
          </div>

          {/* Address */}
          <div>
            <h3 className="font-display text-lg text-cream-200 mb-3 uppercase tracking-wide">
              {t('contact.address')}
            </h3>
            <p className="text-cream-200 text-sm mb-2">{siteInfo.address.fr}</p>
            <p className="text-cream-200 text-sm mb-1">
              {t('contact.phone')}: <a href={`tel:${siteInfo.phone}`} className="hover:text-brand-gold transition-colors">{siteInfo.phone}</a>
            </p>
            <p className="text-cream-200 text-sm">
              {t('contact.email')}: <a href={`mailto:${siteInfo.email}`} className="hover:text-brand-gold transition-colors">{siteInfo.email}</a>
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display text-lg text-cream-200 mb-3 uppercase tracking-wide">
              {t('nav.home')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/menu" className="text-cream-200 hover:text-brand-gold transition-colors">{t('nav.menu')}</Link></li>
              <li><Link to="/order" className="text-cream-200 hover:text-brand-gold transition-colors">{t('nav.order')}</Link></li>
              <li><Link to="/about" className="text-cream-200 hover:text-brand-gold transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/contact" className="text-cream-200 hover:text-brand-gold transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-olive-700 text-center text-sm text-cream-300">
          © 2015–2026 Pointe en folie. {t('footer.rights')}.
        </div>
      </div>
    </footer>
  )
}
