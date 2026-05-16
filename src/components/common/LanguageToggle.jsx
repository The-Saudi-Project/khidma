import { useTranslation } from 'react-i18next'

export default function LanguageToggle({ className = '' }) {
  const { i18n, t } = useTranslation('common')
  const lang = i18n.language?.startsWith('ar') ? 'ar' : 'en'

  const toggle = () => {
    const next = lang === 'en' ? 'ar' : 'en'
    localStorage.setItem('khidma_lang', next)
    document.documentElement.lang = next
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
    i18n.changeLanguage(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`text-xs font-semibold px-2 py-1 rounded-lg border border-white/10 glass hover:glass text-slate-300 ${className}`}
      aria-label="Toggle language"
    >
      {lang === 'en' ? t('language.ar') : t('language.en')}
    </button>
  )
}
