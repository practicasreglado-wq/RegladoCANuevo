// Directiva v-reveal: añade .is-visible cuando el elemento entra en viewport.
// Uso:  <h2 v-reveal>Texto</h2>     o    <div v-reveal="{ delay: 2 }">

let observer = null

function getObserver() {
  if (observer) return observer
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          // si es un splitHeading, animar palabras hijas
          entry.target.querySelectorAll('.split-word').forEach((w) => w.classList.add('is-visible'))
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  )
  return observer
}

export const vReveal = {
  mounted(el, binding) {
    el.classList.add('reveal')
    if (binding.value?.delay) el.dataset.delay = String(binding.value.delay)
    getObserver().observe(el)
  },
  unmounted(el) {
    if (observer) observer.unobserve(el)
  }
}
