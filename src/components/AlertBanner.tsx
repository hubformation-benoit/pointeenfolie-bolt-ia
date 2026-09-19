import { useState } from 'react'
import { siteAlert } from '../data'
import { useLang } from '../LanguageContext'

export default function AlertBanner() {
  const { lang } = useLang()
  const [visible, setVisible] = useState(true)

  if (!visible || !siteAlert[lang]) return null

  return (
    <div
      className="relative w-full text-center text-sm py-2 px-10 font-medium text-olive-800"
      style={{ backgroundColor: '#fcffcf' }}
    >
      {siteAlert[lang]}
      <button
        onClick={() => setVisible(false)}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-olive-700 hover:text-olive-900 transition-colors"
        aria-label="Close"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
