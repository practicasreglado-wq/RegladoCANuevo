<template>
  <section id="subvenciones" class="section section--dark programas">
    <div class="programas__particles" ref="particlesEl" aria-hidden="true"></div>
    <div class="container">
      <header class="programas__header">
        <p class="eyebrow" v-reveal>{{ $t('programas.eyebrow') }}</p>
        <SplitHeading :text="$t('programas.title')" tag="h2" />
        <p class="programas__lead" v-reveal="{ delay: 1 }">{{ $t('programas.lead') }}</p>
      </header>

      <div class="programas__grid">
        <div v-for="(p, i) in $tm('programas.items')" :key="i" class="programas__card reveal--card" v-reveal="{ delay: (i % 3) + 1 }">
          <span class="programas__num">0{{ i + 1 }}</span>
          <h3>{{ p.title }}</h3>
          <p>{{ p.text }}</p>
        </div>
      </div>
    </div>
  </section>

  <section id="contrataciones" class="section contrataciones">
    <div class="container contrataciones__inner">
      <div class="contrataciones__copy">
        <p class="eyebrow" v-reveal>{{ $t('contratacion.eyebrow') }}</p>
        <SplitHeading :text="$t('contratacion.title')" tag="h2" />
        <p class="contrataciones__lead" v-reveal="{ delay: 1 }">{{ $t('contratacion.lead') }}</p>
        <ul class="contrataciones__list">
          <li v-for="(s, i) in $tm('contratacion.items')" :key="i" v-reveal="{ delay: (i % 4) + 1 }">{{ s }}</li>
        </ul>
      </div>
      <div class="contrataciones__cite" v-reveal="{ delay: 2 }">
        <span class="contrataciones__quote">“</span>
        <p>{{ $t('contratacion.cite') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SplitHeading from '@/components/ui/SplitHeading.vue'

const particlesEl = ref(null)

onMounted(() => {
  for (let i = 0; i < 14; i++) {
    const p    = document.createElement('span')
    p.className = 'banner-particle'
    const size  = (Math.random() * 4 + 2).toFixed(1)
    p.style.cssText = [
      `width:${size}px`,
      `height:${size}px`,
      `left:${(Math.random() * 100).toFixed(1)}%`,
      `--dur:${(Math.random() * 7 + 6).toFixed(1)}s`,
      `--delay:${(Math.random() * 10).toFixed(1)}s`,
      `--drift:${((Math.random() - 0.5) * 70).toFixed(0)}px`,
      `--op:${(Math.random() * 0.35 + 0.12).toFixed(2)}`,
    ].join(';')
    particlesEl.value?.appendChild(p)
  }
})
</script>

<style scoped>
.programas {
  scroll-margin-top: var(--nav-height);
  padding: clamp(5rem, 10vw, 8rem) 0;
  position: relative;
  overflow: hidden;
}
.programas__particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.programas__header { max-width: 720px; margin-bottom: 4rem; position: relative; z-index: 1; }
.programas__header > * + * { margin-top: 1rem; }
.programas__lead { color: rgba(255,255,255,0.78); font-size: var(--fs-lg); line-height: 1.7; }
.programas__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 1;
}
.programas__card {
  background: var(--color-navy);
  padding: 2rem;
  transition: background var(--t-base);
  position: relative;
}
.programas__card:hover { background: var(--color-navy-soft); }
.programas__num {
  font-family: var(--font-display);
  color: var(--color-gold);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
}
.programas__card h3 { color: var(--color-white); margin: 0.7rem 0 0.5rem; font-size: var(--fs-xl); }
.programas__card p { color: rgba(255,255,255,0.7); font-size: var(--fs-sm); line-height: 1.6; }

.contrataciones { scroll-margin-top: var(--nav-height); background: var(--color-bg-cream); }
.contrataciones__inner {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: start;
}
.contrataciones__copy > * + * { margin-top: 1.2rem; }
.contrataciones__lead { font-size: var(--fs-lg); color: var(--color-text-muted); line-height: 1.7; }
.contrataciones__list { margin-top: 2rem; }
.contrataciones__list li {
  padding: 0.9rem 0 0.9rem 1.6rem;
  border-bottom: 1px solid var(--color-border);
  font-size: var(--fs-base);
  position: relative;
}
.contrataciones__list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) scale(1);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-gold);
  transition: transform 250ms var(--ease-out);
}
.contrataciones__list li:hover::before {
  transform: translateY(-50%) scale(1.7);
}
.contrataciones__cite {
  position: sticky;
  top: 110px;
  background: var(--color-navy);
  color: rgba(255,255,255,0.92);
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  border-top: 3px solid var(--color-gold);
}
.contrataciones__quote {
  font-family: var(--font-display);
  color: var(--color-gold);
  font-size: 5rem;
  line-height: 0.5;
  display: block;
  margin-bottom: 1rem;
}
.contrataciones__cite p { font-family: var(--font-display); font-size: var(--fs-lg); line-height: 1.5; }

@media (max-width: 900px) {
  .programas__grid { grid-template-columns: repeat(2, 1fr); }
  .contrataciones__inner { grid-template-columns: 1fr; }
  .contrataciones__cite { position: static; }
}
@media (max-width: 560px) {
  .programas__grid { grid-template-columns: 1fr; }
}
</style>
