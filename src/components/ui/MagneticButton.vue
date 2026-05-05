<template>
  <component :is="tag" ref="el" class="mag" @mousemove="onMove" @mouseleave="reset">
    <span class="mag__inner" ref="inner"><slot /></span>
  </component>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({ tag: { type: String, default: 'button' }, strength: { type: Number, default: 0.3 } })
const el = ref(null)
const inner = ref(null)

function onMove(e) {
  if (matchMedia('(pointer: coarse)').matches) return
  const r = el.value.getBoundingClientRect()
  const x = (e.clientX - r.left - r.width / 2) * props.strength
  const y = (e.clientY - r.top - r.height / 2) * props.strength
  el.value.style.transform = `translate3d(${x}px, ${y}px, 0)`
  if (inner.value) inner.value.style.transform = `translate3d(${x * 0.4}px, ${y * 0.4}px, 0)`
}
function reset() {
  if (el.value) el.value.style.transform = ''
  if (inner.value) inner.value.style.transform = ''
}
</script>

<style scoped>
.mag {
  display: inline-block;
  transition: transform 600ms var(--ease-out);
  will-change: transform;
}
.mag__inner {
  display: inline-flex;
  transition: transform 600ms var(--ease-out);
  will-change: transform;
}
@media (prefers-reduced-motion: reduce) { .mag, .mag__inner { transition: none; transform: none !important; } }
</style>
