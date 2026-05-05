<template>
  <div class="marquee" :style="{ '--speed': speed + 's' }">
    <div class="marquee__track">
      <div class="marquee__group"><slot /></div>
      <div class="marquee__group" aria-hidden="true"><slot /></div>
    </div>
  </div>
</template>

<script setup>
defineProps({ speed: { type: Number, default: 38 } })
</script>

<style scoped>
.marquee { overflow: hidden; mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); }
.marquee__track {
  display: flex;
  width: max-content;
  animation: marquee var(--speed) linear infinite;
}
.marquee__group {
  display: flex;
  align-items: center;
  gap: clamp(2rem, 5vw, 4rem);
  padding-right: clamp(2rem, 5vw, 4rem);
}
@keyframes marquee {
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) { .marquee__track { animation: none; } }
</style>
