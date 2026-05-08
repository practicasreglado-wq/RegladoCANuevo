import { createI18n } from 'vue-i18n'
import es from './locales/es.json'
import en from './locales/en.json'

const SUPPORTED = ['es', 'en']

function detectLocale() {
  const stored = localStorage.getItem('locale')
  if (stored && SUPPORTED.includes(stored)) return stored
  const nav = (navigator.language || 'es').slice(0, 2).toLowerCase()
  return SUPPORTED.includes(nav) ? nav : 'es'
}

const initial = detectLocale()

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: initial,
  fallbackLocale: 'es',
  messages: { es, en }
})

export function setLocale(locale) {
  if (!SUPPORTED.includes(locale)) return
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  document.documentElement.lang = locale
  document.documentElement.dir = 'ltr'
}

document.documentElement.lang = initial
document.documentElement.dir = 'ltr'

export default i18n
