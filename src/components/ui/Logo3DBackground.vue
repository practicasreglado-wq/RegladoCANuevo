<template>
  <div class="logo3d" aria-hidden="true">
    <iframe ref="frame" src="/logo3d.html" title="" tabindex="-1" loading="lazy"></iframe>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const frame = ref(null)
let lastY = 0
let raf = null

// Cuánto rota el sólido por cada píxel scrolleado (radianes/píxel).
// Positivo cuando el usuario baja (scroll down → giro horario sobre el eje Z).
const ROT_PER_PX = 0.0035

function onScroll() {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = null
    const y = window.scrollY || document.documentElement.scrollTop || 0
    const dy = y - lastY
    lastY = y
    if (!dy) return
    const f = frame.value
    if (!f || !f.contentWindow) return
    // dy > 0 (scroll abajo) → rotación horaria (delta negativo en Z porque la cámara mira hacia +Z)
    // En el HTML del logo, `spinGroup.rotation.z -=` produce horario al mirar la cara, así que
    // enviamos delta = -dy * factor (positivo en delta = antihorario; negativo = horario).
    f.contentWindow.postMessage({ type: 'reglado-spin', delta: -dy * ROT_PER_PX }, '*')
  })
}

onMounted(() => {
  lastY = window.scrollY || 0
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<style scoped>
/*
  Diseño: el sólido 3D vive siempre en el centro de la ventana, fijo (no
  se desplaza con el scroll), y atraviesa visualmente las secciones como
  marca de agua sutil. Está por encima de los fondos de sección (z:1) pero
  con opacity baja + mix-blend-mode para integrarse, y pointer-events:none
  para no bloquear clicks ni texto seleccionable.
*/
.logo3d {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  display: grid;
  place-items: center;
  overflow: hidden;
  mix-blend-mode: multiply;
}
.logo3d iframe {
  width: min(95vmin, 1100px);
  height: min(95vmin, 1100px);
  border: 0;
  background: transparent;
  opacity: 0.28;
  pointer-events: none;
}

@media (max-width: 768px) {
  .logo3d iframe { width: 110vmin; height: 110vmin; opacity: 0.08; }
}
@media (prefers-reduced-motion: reduce) {
  .logo3d { display: none; }
}
</style>
