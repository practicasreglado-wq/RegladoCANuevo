<template>
  <article class="legal">
    <section class="page-hero section--dark">
      <div class="container">
        <p class="eyebrow">Legal</p>
        <SplitHeading text="Declaración de accesibilidad" tag="h1" />
      </div>
    </section>
    <section class="section">
      <div class="container-narrow legal__body">
        <p>Reglado Consultores se compromete a hacer accesible su sitio web de conformidad con el <strong>Real Decreto 1112/2018</strong>, de 7 de septiembre, sobre accesibilidad de los sitios web y aplicaciones para dispositivos móviles del sector público y de sus proveedores.</p>

        <h2>Estado de cumplimiento</h2>
        <p>Este sitio web es <strong>parcialmente conforme</strong> con la norma UNE-EN 301 549:2022 (WCAG 2.1 nivel AA). Se está realizando una auditoría externa para alcanzar la plena conformidad.</p>

        <h2>Contenido no accesible</h2>
        <ul>
          <li>Algunos componentes interactivos pueden no funcionar correctamente con tecnologías de asistencia muy específicas.</li>
          <li>Las animaciones decorativas se desactivan automáticamente si el usuario tiene activada la preferencia <code>prefers-reduced-motion</code>.</li>
        </ul>

        <h2>Mecanismo de comunicación</h2>
        <p>Si encuentra cualquier barrera de accesibilidad, puede comunicarlo escribiendo a <a href="mailto:info@regladoconsultores.com">info@regladoconsultores.com</a>. Le responderemos en un plazo máximo de 20 días hábiles.</p>

        <h2>Procedimiento de aplicación</h2>
        <p>Si tras esta comunicación no obtiene una respuesta satisfactoria, puede presentar reclamación ante la unidad responsable de accesibilidad de la Administración correspondiente.</p>
      </div>
    </section>
  </article>
</template>
<script setup>
import SplitHeading from '@/components/ui/SplitHeading.vue'
</script>
<style scoped>
.page-hero { padding: calc(var(--nav-height) + clamp(3rem, 8vw, 6rem)) 0 clamp(3rem, 6vw, 5rem); }
.page-hero > .container > * + * { margin-top: 1rem; }
.legal__body :deep(h2) { margin: 2.5rem 0 1rem; font-size: var(--fs-xl); }
.legal__body :deep(p) { line-height: 1.85; margin-bottom: 1rem; }
.legal__body :deep(ul) { padding-left: 1.5rem; margin-bottom: 1rem; }
.legal__body :deep(ul li) { margin-bottom: 0.5rem; line-height: 1.7; }
.legal__body :deep(code) { background: var(--color-bg-light); padding: 0.1em 0.4em; border-radius: 3px; font-size: 0.9em; }
.legal__body :deep(a) { color: var(--color-gold-text); text-decoration: underline; }
</style>
