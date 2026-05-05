<template>
  <section class="section section--cream about">
    <div class="container about__inner">
      <div class="about__copy">
        <p class="eyebrow" v-reveal>{{ $t('about.eyebrow') }}</p>
        <SplitHeading :text="$t('about.title')" tag="h2" />
        <p class="about__text" v-reveal="{ delay: 1 }">{{ $t('about.p1') }}</p>
        <p class="about__text" v-reveal="{ delay: 2 }">{{ $t('about.p2') }}</p>
        <ul class="about__tags" v-reveal="{ delay: 3 }">
          <li v-for="t in tags" :key="t">{{ t }}</li>
        </ul>
      </div>
      <div class="about__visual" v-reveal="{ delay: 2 }">
        <video class="about__video" :src="videoSrc" autoplay muted loop playsinline preload="metadata" aria-hidden="true"></video>
        <div class="about__visual-overlay"></div>
        <div class="about__visual-stamp">
          <img :src="logoBlanco" alt="Reglado Consultores" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SplitHeading from '@/components/ui/SplitHeading.vue'
import logoBlanco from '@/assets/images/REGLADO_Blanco_Symbol.png'

const videoSrc = '/video/nosotros.mp4'

const { tm } = useI18n()
const tags = computed(() => tm('about.tags') || [])
</script>

<style scoped>
.about__inner {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: clamp(2rem, 6vw, 5rem);
  align-items: center;
}
.about__copy > * + * { margin-top: 1.2rem; }
.about__text { color: var(--color-text-muted); font-size: var(--fs-base); line-height: 1.8; }

.about__tags {
  display: flex; flex-wrap: wrap; gap: 0.6rem;
  margin-top: 2rem;
}
.about__tags li {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-navy);
  color: var(--color-navy);
  border-radius: 999px;
  font-size: var(--fs-sm);
  font-weight: 500;
  transition: all var(--t-base);
}
.about__tags li:hover { background: var(--color-navy); color: var(--color-gold); border-color: var(--color-navy); }

.about__visual {
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  background: var(--color-navy);
}
.about__video {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
}
.about__visual-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(17,30,51,0.15), rgba(17,30,51,0.7));
}
.about__visual-stamp {
  position: absolute;
  bottom: 1.5rem; right: 1.5rem;
  width: clamp(60px, 10vw, 90px);
  opacity: 0.95;
}
.about__visual-stamp img { width: 100%; height: auto; }

@media (max-width: 880px) { .about__inner { grid-template-columns: 1fr; } .about__visual { max-width: 480px; } }
@media (prefers-reduced-motion: reduce) { .about__video { display: none; } }
</style>
