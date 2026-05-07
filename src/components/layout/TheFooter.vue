<template>
  <footer class="footer">
    <div class="container footer__inner">
      <div class="footer__brand">
        <div class="footer__logo">
          <img :src="logoBlanco" alt="Reglado Consultores" class="footer__logo-img" />
        </div>
        <p class="footer__tagline">{{ $t('footer.tagline') }}</p>
      </div>

      <div>
        <h4 class="footer__title">{{ $t('nav.services') }}</h4>
        <ul>
          <li><a href="/#inspecciones">{{ $t('services.inspecciones') }}</a></li>
          <li><a href="/#juridica">{{ $t('services.juridica') }}</a></li>
          <li><a href="/#tecnica">{{ $t('services.tecnica') }}</a></li>
          <li><a href="/#economica">{{ $t('services.economica') }}</a></li>
          <li><a href="/#energetica">{{ $t('services.energetica') }}</a></li>
        </ul>
      </div>

      <div>
        <h4 class="footer__title">{{ $t('footer.company') }}</h4>
        <ul>
          <li><a href="/#sobre-nosotros">{{ $t('nav.about') }}</a></li>
          <li><a href="/#subvenciones">{{ $t('nav.subvenciones') }}</a></li>
          <li><a href="/#contrataciones">{{ $t('nav.contrataciones') }}</a></li>
          <li><a href="/#contacto">{{ $t('nav.contacto') }}</a></li>
        </ul>
      </div>

      <div>
        <h4 class="footer__title">{{ $t('footer.contact_us') }}</h4>
        <ul class="footer__contact">
          <li><a :href="`mailto:${$t('contact.info.email')}`">{{ $t('contact.info.email') }}</a></li>
          <li><a :href="`tel:${$t('contact.info.phone').replace(/\s/g,'')}`">{{ $t('contact.info.phone') }}</a></li>
          <li>{{ $t('contact.info.address') }}</li>
          <li>{{ $t('contact.info.hours') }}</li>
        </ul>
      </div>
    </div>

    <div class="footer__bottom container">
      <p>© {{ year }} {{ $t('brand') }}. {{ $t('footer.rights') }}</p>
      <ul class="footer__legal">
        <li><router-link to="/privacidad">{{ $t('footer.privacy') }}</router-link></li>
        <li><router-link to="/aviso-legal">{{ $t('footer.legal_notice') }}</router-link></li>
        <li><router-link to="/accesibilidad">{{ $t('footer.accessibility') }}</router-link></li>
      </ul>
    </div>
  </footer>
</template>

<script setup>
import logoBlanco from '@/assets/images/REGLADO_Blanco_slogan-e1643969373411.png'
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: var(--color-navy-deep);
  color: rgba(255, 255, 255, 0.78);
  padding: clamp(4rem, 8vw, 7rem) 0 2rem;
  border-top: 2px solid var(--color-gold);
  position: relative;
  z-index: 2;
}
.footer__inner {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
  gap: clamp(2rem, 5vw, 4rem);
  padding-bottom: 3rem;
}
.footer__brand { max-width: 320px; }
.footer__logo { display: flex; align-items: center; margin-bottom: 1rem; }
.footer__logo-img { height: 60px; width: auto; }
.footer__tagline { font-size: var(--fs-sm); line-height: 1.7; }
.footer__title {
  font-family: var(--font-sans);
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--color-gold);
  margin-bottom: 1.2rem;
}
.footer ul li { margin-bottom: 0.6rem; font-size: var(--fs-sm); }
.footer a { transition: color var(--t-fast); }
.footer a:hover { color: var(--color-gold); }
.footer__contact a { color: rgba(255,255,255,0.78); }

.footer__bottom {
  display: flex; flex-wrap: wrap; gap: 1rem;
  justify-content: space-between;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  font-size: var(--fs-xs);
  color: rgba(255,255,255,0.72);
}
.footer__legal { display: flex; gap: 1.5rem; }

@media (max-width: 768px) {
  .footer__inner { grid-template-columns: 1fr 1fr; }
  .footer__brand { grid-column: 1 / -1; }
}
@media (max-width: 480px) {
  .footer__inner { grid-template-columns: 1fr; }
  .footer__bottom { flex-direction: column; }
}
</style>
