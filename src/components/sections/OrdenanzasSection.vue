<template>
  <section class="section section--light ordenanzas">
    <div class="container ordenanzas__inner">
      <div class="ordenanzas__copy">
        <p class="eyebrow" v-reveal>{{ $t('ordenanzas.eyebrow') }}</p>
        <SplitHeading :text="$t('ordenanzas.title')" tag="h2" />
        <p class="ordenanzas__subtitle" v-reveal="{ delay: 1 }">{{ $t('ordenanzas.subtitle') }}</p>
        <a href="#contacto" class="btn btn--ghost ordenanzas__cta" @click.prevent="goTo('#contacto')" v-reveal="{ delay: 2 }">
          {{ $t('common.learn_more') }} <span class="btn__arrow">→</span>
        </a>
      </div>
      <ul class="ordenanzas__list">
        <li v-for="(item, i) in items" :key="i" v-reveal="{ delay: (i % 4) + 1 }">
          <span class="ordenanzas__num">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="ordenanzas__text">{{ item }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SplitHeading from '@/components/ui/SplitHeading.vue'
import { scrollTo } from '@/composables/useLenis'
const { tm } = useI18n()
function goTo(h) { const el = document.querySelector(h); if (el) scrollTo(el, { offset: -70 }) }
const items = computed(() => tm('ordenanzas.items') || [])
</script>

<style scoped>
.ordenanzas__inner {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: clamp(2rem, 6vw, 5rem);
  align-items: start;
}
.ordenanzas__copy { position: sticky; top: 120px; }
.ordenanzas__copy > * + * { margin-top: 1.2rem; }
.ordenanzas__subtitle { color: var(--color-text-muted); font-size: var(--fs-lg); }
.ordenanzas__cta { margin-top: 2rem; }

.ordenanzas__list { display: grid; gap: 0; }
.ordenanzas__list li {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--color-border);
  transition: padding-left var(--t-base);
}
.ordenanzas__list li:hover { padding-left: 0.8rem; border-color: var(--color-gold); }
.ordenanzas__num {
  font-family: var(--font-display);
  font-size: 0.85rem;
  color: var(--color-gold-text);
  font-feature-settings: "tnum";
}
.ordenanzas__text { font-size: var(--fs-lg); color: var(--color-navy); flex: 1; }

@media (max-width: 880px) {
  .ordenanzas__inner { grid-template-columns: 1fr; }
  .ordenanzas__copy { position: static; }
}
</style>
