<template>
  <section class="stats section--dark">
    <div class="container">
      <header class="stats__header">
        <p class="eyebrow" v-reveal>{{ $t('stats.eyebrow') }}</p>
        <SplitHeading :text="$t('stats.title')" tag="h2" />
      </header>
      <div class="stats__grid" v-reveal="{ delay: 1 }">
        <div v-for="(item, i) in items" :key="i" class="stats__item">
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
.stats {
  padding: clamp(5rem, 10vw, 8rem) 0;
  position: relative;
  overflow: hidden;
}
.stats::before {
  content: '';
  position: absolute;
  inset: auto -10vw 8rem auto;
  width: clamp(280px, 34vw, 520px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201, 168, 76, 0.13), transparent 68%);
  pointer-events: none;
}
.stats .container {
  position: relative;
  z-index: 1;
}
.stats__header { max-width: 720px; margin-bottom: clamp(2.5rem, 5vw, 4rem); }
.stats__header > * + * { margin-top: 1rem; }

.stats__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: clamp(3.5rem, 6vw, 5rem);
}
.stats__item {
  min-height: 190px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: clamp(1.25rem, 2vw, 1.75rem);
  border: 1px solid rgba(201, 168, 76, 0.22);
  border-top-color: rgba(201, 168, 76, 0.5);
  border-radius: var(--radius-lg);
  background: var(--color-white);
  box-shadow: 0 18px 44px rgba(5, 12, 24, 0.14);
  transition: transform var(--t-base) var(--ease-out),
              border-color var(--t-base) var(--ease-out),
              background var(--t-base) var(--ease-out);
}
.stats__item:hover {
  transform: translateY(-6px);
  border-color: rgba(201, 168, 76, 0.55);
  background: rgba(140, 167, 184, 0.699);;
}
.stats__label {
  color: var(--color-text);
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

@media (max-width: 980px) {
  .stats__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 560px) {
  .stats__grid { grid-template-columns: 1fr; }
  .stats__item { min-height: 160px; }
}
</style>
