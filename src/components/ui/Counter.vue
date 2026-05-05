<template>
  <span ref="el" class="counter">{{ formatted }}<span v-if="suffix" class="counter__suffix">{{ suffix }}</span></span>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
const props = defineProps({
  value: { type: Number, required: true },
  duration: { type: Number, default: 2200 },
  suffix: { type: String, default: '' }
})
const el = ref(null)
const current = ref(0)
const formatted = computed(() => current.value.toLocaleString('es-ES'))

let started = false, raf = null, io = null

function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t) }

function start() {
  if (started) return
  started = true
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    current.value = props.value; return
  }
  const t0 = performance.now()
  const tick = (t) => {
    const p = Math.min(1, (t - t0) / props.duration)
    current.value = Math.round(easeOutExpo(p) * props.value)
    if (p < 1) raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { start(); io.disconnect() }
  }, { threshold: 0.4 })
  if (el.value) io.observe(el.value)
})
onUnmounted(() => { if (raf) cancelAnimationFrame(raf); if (io) io.disconnect() })
</script>

<style scoped>
.counter {
  font-family: var(--font-display);
  font-size: var(--fs-4xl);
  font-weight: 400;
  color: var(--color-gold);
  letter-spacing: -0.02em;
  display: inline-flex;
  align-items: baseline;
}
.counter__suffix { font-size: 0.7em; margin-left: 0.1em; }
</style>
