<template>
  <component :is="tag" ref="el" class="split-heading">
    <span class="split-line">
      <span v-for="(w, j) in words" :key="j" class="split-word" :style="{ transitionDelay: (j * 50) + 'ms' }">{{ w }}<span v-if="j < words.length - 1">&nbsp;</span></span>
    </span>
  </component>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
const props = defineProps({ text: { type: String, required: true }, tag: { type: String, default: 'h2' } })
const el = ref(null)
const words = computed(() => props.text.split(' '))

let io = null
onMounted(() => {
  io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.split-word').forEach((w) => w.classList.add('is-visible'))
        io.unobserve(e.target)
      }
    })
  }, { threshold: 0, rootMargin: '0px' })
  if (el.value) io.observe(el.value)
})
onUnmounted(() => { if (io) io.disconnect() })
</script>
