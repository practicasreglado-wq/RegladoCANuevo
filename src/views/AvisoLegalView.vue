<template>
  <article class="legal">
    <section class="page-hero section--dark">
      <div class="container">
        <p class="eyebrow">Legal</p>
        <SplitHeading text="Aviso legal" tag="h1" />
      </div>
    </section>
    <section class="section">
      <div class="container-narrow legal__body">
        <h2>Titularidad del sitio</h2>
        <p><strong>Reglado Consultores</strong> · CIF B-00000000 · Domicilio social: Madrid · Email: info@regladoconsultores.com</p>

        <h2>Objeto</h2>
        <p>Este sitio web tiene por objeto informar sobre los servicios de consultoría que Reglado Consultores presta a ayuntamientos y organismos del sector público.</p>

        <h2>Propiedad intelectual</h2>
        <p>Todos los contenidos (textos, imágenes, marcas, diseños) están protegidos por la legislación española de propiedad intelectual e industrial. Su reproducción total o parcial requiere autorización expresa.</p>

        <h2>Responsabilidad</h2>
        <p>Reglado Consultores no se responsabiliza de los daños o perjuicios derivados del uso de la información contenida en este sitio. La información jurídica y técnica publicada tiene carácter divulgativo y no sustituye al asesoramiento profesional individualizado.</p>

        <h2>Legislación aplicable</h2>
        <p>El presente aviso legal se rige por la legislación española. Para cualquier controversia, las partes se someten a los Juzgados y Tribunales de Madrid capital.</p>
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
</style>
