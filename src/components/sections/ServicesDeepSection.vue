<!--
  ServicesDeepSection.vue
  Carrusel narrativo de servicios: convierte el scroll vertical en paneles sticky de detalle.
-->
<template>
  <section
    ref="sectionEl"
    class="deep"
    :class="{ 'deep--scroll-carousel': isScrollCarousel, 'is-in-view': isInView }"
    :style="sectionStyle"
  >
    <span
      v-for="(s, i) in blocks"
      :id="s.id"
      :key="`${s.id}-anchor`"
      class="deep__anchor"
      :style="{ top: `${i * 100}svh` }"
      aria-hidden="true"
    ></span>

    <div class="deep__sticky">
      <div ref="trackEl" class="deep__track" :style="trackStyle">
        <article
          v-for="(s, i) in blocks"
          :key="s.id"
          class="deep__panel"
          :class="{ 'is-active': activeIndex === i }"
          :aria-current="activeIndex === i ? 'step' : undefined"
        >
          <div class="deep__media" aria-hidden="true">
            <img :src="s.image" :alt="$t(s.titleKey)" loading="lazy" />
          </div>
          <div class="deep__shade" aria-hidden="true"></div>

          <div class="container deep__panel-inner">
            <div class="deep__content">
              <p class="eyebrow deep__eyebrow">{{ pad(i + 1) }} / {{ totalLabel }}</p>
              <h2 class="deep__title">{{ $t(s.titleKey) }}</h2>
              <p class="deep__lead">{{ $t(s.leadKey) }}</p>

              <ul class="deep__list">
                <li v-for="item in $tm(s.itemsKey)" :key="item">{{ item }}</li>
              </ul>

              <MagneticButton tag="a" href="#contacto" class="btn btn--primary deep__cta" @click.prevent="goTo('#contacto')">
                {{ $t('hero.cta') }} <span class="btn__arrow">→</span>
              </MagneticButton>
            </div>

            <aside class="deep__card" aria-hidden="true">
              <span class="deep__card-num">{{ pad(i + 1) }}</span>
              <span class="deep__card-title">{{ $t(s.titleKey) }}</span>
            </aside>
          </div>
        </article>
      </div>

      <!-- Flecha "anterior": retrocede al servicio previo. Se oculta en el primero.
           Solo visible en desktop (≥901px). -->
      <button
        v-if="activeIndex > 0"
        type="button"
        class="deep__nav-btn deep__nav-btn--prev"
        :aria-label="$t('services_deep.previous_service')"
        @click="goToService(activeIndex - 1)"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Flecha "siguiente": avanza al próximo servicio. Se oculta en el último.
           Solo visible en desktop (≥901px). -->
      <button
        v-if="activeIndex < blocks.length - 1"
        type="button"
        class="deep__nav-btn deep__nav-btn--next"
        :aria-label="$t('services_deep.next_service')"
        @click="goToService(activeIndex + 1)"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div class="deep__hud" :aria-label="$t('services_deep.aria_progress')">
        <div class="deep__hud-top">
          <span>{{ currentLabel }}</span>
          <span>{{ totalLabel }}</span>
        </div>
        <div class="deep__progress" aria-hidden="true">
          <span :style="{ width: `${Math.max(progress, minimumProgress) * 100}%` }"></span>
        </div>
        <div class="deep__hud-bottom">
          <p>{{ isWideViewport ? $t('services_deep.scroll_hint_desktop') : $t('services_deep.scroll_hint') }}</p>

          <!-- Mini-navegación: flecha izquierda · bolitas · flecha derecha.
               Visible en desktop y móvil. Las flechas se deshabilitan en los extremos. -->
          <div class="deep__dots-wrap">
            <button
              type="button"
              class="deep__dot-nav deep__dot-nav--prev"
              :aria-label="$t('services_deep.previous_service')"
              :disabled="activeIndex === 0"
              @click="goToService(activeIndex - 1)"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <div class="deep__dots">
              <button
                v-for="(_, i) in blocks"
                :key="i"
                type="button"
                :class="{ 'is-active': activeIndex === i }"
                :aria-label="$t('services_deep.go_to_service', { n: i + 1 })"
                :aria-current="activeIndex === i ? 'true' : undefined"
                @click="goToService(i)"
              ></button>
            </div>

            <button
              type="button"
              class="deep__dot-nav deep__dot-nav--next"
              :aria-label="$t('services_deep.next_service')"
              :disabled="activeIndex === blocks.length - 1"
              @click="goToService(activeIndex + 1)"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">
                <path d="M9 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import MagneticButton from '@/components/ui/MagneticButton.vue'
import { scrollTo } from '@/composables/useLenis'

import imgInspecciones from '@/assets/images/inspeccion_tributaria.png'
import imgJuridica from '@/assets/images/juridica_hero_bg.png'
import imgTecnica from '@/assets/images/tecnica_hero_bg.png'
import imgEconomica from '@/assets/images/economica_hero_bg.png'
import imgEnergetica from '@/assets/images/consultoria_energetica.png'

const sectionEl = ref(null)
const trackEl = ref(null)
const activeIndex = ref(0)
const progress = ref(0)
const isScrollCarousel = ref(false)
const isWideViewport = ref(false)
const isInView = ref(false)

let frame = null
let reducedMotionQuery = null
let wideViewportQuery = null

function goTo(hash) {
  const el = document.querySelector(hash)
  if (el) scrollTo(el, { offset: -70 })
}

// Navega al servicio i-ésimo desplazando la página al ancla correspondiente.
// Usado tanto por los puntos del HUD como por la flecha "siguiente".
// offset: 0 e immediate: true porque los anchors están posicionados en las
// coordenadas exactas de cada slide (mismo patrón que usa TheNavbar).
function goToService(i) {
  const target = blocks[i]
  if (!target) return
  const anchor = document.getElementById(target.id)
  if (anchor) scrollTo(anchor, { offset: 0, immediate: true })
}

function pad(value) {
  return String(value).padStart(2, '0')
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function updateMode() {
  isScrollCarousel.value = !reducedMotionQuery?.matches
  isWideViewport.value = Boolean(wideViewportQuery?.matches)
  scheduleUpdate()
}

function scheduleUpdate() {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = null
    updateProgress()
  })
}
function updateProgress() {
  if (!sectionEl.value) return

  const section = sectionEl.value
  const maxIndex = blocks.length - 1
  const sectionRect = section.getBoundingClientRect()
  isInView.value = sectionRect.top < window.innerHeight && sectionRect.bottom > 0

  if (isScrollCarousel.value) {
    const scrollable = Math.max(1, section.offsetHeight - window.innerHeight)
    const nextProgress = clamp(-sectionRect.top / scrollable, 0, 1)

    progress.value = nextProgress
    activeIndex.value = clamp(Math.round(nextProgress * maxIndex), 0, maxIndex)
    return
  }
}

onMounted(() => {
  wideViewportQuery = window.matchMedia('(min-width: 901px)')
  reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  updateMode()
  window.addEventListener('scroll', scheduleUpdate, { passive: true })
  window.addEventListener('resize', updateMode, { passive: true })
  wideViewportQuery.addEventListener?.('change', updateMode)
  reducedMotionQuery.addEventListener?.('change', updateMode)
})

onUnmounted(() => {
  if (frame) cancelAnimationFrame(frame)
  window.removeEventListener('scroll', scheduleUpdate)
  window.removeEventListener('resize', updateMode)
  wideViewportQuery?.removeEventListener?.('change', updateMode)
  reducedMotionQuery?.removeEventListener?.('change', updateMode)
})
const blocks = [
  {
    id: 'inspecciones',
    titleKey: 'services.inspecciones',
    leadKey: 'services.inspecciones_lead',
    itemsKey: 'services.inspecciones_items',
    image: imgInspecciones
  },
  {
    id: 'juridica',
    titleKey: 'services.juridica',
    leadKey: 'services.juridica_lead',
    itemsKey: 'services.juridica_items',
    image: imgJuridica
  },
  {
    id: 'tecnica',
    titleKey: 'services.tecnica',
    leadKey: 'services.tecnica_lead',
    itemsKey: 'services.tecnica_items',
    image: imgTecnica
  },
  {
    id: 'economica',
    titleKey: 'services.economica',
    leadKey: 'services.economica_lead',
    itemsKey: 'services.economica_items',
    image: imgEconomica
  },
  {
    id: 'energetica',
    titleKey: 'services.energetica',
    leadKey: 'services.energetica_lead',
    itemsKey: 'services.energetica_items',
    image: imgEnergetica
  }
]

const totalLabel = computed(() => pad(blocks.length))
const currentLabel = computed(() => pad(activeIndex.value + 1))
const minimumProgress = computed(() => 1 / blocks.length)

const sectionStyle = computed(() => (
  isScrollCarousel.value ? { height: `${blocks.length * 100}svh` } : undefined
))

const trackStyle = computed(() => {
  if (!isScrollCarousel.value) return undefined
  // Ahora usamos el índice activo multiplicado por 100 para que el movimiento sea por "páginas" completas
  const x = activeIndex.value * 100
  return { transform: `translate3d(-${x}vw, 0, 0)` }
})
</script>

<style scoped>
.deep {
  position: relative;
  background: var(--color-navy-deep);
  color: var(--color-white);
  overflow: clip;
}

.deep__anchor {
  position: absolute;
  left: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
  scroll-margin-top: 0;
}

.deep__sticky {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
}

.deep--scroll-carousel .deep__sticky {
  position: sticky;
  top: 0;
  height: 100svh;
}

.deep__track {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100svh;
  will-change: transform;
  transition: transform 1.1s cubic-bezier(0.65, 0, 0.35, 1);
}

.deep--scroll-carousel .deep__track {
  flex-direction: row;
  width: max-content;
  height: 100%;
}

.deep__panel {
  position: relative;
  width: 100%;
  min-height: 100svh;
  overflow: hidden;
  display: flex;
  align-items: center;
  isolation: isolate;
}

.deep--scroll-carousel .deep__panel {
  width: 100vw;
  height: 100svh;
  flex: 0 0 100vw;
}

.deep__media,
.deep__shade {
  position: absolute;
  inset: 0;
  z-index: -2;
}

.deep__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.95) contrast(1.04);
  transform: scale(1.04);
  transition: transform 1400ms var(--ease-out);
}

.deep__panel.is-active .deep__media img {
  transform: scale(1);
}

.deep__shade {
  z-index: -1;
  background:
    linear-gradient(90deg, rgba(17, 30, 51, 0.82) 0%, rgba(17, 30, 51, 0.62) 42%, rgba(17, 30, 51, 0.22) 100%),
    linear-gradient(180deg, rgba(17, 30, 51, 0.14), rgba(17, 30, 51, 0.58));
}

.deep__panel-inner {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(220px, 0.35fr);
  gap: clamp(2rem, 6vw, 6rem);
  align-items: end;
  padding-top: clamp(6rem, 11vh, 8rem);
  padding-bottom: clamp(8rem, 15vh, 11rem);
  padding-left: clamp(2rem, 8vw, 7rem);
  padding-right: clamp(2rem, 8vw, 7rem);
}

.deep__content {
  max-width: 780px;
}

.deep__content > * + * {
  margin-top: 0.8rem;
}

.deep__eyebrow {
  color: var(--color-gold);
}

.deep__eyebrow::before {
  background: var(--color-gold);
}

.deep__title {
  color: var(--color-white);
  font-size: clamp(1.9rem, 3.4vw, 3.6rem);
  max-width: 12ch;
}

.deep--scroll-carousel .deep__eyebrow {
  font-size: clamp(0.66rem, 0.5vw + 0.54rem, 0.78rem);
  letter-spacing: 0.14em;
}

.deep__lead {
  color: rgba(255, 255, 255, 0.9);
  font-size: var(--fs-lg);
  line-height: 1.7;
  max-width: 62ch;
}

.deep__list {
  display: grid;
  gap: 0.3rem;
  max-width: 760px;
  margin-top: 1.2rem;
}

.deep__list li {
  position: relative;
  padding: 0.78rem 0 0.78rem 1.8rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.94);
  font-size: var(--fs-base);
  line-height: 1.55;
}

.deep__list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 1.55rem;
  width: 14px;
  height: 1px;
  background: var(--color-gold);
  transition: width var(--t-base) var(--ease-out);
}

.deep__list li:hover::before {
  width: 24px;
}

.deep__cta {
  margin-top: 2.2rem;
}

.deep__card {
  justify-self: end;
  width: min(100%, 280px);
  padding: 1.3rem;
  border: 1px solid rgba(201, 168, 76, 0.34);
  border-radius: var(--radius-lg);
  background: rgba(17, 30, 51, 0.52);
  color: var(--color-white);
  backdrop-filter: blur(14px);
  box-shadow: var(--shadow-md);
}

.deep__card-num {
  display: block;
  font-family: var(--font-display);
  color: var(--color-gold);
  font-size: clamp(3rem, 6vw, 5rem);
  line-height: 0.9;
}

.deep__card-title {
  display: block;
  margin-top: 1rem;
  font-family: var(--font-display);
  font-size: var(--fs-xl);
  line-height: 1.15;
}

.deep__hud {
  position: absolute;
  left: clamp(1.25rem, 4vw, 2.5rem);
  right: clamp(1.25rem, 4vw, 2.5rem);
  bottom: 1.35rem;
  z-index: 4;
  color: var(--color-white);
  pointer-events: none;
}

.deep__hud-top,
.deep__hud-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.deep__hud-top {
  color: rgba(255, 255, 255, 0.72);
  font-size: var(--fs-xs);
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.deep__progress {
  height: 2px;
  margin: 0.65rem 0 0.7rem;
  background: rgba(255, 255, 255, 0.18);
  overflow: hidden;
}

.deep__progress span {
  display: block;
  height: 100%;
  background: var(--color-gold);
  transition: width var(--t-base) var(--ease-out);
}

.deep__hud-bottom p {
  color: rgba(255, 255, 255, 0.72);
  font-size: var(--fs-xs);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Wrapper que agrupa: flecha-izq · bolitas · flecha-der */
.deep__dots-wrap {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  pointer-events: auto;
}

.deep__dots {
  display: inline-flex;
  gap: 0.5rem;
}

.deep__dots button {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.42);
  transition: width var(--t-base) var(--ease-out),
              background var(--t-base) var(--ease-out);
}

.deep__dots button.is-active {
  width: 28px;
  background: var(--color-gold);
}

/* Mini-flechas que flanquean las bolitas (desktop + móvil) */
.deep__dot-nav {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  transition:
    color var(--t-fast),
    background var(--t-fast),
    transform var(--t-fast),
    opacity var(--t-fast);
}

.deep__dot-nav:hover {
  color: var(--color-gold);
  background: rgba(201, 168, 76, 0.15);
}

.deep__dot-nav--prev:hover { transform: translateX(-2px); }
.deep__dot-nav--next:hover { transform: translateX(2px); }

/* Estado deshabilitado en los extremos del carrusel: visible pero apagado */
.deep__dot-nav[disabled] {
  opacity: 0.25;
  cursor: not-allowed;
  pointer-events: none;
}

.deep__dot-nav:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 2px;
}

/* ── Flechas de navegación del carrusel ──
   Botones cuadrados posicionados en los laterales del carrusel.
   Solo visibles en desktop (≥901px). En móvil se oculta y se navega
   exclusivamente con scroll o con las bolitas del HUD.
   También se ocultan en `prefers-reduced-motion` (el carrusel se vuelve stack). */
.deep__nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 52px;
  height: 52px;
  border-radius: 8px;
  background: rgba(17, 30, 51, 0.65);
  border: 1px solid rgba(201, 168, 76, 0.55);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  color: var(--color-gold);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 5;
  transition:
    background var(--t-base) var(--ease-out),
    border-color var(--t-base) var(--ease-out),
    transform var(--t-base) var(--ease-out);
}

/* Posición lateral según el modificador */
.deep__nav-btn--prev { left:  clamp(1rem, 3vw, 2.5rem); }
.deep__nav-btn--next { right: clamp(1rem, 3vw, 2.5rem); }

/* Hover: tinte dorado + pequeño desplazamiento en la dirección de la flecha */
.deep__nav-btn:hover {
  background: rgba(201, 168, 76, 0.18);
  border-color: var(--color-gold);
}
.deep__nav-btn--prev:hover { transform: translateY(-50%) translateX(-4px); }
.deep__nav-btn--next:hover { transform: translateY(-50%) translateX(4px); }

.deep__nav-btn:focus-visible {
  outline: 2px solid var(--color-gold);
  outline-offset: 3px;
}

/* Móvil: ocultas (el usuario navega con scroll o con las bolitas) */
@media (max-width: 900px) {
  .deep__nav-btn { display: none; }
}

/* Movimiento reducido: ocultas (el carrusel se convierte en stack vertical) */
@media (prefers-reduced-motion: reduce) {
  .deep__nav-btn { display: none; }
}

@media (max-width: 1100px) {
  .deep__panel-inner {
    grid-template-columns: minmax(0, 1fr);
  }

  .deep__card {
    display: none;
  }
}

@media (min-width: 901px) {
  .deep__content {
    max-width: none;
  }

  .deep__lead {
    max-width: 100%;
    font-size: clamp(1.05rem, 0.55vw + 0.95rem, 1.2rem);
    line-height: 1.65;
  }

  .deep__list {
    max-width: 900px;
  }

  .deep__cta {
    display: flex;
    width: max-content;
    margin-left: auto;
    margin-right: auto;
  }
}

@media (min-width: 1101px) {
  .deep__panel-inner {
    grid-template-columns: minmax(0, 1fr) 280px;
    gap: clamp(2rem, 4vw, 4.5rem);
  }

  .deep__card {
    width: 280px;
    min-width: 280px;
  }
}

@media (max-width: 900px) {
  .deep {
    overflow: clip;
  }

  .deep__sticky {
    overflow: hidden;
  }

  .deep__panel {
    min-height: 100svh;
    align-items: stretch;
  }

  .deep__panel-inner {
    --deep-mobile-top: clamp(4.75rem, 9svh, 6rem);
    --deep-mobile-bottom: clamp(4.75rem, 8svh, 5.75rem);
    min-height: 100svh;
    align-items: center;
    padding-top: var(--deep-mobile-top);
    padding-bottom: var(--deep-mobile-bottom);
  }

  .deep__shade {
    background:
      linear-gradient(180deg, rgba(17, 30, 51, 0.24) 0%, rgba(17, 30, 51, 0.62) 48%, rgba(17, 30, 51, 0.86) 100%),
      linear-gradient(90deg, rgba(17, 30, 51, 0.68), rgba(17, 30, 51, 0.26));
  }

  .deep__content {
    max-width: min(100%, 42rem);
  }

  .deep__content > * + * {
    margin-top: clamp(0.65rem, 1.5svh, 0.95rem);
  }

  .deep__title {
    max-width: 11ch;
    font-size: clamp(1.85rem, 7.6vw, 3rem);
    line-height: 0.98;
  }

  .deep__lead {
    max-width: min(100%, 40rem);
    font-size: clamp(0.92rem, 2.7vw, 1rem);
    line-height: 1.45;
  }

  .deep__list {
    gap: 0.25rem;
    margin-top: clamp(0.9rem, 2svh, 1.25rem);
  }

  .deep__list li {
    padding-top: clamp(0.38rem, 1.1svh, 0.55rem);
    padding-bottom: clamp(0.38rem, 1.1svh, 0.55rem);
    font-size: clamp(0.82rem, 2.5vw, 0.9rem);
    line-height: 1.35;
  }

  .deep__list li::before {
    top: 1.15rem;
    width: 12px;
  }

  .deep__cta {
    margin-top: clamp(1rem, 2.2svh, 1.35rem);
    padding: 0.82rem 1.35rem;
  }

  .deep__hud {
    position: absolute;
    bottom: 0.75rem;
    opacity: 1;
    visibility: visible;
  }
}

@media (max-width: 560px) {
  .deep__panel-inner {
    --deep-mobile-top: clamp(4.65rem, 8svh, 5.4rem);
    --deep-mobile-bottom: clamp(4.25rem, 7svh, 5rem);
  }

  .deep__title {
    max-width: 10.5ch;
    font-size: clamp(1.72rem, 8.6vw, 2.45rem);
  }

  .deep__lead {
    font-size: clamp(0.85rem, 3.5vw, 0.96rem);
    line-height: 1.38;
  }

  .deep__list li {
    padding-top: 0.32rem;
    padding-bottom: 0.32rem;
    font-size: clamp(0.76rem, 3.1vw, 0.84rem);
    line-height: 1.28;
  }

  .deep__cta {
    width: 100%;
    justify-content: center;
    padding: 0.76rem 1rem;
  }

  .deep__hud-bottom {
    align-items: flex-end;
  }

  .deep__hud-bottom p {
    max-width: 18ch;
    line-height: 1.35;
  }
}

@media (max-width: 420px) and (max-height: 720px) {
  .deep__panel-inner {
    --deep-mobile-top: 4.25rem;
    --deep-mobile-bottom: 4rem;
  }

  .deep__content > * + * {
    margin-top: 0.5rem;
  }

  .deep__title {
    font-size: clamp(1.55rem, 8vw, 2.15rem);
  }

  .deep__lead {
    font-size: 0.82rem;
    line-height: 1.32;
  }

  .deep__list {
    gap: 0.1rem;
    margin-top: 0.65rem;
  }

  .deep__list li {
    padding-top: 0.22rem;
    padding-bottom: 0.22rem;
    font-size: 0.72rem;
    line-height: 1.22;
  }

  .deep__cta {
    margin-top: 0.7rem;
    padding: 0.66rem 0.9rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .deep {
    height: auto !important;
  }

  .deep__sticky {
    position: relative !important;
    height: auto !important;
  }

  .deep__track {
    transform: none !important;
    flex-direction: column !important;
  }

  .deep__panel {
    width: 100% !important;
    height: auto !important;
    min-height: 100svh;
  }

  .deep__media img,
  .deep__progress span,
  .deep__dots button {
    transition: none !important;
  }
}
</style>
