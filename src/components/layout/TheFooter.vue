<template>
  <footer class="footer" aria-label="Pie de página">

    <!-- Partículas doradas flotantes (mismo efecto que la sección "Financiación europea") -->
    <div class="footer__particles" ref="particlesEl" aria-hidden="true"></div>

    <!-- ── Grid principal: 4 columnas ── -->
    <div class="container footer__inner">

      <!-- Col 1: Logo + info empresa -->
      <div class="footer__col footer__col--brand">
        <div class="footer__logo-wrap">
          <img :src="logoBlanco" alt="Reglado Consultores & Abogados" class="footer__logo-img" />
        </div>
        <p class="footer__tagline">{{ $t('footer.tagline') }}</p>
        <address class="footer__address">
          <p>CIF: B09662081</p>
          <p>Avda. Isla Graciosa, 7,<br>28703 San Sebastián de los Reyes</p>
        </address>
        <div class="footer__social">
          <a
            href="https://www.linkedin.com/company/reglado-consultores"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn de Reglado Consultores"
            class="footer__social-link"
          >
            <!-- LinkedIn icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Col 2: Navegación (elementos del menú principal) -->
      <div class="footer__col">
        <h4 class="footer__title">Navegación</h4>
        <ul class="footer__links">
          <li><a href="/">{{ $t('nav.home') }}</a></li>
          <li><a href="/#sobre-nosotros">{{ $t('nav.about') }}</a></li>
          <li><a href="/#servicios">{{ $t('nav.services') }}</a></li>
          <li><a href="/#subvenciones">{{ $t('nav.subvenciones') }}</a></li>
          <li><a href="/#contrataciones">{{ $t('nav.contrataciones') }}</a></li>
        </ul>
      </div>

      <!-- Col 3: Servicios (áreas de especialización) -->
      <div class="footer__col">
        <h4 class="footer__title">{{ $t('nav.services') }}</h4>
        <ul class="footer__links">
          <li><a href="/#inspecciones">{{ $t('services.inspecciones') }}</a></li>
          <li><a href="/#juridica">{{ $t('services.juridica') }}</a></li>
          <li><a href="/#tecnica">{{ $t('services.tecnica') }}</a></li>
          <li><a href="/#economica">{{ $t('services.economica') }}</a></li>
          <li><a href="/#energetica">{{ $t('services.energetica') }}</a></li>
        </ul>
      </div>

      <!-- Col 4: Contacto -->
      <div class="footer__col">
        <h4 class="footer__title">{{ $t('footer.contact_us') }}</h4>
        <ul class="footer__contact">
          <li>
            <span class="footer__contact-label">Teléfono:</span>
            <span class="footer__contact-text">{{ $t('contact.info.phone') }}</span>
          </li>
          <li>
            <span class="footer__contact-label">Email:</span>
            <span class="footer__contact-text">info@regladoconsultores.com</span>
          </li>
        </ul>
      </div>

    </div>

    <!-- ── Barra inferior: copyright + enlaces legales ── -->
    <div class="footer__bottom container">
      <p>© {{ year }} {{ $t('brand') }}. {{ $t('footer.rights') }}</p>
      <ul class="footer__legal">
        <li><router-link to="/aviso-legal">{{ $t('footer.legal_notice') }}</router-link></li>
        <li><router-link to="/privacidad">{{ $t('footer.privacy') }}</router-link></li>
        <li><router-link to="/cookies">{{ $t('footer.cookies') }}</router-link></li>
      </ul>
    </div>

  </footer>
</template>

<script setup>
import { ref } from 'vue'
import logoBlanco from '@/assets/images/REGLADO_Blanco_slogan-e1643969373411.png'
import { useGoldParticles } from '@/composables/useGoldParticles'

const year = new Date().getFullYear()
const particlesEl = ref(null)

// Partículas doradas flotantes en el footer
useGoldParticles(particlesEl)
</script>

<style scoped>
/* ── Base ──────────────────────────────────────────────────── */
.footer {
  background: var(--color-navy);
  color: rgba(255, 255, 255, 0.78);
  font-family: Georgia, 'Times New Roman', serif;
  padding: clamp(3rem, 6vw, 5.5rem) 0 2rem;
  border-top: 2px solid var(--color-gold);
  position: relative;
  overflow: hidden;
  z-index: 2;
}

/* Capa de partículas detrás del contenido */
.footer__particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

/* ── Grid 4 columnas ───────────────────────────────────────── */
.footer__inner {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1.2fr 1fr;
  gap: clamp(2rem, 4vw, 3.5rem);
  padding-bottom: 3rem;
  position: relative;
  z-index: 1;
}

/* ── Col 1: marca ──────────────────────────────────────────── */
.footer__col--brand {
  max-width: 280px;
  transform: translateY(-2.25rem);
}

/* Logo directamente sobre el fondo azul, sin recuadro */
.footer__logo-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.48rem 0;
  margin-bottom: 1.6rem;
  position: relative;
}
.footer__logo-img {
  height: 64px;
  width: auto;
  display: block;
  opacity: 0;
}
.footer__logo-wrap::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 64px;
  background: var(--color-gold);
  -webkit-mask: url('@/assets/images/REGLADO_Blanco_slogan-e1643969373411.png') center / contain no-repeat;
  mask: url('@/assets/images/REGLADO_Blanco_slogan-e1643969373411.png') center / contain no-repeat;
}

.footer__tagline {
  font-size: 0.88rem;
  line-height: 1.75;
  margin-bottom: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.footer__address {
  font-style: normal;
  font-size: 0.86rem;
  color: rgba(255, 255, 255, 0.62);
  line-height: 1.75;
  margin-bottom: 1.2rem;
}
.footer__address p { margin: 0; }

/* Icono LinkedIn */
.footer__social { display: flex; gap: 0.8rem; }
.footer__social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  color: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.04);
  transition:
    color var(--t-fast),
    border-color var(--t-fast),
    background var(--t-fast),
    transform var(--t-fast);
}
.footer__social-link:hover {
  color: var(--color-white);
  border-color: rgba(255, 255, 255, 0.55);
  background: rgba(255, 255, 255, 0.13);
  transform: translateY(-2px);
}

/* ── Títulos: borde blanco redondeado, fondo blanco transparente, texto dorado ── */
.footer__title {
  display: inline-block;
  font-family: var(--font-sans);
  font-size: 0.92rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-gold);
  border: 1.5px solid rgba(255, 255, 255, 0.65);
  background: rgba(255, 255, 255, 0.07);
  border-radius: 5px;
  padding: 0.45rem 1.1rem;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

/* ── Listas de navegación y servicios ──────────────────────── */
.footer__links {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer__links li { margin-bottom: 0.42rem; }
.footer__links a {
  font-size: 0.88rem;
  font-weight: 400;
  line-height: 1.25;
  color: rgba(255, 255, 255, 0.82);
  text-decoration: none;
  transition: color var(--t-fast);
}
.footer__links a:hover { color: var(--color-gold); }

/* ── Lista de contacto ─────────────────────────────────────── */
.footer__contact {
  list-style: none;
  padding: 0;
  margin: 0;
}
.footer__contact li {
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
  margin-bottom: 0.78rem;
}
.footer__contact-label {
  font-family: var(--font-sans);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0;
  color: var(--color-white);
}
.footer__contact a {
  font-size: 0.88rem;
  line-height: 1.25;
  color: rgba(255, 255, 255, 0.82);
  text-decoration: none;
  transition: color var(--t-fast);
}
.footer__contact a:hover { color: var(--color-gold); }
.footer__contact-text {
  font-size: 0.88rem;
  line-height: 1.25;
  color: rgba(255, 255, 255, 0.82);
}

/* ── Barra inferior ────────────────────────────────────────── */
.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.8rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.86rem;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.5);
  position: relative;
  z-index: 1;
}

.footer__legal {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 0;
}
/* Separador · entre items legales */
.footer__legal li + li::before {
  content: '·';
  margin: 0 0.65rem;
  color: rgba(255, 255, 255, 0.3);
}
.footer__legal a {
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: color var(--t-fast);
}
.footer__legal a:hover { color: var(--color-gold); }

/* ── Responsive ────────────────────────────────────────────── */
@media (max-width: 960px) {
  .footer__inner {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
  }
  /* La columna de marca ocupa todo el ancho en tablet */
  .footer__col--brand {
    grid-column: 1 / -1;
    max-width: 100%;
  }
}

@media (max-width: 520px) {
  .footer__inner { grid-template-columns: 1fr; }
  .footer__col--brand { grid-column: auto; }
  .footer__bottom { flex-direction: column; align-items: flex-start; }
}
</style>
