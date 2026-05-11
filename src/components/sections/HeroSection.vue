<!--
  HeroSection.vue
  Primera seccion de impacto con fondo secuenciado, particulas, llamadas a la accion y scroll guiado.
-->
<template>
  <section id="top" class="hero">
    <CanvasVideoBackground name="h4" :frame-count="79" trigger="#top" end-trigger="#sobre-nosotros" />
    <div class="hero__bg-overlay" aria-hidden="true"></div>
    <div class="hero__particles" ref="particlesEl" aria-hidden="true"></div>

    <div class="container hero__shell">
      <aside class="hero__sidebar" aria-hidden="true">
        <span class="hero__line"></span>
        <p class="hero__eyebrow">{{ $t('hero.eyebrow') }}</p>
        <span class="hero__line"></span>
      </aside>

      <div class="hero__main">
        <SplitHeading :text="$t('hero.title')" tag="h1" class="hero__title" />
        <p class="hero__subtitle" v-reveal="{ delay: 2 }">{{ $t('hero.subtitle') }}</p>
        <div class="hero__ctas" v-reveal="{ delay: 3 }">
          <MagneticButton tag="a" href="#contacto" class="btn btn--primary" @click.prevent="goTo('#contacto')">
            {{ $t('hero.cta') }} <span class="btn__arrow">→</span>
          </MagneticButton>
          <a href="#servicios" class="btn btn--ghost" @click.prevent="goTo('#servicios')">
            {{ $t('hero.cta_secondary') }}
          </a>
        </div>
      </div>
    </div>

    <div class="hero__scroll" aria-hidden="true">
      <span class="hero__scroll-line"></span>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import SplitHeading from '@/components/ui/SplitHeading.vue'
import MagneticButton from '@/components/ui/MagneticButton.vue'
import CanvasVideoBackground from '@/components/ui/CanvasVideoBackground.vue'
import { scrollTo } from '@/composables/useLenis'
import { useGoldParticles } from '@/composables/useGoldParticles'

const particlesEl = ref(null)

// Partículas doradas flotantes en el fondo del hero
useGoldParticles(particlesEl)

function goTo(hash) {
  const el = document.querySelector(hash)
  if (el) scrollTo(el, { offset: -96 })
}
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: var(--color-navy-deep);
  color: var(--color-white);
  overflow: hidden;
  padding-top: var(--nav-height);
  isolation: isolate;
}
.hero__bg-overlay {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse at 70% 30%, rgba(201, 168, 76, 0.12), transparent 55%),
    radial-gradient(ellipse at 20% 80%, rgba(36, 58, 99, 0.55), transparent 60%),
    linear-gradient(180deg, rgba(17, 30, 51, 0.35), rgba(17, 30, 51, 0.85));
  z-index: 1;
  pointer-events: none;
}

.hero__shell {
  position: relative;
  z-index: 2;
  width: 100%;
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 28px;
  align-items: start;
  padding-top: clamp(3rem, 8vw, 6rem);
  padding-bottom: clamp(3rem, 8vw, 6rem);
}

.hero__sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding-top: 0.4rem;
}
.hero__line { width: 1px; height: 68px; background: rgba(220, 232, 247, 0.55); }
.hero__eyebrow {
  color: var(--color-gold);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  white-space: nowrap;
}

.hero__main { max-width: 980px; }
.hero__title :deep(.split-word),
.hero__title :deep(.split-line) {
  color: var(--color-white);
}
.hero__title { margin-bottom: 1.5rem; }
.hero__title :deep(span) { color: var(--color-white); }
.hero__main :deep(h1) {
  color: var(--color-white);
  font-size: clamp(2.2rem, 4.5vw + 0.5rem, 4.5rem);
  font-weight: 300;
  max-width: 16ch;
  line-height: 1.1;
}
.hero__subtitle {
  font-size: var(--fs-lg);
  color: rgba(255, 255, 255, 0.85);
  max-width: 60ch;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}
.hero__ctas { display: flex; gap: 1rem; flex-wrap: wrap; }

.hero__scroll {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}
.hero__scroll-line {
  display: block;
  width: 1px; height: 60px;
  background: linear-gradient(to bottom, transparent, var(--color-gold));
  position: relative;
  overflow: hidden;
}
.hero__scroll-line::after {
  content: '';
  position: absolute;
  top: -60px; left: 0;
  width: 100%; height: 60px;
  background: linear-gradient(to bottom, transparent, var(--color-white));
  animation: scrollLine 2.4s var(--ease-out) infinite;
}
@keyframes scrollLine {
  0% { transform: translateY(0); }
  100% { transform: translateY(120px); }
}

@media (max-width: 900px) {
  .hero__shell { grid-template-columns: 1fr; gap: 1.5rem; }
  .hero__sidebar { flex-direction: row; gap: 12px; padding-top: 0; }
  .hero__line { width: 44px; height: 1px; }
  .hero__eyebrow { writing-mode: initial; transform: none; }
}
.hero__particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

@media (prefers-reduced-motion: reduce) {
  .hero__scroll-line::after { animation: none; }
}

/* Botón "Ver servicios" sobre fondo oscuro del hero */
.btn--ghost {
  color: var(--color-gold);
  border-color: var(--color-gold);
}
.btn--ghost:hover {
  background: rgba(201, 168, 76, 0.12);
  color: var(--color-gold);
  border-color: var(--color-gold);
}
</style>
