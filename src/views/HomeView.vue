<template>
  <HeroSection @scrollto="onScroll" />
  <section id="servicios" class="anchor"></section>
  <ServicesSection />
  <BannerSection />
  <section id="sobre-nosotros" class="anchor"></section>
  <AboutSection />
  <StatsSection />
  <VideoShowcaseSection
    video-src="/video/InspeccionesTributarias.mp4"
    eyebrow="Caso de uso destacado"
    title="Inspección tributaria con resultados medibles"
    lead="Auditoría completa de IBI, IAE e ICIO con incremento medio de la recaudación del 12-18% sin nuevas tasas para los vecinos." />
  <ServicesDeepSection @scrollto="onScroll" />
  <ProgramasSection />
  <OrdenanzasSection />
  <ContactSection />
</template>

<script setup>
import { onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import HeroSection from '@/components/sections/HeroSection.vue'
import ServicesSection from '@/components/sections/ServicesSection.vue'
import BannerSection from '@/components/sections/BannerSection.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import StatsSection from '@/components/sections/StatsSection.vue'
import VideoShowcaseSection from '@/components/sections/VideoShowcaseSection.vue'
import ServicesDeepSection from '@/components/sections/ServicesDeepSection.vue'
import ProgramasSection from '@/components/sections/ProgramasSection.vue'
import OrdenanzasSection from '@/components/sections/OrdenanzasSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'
import { scrollTo } from '@/composables/useLenis'

const route = useRoute()

function onScroll(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (el) scrollTo(el, { offset: -70 })
}

onMounted(async () => {
  await nextTick()
  if (route.hash) {
    setTimeout(() => onScroll(route.hash), 200)
  }
})
</script>

<style scoped>
.anchor { display: block; height: 0; scroll-margin-top: var(--nav-height); }
</style>
