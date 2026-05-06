<template>
  <section class="section section--cream about">
    <div class="container about__inner">
      <div class="about__copy">
        <p class="eyebrow" v-reveal>{{ $t('about.eyebrow') }}</p>
        <SplitHeading :text="$t('about.title')" tag="h2" />
        <p class="about__text" v-reveal="{ delay: 1 }">{{ $t('about.p1') }}</p>
        <p class="about__text" v-reveal="{ delay: 2 }">{{ $t('about.p2') }}</p>
      </div>
      <ul class="about__tags" v-reveal="{ delay: 3 }">
        <li v-for="card in tagCards" :key="card.label" class="about__tag-card">
          <img class="about__tag-image" :src="card.image" :alt="card.label" loading="lazy" />
          <span class="about__tag-overlay"></span>
          <span class="about__tag-label">{{ card.label }}</span>
        </li>
      </ul>
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
import independenciaImg from '@/assets/images/image-section-72-min.jpg'
import rigorImg from '@/assets/images/procedimientos_admin.png'
import cercaniaImg from '@/assets/images/asesoramiento_ayuntamientos.png'
import innovacionImg from '@/assets/images/consultoria_energetica.png'
import compromisoImg from '@/assets/images/integral_consultoria_bg.png'

const videoSrc = '/video/nosotros.mp4'
const tagImages = [independenciaImg, rigorImg, cercaniaImg, innovacionImg, compromisoImg]

const { tm } = useI18n()
const tags = computed(() => tm('about.tags') || [])
const tagCards = computed(() => tags.value.map((label, index) => ({
  label,
  image: tagImages[index % tagImages.length]
})))
</script>

<style scoped>
.about__inner {
  display: grid;
  grid-template-columns: minmax(170px, 0.52fr) minmax(0, 1.12fr) minmax(320px, 0.98fr);
  grid-template-areas: 'tags copy visual';
  column-gap: clamp(2.25rem, 4.8vw, 5.25rem);
  row-gap: clamp(1.5rem, 3vw, 3rem);
  align-items: center;
}
.about__copy { grid-area: copy; }
.about__copy > * + * { margin-top: 1.2rem; }
.about__copy .eyebrow { color: var(--color-gold); }
.about__copy .eyebrow::before { background: var(--color-gold); }
.about__text { color: var(--color-text-muted); font-size: var(--fs-base); line-height: 1.8; }

.about__tags {
  grid-area: tags;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
  align-self: center;
  max-width: 220px;
  width: 100%;
}
.about__tag-card {
  position: relative;
  min-height: clamp(98px, 8.2vw, 116px);
  border: 1px solid rgba(26, 45, 78, 0.12);
  border-radius: var(--radius-lg);
  overflow: hidden;
  isolation: isolate;
  background: var(--color-navy);
  box-shadow: var(--shadow-sm);
  transition: transform var(--t-base) var(--ease-out),
              border-color var(--t-base) var(--ease-out),
              box-shadow var(--t-base) var(--ease-out);
}
.about__tag-card::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 2;
  width: 0;
  height: 3px;
  background: var(--color-gold);
  transition: width 500ms var(--ease-out);
}
.about__tag-card:hover {
  transform: translateY(-6px);
  border-color: rgba(201, 168, 76, 0.65);
  box-shadow: var(--shadow-md);
}
.about__tag-card:hover::after { width: 100%; }
.about__tag-image {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.02);
  transition: transform 700ms var(--ease-out), filter 700ms var(--ease-out);
}
.about__tag-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(180deg, rgba(17, 30, 51, 0.28), rgba(17, 30, 51, 0.82)),
    linear-gradient(90deg, rgba(26, 45, 78, 0.62), rgba(26, 45, 78, 0.18));
}
.about__tag-label {
  position: absolute;
  left: 1rem;
  right: 1rem;
  bottom: 0.9rem;
  z-index: 3;
  color: var(--color-white);
  font-size: var(--fs-sm);
  font-weight: 600;
  line-height: 1.2;
  text-shadow: 0 2px 14px rgba(17, 30, 51, 0.45);
}
.about__tag-card:hover .about__tag-image {
  filter: saturate(1.1) contrast(1.04);
  transform: scale(1.09);
}

.about__visual {
  grid-area: visual;
  position: relative;
  min-height: clamp(560px, 44vw, 680px);
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

@media (max-width: 1120px) {
  .about__inner {
    grid-template-columns: minmax(0, 1fr) minmax(280px, 0.82fr);
    grid-template-areas:
      'copy visual'
      'tags visual';
  }
  .about__tags {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-self: start;
    max-width: none;
  }
  .about__tag-card:last-child { grid-column: 1 / -1; }
  .about__visual { min-height: 520px; }
}
@media (max-width: 880px) {
  .about__inner {
    grid-template-columns: 1fr;
    grid-template-areas:
      'copy'
      'tags'
      'visual';
  }
  .about__visual { max-width: 480px; min-height: auto; aspect-ratio: 4 / 5; }
  .about__tags { grid-template-columns: repeat(2, 1fr); }
  .about__tag-card:last-child { grid-column: 1 / -1; }
}
@media (max-width: 560px) {
  .about__tags { grid-template-columns: 1fr; }
  .about__tag-card:last-child { grid-column: auto; }
  .about__tag-card { min-height: 104px; }
}
@media (prefers-reduced-motion: reduce) { .about__video { display: none; } }
</style>
