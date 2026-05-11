<!--
  MapaReglado.vue — Atlas interactivo de municipios de España
  ================================================================
  Carga el mapa bajo demanda en un iframe y protege el scroll de la pagina
  hasta que el usuario decide interactuar con el atlas.
-->
<template>
  <div 
    class="mapa-reglado" 
    :class="{ 'is-interacting': interacting }"
    :style="cssVars"
    @wheel="onWheel"
    @mouseleave="interacting = false"
  >
    <iframe
      ref="iframeEl"
      v-if="loaded"
      :src="src"
      :title="title"
      class="mapa-reglado__frame"
      :style="{ pointerEvents: interacting ? 'auto' : 'none' }"
      loading="lazy"
      referrerpolicy="no-referrer"
      sandbox="allow-scripts allow-same-origin"
    ></iframe>
    
    <!-- Capa invisible que protege el scroll. Se quita al hacer click. -->
    <div 
      v-if="loaded && !interacting" 
      class="mapa-reglado__scroll-protector"
      @click="interacting = true"
    ></div>

    <div v-if="!loaded" ref="placeholderEl" class="mapa-reglado__placeholder">
      <slot name="placeholder">
        <button type="button" class="mapa-reglado__btn" @click="loaded = true">
          {{ placeholderText }}
          <span aria-hidden="true">→</span>
        </button>
        <p v-if="hintText" class="mapa-reglado__hint">{{ hintText }}</p>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  src: { type: String, default: '/mapa/index.html' },
  autoLoad: { type: Boolean, default: true },
  rootMargin: { type: String, default: '300px' },
  aspectRatio: { type: String, default: '16/10' },
  aspectRatioMobile: { type: String, default: '4/5' },
  placeholderText: { type: String, default: 'Cargar mapa interactivo' },
  hintText: { type: String, default: 'Se cargan ~14 MB de datos al pulsar el botón.' },
  title: { type: String, default: 'Atlas interactivo de municipios de España' },
  borderRadius: { type: String, default: '12px' },
  background: { type: String, default: '#0a0e1a' }
})

const cssVars = computed(() => ({
  '--mr-aspect': props.aspectRatio,
  '--mr-aspect-mobile': props.aspectRatioMobile,
  '--mr-radius': props.borderRadius,
  '--mr-bg': props.background
}))

const loaded = ref(false)
const interacting = ref(false)
const placeholderEl = ref(null)
const iframeEl = ref(null)
let io = null

// Ocultar el cursor global cuando estamos interactuando con el mapa
watch(interacting, (val) => {
  if (val) {
    document.documentElement.classList.add('hide-cursor')
  } else {
    document.documentElement.classList.remove('hide-cursor')
  }
})

/**
 * Cuando el usuario hace scroll, desactivamos la interacción.
 */
function onWheel() {
  if (interacting.value) {
    interacting.value = false
  }
}

onMounted(() => {
  if (!props.autoLoad || loaded.value) return
  if (!('IntersectionObserver' in window) || !placeholderEl.value) {
    loaded.value = true
    return
  }
  io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { loaded.value = true; cleanup() }
  }, { rootMargin: props.rootMargin })
  io.observe(placeholderEl.value)
})

function cleanup() { 
  if (io) { io.disconnect(); io = null } 
  document.documentElement.classList.remove('hide-cursor')
}
onBeforeUnmount(cleanup)

function flyTo(cpro, muniId = null) {
  if (!loaded.value) {
    loaded.value = true
    setTimeout(() => {
      interacting.value = true
      iframeEl.value?.contentWindow?.postMessage({ type: 'fly-to', cpro, muniId }, window.location.origin)
    }, 1000)
    return
  }
  interacting.value = true
  iframeEl.value?.contentWindow?.postMessage({ type: 'fly-to', cpro, muniId }, '*')
}

defineExpose({ flyTo })
</script>

<style scoped>
.mapa-reglado {
  position: relative;
  width: 100%;
  aspect-ratio: var(--mr-aspect);
  border-radius: var(--mr-radius);
  overflow: hidden;
  background: var(--mr-bg);
  box-shadow: 0 30px 80px rgba(17, 30, 51, 0.18);
}

.mapa-reglado__frame {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
  transition: opacity 0.3s ease;
}

/* Capa invisible: bloquea la interaccion directa con el iframe sin bloquear el scroll de la pagina. */
.mapa-reglado__scroll-protector {
  position: absolute;
  inset: 0;
  z-index: 10;
  cursor: pointer;
  background: transparent;
}

.mapa-reglado:not(.is-interacting):hover .mapa-reglado__frame {
  opacity: 0.85;
}

.mapa-reglado__placeholder {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
  background:
    radial-gradient(ellipse at center, rgba(0, 212, 255, 0.12), transparent 60%),
    linear-gradient(135deg, #0a0e1a, #141a2e);
  color: rgba(255, 255, 255, 0.85);
}

.mapa-reglado__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.95rem 1.8rem;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  background: #c9a84c;
  color: #1a2d4e;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
  transition: background 350ms var(--ease-out), transform 350ms var(--ease-out);
}

.mapa-reglado__btn:hover {
  background: #a8872e;
  transform: translateY(-1px);
}

.mapa-reglado__hint {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  max-width: 40ch;
}

@media (max-width: 768px) {
  .mapa-reglado { aspect-ratio: var(--mr-aspect-mobile); }
}
</style>
