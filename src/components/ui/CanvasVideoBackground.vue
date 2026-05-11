<!--
  CanvasVideoBackground.vue
  Fondo animado por scroll que dibuja una secuencia de imagenes en canvas con fallback estatico.
-->
<template>
  <div class="cvb">
    <div v-if="!isReady && !showFallback" class="cvb__loader" aria-hidden="true">
      <span class="cvb__spinner"></span>
    </div>
    <div
      v-if="showFallback"
      class="cvb__fallback"
      :style="{ backgroundImage: `url(${fallbackImage})` }"
      aria-hidden="true"
    ></div>
    <template v-else>
      <canvas ref="canvasRef" class="cvb__canvas" :style="{ opacity: isReady ? opacity : 0 }" aria-hidden="true"></canvas>
      <div class="cvb__overlay" :style="{ opacity: isReady ? opacity : 0 }" aria-hidden="true"></div>
    </template>
  </div>
</template>

<script setup>
/**
 * Scroll-scrubbed image sequence (canvas).
 * Uses webp frames stored in /public/frames/{name}/frame_NNNN.webp.
 * Adapted from the original Reglado component.
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import fallbackImage from '@/assets/images/contact-hero-bg.png'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  name: { type: String, default: 'h4' },
  frameCount: { type: Number, default: 79 },
  trigger: { type: String, default: '#top' },
  endTrigger: { type: String, default: '#sobre-nosotros' }
})

const canvasRef = ref(null)
const opacity = ref(1)
const isReady = ref(false)
const showFallback = ref(false)

const images = []
const playhead = { frame: 0 }
let lastDrawn = -1
let ctx = null
const dp = { w: 0, h: 0, x: 0, y: 0 }
let scrubTween = null
let fadeTween = null

function shouldFallback() {
  // Evita cargar la secuencia completa cuando el usuario o el dispositivo piden una experiencia ligera.
  const rm = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  const sd = navigator.connection?.saveData
  const slow = ['slow-2g', '2g'].includes(navigator.connection?.effectiveType || '')
  const lowMem = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4
  return Boolean(rm || sd || slow || lowMem)
}

async function preload() {
  const PRIORITY = 30
  const promises = []
  for (let i = 1; i <= props.frameCount; i++) {
    const img = new Image()
    const p = new Promise((r) => { img.onload = () => r(true); img.onerror = () => r(false) })
    if (i <= PRIORITY) {
      img.src = `/frames/${props.name}/frame_${String(i).padStart(4, '0')}.webp`
      promises.push(p)
    } else {
      setTimeout(() => {
        if (!img.src) img.src = `/frames/${props.name}/frame_${String(i).padStart(4, '0')}.webp`
      }, 500 + i * 2)
    }
    images.push(img)
  }
  await Promise.all(promises)
}

function fit(canvas, img) {
  // Cover centrado: llena el viewport sin deformar los frames, recortando solo los bordes sobrantes.
  const ca = canvas.width / canvas.height
  const ia = img.width / img.height
  if (ca > ia) { dp.w = canvas.width; dp.h = canvas.width / ia; dp.x = 0; dp.y = (canvas.height - dp.h) / 2 }
  else { dp.w = canvas.height * ia; dp.h = canvas.height; dp.x = (canvas.width - dp.w) / 2; dp.y = 0 }
}

function draw(frame) {
  if (!canvasRef.value || !ctx) return
  const img = images[frame]
  if (!img || !img.complete || !img.width) return
  if (frame === lastDrawn) return
  fit(canvasRef.value, img)
  lastDrawn = frame
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  ctx.drawImage(img, dp.x, dp.y, dp.w, dp.h)
}

function resize() {
  if (!canvasRef.value) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = window.innerWidth, h = window.innerHeight
  canvasRef.value.width = w * dpr
  canvasRef.value.height = h * dpr
  canvasRef.value.style.width = w + 'px'
  canvasRef.value.style.height = h + 'px'
  ctx = canvasRef.value.getContext('2d', { alpha: false })
  if (ctx) { ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'medium' }
  lastDrawn = -1
  draw(Math.round(playhead.frame))
}

onMounted(async () => {
  if (shouldFallback()) { showFallback.value = true; return }
  await preload()
  isReady.value = true
  window.addEventListener('resize', resize)
  resize()
  draw(0)

  scrubTween = gsap.to(playhead, {
    frame: props.frameCount - 1,
    ease: 'none',
    scrollTrigger: {
      trigger: props.trigger,
      start: 'top top',
      endTrigger: props.endTrigger,
      end: 'top top',
      scrub: 1,
      onUpdate: () => draw(Math.round(playhead.frame))
    }
  })

  fadeTween = gsap.to(opacity, {
    value: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: props.endTrigger,
      start: 'top 80%',
      end: 'top 20%',
      scrub: true,
      onUpdate: (self) => { opacity.value = 1 - self.progress }
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  scrubTween?.scrollTrigger?.kill(); scrubTween?.kill()
  fadeTween?.scrollTrigger?.kill(); fadeTween?.kill()
})
</script>

<style scoped>
.cvb {
  position: fixed;
  inset: 0;
  width: 100vw; height: 100vh;
  z-index: -1;
  background-color: var(--color-navy-deep);
  pointer-events: none;
  overflow: hidden;
}
.cvb__canvas { position: absolute; inset: 0; width: 100%; height: 100%; transition: opacity 0.6s ease; }
.cvb__overlay {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, rgba(17,30,51,0.55), rgba(26,45,78,0.7));
  transition: opacity 0.6s ease;
}
.cvb__fallback { position: absolute; inset: 0; background-size: cover; background-position: center; }
.cvb__loader { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
.cvb__spinner {
  display: block; width: 36px; height: 36px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-top-color: var(--color-gold);
  border-radius: 50%;
  animation: cvb-spin 1s linear infinite;
}
@keyframes cvb-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .cvb__spinner { animation: none; } }
</style>
