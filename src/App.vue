<template>
  <a class="skip-link" href="#main">{{ $t('common.back_home') }}</a>
  <ScrollProgress />
  <CursorBlend />
  <Logo3DBackground />
  <div class="grain" aria-hidden="true"></div>
  <TheNavbar />
  <main id="main">
    <router-view v-slot="{ Component, route }">
      <transition name="page" mode="out-in" @before-enter="resetScroll">
        <component :is="Component" :key="route.fullPath" />
      </transition>
    </router-view>
  </main>
  <TheFooter />
  <CookieBanner />
</template>

<script setup>
import { onMounted } from 'vue'
import TheNavbar from '@/components/layout/TheNavbar.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import ScrollProgress from '@/components/ui/ScrollProgress.vue'
import CursorBlend from '@/components/ui/CursorBlend.vue'
import CookieBanner from '@/components/ui/CookieBanner.vue'
import Logo3DBackground from '@/components/ui/Logo3DBackground.vue'
import { initLenis } from '@/composables/useLenis'

const resetScroll = () => window.scrollTo({ top: 0, behavior: 'instant' })

onMounted(() => { initLenis() })
</script>

<style scoped>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 0.6rem 1rem;
  background: var(--color-navy);
  color: var(--color-white);
  z-index: 10000;
  transition: top 200ms;
}
.skip-link:focus { top: 0; }

.page-enter-active, .page-leave-active {
  transition: opacity 500ms var(--ease-out), transform 500ms var(--ease-out);
}
.page-enter-from { opacity: 0; transform: translateY(20px); }
.page-leave-to { opacity: 0; transform: translateY(-12px); }
</style>
