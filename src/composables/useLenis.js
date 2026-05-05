import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance = null

export function initLenis() {
  if (lenisInstance) return lenisInstance
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null

  lenisInstance = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4
  })

  lenisInstance.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenisInstance.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  return lenisInstance
}

export function getLenis() { return lenisInstance }

export function scrollTo(target, options = {}) {
  if (lenisInstance) lenisInstance.scrollTo(target, { duration: 1.2, ...options })
  else if (typeof target === 'string') {
    const el = document.querySelector(target)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
}
