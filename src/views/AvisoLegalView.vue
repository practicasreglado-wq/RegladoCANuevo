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
    title: 'Aviso legal',
    sections: [
      {
        title: '1. Titularidad del portal',
        body: `<p>Reglado Consultores, es la titular y responsable de este sitio web, poniendo a disposición de los usuarios el presente documento, con el que pretende dar cumplimiento a las obligaciones dispuestas en la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSICE), así como informar a todos los usuarios del sitio web respecto a cuáles son las condiciones de uso.</p>
               <p>Reglado Consultores se reserva el derecho de modificar cualquier tipo de información que pudiera aparecer en el sitio web, sin que exista obligación de preavisar o poner en conocimiento de los usuarios dichas obligaciones.</p>`
      },
      {
        title: '2. Datos identificativos',
        body: `<ul>
                 <li><strong>Denominación social:</strong> Reglado Consultores</li>
                 <li><strong>Nombre comercial:</strong> Reglado Consultores</li>
                 <li><strong>CIF:</strong> B09662081</li>
                 <li><strong>Domicilio:</strong> Avda. Isla Graciosa, 7 piso 1º despachos 5-6, 28703 San Sebastián de los Reyes.</li>
                 <li><strong>Teléfono:</strong> +34 911462674 / 615-641-081</li>
                 <li><strong>Dirección electrónica:</strong> info@regladoconsultores.com</li>
               </ul>`
      },
      {
        title: '3. Objeto',
        body: `<p>El presente Aviso Legal recoge las condiciones de uso que regulan el acceso, navegación y uso del Portal, así como las responsabilidades derivadas de la utilización, prestación y/o contratación de los productos o servicios que, en su caso, puedan ser ofrecidos, así como de los contenidos que lo integran.</p>`
      },
      {
        title: '4. Aceptación',
        body: `<p>El acceso y utilización de este portal de Internet como usuario implica la aceptación de las disposiciones contenidas en este Aviso legal, el cual puede cambiar en cualquier momento.</p>`
      },
      {
        title: '5. Acceso y uso del portal',
        body: `<p>El acceso al Portal por parte de los Usuarios tiene carácter libre y gratuito. En todo caso, el acceso, navegación y uso del Portal se hace bajo la única y exclusiva responsabilidad del Usuario.</p>`
      },
      {
        title: '6. Condiciones de uso',
        body: `<p>El portal y sus servicios son, en general, de libre acceso. El Usuario se compromete a utilizar este sitio web sin incurrir en actividades que puedan ser consideradas ilícitas o ilegales, que infrinjan los derechos de terceros o que puedan atentar contra las presentes Condiciones de uso, la legislación vigente y los usos generalmente aceptados.</p>`
      },
      {
        title: '7. Privacidad y tratamiento de datos',
        body: `<p>Cuando para el acceso a determinados contenidos o servicio sea necesario facilitar datos de carácter personal, los Usuarios garantizarán su veracidad, exactitud, autenticidad y vigencia. La empresa dará a dichos datos el tratamiento automatizado que corresponda en función de su naturaleza o finalidad (cumplimiento del RGPD, LOPDGDD y LSSI).</p>`
      },
      {
        title: '8. Responsabilidades y limitaciones',
        body: `<p>La Empresa no puede garantizar la fiabilidad, utilidad o veracidad de la información que se preste a través del Portal, y no garantiza ni se hace responsable de daños por virus, falta de disponibilidad, invulnerabilidad del Portal, u otros daños causados por el uso del mismo.</p>`
      },
      {
        title: '9. Derechos de propiedad intelectual e industrial',
        body: `<p>Todos aquellos activos intangibles puestos a disposición del público por la presente página web están protegidos. Quedan reservados todos los derechos de propiedad intelectual e industrial sobre los Contenidos y, en particular, queda prohibido modificar, copiar, reproducir, comunicar públicamente, transformar o distribuir de cualquier forma la totalidad o parte de los contenidos incluidos en el Portal.</p>`
      },
      {
        title: '10. Hipervínculos y enlaces a otras páginas web',
        body: `<p>En el caso de que se dispusiesen enlaces o hipervínculos hacía otros sitios de Internet, Reglado Consultores no ejercerá ningún tipo de control sobre dichos sitios y contenidos, ni asumirá responsabilidad alguna por sus contenidos.</p>`
      },
      {
        title: '11. Cookies',
        body: `<p>La empresa se reserva el derecho de utilizar la tecnología "cookie" en el espacio Web, a fin de reconocerlo como Usuario frecuente y personalizar el uso que realice del espacio Web.</p>`
      },
      {
        title: '12. Duración y modificación',
        body: `<p>Reglado Consultores se reserva el derecho de modificar el presente Aviso Legal y/o las condiciones particulares.</p>`
      },
      {
        title: '13. Comunicaciones',
        body: `<p>Cualquier comunicación entre Reglado Consultores y el Usuario, deberá dirigirse a la Empresa a la dirección electrónica: info@regladoconsultores.com</p>`
      },
      {
        title: '14. Legislación aplicable y tribunales competentes',
        body: `<p>El presente Aviso Legal y las relaciones establecidas entre la Empresa y el Usuario se regirán y resolverán de conformidad con lo establecido en la normativa española. Para los casos en los que la normativa prevea la posibilidad a las partes de someterse a un fuero, la Empresa y el Usuario, someterán cualesquiera controversias a los Juzgados y Tribunales competentes.</p>`
      }
    ]
  },
  en: {
    eyebrow: 'Legal',
    title: 'Legal Notice',
    sections: [
      {
        title: '1. Ownership of the website',
        body: `<p>Reglado Consultores is the owner and responsible party for this website, providing users with this document in order to comply with the obligations established by Spanish Law 34/2002 of 11 July on Information Society Services and Electronic Commerce (LSSICE), and to inform all website users about the conditions of use.</p>
               <p>Reglado Consultores reserves the right to modify any information that may appear on the website, without any obligation to give prior notice or inform users of such changes.</p>`
      },
      {
        title: '2. Identification details',
        body: `<ul>
                 <li><strong>Company name:</strong> Reglado Consultores</li>
                 <li><strong>Trade name:</strong> Reglado Consultores</li>
                 <li><strong>Tax ID:</strong> B09662081</li>
                 <li><strong>Address:</strong> Avda. Isla Graciosa, 7 floor 1st offices 5-6, 28703 San Sebastián de los Reyes.</li>
                 <li><strong>Phone:</strong> +34 911462674 / 615-641-081</li>
                 <li><strong>Email:</strong> info@regladoconsultores.com</li>
               </ul>`
      },
      {
        title: '3. Purpose',
        body: `<p>This Legal Notice sets out the conditions of use governing access to, browsing of and use of the Website, as well as the responsibilities arising from the use, provision and/or contracting of any products or services offered, and the contents that make it up.</p>`
      },
      {
        title: '4. Acceptance',
        body: `<p>Accessing and using this website as a user implies acceptance of the provisions contained in this Legal Notice, which may change at any time.</p>`
      },
      {
        title: '5. Access and use of the website',
        body: `<p>Access to the Website by Users is free of charge. In any event, access to, browsing of and use of the Website are carried out under the User's sole and exclusive responsibility.</p>`
      },
      {
        title: '6. Conditions of use',
        body: `<p>The website and its services are, in general, freely accessible. The User undertakes to use this website without engaging in activities that may be considered unlawful or illegal, that infringe the rights of third parties or that may breach these Conditions of Use, current legislation and generally accepted standards.</p>`
      },
      {
        title: '7. Privacy and data processing',
        body: `<p>Where access to certain content or services requires the provision of personal data, Users shall guarantee its truthfulness, accuracy, authenticity and validity. The company will process such data automatically as appropriate to its nature or purpose (in compliance with GDPR, LOPDGDD and LSSI).</p>`
      },
      {
        title: '8. Liability and limitations',
        body: `<p>The Company cannot guarantee the reliability, usefulness or accuracy of the information provided through the Website, and does not guarantee or assume responsibility for damage caused by viruses, unavailability, vulnerability of the Website or any other damage caused by its use.</p>`
      },
      {
        title: '9. Intellectual and industrial property rights',
        body: `<p>All intangible assets made available to the public through this website are protected. All intellectual and industrial property rights to the Contents are reserved and, in particular, it is prohibited to modify, copy, reproduce, publicly communicate, transform or distribute in any way all or part of the contents included on the Website.</p>`
      },
      {
        title: '10. Hyperlinks and links to other websites',
        body: `<p>In the event that links or hyperlinks to other Internet sites are provided, Reglado Consultores will not exercise any control over such sites and content, nor will it assume any responsibility for their content.</p>`
      },
      {
        title: '11. Cookies',
        body: `<p>The company reserves the right to use "cookie" technology on the Website in order to recognise the User as a frequent visitor and personalise their use of the Website.</p>`
      },
      {
        title: '12. Duration and modification',
        body: `<p>Reglado Consultores reserves the right to modify this Legal Notice and/or the particular conditions.</p>`
      },
      {
        title: '13. Communications',
        body: `<p>Any communication between Reglado Consultores and the User must be addressed to the Company at the email address: info@regladoconsultores.com</p>`
      },
      {
        title: '14. Applicable law and competent courts',
        body: `<p>This Legal Notice and the relationships established between the Company and the User shall be governed and resolved in accordance with Spanish law. In cases where the regulations allow the parties to submit to a jurisdiction, the Company and the User shall submit any disputes to the competent Courts and Tribunals.</p>`
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
