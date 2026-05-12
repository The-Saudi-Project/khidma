import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enCommon from './locales/en/common.json'
import arCommon from './locales/ar/common.json'
import enBooking from './locales/en/booking.json'
import arBooking from './locales/ar/booking.json'

const resources = {
  en: {
    common: enCommon,
    booking: enBooking,
    auth: enCommon,
    provider: enCommon,
    admin: enCommon
  },
  ar: {
    common: arCommon,
    booking: arBooking,
    auth: arCommon,
    provider: arCommon,
    admin: arCommon
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    ns: ['common', 'booking', 'auth', 'provider', 'admin'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'khidma_lang',
      caches: ['localStorage']
    }
  })

export default i18n
