<template>
  <transition name="fade">
    <div v-if="show" class="cookie" role="dialog" aria-live="polite">
      <div class="cookie__inner">
        <div>
          <p class="cookie__title">{{ $t('cookies.title') }}</p>
          <p class="cookie__text">{{ $t('cookies.text') }}</p>
        </div>
        <div class="cookie__actions">
          <router-link to="/privacidad" class="cookie__link">{{ $t('footer.privacy') }}</router-link>
          <button class="btn btn--primary" @click="accept">{{ $t('cookies.accept') }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const KEY = 'reglado.cookies.v1'
const show = ref(false)
function accept() {
  localStorage.setItem(KEY, JSON.stringify({ technical: true, ts: Date.now() }))
  show.value = false
}
onMounted(() => { if (!localStorage.getItem(KEY)) show.value = true })
</script>

<style scoped>
.cookie {
  position: fixed;
  bottom: 1rem; left: 1rem; right: 1rem;
  z-index: 9000;
  background: var(--color-navy);
  color: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border-top: 2px solid var(--color-gold);
  max-width: 920px;
  margin: 0 auto;
}
.cookie__inner {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
}
.cookie__title { font-weight: 600; margin-bottom: 0.2rem; }
.cookie__text { font-size: var(--fs-sm); opacity: 0.85; max-width: 60ch; }
.cookie__actions { display: flex; align-items: center; gap: 1rem; }
.cookie__link { font-size: var(--fs-sm); text-decoration: underline; opacity: 0.85; }
.cookie__link:hover { opacity: 1; }
.fade-enter-active, .fade-leave-active { transition: opacity 350ms, transform 350ms; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(20px); }
</style>
