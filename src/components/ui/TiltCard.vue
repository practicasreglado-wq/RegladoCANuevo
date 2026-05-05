<template>
  <div ref="el" class="tilt" @mousemove="onMove" @mouseleave="reset">
    <div class="tilt__inner"><slot /></div>
    <div class="tilt__glow" aria-hidden="true"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({ max: { type: Number, default: 6 } })
const el = ref(null)

function onMove(e) {
  if (matchMedia('(pointer: coarse)').matches) return
  const r = el.value.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width
  const y = (e.clientY - r.top) / r.height
  const rx = (0.5 - y) * props.max
  const ry = (x - 0.5) * props.max
  el.value.style.setProperty('--rx', rx + 'deg')
  el.value.style.setProperty('--ry', ry + 'deg')
  el.value.style.setProperty('--mx', (x * 100) + '%')
  el.value.style.setProperty('--my', (y * 100) + '%')
}
function reset() {
  el.value.style.setProperty('--rx', '0deg')
  el.value.style.setProperty('--ry', '0deg')
}
</script>

<style scoped>
.tilt {
  --rx: 0deg; --ry: 0deg; --mx: 50%; --my: 50%;
  position: relative;
  transform-style: preserve-3d;
  transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry));
  transition: transform 350ms var(--ease-out);
  will-change: transform;
}
.tilt__inner { position: relative; z-index: 1; }
.tilt__glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: radial-gradient(circle at var(--mx) var(--my), rgba(201, 168, 76, 0.18), transparent 60%);
  opacity: 0;
  transition: opacity 250ms var(--ease-out);
  z-index: 0;
}
.tilt:hover .tilt__glow { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .tilt { transform: none !important; transition: none; } }
</style>
