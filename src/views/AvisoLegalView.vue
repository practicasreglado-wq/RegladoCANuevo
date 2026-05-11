<!--
  AvisoLegalView.vue
  Vista legal con informacion de titularidad, responsabilidad y marco normativo del sitio.
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
    title: 'Aviso legal',
    sections: [
      {
        title: '1. Titularidad del portal',
        blocks: [
          { type: 'p', content: 'Reglado Consultores, es la titular y responsable de este sitio web, poniendo a disposición de los usuarios el presente documento, con el que pretende dar cumplimiento a las obligaciones dispuestas en la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSICE), así como informar a todos los usuarios del sitio web respecto a cuáles son las condiciones de uso.' },
          { type: 'p', content: 'Reglado Consultores se reserva el derecho de modificar cualquier tipo de información que pudiera aparecer en el sitio web, sin que exista obligación de preavisar o poner en conocimiento de los usuarios dichas obligaciones.' }
        ]
      },
      {
        title: '2. Datos identificativos',
        blocks: [
          { type: 'ul', items: [
            'Denominación social: Reglado Consultores',
            'Nombre comercial: Reglado Consultores',
            'CIF: B09662081',
            'Domicilio: Avda. Isla Graciosa, 7 piso 1º despachos 5-6, 28703 San Sebastián de los Reyes.',
            'Teléfono: +34 911462674 / 615-641-081',
            'Dirección electrónica: info@regladoconsultores.com'
          ]}
        ]
      },
      {
        title: '3. Objeto',
        blocks: [
          { type: 'p', content: 'El presente Aviso Legal recoge las condiciones de uso que regulan el acceso, navegación y uso del Portal, así como las responsabilidades derivadas de la utilización, prestación y/o contratación de los productos o servicios que, en su caso, puedan ser ofrecidos, así como de los contenidos que lo integran.' }
        ]
      },
      {
        title: '4. Aceptación',
        blocks: [
          { type: 'p', content: 'El acceso y utilización de este portal de Internet como usuario implica la aceptación de las disposiciones contenidas en este Aviso legal, el cual puede cambiar en cualquier momento.' }
        ]
      },
      {
        title: '5. Acceso y uso del portal',
        blocks: [
          { type: 'p', content: 'El acceso al Portal por parte de los Usuarios tiene carácter libre y gratuito. En todo caso, el acceso, navegación y uso del Portal se hace bajo la única y exclusiva responsabilidad del Usuario.' }
        ]
      },
      {
        title: '6. Condiciones de uso',
        blocks: [
          { type: 'p', content: 'El portal y sus servicios son, en general, de libre acceso. El Usuario se compromete a utilizar este sitio web sin incurrir en actividades que puedan ser consideradas ilícitas o ilegales, que infrinjan los derechos de terceros o que puedan atentar contra las presentes Condiciones de uso, la legislación vigente y los usos generalmente aceptados.' }
        ]
      },
      {
        title: '7. Privacidad y tratamiento de datos',
        blocks: [
          { type: 'p', content: 'Cuando para el acceso a determinados contenidos o servicio sea necesario facilitar datos de carácter personal, los Usuarios garantizarán su veracidad, exactitud, autenticidad y vigencia. La empresa dará a dichos datos el tratamiento automatizado que corresponda en función de su naturaleza o finalidad (cumplimiento del RGPD, LOPDGDD y LSSI).' }
        ]
      },
      {
        title: '8. Responsabilidades y limitaciones',
        blocks: [
          { type: 'p', content: 'La Empresa no puede garantizar la fiabilidad, utilidad o veracidad de la información que se preste a través del Portal, y no garantiza ni se hace responsable de daños por virus, falta de disponibilidad, invulnerabilidad del Portal, u otros daños causados por el uso del mismo.' }
        ]
      },
      {
        title: '9. Derechos de propiedad intelectual e industrial',
        blocks: [
          { type: 'p', content: 'Todos aquellos activos intangibles puestos a disposición del público por la presente página web están protegidos. Quedan reservados todos los derechos de propiedad intelectual e industrial sobre los Contenidos y, en particular, queda prohibido modificar, copiar, reproducir, comunicar públicamente, transformar o distribuir de cualquier forma la totalidad o parte de los contenidos incluidos en el Portal.' }
        ]
      },
      {
        title: '10. Hipervínculos y enlaces a otras páginas web',
        blocks: [
          { type: 'p', content: 'En el caso de que se dispusiesen enlaces o hipervínculos hacía otros sitios de Internet, Reglado Consultores no ejercerá ningún tipo de control sobre dichos sitios y contenidos, ni asumirá responsabilidad alguna por sus contenidos.' }
        ]
      },
      {
        title: '11. Cookies',
        blocks: [
          { type: 'p', content: 'La empresa se reserva el derecho de utilizar la tecnología "cookie" en el espacio Web, a fin de reconocerlo como Usuario frecuente y personalizar el uso que realice del espacio Web.' }
        ]
      },
      {
        title: '12. Duración y modificación',
        blocks: [
          { type: 'p', content: 'Reglado Consultores se reserva el derecho de modificar el presente Aviso Legal y/o las condiciones particulares.' }
        ]
      },
      {
        title: '13. Comunicaciones',
        blocks: [
          { type: 'p', content: 'Cualquier comunicación entre Reglado Consultores y el Usuario, deberá dirigirse a la Empresa a la dirección electrónica: info@regladoconsultores.com' }
        ]
      },
      {
        title: '14. Legislación aplicable y tribunales competentes',
        blocks: [
          { type: 'p', content: 'El presente Aviso Legal y las relaciones establecidas entre la Empresa y el Usuario se regirán y resolverán de conformidad con lo establecido en la normativa española. Para los casos en los que la normativa prevea la posibilidad a las partes de someterse a un fuero, la Empresa y el Usuario, someterán cualesquiera controversias a los Juzgados y Tribunales competentes.' }
        ]
      }
    ]
  },
  en: {
    eyebrow: 'Legal',
    title: 'Legal Notice',
    sections: [
      {
        title: '1. Ownership of the website',
        blocks: [
          { type: 'p', content: 'Reglado Consultores is the owner and responsible party for this website, providing users with this document in order to comply with the obligations established by Spanish Law 34/2002 of 11 July on Information Society Services and Electronic Commerce (LSSICE), and to inform all website users about the conditions of use.' },
          { type: 'p', content: 'Reglado Consultores reserves the right to modify any information that may appear on the website, without any obligation to give prior notice or inform users of such changes.' }
        ]
      },
      {
        title: '2. Identification details',
        blocks: [
          { type: 'ul', items: [
            'Company name: Reglado Consultores',
            'Trade name: Reglado Consultores',
            'Tax ID: B09662081',
            'Address: Avda. Isla Graciosa, 7 floor 1st offices 5-6, 28703 San Sebastián de los Reyes.',
            'Phone: +34 911462674 / 615-641-081',
            'Email: info@regladoconsultores.com'
          ]}
        ]
      },
      {
        title: '3. Purpose',
        blocks: [
          { type: 'p', content: 'This Legal Notice sets out the conditions of use governing access to, browsing of and use of the Website, as well as the responsibilities arising from the use, provision and/or contracting of any products or services offered, and the contents that make it up.' }
        ]
      },
      {
        title: '4. Acceptance',
        blocks: [
          { type: 'p', content: 'Accessing and using this website as a user implies acceptance of the provisions contained in this Legal Notice, which may change at any time.' }
        ]
      },
      {
        title: '5. Access and use of the website',
        blocks: [
          { type: 'p', content: 'Access to the Website by Users is free of charge. In any event, access to, browsing of and use of the Website are carried out under the User\'s sole and exclusive responsibility.' }
        ]
      },
      {
        title: '6. Conditions of use',
        blocks: [
          { type: 'p', content: 'The website and its services are, in general, freely accessible. The User undertakes to use this website without engaging in activities that may be considered unlawful or illegal, that infringe the rights of third parties or that may breach these Conditions of Use, current legislation and generally accepted standards.' }
        ]
      },
      {
        title: '7. Privacy and data processing',
        blocks: [
          { type: 'p', content: 'Where access to certain content or services requires the provision of personal data, Users shall guarantee its truthfulness, accuracy, authenticity and validity. The company will process such data automatically as appropriate to its nature or purpose (in compliance with GDPR, LOPDGDD and LSSI).' }
        ]
      },
      {
        title: '8. Liability and limitations',
        blocks: [
          { type: 'p', content: 'The Company cannot guarantee the reliability, usefulness or accuracy of the information provided through the Website, and does not guarantee or assume responsibility for damage caused by viruses, unavailability, vulnerability of the Website or any other damage caused by its use.' }
        ]
      },
      {
        title: '9. Intellectual and industrial property rights',
        blocks: [
          { type: 'p', content: 'All intangible assets made available to the public through this website are protected. All intellectual and industrial property rights to the Contents are reserved and, in particular, it is prohibited to modify, copy, reproduce, publicly communicate, transform or distribute in any way all or part of the contents included on the Website.' }
        ]
      },
      {
        title: '10. Hyperlinks and links to other websites',
        blocks: [
          { type: 'p', content: 'In the event that links or hyperlinks to other Internet sites are provided, Reglado Consultores will not exercise any control over such sites and content, nor will it assume any responsibility for their content.' }
        ]
      },
      {
        title: '11. Cookies',
        blocks: [
          { type: 'p', content: 'The company reserves the right to use "cookie" technology on the Website in order to recognise the User as a frequent visitor and personalise their use of the Website.' }
        ]
      },
      {
        title: '12. Duration and modification',
        blocks: [
          { type: 'p', content: 'Reglado Consultores reserves the right to modify this Legal Notice and/or the particular conditions.' }
        ]
      },
      {
        title: '13. Communications',
        blocks: [
          { type: 'p', content: 'Any communication between Reglado Consultores and the User must be addressed to the Company at the email address: info@regladoconsultores.com' }
        ]
      },
      {
        title: '14. Applicable law and competent courts',
        blocks: [
          { type: 'p', content: 'This Legal Notice and the relationships established between the Company and the User shall be governed and resolved in accordance with Spanish law. In cases where the regulations allow the parties to submit to a jurisdiction, the Company and the User shall submit any disputes to the competent Courts and Tribunals.' }
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
