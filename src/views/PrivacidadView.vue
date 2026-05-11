<template>
  <article class="legal">
    <section class="page-hero section--dark">
      <div class="container">
        <p class="eyebrow">{{ data.eyebrow }}</p>
        <SplitHeading :text="data.title" tag="h1" />
      </div>
    </section>
    <section class="section">
      <div class="container-narrow legal__body">
        <template v-for="(section, i) in data.sections" :key="i">
          <h2>{{ section.title }}</h2>
          <div v-html="section.body"></div>
        </template>
      </div>
    </section>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SplitHeading from '@/components/ui/SplitHeading.vue'

const { locale } = useI18n({ useScope: 'global' })

const content = {
  es: {
    eyebrow: 'Legal',
    title: 'Política de privacidad',
    sections: [
      {
        title: '1. ¿Quién es el responsable del tratamiento de sus datos?',
        body: `<p>El responsable del tratamiento de los datos personales es <strong>Reglado Consultores</strong>, con CIF B09662081 y domicilio en Avda. Isla Graciosa, 7 piso 1º despachos 5-6, 28703 San Sebastián de los Reyes (Madrid).</p>
               <p>Contacto: info@regladoconsultores.com</p>`
      },
      {
        title: '2. ¿Con qué finalidad tratamos sus datos personales?',
        body: `<p>En Reglado Consultores tratamos la información que nos facilitan las personas interesadas con las siguientes finalidades:</p>
               <ul>
                 <li>Gestionar el registro de usuarios y el acceso a los servicios del portal empresarial.</li>
                 <li>Tramitar el envío de la información que nos soliciten a través de los diversos formularios de contacto.</li>
                 <li>Prestar los servicios contratados por el usuario (energía, inmobiliaria, consultoría).</li>
                 <li>Remitir comunicaciones comerciales sobre nuestros servicios cuando el usuario lo haya autorizado.</li>
               </ul>`
      },
      {
        title: '3. ¿Por cuánto tiempo conservaremos sus datos?',
        body: `<p>Los datos personales proporcionados se conservarán mientras se mantenga la relación comercial o durante los años necesarios para cumplir con las obligaciones legales.</p>`
      },
      {
        title: '4. ¿Cuál es la legitimación para el tratamiento de sus datos?',
        body: `<p>La base legal para el tratamiento de sus datos es el consentimiento del interesado al registrarse en el portal o al enviar una consulta a través de nuestros formularios.</p>`
      },
      {
        title: '5. ¿A qué destinatarios se comunicarán sus datos?',
        body: `<p>Los datos no se cederán a terceros salvo en los casos en que exista una obligación legal o sea necesario para la prestación del servicio solicitado (ej. comunicación a empresas del grupo para servicios específicos de energía o inmuebles).</p>`
      },
      {
        title: '6. ¿Cuáles son sus derechos al facilitarnos sus datos?',
        body: `<p>Cualquier persona tiene derecho a obtener confirmación sobre si en Reglado Consultores estamos tratando datos personales que les conciernan, o no. Las personas interesadas tienen derecho a:</p>
               <ul>
                 <li>Acceder a sus datos personales.</li>
                 <li>Solicitar la rectificación de los datos inexactos.</li>
                 <li>Solicitar su supresión cuando, entre otros motivos, los datos ya no sean necesarios para los fines que fueron recogidos.</li>
                 <li>Solicitar la limitación de su tratamiento.</li>
                 <li>Oponerse al tratamiento de sus datos.</li>
                 <li>Derecho a la portabilidad de los datos.</li>
               </ul>
               <p>Para ejercer estos derechos, puede dirigirse a info@regladoconsultores.com adjuntando copia de su DNI.</p>`
      },
      {
        title: '7. Procedencia de los datos',
        body: `<p>Los datos personales que tratamos en Reglado Consultores han sido facilitados directamente por el interesado a través de los formularios de registro y contacto del sitio web.</p>`
      }
    ]
  },
  en: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    sections: [
      {
        title: '1. Who is responsible for processing your data?',
        body: `<p>The data controller is <strong>Reglado Consultores</strong>, with Tax ID B09662081 and registered address at Avda. Isla Graciosa, 7 floor 1st offices 5-6, 28703 San Sebastián de los Reyes (Madrid, Spain).</p>
               <p>Contact: info@regladoconsultores.com</p>`
      },
      {
        title: '2. For what purpose do we process your personal data?',
        body: `<p>At Reglado Consultores we process the information provided by interested parties for the following purposes:</p>
               <ul>
                 <li>Managing user registration and access to the business portal services.</li>
                 <li>Handling the information requested through the various contact forms.</li>
                 <li>Providing the services contracted by the user (energy, real estate, consulting).</li>
                 <li>Sending commercial communications about our services when the user has authorised it.</li>
               </ul>`
      },
      {
        title: '3. How long will we keep your data?',
        body: `<p>The personal data provided will be kept for as long as the commercial relationship continues, or for the years required to comply with legal obligations.</p>`
      },
      {
        title: '4. What is the legal basis for processing your data?',
        body: `<p>The legal basis for processing your data is the consent given by the data subject when registering on the portal or submitting an enquiry through our forms.</p>`
      },
      {
        title: '5. To whom will your data be disclosed?',
        body: `<p>Data will not be transferred to third parties except where there is a legal obligation or it is necessary to provide the requested service (e.g. communication to group companies for specific energy or real estate services).</p>`
      },
      {
        title: '6. What are your rights when you provide us with your data?',
        body: `<p>Anyone has the right to obtain confirmation as to whether or not Reglado Consultores is processing personal data concerning them. Interested parties have the right to:</p>
               <ul>
                 <li>Access their personal data.</li>
                 <li>Request the correction of inaccurate data.</li>
                 <li>Request its deletion when, among other reasons, the data is no longer necessary for the purposes for which it was collected.</li>
                 <li>Request the restriction of its processing.</li>
                 <li>Object to the processing of their data.</li>
                 <li>Right to data portability.</li>
               </ul>
               <p>To exercise these rights, you may contact info@regladoconsultores.com attaching a copy of your ID.</p>`
      },
      {
        title: '7. Origin of the data',
        body: `<p>The personal data we process at Reglado Consultores has been provided directly by the data subject through the registration and contact forms on our website.</p>`
      }
    ]
  }
}

const data = computed(() => content[locale.value] ?? content.es)
</script>

<style scoped>
.page-hero { padding: calc(var(--nav-height) + clamp(3rem, 8vw, 6rem)) 0 clamp(3rem, 6vw, 5rem); }
.page-hero > .container > * + * { margin-top: 1rem; }
.legal__body :deep(h2) { margin: 2.5rem 0 1rem; font-size: var(--fs-xl); }
.legal__body :deep(p) { line-height: 1.85; margin-bottom: 1rem; color: var(--color-text); }
.legal__body :deep(ul) { margin: 0 0 1rem 0; padding-left: 1.5rem; list-style: disc; }
.legal__body :deep(li) { line-height: 1.85; margin-bottom: 0.4rem; color: var(--color-text); }
</style>
