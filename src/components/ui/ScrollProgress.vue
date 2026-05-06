<template>
  <div class="scroll-progress" aria-hidden="true">
    <div class="scroll-progress__bar" :style="{ transform: `scaleX(${progress})` }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const progress = ref(0)
let raf = null

function update() {
  const h = document.documentElement
  const total = h.scrollHeight - h.clientHeight
  progress.value = total > 0 ? Math.min(1, Math.max(0, h.scrollTop / total)) : 0
  raf = null
}
function onScroll() { if (!raf) raf = requestAnimationFrame(update) }

onMounted(() => { window.addEventListener('scroll', onScroll, { passive: true }); update() })
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: transparent;
  z-index: 9999;
  pointer-events: none;
}
.scroll-progress__bar {
  height: 100%;
  background: linear-gradient(90deg, var(--color-gold), var(--color-gold-soft));
  transform-origin: left center;
  transform: scaleX(0);
  transition: transform 80ms linear;
  will-change: transform;
}
</style>
