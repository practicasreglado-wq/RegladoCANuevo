<template>
  <section class="banner section--dark">
    <div class="banner__symbol" aria-hidden="true">§</div>
    <div class="container banner__inner">
      <p class="eyebrow" v-reveal>{{ $t('banner.eyebrow') }}</p>
      <SplitHeading :text="$t('banner.title')" tag="h2" />
      <p class="banner__text" v-reveal="{ delay: 2 }">{{ $t('banner.text') }}</p>
    </div>
  </section>
</template>

<script setup>
import SplitHeading from '@/components/ui/SplitHeading.vue'
</script>

<style scoped>
.banner {
  padding: clamp(5rem, 12vw, 9rem) 0;
  position: relative;
  overflow: hidden;
}
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
}
.banner__inner { position: relative; z-index: 1; max-width: 880px; }
.banner__inner > * + * { margin-top: 1.5rem; }
.banner__inner :deep(h2) { color: var(--color-white); font-weight: 300; }
.banner__text { color: rgba(255,255,255,0.78); font-size: var(--fs-lg); line-height: 1.7; max-width: 60ch; }
</style>
