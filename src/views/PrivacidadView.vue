<template>
  <article class="legal">
    <section class="page-hero section--dark">
      <div class="container">
        <p class="eyebrow">Legal</p>
        <SplitHeading text="Política de privacidad" tag="h1" />
      </div>
    </section>
    <section class="section">
      <div class="container-narrow legal__body">
        <p><strong>Responsable del tratamiento:</strong> Reglado Consultores · CIF B-00000000 · Madrid · info@regladoconsultores.com</p>

        <h2>1. Datos que recopilamos</h2>
        <p>A través del formulario de contacto recogemos: nombre y apellidos, cargo, ayuntamiento u organismo, email, teléfono, servicio de interés y mensaje. No recogemos datos especialmente protegidos.</p>

        <h2>2. Finalidad y base legal</h2>
        <p>Tratamos sus datos exclusivamente para responder a su consulta. La base jurídica es su consentimiento expreso, otorgado al marcar la casilla del formulario, en aplicación del art. 6.1.a del RGPD.</p>

        <h2>3. Plazo de conservación</h2>
        <p>Conservamos los datos durante el tiempo estrictamente necesario para gestionar la consulta y, posteriormente, durante un máximo de 24 meses para atender posibles reclamaciones, salvo que solicite su supresión antes.</p>

        <h2>4. Destinatarios</h2>
        <p>No cedemos datos a terceros, salvo obligación legal. Usamos proveedores tecnológicos (hosting y email) que cumplen el RGPD y firman acuerdos de encargado de tratamiento.</p>

        <h2>5. Sus derechos</h2>
        <p>Acceso, rectificación, supresión, oposición, limitación y portabilidad. Puede ejercerlos escribiendo a info@regladoconsultores.com con copia de su documento identificativo. También puede reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).</p>

        <h2>6. Seguridad</h2>
        <p>Aplicamos medidas técnicas y organizativas adecuadas (cifrado en tránsito TLS, control de acceso, copias de seguridad cifradas) para proteger sus datos frente a accesos no autorizados, pérdida o destrucción.</p>

        <h2>7. Cookies</h2>
        <p>Solo utilizamos cookies técnicas estrictamente necesarias para el funcionamiento del sitio. No usamos cookies de seguimiento publicitario ni de terceros.</p>
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
.legal__body :deep(p) { line-height: 1.85; margin-bottom: 1rem; color: var(--color-text); }
</style>
