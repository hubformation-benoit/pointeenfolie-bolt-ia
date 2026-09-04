import { useLang } from '../LanguageContext'
import { siteInfo, openHours } from '../data'

export default function ContactPage() {
  const { lang, t } = useLang()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-title text-center">{t('contact.title')}</h1>

      <div className="grid sm:grid-cols-2 gap-6 mt-8">
        {/* Address */}
        <div className="card p-6">
          <div className="flex items-start gap-3 mb-3">
            <svg className="w-6 h-6 text-brand-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <div>
              <h2 className="font-display text-lg text-brand-green uppercase tracking-wide mb-1">{t('contact.address')}</h2>
              <p className="text-olive-700">{siteInfo.address[lang]}</p>
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="card p-6">
          <div className="flex items-start gap-3 mb-3">
            <svg className="w-6 h-6 text-brand-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            <div>
              <h2 className="font-display text-lg text-brand-green uppercase tracking-wide mb-1">{t('contact.phone')}</h2>
              <a href={`tel:${siteInfo.phone}`} className="text-olive-700 hover:text-brand-green transition-colors text-lg font-semibold">{siteInfo.phone}</a>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="card p-6">
          <div className="flex items-start gap-3 mb-3">
            <svg className="w-6 h-6 text-brand-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <div>
              <h2 className="font-display text-lg text-brand-green uppercase tracking-wide mb-1">{t('contact.email')}</h2>
              <a href={`mailto:${siteInfo.email}`} className="btn-outline text-sm py-2">{t('contact.emailLink')}</a>
            </div>
          </div>
        </div>

        {/* Hours */}
        <div className="card p-6">
          <div className="flex items-start gap-3 mb-3">
            <svg className="w-6 h-6 text-brand-green shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div className="w-full">
              <h2 className="font-display text-lg text-brand-green uppercase tracking-wide mb-2">{t('contact.hours')}</h2>
              <div className="space-y-2">
                {openHours.map((h, i) => (
                  <div key={i} className="flex justify-between text-sm border-b border-olive-100 pb-2 last:border-0">
                    <span className="text-olive-700 font-medium">{h.days[lang]}</span>
                    <span className="text-olive-600">{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
