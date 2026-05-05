<template>
  <canvas ref="canvas" class="hero-canvas" aria-hidden="true"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const canvas = ref(null)
let renderer, scene, camera, points, lines, raf, ro
let mouseX = 0, mouseY = 0

const POINT_COUNT = 90
const CONNECT_DIST = 1.6

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  init()
})

function init() {
  const c = canvas.value
  renderer = new THREE.WebGLRenderer({ canvas: c, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  resize()

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, c.clientWidth / c.clientHeight, 0.1, 100)
  camera.position.z = 7

  // Puntos: distribución esférica
  const positions = new Float32Array(POINT_COUNT * 3)
  const velocities = []
  for (let i = 0; i < POINT_COUNT; i++) {
    const r = 2.6 + Math.random() * 1.4
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi) * 0.6
    velocities.push({
      x: (Math.random() - 0.5) * 0.0015,
      y: (Math.random() - 0.5) * 0.0015,
      z: (Math.random() - 0.5) * 0.001
    })
  }

  const geom = new THREE.BufferGeometry()
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const mat = new THREE.PointsMaterial({
    color: 0xc9a84c,
    size: 0.07,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true
  })
  points = new THREE.Points(geom, mat)
  points.userData.velocities = velocities
  scene.add(points)

  // Líneas conectoras
  const lineGeom = new THREE.BufferGeometry()
  const lineMat = new THREE.LineBasicMaterial({ color: 0xc9a84c, transparent: true, opacity: 0.18 })
  lines = new THREE.LineSegments(lineGeom, lineMat)
  scene.add(lines)

  // Glow central sutil
  const sphereGeom = new THREE.SphereGeometry(0.6, 32, 32)
  const sphereMat = new THREE.MeshBasicMaterial({ color: 0x1a2d4e, transparent: true, opacity: 0.0 })
  const core = new THREE.Mesh(sphereGeom, sphereMat)
  scene.add(core)

  window.addEventListener('mousemove', onMouseMove)
  ro = new ResizeObserver(resize); ro.observe(c)
  animate()
}

function onMouseMove(e) {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 0.6
  mouseY = (e.clientY / window.innerHeight - 0.5) * 0.6
}

function resize() {
  if (!renderer) return
  const c = canvas.value
  const w = c.clientWidth, h = c.clientHeight
  renderer.setSize(w, h, false)
  if (camera) {
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
}

function animate() {
  raf = requestAnimationFrame(animate)

  const positions = points.geometry.attributes.position.array
  const v = points.userData.velocities
  for (let i = 0; i < POINT_COUNT; i++) {
    positions[i * 3] += v[i].x
    positions[i * 3 + 1] += v[i].y
    positions[i * 3 + 2] += v[i].z
    // mantener dentro de la esfera
    const x = positions[i * 3], y = positions[i * 3 + 1], z = positions[i * 3 + 2]
    const d = Math.sqrt(x * x + y * y + z * z)
    if (d > 4.2 || d < 2.2) {
      v[i].x *= -1; v[i].y *= -1; v[i].z *= -1
    }
  }
  points.geometry.attributes.position.needsUpdate = true

  // recalcular líneas
  const linePositions = []
  for (let i = 0; i < POINT_COUNT; i++) {
    for (let j = i + 1; j < POINT_COUNT; j++) {
      const dx = positions[i * 3] - positions[j * 3]
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (d < CONNECT_DIST) {
        linePositions.push(positions[i*3], positions[i*3+1], positions[i*3+2])
        linePositions.push(positions[j*3], positions[j*3+1], positions[j*3+2])
      }
    }
  }
  lines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3))
  lines.geometry.attributes.position.needsUpdate = true

  // rotación lenta + parallax mouse
  points.rotation.y += 0.0012
  points.rotation.x += 0.0006
  lines.rotation.copy(points.rotation)
  camera.position.x += (mouseX * 1.2 - camera.position.x) * 0.04
  camera.position.y += (-mouseY * 1.2 - camera.position.y) * 0.04
  camera.lookAt(scene.position)

  renderer.render(scene, camera)
}

onUnmounted(() => {
  if (raf) cancelAnimationFrame(raf)
  if (ro) ro.disconnect()
  window.removeEventListener('mousemove', onMouseMove)
  if (renderer) renderer.dispose()
})
</script>

<style scoped>
.hero-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
@media (prefers-reduced-motion: reduce) { .hero-canvas { display: none; } }
</style>
