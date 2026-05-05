<template>
  <section class="stats section--dark">
    <div class="container">
      <header class="stats__header">
        <p class="eyebrow" v-reveal>{{ $t('stats.eyebrow') }}</p>
        <SplitHeading :text="$t('stats.title')" tag="h2" />
      </header>
      <div class="stats__grid">
        <div v-for="(item, i) in items" :key="i" class="stats__item" v-reveal="{ delay: i + 1 }">
          <Counter :value="item.value" :suffix="item.suffix" />
          <p class="stats__label">{{ item.label }}</p>
        </div>
      </div>

      <div class="stats__marquee">
        <Marquee :speed="40">
          <span v-for="m in municipios" :key="m" class="stats__chip">{{ m }}</span>
        </Marquee>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SplitHeading from '@/components/ui/SplitHeading.vue'
import Counter from '@/components/ui/Counter.vue'
import Marquee from '@/components/ui/Marquee.vue'

const { tm } = useI18n()
const items = computed(() => tm('stats.items') || [])

const municipios = [
  'Madrid', 'Sevilla', 'Valencia', 'Zaragoza', 'Bilbao', 'Murcia',
  'Palma', 'Córdoba', 'Vigo', 'Gijón', 'Granada', 'Pamplona',
  'Toledo', 'Cáceres', 'Cuenca', 'Soria', 'Teruel', 'Ávila'
]
</script>

<style scoped>
.stats { padding: clamp(5rem, 10vw, 8rem) 0; }
.stats__header { max-width: 720px; margin-bottom: 4rem; }
.stats__header > * + * { margin-top: 1rem; }

.stats__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2rem;
  margin-bottom: 5rem;
}
.stats__item {
  border-top: 1px solid rgba(201, 168, 76, 0.4);
  padding-top: 1.5rem;
}
.stats__label {
  color: rgba(255,255,255,0.7);
  font-size: var(--fs-sm);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 0.6rem;
}

.stats__marquee {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 3rem;
}
.stats__chip {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.4rem);
  color: rgba(255,255,255,0.6);
  white-space: nowrap;
  transition: color var(--t-base);
}
.stats__chip:hover { color: var(--color-gold); }
</style>
