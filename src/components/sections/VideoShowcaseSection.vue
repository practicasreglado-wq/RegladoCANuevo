<template>
  <section class="showcase section--dark">
    <div class="showcase__media" aria-hidden="true">
      <video :src="videoSrc" autoplay muted loop playsinline preload="metadata"></video>
      <div class="showcase__overlay"></div>
    </div>
    <div class="container showcase__inner">
      <p class="eyebrow" v-reveal>{{ eyebrow }}</p>
      <SplitHeading :text="title" tag="h2" />
      <p class="showcase__lead" v-reveal="{ delay: 1 }">{{ lead }}</p>
      <a href="#contacto" class="btn btn--primary" @click.prevent="goTo('#contacto')" v-reveal="{ delay: 2 }">
        {{ cta }} <span class="btn__arrow">→</span>
      </a>
    </div>
  </section>
</template>

<script setup>
import SplitHeading from '@/components/ui/SplitHeading.vue'
import { scrollTo } from '@/composables/useLenis'

defineProps({
  videoSrc: { type: String, required: true },
  eyebrow: String,
  title: String,
  lead: String,
  cta: { type: String, default: 'Solicitar consulta' }
})

function goTo(hash) {
  const el = document.querySelector(hash)
  if (el) scrollTo(el, { offset: -70 })
}
</script>

<style scoped>
.showcase {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  padding: clamp(5rem, 12vw, 10rem) 0;
  overflow: hidden;
  isolation: isolate;
  color: var(--color-white);
}
.showcase__media {
  position: absolute; inset: 0;
  z-index: -1;
}
.showcase__media video {
  width: 100%; height: 100%;
  object-fit: cover;
}
.showcase__overlay {
  position: absolute; inset: 0;
  background:
    linear-gradient(135deg, rgba(17,30,51,0.8), rgba(26,45,78,0.6) 60%, rgba(201,168,76,0.15));
}
.showcase__inner { position: relative; max-width: 920px; }
.showcase__inner > * + * { margin-top: 1.5rem; }
.showcase__inner :deep(h2) { color: var(--color-white); font-weight: 300; max-width: 18ch; }
.showcase__lead { font-size: var(--fs-lg); color: rgba(255,255,255,0.85); max-width: 60ch; line-height: 1.6; }

@media (prefers-reduced-motion: reduce) {
  .showcase__media video { display: none; }
  .showcase__media { background: var(--color-navy); }
}
</style>
