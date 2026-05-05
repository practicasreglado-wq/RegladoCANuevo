<template>
  <div class="deep">
    <section v-for="(s, i) in blocks" :key="s.id" :id="s.id" class="deep__block" :class="{ 'deep__block--alt': i % 2 === 1 }">
      <div class="container deep__inner">
        <div class="deep__copy">
          <p class="eyebrow" v-reveal>0{{ i + 1 }} · {{ $t('services_section.eyebrow') }}</p>
          <SplitHeading :text="$t(s.titleKey)" tag="h2" />
          <p class="deep__lead" v-reveal="{ delay: 1 }">{{ s.lead }}</p>
          <ul class="deep__list">
            <li v-for="(item, j) in s.items" :key="j" v-reveal="{ delay: (j % 4) + 1 }">{{ item }}</li>
          </ul>
        </div>
        <aside class="deep__aside" v-reveal="{ delay: 2 }">
          <figure class="deep__figure">
            <img :src="s.image" :alt="$t(s.titleKey)" loading="lazy" />
            <figcaption>
              <span class="deep__num">0{{ i + 1 }}</span>
              <span class="deep__cap">{{ $t(s.titleKey) }}</span>
            </figcaption>
          </figure>
          <a href="#contacto" class="btn btn--ghost" @click.prevent="goTo('#contacto')">
            {{ $t('hero.cta') }} <span class="btn__arrow">→</span>
          </a>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup>
import SplitHeading from '@/components/ui/SplitHeading.vue'
import { scrollTo } from '@/composables/useLenis'

import imgInspecciones from '@/assets/images/inspeccion_tributaria.png'
import imgJuridica from '@/assets/images/juridica_hero_bg.png'
import imgTecnica from '@/assets/images/tecnica_hero_bg.png'
import imgEconomica from '@/assets/images/economica_hero_bg.png'
import imgEnergetica from '@/assets/images/consultoria_energetica.png'

function goTo(hash) {
  const el = document.querySelector(hash)
  if (el) scrollTo(el, { offset: -70 })
}

const blocks = [
  {
    id: 'inspecciones',
    titleKey: 'services.inspecciones',
    image: imgInspecciones,
    lead: 'Auditoría tributaria, regularización de padrones y defensa en vía administrativa y judicial. Detectamos bolsas de fraude e incrementamos la recaudación municipal.',
    items: [
      'IBI · Inspección catastral, regularizaciones y procedimientos especiales.',
      'IAE · Detección de altas no declaradas y revisión de epígrafes.',
      'IIVTNU · Liquidación, devolución y litigios tras la STC 182/2021.',
      'ICIO · Comprobaciones de obras, autoliquidaciones y reintegros.',
      'Tasas y precios públicos · Análisis de coste y propuesta de actualización.'
    ]
  },
  {
    id: 'juridica',
    titleKey: 'services.juridica',
    image: imgJuridica,
    lead: 'Asesoramiento jurídico integral, informes, dictámenes y representación letrada en todas las jurisdicciones. Asistencia continuada o por proyecto.',
    items: [
      'Derecho administrativo y procedimiento.',
      'Urbanismo y ordenación del territorio.',
      'Contratación pública: pliegos, mesas y recursos.',
      'Función pública y régimen disciplinario.',
      'Responsabilidad patrimonial y contencioso-administrativo.'
    ]
  },
  {
    id: 'tecnica',
    titleKey: 'services.tecnica',
    image: imgTecnica,
    lead: 'Urbanismo, planeamiento, licencias y proyectos de obra municipal con visión integradora. Equipo de arquitectos, ingenieros y técnicos urbanistas.',
    items: [
      'Redacción y revisión de planeamiento urbanístico.',
      'Licencias de obra, actividad y declaraciones responsables.',
      'Proyectos de urbanización y obra civil municipal.',
      'Inspección urbanística y disciplina.',
      'Valoraciones y peritajes.'
    ]
  },
  {
    id: 'economica',
    titleKey: 'services.economica',
    image: imgEconomica,
    lead: 'Presupuestos, control financiero, estabilidad presupuestaria y planes de saneamiento. Trabajamos codo a codo con la intervención municipal.',
    items: [
      'Elaboración del presupuesto y modificaciones presupuestarias.',
      'Liquidación, cuenta general y rendición a la Cámara de Cuentas.',
      'Estabilidad presupuestaria y regla de gasto.',
      'Planes económico-financieros y de ajuste.',
      'Control interno y auditoría pública.'
    ]
  },
  {
    id: 'energetica',
    titleKey: 'services.energetica',
    image: imgEnergetica,
    lead: 'Auditorías energéticas, transición y eficiencia en edificios públicos. Ahorros del 30-45% en factura energética y financiación europea capturada.',
    items: [
      'Auditorías energéticas en edificios e instalaciones públicas.',
      'Planes de transición energética municipal.',
      'Comunidades energéticas locales.',
      'Renovación de alumbrado público y eficiencia.',
      'Tramitación de subvenciones IDAE y fondos europeos.'
    ]
  }
]
</script>

<style scoped>
.deep__block {
  padding: clamp(4rem, 9vw, 7rem) 0;
  border-top: 1px solid var(--color-border);
  scroll-margin-top: var(--nav-height);
  background: var(--color-white);
}
.deep__block--alt { background: var(--color-bg-light); }
.deep__inner {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: clamp(2rem, 6vw, 5rem);
  align-items: start;
}
.deep__block--alt .deep__inner { grid-template-columns: 1fr 1.4fr; }
.deep__block--alt .deep__copy { order: 2; }

.deep__copy > * + * { margin-top: 1.2rem; }
.deep__lead { font-size: var(--fs-lg); color: var(--color-text-muted); line-height: 1.7; max-width: 60ch; }

.deep__list { margin-top: 2rem; display: grid; gap: 0; }
.deep__list li {
  position: relative;
  padding: 1rem 0 1rem 1.8rem;
  border-bottom: 1px solid var(--color-border);
  font-size: var(--fs-base);
  line-height: 1.7;
}
.deep__list li::before {
  content: '';
  position: absolute;
  left: 0; top: 1.55rem;
  width: 14px; height: 1px;
  background: var(--color-gold);
  transition: width var(--t-base);
}
.deep__list li:hover::before { width: 24px; }

.deep__aside { position: sticky; top: 110px; display: grid; gap: 1.5rem; }
.deep__figure {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  background: var(--color-navy);
}
.deep__figure img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 1.2s var(--ease-out);
}
.deep__figure:hover img { transform: scale(1.05); }
.deep__figure figcaption {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 1.5rem;
  background: linear-gradient(180deg, transparent, rgba(17,30,51,0.85));
  color: var(--color-white);
  display: flex; align-items: baseline; gap: 0.8rem;
}
.deep__num {
  font-family: var(--font-display);
  color: var(--color-gold);
  font-size: 1.8rem;
  letter-spacing: -0.02em;
}
.deep__cap { font-family: var(--font-display); font-size: var(--fs-lg); }

@media (max-width: 900px) {
  .deep__inner, .deep__block--alt .deep__inner { grid-template-columns: 1fr; }
  .deep__block--alt .deep__copy { order: 0; }
  .deep__aside { position: static; }
  .deep__figure { aspect-ratio: 3 / 2; }
}
</style>
