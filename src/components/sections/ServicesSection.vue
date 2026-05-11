<!--
  ServicesSection.vue
  Resumen de areas de servicio con tarjetas enlazadas a cada panel de detalle.
-->
<template>
  <section class="section">
    <div class="container">
      <header class="services__header">
        <p class="eyebrow" v-reveal>{{ $t('services_section.eyebrow') }}</p>
        <SplitHeading :text="$t('services_section.title')" tag="h2" />
        <p class="services__subtitle" v-reveal="{ delay: 2 }">{{ $t('services_section.subtitle') }}</p>
      </header>

      <div class="services__grid">
        <TiltCard v-for="(s, i) in services" :key="s.hash" class="services__card-wrap" :max="14">
          <a :href="s.hash" class="services__card reveal--card" @click.prevent="goTo(s.hash)" v-reveal="{ delay: (i % 5) + 1 }">
            <div class="services__icon" :style="{ '-webkit-mask-image': `url(${s.icon})`, 'mask-image': `url(${s.icon})` }" aria-hidden="true"></div>
            <h3 class="services__card-title">{{ $t(s.titleKey) }}</h3>
            <p class="services__card-text">{{ $t(s.textKey) }}</p>
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

const services = [
  { hash: '#inspecciones', titleKey: 'services.inspecciones', textKey: 'services.inspecciones_short', icon: '/iconos/seguridad.png' },
  { hash: '#juridica', titleKey: 'services.juridica', textKey: 'services.juridica_short', icon: '/iconos/ley.png' },
  { hash: '#tecnica', titleKey: 'services.tecnica', textKey: 'services.tecnica_short', icon: '/iconos/plano.png' },
  { hash: '#economica', titleKey: 'services.economica', textKey: 'services.economica_short', icon: '/iconos/auditoria.png' },
  { hash: '#energetica', titleKey: 'services.energetica', textKey: 'services.energetica_short', icon: '/iconos/factura-de-electricidad.png' }
]
</script>

<style scoped>
/* Estilos locales de ServicesSection */

/* ── Cabecera de sección ── */
.services__header { max-width: 720px; margin-bottom: 4rem; }
.services__header > * + * { margin-top: 1rem; }

/* Eyebrow en dorado */
.eyebrow { color: var(--color-gold); }

/* Título h2 (SplitHeading) en blanco */
:deep(.split-word) { color: var(--color-white); }

/* Subtítulo en blanco */
.services__subtitle { color: rgba(255, 255, 255, 0.85); font-size: var(--fs-lg); }

/* ── Grid 3+2 centrado ── */
.services__grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.5rem;
  align-items: stretch;
}

/* Fila 1: 3 tarjetas ocupan 2 columnas cada una */
.services__card-wrap:nth-child(-n+3) { grid-column: span 2; }

/* Fila 2: 2 tarjetas centradas (desplazadas 1 columna) */
.services__card-wrap:nth-child(4) { grid-column: 2 / 4; }
.services__card-wrap:nth-child(5) { grid-column: 4 / 6; }

.services__card-wrap { border-radius: var(--radius-lg); height: 100%; }

/* ── Tarjeta ── */
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
  width: 42px;
  height: 42px;
  background-color: var(--color-gold);
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  margin-bottom: 1.5rem;
  transition: transform var(--t-base) var(--ease-out);
}
.services__card:hover .services__icon { transform: translateY(-5px) scale(1.05); }
.services__card-title { font-size: var(--fs-xl); margin-bottom: 0.6rem; color: var(--color-navy); }
.services__card-text { color: var(--color-text-muted); font-size: var(--fs-sm); margin-bottom: 1.5rem; line-height: 1.6; }
.services__card-cta {
  font-size: var(--fs-sm);
  font-weight: 500;
  color: var(--color-gold);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  position: relative;
}
.services__card-cta::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0;
  width: 0; height: 1px;
  background: currentColor;
  transition: width var(--t-base) var(--ease-out);
}
.services__card:hover .services__card-cta::after {
  width: calc(100% - 1.5rem); /* Ajuste para no subrayar la flecha */
}
.services__card:hover .btn__arrow { transform: translateX(4px); }

/* ── Responsive ── */
@media (max-width: 900px) {
  .services__grid { grid-template-columns: repeat(2, 1fr); }
  .services__card-wrap { grid-column: span 1 !important; height: auto; }
  .section { padding-bottom: clamp(12rem, 26vw, 22rem); }
}
@media (max-width: 560px) {
  .services__grid { grid-template-columns: 1fr; }
}
</style>
