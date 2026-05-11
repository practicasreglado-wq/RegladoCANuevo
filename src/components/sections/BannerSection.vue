<template>
  <section class="banner section--dark" ref="sectionEl">
    <div class="banner__particles" ref="particlesEl" aria-hidden="true"></div>
    <div class="banner__symbol" ref="symbolEl" aria-hidden="true">§</div>
    <div class="container banner__inner">
      <p class="eyebrow" v-reveal>{{ $t('banner.eyebrow') }}</p>
      <SplitHeading :text="$t('banner.title')" tag="h2" />
      <p class="banner__text" v-reveal="{ delay: 2 }">{{ $t('banner.text') }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SplitHeading from '@/components/ui/SplitHeading.vue'
import { useGoldParticles } from '@/composables/useGoldParticles'

const symbolEl    = ref(null)
const sectionEl   = ref(null)
const particlesEl = ref(null)

// Partículas doradas flotantes
useGoldParticles(particlesEl)

// Símbolo § fijo en el viewport: contrarresta el scroll para que parezca anclado
function onScroll() {
  if (!symbolEl.value) return
  const rect       = symbolEl.value.closest('section').getBoundingClientRect()
  const adjustment = (window.innerHeight / 2) - (rect.top + rect.height / 2)
  symbolEl.value.style.transform = `translateY(calc(-50% + ${adjustment}px))`
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.banner {
  padding: clamp(5rem, 12vw, 9rem) 0;
  position: relative;
  overflow: hidden;
}

/* ── Símbolo § fijo (A) ── */
.banner__symbol {
  position: absolute;
  right: -2vw; top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-display);
  font-size: clamp(20rem, 38vw, 40rem);
  color: var(--color-gold);
  opacity: 0.07;
  line-height: 0.8;
  pointer-events: none;
  user-select: none;
  will-change: transform;
}

.banner__inner { position: relative; z-index: 1; max-width: 880px; }
.banner__inner > * + * { margin-top: 1.5rem; }
.banner__inner :deep(h2) { color: var(--color-white); font-weight: 300; }

.banner__text {
  color: rgba(255,255,255,0.78);
  font-size: var(--fs-lg);
  line-height: 1.7;
  max-width: 60ch;
}

/* Contenedor de partículas doradas (los .banner-particle se definen en main.css) */
.banner__particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
</style>
