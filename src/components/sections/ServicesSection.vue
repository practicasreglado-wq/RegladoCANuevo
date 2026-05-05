<template>
  <section class="section">
    <div class="container">
      <header class="services__header">
        <p class="eyebrow" v-reveal>{{ $t('services_section.eyebrow') }}</p>
        <SplitHeading :text="$t('services_section.title')" tag="h2" />
        <p class="services__subtitle" v-reveal="{ delay: 2 }">{{ $t('services_section.subtitle') }}</p>
      </header>

      <div class="services__grid">
        <TiltCard v-for="(s, i) in services" :key="s.hash" class="services__card-wrap">
          <a :href="s.hash" class="services__card" @click.prevent="goTo(s.hash)" v-reveal="{ delay: (i % 4) + 1 }">
            <div class="services__icon" v-html="s.icon" aria-hidden="true"></div>
            <h3 class="services__card-title">{{ $t(s.titleKey) }}</h3>
            <p class="services__card-text">{{ s.text }}</p>
            <span class="services__card-cta">{{ $t('services_section.cta') }} <span class="btn__arrow">→</span></span>
          </a>
        </TiltCard>
      </div>
    </div>
  </section>
</template>

<script setup>
import SplitHeading from '@/components/ui/SplitHeading.vue'
import TiltCard from '@/components/ui/TiltCard.vue'
import { scrollTo } from '@/composables/useLenis'

function goTo(hash) {
  const el = document.querySelector(hash)
  if (el) scrollTo(el, { offset: -70 })
}

const ICONS = {
  scale: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M16 4v24M6 28h20M9 8l-5 10h10L9 8zM23 8l-5 10h10L23 8z"/></svg>',
  gavel: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M14 6l8 8-2 2-8-8 2-2zM6 22l8-8 4 4-8 8-4-4zM4 28h12"/></svg>',
  cog: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="16" cy="16" r="4"/><path d="M16 4v4M16 24v4M4 16h4M24 16h4M7.5 7.5l2.8 2.8M21.7 21.7l2.8 2.8M7.5 24.5l2.8-2.8M21.7 10.3l2.8-2.8"/></svg>',
  chart: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 28h24M8 24V14M14 24V8M20 24v-6M26 24v-12"/></svg>',
  bolt: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M18 4L7 18h7l-3 10 11-14h-7l3-10z"/></svg>'
}

const services = [
  { hash: '#inspecciones', titleKey: 'services.inspecciones', text: 'Auditoría tributaria, regularización de padrones y defensa en vía administrativa.', icon: ICONS.scale },
  { hash: '#juridica', titleKey: 'services.juridica', text: 'Asesoramiento jurídico integral, informes, dictámenes y representación letrada.', icon: ICONS.gavel },
  { hash: '#tecnica', titleKey: 'services.tecnica', text: 'Urbanismo, planeamiento, licencias y proyectos de obra municipal.', icon: ICONS.cog },
  { hash: '#economica', titleKey: 'services.economica', text: 'Presupuestos, control financiero, estabilidad y plan de saneamiento.', icon: ICONS.chart },
  { hash: '#energetica', titleKey: 'services.energetica', text: 'Auditorías energéticas, transición y eficiencia en edificios públicos.', icon: ICONS.bolt }
]
</script>

<style scoped>
.services__header { max-width: 720px; margin-bottom: 4rem; }
.services__header > * + * { margin-top: 1rem; }
.services__subtitle { color: var(--color-text-muted); font-size: var(--fs-lg); }

.services__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
.services__card-wrap { border-radius: var(--radius-lg); }
.services__card {
  display: block;
  position: relative;
  padding: 2rem;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  height: 100%;
  transition: border-color var(--t-base) var(--ease-out), box-shadow var(--t-base) var(--ease-out);
  overflow: hidden;
}
.services__card::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  height: 2px; width: 0;
  background: var(--color-gold);
  transition: width 500ms var(--ease-out);
}
.services__card:hover { border-color: var(--color-gold); box-shadow: var(--shadow-md); }
.services__card:hover::after { width: 100%; }
.services__icon {
  color: var(--color-gold);
  margin-bottom: 1.5rem;
}
.services__card-title { font-size: var(--fs-xl); margin-bottom: 0.6rem; }
.services__card-text { color: var(--color-text-muted); font-size: var(--fs-sm); margin-bottom: 1.5rem; line-height: 1.6; }
.services__card-cta {
  font-size: var(--fs-sm);
  font-weight: 500;
  color: var(--color-gold-text);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.services__card:hover .btn__arrow { transform: translateX(4px); }
</style>
