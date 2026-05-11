// Genera partículas doradas flotantes dentro de un contenedor.
// Las partículas se animan vía CSS (clase global `.banner-particle` definida en main.css),
// con variables CSS personalizadas inyectadas por partícula para variar su tamaño,
// duración, retraso, deriva horizontal y opacidad.
//
// Uso:
//   const particlesEl = ref(null)
//   useGoldParticles(particlesEl)              // 14 partículas por defecto
//   useGoldParticles(particlesEl, 20)          // cantidad personalizada

import { onMounted } from 'vue'

const DEFAULT_COUNT = 14

export function useGoldParticles(containerRef, count = DEFAULT_COUNT) {
  onMounted(() => {
    const container = containerRef.value
    if (!container) return

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('span')
      particle.className = 'banner-particle'

      // Tamaño aleatorio entre 2px y 6px
      const size = (Math.random() * 4 + 2).toFixed(1)

      // Posición horizontal aleatoria (0–100%)
      const left = (Math.random() * 100).toFixed(1)

      // Duración de la animación entre 6s y 13s
      const duration = (Math.random() * 7 + 6).toFixed(1)

      // Retraso aleatorio (0–10s) para escalonar la aparición
      const delay = (Math.random() * 10).toFixed(1)

      // Deriva horizontal mientras sube (-35px a +35px)
      const drift = ((Math.random() - 0.5) * 70).toFixed(0)

      // Opacidad máxima entre 0.12 y 0.47
      const opacity = (Math.random() * 0.35 + 0.12).toFixed(2)

      particle.style.cssText = [
        `width:${size}px`,
        `height:${size}px`,
        `left:${left}%`,
        `--dur:${duration}s`,
        `--delay:${delay}s`,
        `--drift:${drift}px`,
        `--op:${opacity}`,
      ].join(';')

      container.appendChild(particle)
    }
  })
}
