<!--
  HomeView.vue
  Pagina principal: ensambla las secciones comerciales y de contacto en una landing navegable por anclas.
-->
<template>
  <main>
    <HeroSection @scrollto="onScroll" />
    <ServicesSection id="servicios" />
    <BannerSection />
    <AboutSection id="sobre-nosotros" />
    <StatsSection />
    <VideoShowcaseSection
      video-src="/video/InspeccionesTributarias.mp4"
      :eyebrow="$t('video_showcase.eyebrow')"
      :title="$t('video_showcase.title')"
      :lead="$t('video_showcase.lead')" />
    <ServicesDeepSection @scrollto="onScroll" />
    <ProgramasSection />
    <OrdenanzasSection />
    <ContactSection id="contacto" />
  </main>
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
</style>
