<template>
  <div ref="el" class="cursor" :class="{ 'is-active': active, 'is-hover': hover }" aria-hidden="true"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const el = ref(null)
const active = ref(false)
const hover = ref(false)
let x = 0, y = 0, tx = 0, ty = 0, raf = null, isTouch = false

function onMove(e) {
  x = e.clientX; y = e.clientY
  if (!active.value) active.value = true
  if (!raf) raf = requestAnimationFrame(loop)
}
function loop() {
  tx += (x - tx) * 0.18
  ty += (y - ty) * 0.18
  if (el.value) el.value.style.transform = `translate3d(${tx - 12}px, ${ty - 12}px, 0)`
  if (Math.abs(x - tx) > 0.1 || Math.abs(y - ty) > 0.1) raf = requestAnimationFrame(loop)
  else raf = null
}
function onOver(e) {
  const t = e.target
  if (t.closest && t.closest('a, button, [data-cursor="hover"]')) hover.value = true
}
function onOut(e) {
  const t = e.target
  if (t.closest && t.closest('a, button, [data-cursor="hover"]')) hover.value = false
}
function onLeave() { active.value = false }

onMounted(() => {
  isTouch = matchMedia('(pointer: coarse)').matches
  if (isTouch) return
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseover', onOver, true)
  window.addEventListener('mouseout', onOut, true)
  document.addEventListener('mouseleave', onLeave)
})
onUnmounted(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseover', onOver, true)
  window.removeEventListener('mouseout', onOut, true)
  document.removeEventListener('mouseleave', onLeave)
  if (raf) cancelAnimationFrame(raf)
})
</script>

<style scoped>
.cursor {
  position: fixed;
  top: 0; left: 0;
  width: 24px; height: 24px;
  border-radius: 50%;
  background: var(--color-gold);
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  opacity: 0;
  transition: width 280ms var(--ease-out), height 280ms var(--ease-out), opacity 200ms;
  will-change: transform;
}
.cursor.is-active { opacity: 0.85; }
.cursor.is-hover { width: 56px; height: 56px; transform-origin: center; }
.cursor.is-hover { margin-left: -16px; margin-top: -16px; }

@media (pointer: coarse) { .cursor { display: none; } }
@media (prefers-reduced-motion: reduce) { .cursor { display: none; } }
</style>
