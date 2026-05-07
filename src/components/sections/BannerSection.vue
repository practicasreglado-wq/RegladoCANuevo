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

const symbolEl    = ref(null)
const sectionEl   = ref(null)
const particlesEl = ref(null)

// Opción A: § fijo en viewport contrarrestando el scroll
function onScroll() {
  if (!symbolEl.value) return
  const rect       = symbolEl.value.closest('section').getBoundingClientRect()
  const adjustment = (window.innerHeight / 2) - (rect.top + rect.height / 2)
  symbolEl.value.style.transform = `translateY(calc(-50% + ${adjustment}px))`
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })


  // Opción D: partículas doradas flotantes generadas aleatoriamente
  for (let i = 0; i < 14; i++) {
    const p    = document.createElement('span')
    p.className = 'banner-particle'
    const size  = (Math.random() * 4 + 2).toFixed(1)
    p.style.cssText = [
      `width:${size}px`,
      `height:${size}px`,
      `left:${(Math.random() * 100).toFixed(1)}%`,
      `--dur:${(Math.random() * 7 + 6).toFixed(1)}s`,
      `--delay:${(Math.random() * 10).toFixed(1)}s`,
      `--drift:${((Math.random() - 0.5) * 70).toFixed(0)}px`,
      `--op:${(Math.random() * 0.35 + 0.12).toFixed(2)}`,
    ].join(';')
    particlesEl.value?.appendChild(p)
  }
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

/* -- Highlight bidireccional eliminado -- */
.banner__text {
  color: rgba(255,255,255,0.78);
  font-size: var(--fs-lg);
  line-height: 1.7;
  max-width: 60ch;
}

/* ── Contenedor partículas (D) ── */
.banner__particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

@media (prefers-reduced-motion: reduce) {
  .banner__text::after { display: none; }
}
</style>

<!-- Estilos globales para las partículas creadas dinámicamente (sin scoped) -->
<style>
.banner-particle {
  position: absolute;
  bottom: -8px;
  border-radius: 50%;
  background: #c9a84c;
  animation: banner-float var(--dur, 8s) ease-in var(--delay, 0s) infinite;
  opacity: 0;
}
@keyframes banner-float {
  0%   { transform: translateY(0) translateX(0);                        opacity: 0; }
  10%  { opacity: var(--op, 0.2); }
  90%  { opacity: var(--op, 0.2); }
  100% { transform: translateY(-110vh) translateX(var(--drift, 0px));   opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .banner-particle { animation: none; }
}
</style>
