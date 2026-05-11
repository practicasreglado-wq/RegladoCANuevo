<!--
  ScrollProgress.vue
  Muestra barras superior e inferior con el progreso real de lectura de la pagina.
-->
<template>
  <div class="scroll-progress" aria-hidden="true">
    <!-- Barra superior -->
    <div class="scroll-progress__container scroll-progress__container--top">
      <div class="scroll-progress__bar" :style="{ transform: `scaleX(${progress})` }"></div>
    </div>
    <!-- Barra inferior -->
    <div class="scroll-progress__container scroll-progress__container--bottom">
      <div class="scroll-progress__bar" :style="{ transform: `scaleX(${progress})` }"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)
let raf = null

function update() {
  const h = document.documentElement
  const total = h.scrollHeight - h.clientHeight
  // Probamos con varias formas de obtener el scroll para máxima compatibilidad
  const current = window.pageYOffset || document.documentElement.scrollTop || window.scrollY || 0
  progress.value = total > 0 ? Math.min(1, Math.max(0, current / total)) : 0
  raf = null
}

function onScroll() {
  if (!raf) {
    raf = requestAnimationFrame(update)
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  update()
})

onUnmounted(() => {
  if (raf) cancelAnimationFrame(raf)
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999; /* Máxima prioridad */
  pointer-events: none;
}

.scroll-progress__container {
  position: absolute;
  left: 0;
  right: 0;
  height: 6px;
  background: rgba(0, 0, 0, 0.05);
}

.scroll-progress__container--top {
  top: 0;
}

.scroll-progress__container--bottom {
  bottom: 0;
}

.scroll-progress__bar {
  height: 100%;
  background: linear-gradient(90deg, #d4af37, #f9e29c, #d4af37);
  transform-origin: left center;
  transform: scaleX(0);
  transition: transform 100ms linear;
  will-change: transform;
  box-shadow: 0 0 8px rgba(212, 175, 55, 0.5);
}
</style>
