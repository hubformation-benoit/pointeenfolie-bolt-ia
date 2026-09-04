import { useLang } from '../LanguageContext'

export default function AboutPage() {
  const { t } = useLang()

  const values = [
    { icon: '👐', title: t('about.handmade'), desc: t('about.handmadeDesc') },
    { icon: '🌿', title: t('about.local'), desc: t('about.localDesc') },
    { icon: '🎵', title: t('about.music'), desc: t('about.musicDesc') },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-title text-center">{t('about.title')}</h1>

      {/* Chef quote */}
      <div className="flex flex-col md:flex-row items-center gap-8 mt-8 mb-12">
        <img src="/images/contenu/chef.png" alt="Chef Louis" className="w-40 h-40 rounded-full border-8 border-olive-200 object-cover shrink-0" />
        <div>
          <h2 className="font-display text-xl text-brand-green uppercase tracking-wide mb-2">{t('about.chefTitle')}</h2>
          <p className="text-olive-700 text-lg italic">"{t('about.chefQuote')}"</p>
        </div>
      </div>

      {/* Story */}
      <div className="space-y-6 text-olive-700 text-lg leading-relaxed">
        <p>{t('about.p1')}</p>
        <p>{t('about.p2')}</p>
        <p>{t('about.p3')}</p>
      </div>

      {/* Values */}
      <div className="mt-12">
        <h2 className="section-title text-2xl text-center mb-6">{t('about.values')}</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <div key={i} className="card p-6 text-center">
              <div className="text-4xl mb-3">{v.icon}</div>
              <h3 className="font-display text-lg text-brand-green uppercase tracking-wide mb-2">{v.title}</h3>
              <p className="text-olive-600 text-sm">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
