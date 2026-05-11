<!--
  PrivacidadView.vue
  Vista legal con la politica de privacidad y tratamiento de datos del sitio.
-->
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
        <!--
          Renderizado de bloques con elementos nativos (sin v-html).
          Más seguro: imposible inyectar HTML aunque el contenido llegara
          algún día desde una fuente externa.
        -->
        <template v-for="(section, i) in data.sections" :key="i">
          <h2>{{ section.title }}</h2>
          <template v-for="(block, j) in section.blocks" :key="j">
            <p v-if="block.type === 'p'">{{ block.content }}</p>
            <ul v-else-if="block.type === 'ul'">
              <li v-for="(item, k) in block.items" :key="k">{{ item }}</li>
            </ul>
          </template>
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
        blocks: [
          { type: 'p', content: 'El responsable del tratamiento de los datos personales es Reglado Consultores, con CIF B09662081 y domicilio en Avda. Isla Graciosa, 7 piso 1º despachos 5-6, 28703 San Sebastián de los Reyes (Madrid).' },
          { type: 'p', content: 'Contacto: info@regladoconsultores.com' }
        ]
      },
      {
        title: '2. ¿Con qué finalidad tratamos sus datos personales?',
        blocks: [
          { type: 'p', content: 'En Reglado Consultores tratamos la información que nos facilitan las personas interesadas con las siguientes finalidades:' },
          { type: 'ul', items: [
            'Gestionar el registro de usuarios y el acceso a los servicios del portal empresarial.',
            'Tramitar el envío de la información que nos soliciten a través de los diversos formularios de contacto.',
            'Prestar los servicios contratados por el usuario (energía, inmobiliaria, consultoría).',
            'Remitir comunicaciones comerciales sobre nuestros servicios cuando el usuario lo haya autorizado.'
          ]}
        ]
      },
      {
        title: '3. ¿Por cuánto tiempo conservaremos sus datos?',
        blocks: [
          { type: 'p', content: 'Los datos personales proporcionados se conservarán mientras se mantenga la relación comercial o durante los años necesarios para cumplir con las obligaciones legales.' }
        ]
      },
      {
        title: '4. ¿Cuál es la legitimación para el tratamiento de sus datos?',
        blocks: [
          { type: 'p', content: 'La base legal para el tratamiento de sus datos es el consentimiento del interesado al registrarse en el portal o al enviar una consulta a través de nuestros formularios.' }
        ]
      },
      {
        title: '5. ¿A qué destinatarios se comunicarán sus datos?',
        blocks: [
          { type: 'p', content: 'Los datos no se cederán a terceros salvo en los casos en que exista una obligación legal o sea necesario para la prestación del servicio solicitado (ej. comunicación a empresas del grupo para servicios específicos de energía o inmuebles).' }
        ]
      },
      {
        title: '6. ¿Cuáles son sus derechos al facilitarnos sus datos?',
        blocks: [
          { type: 'p', content: 'Cualquier persona tiene derecho a obtener confirmación sobre si en Reglado Consultores estamos tratando datos personales que les conciernan, o no. Las personas interesadas tienen derecho a:' },
          { type: 'ul', items: [
            'Acceder a sus datos personales.',
            'Solicitar la rectificación de los datos inexactos.',
            'Solicitar su supresión cuando, entre otros motivos, los datos ya no sean necesarios para los fines que fueron recogidos.',
            'Solicitar la limitación de su tratamiento.',
            'Oponerse al tratamiento de sus datos.',
            'Derecho a la portabilidad de los datos.'
          ]},
          { type: 'p', content: 'Para ejercer estos derechos, puede dirigirse a info@regladoconsultores.com adjuntando copia de su DNI.' }
        ]
      },
      {
        title: '7. Procedencia de los datos',
        blocks: [
          { type: 'p', content: 'Los datos personales que tratamos en Reglado Consultores han sido facilitados directamente por el interesado a través de los formularios de registro y contacto del sitio web.' }
        ]
      }
    ]
  },
  en: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    sections: [
      {
        title: '1. Who is responsible for processing your data?',
        blocks: [
          { type: 'p', content: 'The data controller is Reglado Consultores, with Tax ID B09662081 and registered address at Avda. Isla Graciosa, 7 floor 1st offices 5-6, 28703 San Sebastián de los Reyes (Madrid, Spain).' },
          { type: 'p', content: 'Contact: info@regladoconsultores.com' }
        ]
      },
      {
        title: '2. For what purpose do we process your personal data?',
        blocks: [
          { type: 'p', content: 'At Reglado Consultores we process the information provided by interested parties for the following purposes:' },
          { type: 'ul', items: [
            'Managing user registration and access to the business portal services.',
            'Handling the information requested through the various contact forms.',
            'Providing the services contracted by the user (energy, real estate, consulting).',
            'Sending commercial communications about our services when the user has authorised it.'
          ]}
        ]
      },
      {
        title: '3. How long will we keep your data?',
        blocks: [
          { type: 'p', content: 'The personal data provided will be kept for as long as the commercial relationship continues, or for the years required to comply with legal obligations.' }
        ]
      },
      {
        title: '4. What is the legal basis for processing your data?',
        blocks: [
          { type: 'p', content: 'The legal basis for processing your data is the consent given by the data subject when registering on the portal or submitting an enquiry through our forms.' }
        ]
      },
      {
        title: '5. To whom will your data be disclosed?',
        blocks: [
          { type: 'p', content: 'Data will not be transferred to third parties except where there is a legal obligation or it is necessary to provide the requested service (e.g. communication to group companies for specific energy or real estate services).' }
        ]
      },
      {
        title: '6. What are your rights when you provide us with your data?',
        blocks: [
          { type: 'p', content: 'Anyone has the right to obtain confirmation as to whether or not Reglado Consultores is processing personal data concerning them. Interested parties have the right to:' },
          { type: 'ul', items: [
            'Access their personal data.',
            'Request the correction of inaccurate data.',
            'Request its deletion when, among other reasons, the data is no longer necessary for the purposes for which it was collected.',
            'Request the restriction of its processing.',
            'Object to the processing of their data.',
            'Right to data portability.'
          ]},
          { type: 'p', content: 'To exercise these rights, you may contact info@regladoconsultores.com attaching a copy of your ID.' }
        ]
      },
      {
        title: '7. Origin of the data',
        blocks: [
          { type: 'p', content: 'The personal data we process at Reglado Consultores has been provided directly by the data subject through the registration and contact forms on our website.' }
        ]
      }
    ]
  }
}

const data = computed(() => content[locale.value] ?? content.es)
</script>

<style scoped>
.page-hero { padding: calc(var(--nav-height) + clamp(3rem, 8vw, 6rem)) 0 clamp(3rem, 6vw, 5rem); }
.page-hero > .container > * + * { margin-top: 1rem; }
.legal__body h2 { margin: 2.5rem 0 1rem; font-size: var(--fs-xl); }
.legal__body p { line-height: 1.85; margin-bottom: 1rem; color: var(--color-text); }
.legal__body ul { margin: 0 0 1rem 0; padding-left: 1.5rem; list-style: disc; }
.legal__body li { line-height: 1.85; margin-bottom: 0.4rem; color: var(--color-text); }
</style>
