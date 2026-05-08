<template>
  <section class="stats section--dark">
    <div class="container">
      <header class="stats__header">
        <p class="eyebrow" v-reveal>{{ $t('stats.eyebrow') }}</p>
        <SplitHeading :text="$t('stats.title')" tag="h2" />
      </header>
      
      <!-- Marco decorativo para el mapa -->
      <div class="stats__map-wrapper" v-reveal>
        <div class="map-frame">
          <MapaReglado 
            ref="mapa"
            aspect-ratio="16/9"
            aspect-ratio-mobile="4/5"
            border-radius="8px"
            hint-text="Mapa de cobertura nacional · Reglado Consultores"
          />
        </div>
      </div>

      <div class="stats__marquee">
        <Marquee :speed="40">
          <button 
            v-for="m in municipios" 
            :key="m.name" 
            class="stats__chip"
            @click="goToCity(m)"
          >
            {{ m.name }}
          </button>
        </Marquee>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SplitHeading from '@/components/ui/SplitHeading.vue'
import Marquee from '@/components/ui/Marquee.vue'
import MapaReglado from '@/components/common/MapaReglado.vue'

const { tm } = useI18n({ useScope: 'global' })

const mapa = ref(null)

const municipios = [
  { name: 'Madrid', cpro: '28', muniId: '28079' },
  { name: 'Sevilla', cpro: '41', muniId: '41091' },
  { name: 'Valencia', cpro: '46', muniId: '46250' },
  { name: 'Zaragoza', cpro: '50', muniId: '50297' },
  { name: 'Bilbao', cpro: '48', muniId: '48020' },
  { name: 'Murcia', cpro: '30', muniId: '30030' },
  { name: 'Palma', cpro: '07', muniId: '07040' },
  { name: 'Córdoba', cpro: '14', muniId: '14021' },
  { name: 'Vigo', cpro: '36', muniId: '36057' },
  { name: 'Gijón', cpro: '33', muniId: '33024' },
  { name: 'Granada', cpro: '18', muniId: '18087' },
  { name: 'Pamplona', cpro: '31', muniId: '31201' },
  { name: 'Toledo', cpro: '45', muniId: '45168' },
  { name: 'Cáceres', cpro: '10', muniId: '10037' },
  { name: 'Cuenca', cpro: '16', muniId: '16078' },
  { name: 'Soria', cpro: '42', muniId: '42173' },
  { name: 'Teruel', cpro: '44', muniId: '44216' },
  { name: 'Ávila', cpro: '05', muniId: '05019' }
]

function goToCity(city) {
  mapa.value?.flyTo(city.cpro, city.muniId)
  
  // Opcional: scroll suave hacia el mapa si estamos en móvil y queda lejos
  const mapEl = document.querySelector('.stats__map-wrapper')
  if (mapEl) {
    const rect = mapEl.getBoundingClientRect()
    if (rect.top < 0 || rect.bottom > window.innerHeight) {
      mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}
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

/* Nuevo marco para el mapa */
.stats__map-wrapper {
  margin-bottom: 2rem; /* Reducido para que esté más pegado */
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(201, 168, 76, 0.15);
  border-radius: calc(var(--radius-lg) + 1rem);
  position: relative;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.2);
}

.stats__map-wrapper::after {
  content: '';
  position: absolute;
  inset: 0.5rem;
  border: 1px solid rgba(201, 168, 76, 0.3);
  border-radius: calc(var(--radius-lg) + 0.5rem);
  pointer-events: none;
}

.map-frame {
  position: relative;
  z-index: 2;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stats__marquee {
  border-top: 1px solid rgba(201, 168, 76, 0.1);
  padding-top: 2rem;
  opacity: 0.8;
}

.stats__chip {
  appearance: none;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-display);
  font-size: clamp(1rem, 2vw, 1.4rem);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.4);
  white-space: nowrap;
  padding: 0 3rem;
  transition: all var(--t-base) var(--ease-out);
  position: relative;
}

.stats__chip:hover { 
  color: var(--color-gold);
  transform: scale(1.05);
}

.stats__chip::after {
  content: '·';
  position: absolute;
  right: -0.5rem;
  color: rgba(201, 168, 76, 0.3);
}
</style>
