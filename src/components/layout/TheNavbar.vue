<template>
  <header class="nav" :class="{ 'is-scrolled': scrolled, 'is-open': open }">
    <div class="container nav__inner">
      <a href="#top" class="nav__logo" @click.prevent="goTo('#top')" aria-label="Inicio">
        <img :src="logoOscuro" alt="Reglado Consultores" class="nav__logo-img nav__logo-img--dark" />
        <img :src="logoBlanco" alt="" aria-hidden="true" class="nav__logo-img nav__logo-img--light" />
      </a>

      <nav class="nav__menu" :class="{ 'is-open': open }" aria-label="Principal">
        <a href="#top" class="nav__link" @click.prevent="goTo('#top')">{{ $t('nav.home') }}</a>
        <a href="#sobre-nosotros" class="nav__link" @click.prevent="goTo('#sobre-nosotros')">{{ $t('nav.about') }}</a>
        <div class="nav__dropdown" @mouseenter="dropdown = true" @mouseleave="dropdown = false">
          <button class="nav__link nav__dropdown-trigger" @click="dropdown = !dropdown" :aria-expanded="dropdown">
            {{ $t('nav.services') }}
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>
          <transition name="drop">
            <div v-if="dropdown" class="nav__dropdown-menu">
              <a href="#inspecciones" @click.prevent="goTo('#inspecciones')">{{ $t('services.inspecciones') }}</a>
              <a href="#juridica" @click.prevent="goTo('#juridica')">{{ $t('services.juridica') }}</a>
              <a href="#tecnica" @click.prevent="goTo('#tecnica')">{{ $t('services.tecnica') }}</a>
              <a href="#economica" @click.prevent="goTo('#economica')">{{ $t('services.economica') }}</a>
              <a href="#energetica" @click.prevent="goTo('#energetica')">{{ $t('services.energetica') }}</a>
            </div>
          </transition>
        </div>
        <a href="#subvenciones" class="nav__link" @click.prevent="goTo('#subvenciones')">{{ $t('nav.subvenciones') }}</a>
        <a href="#contrataciones" class="nav__link" @click.prevent="goTo('#contrataciones')">{{ $t('nav.contrataciones') }}</a>
      </nav>

      <div class="nav__right">
        <div class="lang">
          <button v-for="l in ['es','en']" :key="l" :class="{ active: locale === l }" @click="changeLocale(l)" :aria-label="`Idioma ${l}`">{{ l }}</button>
        </div>
        <a href="#contacto" class="btn btn--primary nav__cta" @click.prevent="goTo('#contacto')">{{ $t('nav.contacto') }}<span class="btn__arrow">→</span></a>
        <button class="nav__burger" :class="{ 'is-open': open }" :aria-label="$t('nav.menu')" :aria-expanded="open" @click="open = !open">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/i18n'
import { scrollTo } from '@/composables/useLenis'
import logoOscuro from '@/assets/images/REGLADO_Oscuro_Symbol.png'
import logoBlanco from '@/assets/images/REGLADO_Blanco_Symbol.png'

const scrolled = ref(false)
const open = ref(false)
const dropdown = ref(false)
const { locale } = useI18n()
const router = useRouter()
const route = useRoute()

function onScroll() { scrolled.value = window.scrollY > 24 }
function close() { open.value = false; dropdown.value = false }
function changeLocale(l) { setLocale(l) }

async function goTo(hash) {
  close()
  // Si no estamos en home, navegar primero
  if (route.path !== '/') {
    await router.push({ path: '/', hash })
    return
  }
  if (hash === '#top') {
    scrollTo(0)
  } else {
    const el = document.querySelector(hash)
    if (el) scrollTo(el, { offset: -70 })
  }
  // actualizar url sin saltar (hash sin reload)
  history.replaceState(null, '', hash === '#top' ? '/' : hash)
}

onMounted(() => { window.addEventListener('scroll', onScroll, { passive: true }); onScroll() })
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  height: var(--nav-height);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: saturate(180%) blur(14px);
  -webkit-backdrop-filter: saturate(180%) blur(14px);
  border-bottom: 1px solid transparent;
  transition: background 350ms var(--ease-out), border-color 350ms var(--ease-out), height 350ms var(--ease-out);
}
.nav.is-scrolled {
  background: rgba(255, 255, 255, 0.92);
  border-bottom-color: var(--color-border);
  height: 68px;
}
.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  gap: 2rem;
}
.nav__logo { display: flex; align-items: center; height: 100%; }
.nav__logo-img { height: 38px; width: auto; transition: opacity var(--t-base) var(--ease-out); }
.nav__logo-img--light { display: none; }
.nav__menu {
  display: flex; align-items: center; gap: 2rem;
}
.nav__link {
  position: relative;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-navy);
  padding: 0.4rem 0;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: color var(--t-fast);
  background: none; border: 0; cursor: pointer;
  font-family: inherit;
}
.nav__link::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0;
  width: 100%; height: 1px;
  background: var(--color-gold);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 350ms var(--ease-out);
}
.nav__link:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
.nav__dropdown { position: relative; }
.nav__dropdown-menu {
  position: absolute;
  top: calc(100% + 18px);
  left: -1rem;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  min-width: 280px;
  padding: 0.7rem;
}
.nav__dropdown-menu a {
  display: block;
  padding: 0.7rem 1rem;
  font-size: 0.9rem;
  color: var(--color-navy);
  border-radius: 6px;
  transition: background var(--t-fast), color var(--t-fast);
}
.nav__dropdown-menu a:hover { background: var(--color-bg-light); color: var(--color-gold-text); }
.drop-enter-active, .drop-leave-active { transition: opacity 200ms, transform 200ms var(--ease-out); }
.drop-enter-from, .drop-leave-to { opacity: 0; transform: translateY(-6px); }

.nav__right { display: flex; align-items: center; gap: 1rem; }
.lang { display: flex; gap: 0.2rem; }
.lang button {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.3rem 0.5rem;
  color: var(--color-text-muted);
  background: none; border: 0; cursor: pointer;
  transition: color var(--t-fast);
}
.lang button.active { color: var(--color-navy); font-weight: 600; }
.lang button:hover { color: var(--color-gold-text); }
.nav__cta { padding: 0.7rem 1.2rem; font-size: 0.85rem; }

.nav__burger {
  display: none;
  width: 36px; height: 36px;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  background: none; border: 0; cursor: pointer;
  padding: 0;
}
.nav__burger span {
  display: block;
  width: 22px; height: 2px;
  background: var(--color-navy);
  transition: transform 300ms var(--ease-out), opacity 300ms;
  margin: 0 auto;
}
.nav__burger.is-open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav__burger.is-open span:nth-child(2) { opacity: 0; }
.nav__burger.is-open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@media (max-width: 980px) {
  .nav__menu {
    position: fixed;
    inset: var(--nav-height) 0 auto 0;
    background: var(--color-white);
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 2rem 1.5rem;
    border-bottom: 1px solid var(--color-border);
    transform: translateY(-12px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 250ms, transform 250ms var(--ease-out);
  }
  .nav__menu.is-open { transform: none; opacity: 1; pointer-events: auto; }
  .nav__dropdown-menu { position: static; box-shadow: none; border: 0; padding: 0.4rem 0 0; min-width: 0; }
  .nav__cta { display: none; }
  .nav__burger { display: flex; }
}
</style>
