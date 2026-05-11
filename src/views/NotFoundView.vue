<!--
  NotFoundView.vue
  Vista de fallback para rutas no reconocidas, con salida clara hacia la pagina principal.
-->
<template>
  <section class="notfound">
    <div class="container">
      <p class="notfound__code">404</p>
      <h1>{{ $t('notfound.title') }}</h1>
      <p class="notfound__text">{{ $t('notfound.text') }}</p>
      <router-link to="/" class="btn btn--primary">{{ $t('common.back_home') }} <span class="btn__arrow">→</span></router-link>
    </div>
  </section>
</template>

<style scoped>
.notfound {
  min-height: 80vh;
  display: grid;
  place-items: center;
  text-align: center;
  padding: calc(var(--nav-height) + 4rem) 0 6rem;
}
.notfound__code {
  font-family: var(--font-display);
  font-size: clamp(8rem, 25vw, 18rem);
  color: var(--color-gold);
  opacity: 0.3;
  line-height: 1;
  letter-spacing: -0.05em;
}
.notfound h1 { margin: 1rem 0; }
.notfound__text { color: var(--color-text-muted); margin-bottom: 2.5rem; }
</style>
