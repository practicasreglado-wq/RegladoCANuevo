<template>
  <section id="subvenciones" class="section section--dark programas">
    <div class="container">
      <header class="programas__header">
        <p class="eyebrow" v-reveal>Financiación europea</p>
        <SplitHeading text="Subvenciones y fondos europeos" tag="h2" />
        <p class="programas__lead" v-reveal="{ delay: 1 }">Captación, gestión y justificación de fondos Next Generation, FEDER, FSE+, MITECO, IDAE y convocatorias autonómicas. Trabajamos con tu municipio en todo el ciclo de la subvención.</p>
      </header>

      <div class="programas__grid">
        <div v-for="(p, i) in programas" :key="p.title" class="programas__card" v-reveal="{ delay: (i % 3) + 1 }">
          <span class="programas__num">0{{ i + 1 }}</span>
          <h3>{{ p.title }}</h3>
          <p>{{ p.text }}</p>
        </div>
      </div>
    </div>
  </section>

  <section id="contrataciones" class="section contrataciones">
    <div class="container contrataciones__inner">
      <div class="contrataciones__copy">
        <p class="eyebrow" v-reveal>Contratación pública</p>
        <SplitHeading text="Asistencia integral en contratación" tag="h2" />
        <p class="contrataciones__lead" v-reveal="{ delay: 1 }">Acompañamiento en todo el ciclo del contrato público: pliegos, mesas, ejecución y recursos. Procedimientos sólidos, ágiles y blindados frente a impugnaciones.</p>
        <ul class="contrataciones__list">
          <li v-for="(s, i) in contratacionesItems" :key="i" v-reveal="{ delay: (i % 4) + 1 }">{{ s }}</li>
        </ul>
      </div>
      <div class="contrataciones__cite" v-reveal="{ delay: 2 }">
        <span class="contrataciones__quote">“</span>
        <p>LCSP 9/2017, Directivas comunitarias y doctrina TACRC. Procedimientos blindados frente a recursos y modificaciones contractuales.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import SplitHeading from '@/components/ui/SplitHeading.vue'

const programas = [
  { title: 'Next Generation EU', text: 'Plan de Recuperación, Transformación y Resiliencia. PERTE, MRR, transferencias a entidades locales.' },
  { title: 'FEDER 2021-2027', text: 'Programas operativos plurianuales para infraestructuras, digitalización y cohesión territorial.' },
  { title: 'EDUSI', text: 'Estrategia de Desarrollo Urbano Sostenible. Capturamos y ejecutamos los fondos asociados.' },
  { title: 'IDAE / MITECO', text: 'Convocatorias de eficiencia energética, autoconsumo y movilidad sostenible.' },
  { title: 'DUS 5000', text: 'Ayudas para municipios de menos de 5.000 habitantes en transición energética.' },
  { title: 'Convocatorias autonómicas', text: 'Cobertura en las 17 CC. AA. con seguimiento mensual de oportunidades.' }
]

const contratacionesItems = [
  'Redacción de pliegos administrativos y técnicos.',
  'Asistencia letrada en mesas de contratación.',
  'Defensa ante recursos especiales (TACRC, OARC).',
  'Modificaciones, prórrogas y resoluciones contractuales.',
  'Auditoría de procedimientos en curso.'
]
</script>

<style scoped>
.programas { scroll-margin-top: var(--nav-height); padding: clamp(5rem, 10vw, 8rem) 0; }
.programas__header { max-width: 720px; margin-bottom: 4rem; }
.programas__header > * + * { margin-top: 1rem; }
.programas__lead { color: rgba(255,255,255,0.78); font-size: var(--fs-lg); line-height: 1.7; }
.programas__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.programas__card {
  background: var(--color-navy);
  padding: 2rem;
  transition: background var(--t-base);
  position: relative;
}
.programas__card:hover { background: var(--color-navy-soft); }
.programas__num {
  font-family: var(--font-display);
  color: var(--color-gold);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
}
.programas__card h3 { color: var(--color-white); margin: 0.7rem 0 0.5rem; font-size: var(--fs-xl); }
.programas__card p { color: rgba(255,255,255,0.7); font-size: var(--fs-sm); line-height: 1.6; }

.contrataciones { scroll-margin-top: var(--nav-height); background: var(--color-bg-cream); }
.contrataciones__inner {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: start;
}
.contrataciones__copy > * + * { margin-top: 1.2rem; }
.contrataciones__lead { font-size: var(--fs-lg); color: var(--color-text-muted); line-height: 1.7; }
.contrataciones__list { margin-top: 2rem; }
.contrataciones__list li {
  padding: 0.9rem 0;
  border-bottom: 1px solid var(--color-border);
  font-size: var(--fs-base);
}
.contrataciones__cite {
  position: sticky;
  top: 110px;
  background: var(--color-navy);
  color: rgba(255,255,255,0.92);
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  border-top: 3px solid var(--color-gold);
}
.contrataciones__quote {
  font-family: var(--font-display);
  color: var(--color-gold);
  font-size: 5rem;
  line-height: 0.5;
  display: block;
  margin-bottom: 1rem;
}
.contrataciones__cite p { font-family: var(--font-display); font-size: var(--fs-lg); line-height: 1.5; }

@media (max-width: 900px) {
  .contrataciones__inner { grid-template-columns: 1fr; }
  .contrataciones__cite { position: static; }
}
</style>
