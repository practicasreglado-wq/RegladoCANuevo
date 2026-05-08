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

const { locale } = useI18n()

const content = {
  es: {
    eyebrow: 'Legal',
    title: 'Política de cookies',
    sections: [
      {
        title: '1. ¿Qué son las cookies?',
        body: `<p>Una cookie es un fichero que se descarga en su ordenador al acceder a determinadas páginas web. Las cookies permiten a una página web, entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo y, dependiendo de la información que contengan y de la forma en que utilice su equipo, pueden utilizarse para reconocer al usuario.</p>`
      },
      {
        title: '2. Tipos de cookies que utiliza esta página web',
        body: `<p><strong>Cookies técnicas:</strong> Son aquellas que permiten al usuario la navegación a través de una página web, plataforma o aplicación y la utilización de las diferentes opciones o servicios que en ella existan.</p>
               <p><strong>Cookies de personalización:</strong> Son aquellas que permiten al usuario acceder al servicio con algunas características de carácter general predefinidas en función de una serie de criterios en el terminal del usuario.</p>
               <p><strong>Cookies de análisis:</strong> Son aquellas que bien tratadas por nosotros o por terceros, nos permiten cuantificar el número de usuarios y así realizar la medición y análisis estadístico de la utilización que hacen los usuarios del servicio ofertado.</p>`
      },
      {
        title: '3. Desactivación y eliminación de cookies',
        body: `<p>Tiene la opción de permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador instalado en su equipo. Al desactivar cookies, algunos de los servicios disponibles podrían dejar de estar operativos. La forma de deshabilitar las cookies es diferente para cada navegador, pero normalmente puede hacerse desde el menú Herramientas u Opciones.</p>
               <p>Para más información sobre cómo configurar las cookies según el navegador que estás utilizando, por favor visita los enlaces correspondientes según tu navegador (Chrome, Firefox, Safari, Edge, etc.).</p>`
      },
      {
        title: '4. Aceptación de la política de cookies',
        body: `<p>Reglado Consultores asume que usted acepta el uso de cookies si continúa navegando. No obstante, muestra información sobre su Política de cookies en la parte inferior o superior de cualquier página del portal con cada inicio de sesión con el objeto de que usted sea consciente.</p>`
      }
    ]
  },
  en: {
    eyebrow: 'Legal',
    title: 'Cookie Policy',
    sections: [
      {
        title: '1. What are cookies?',
        body: `<p>A cookie is a file that is downloaded onto your computer when you access certain websites. Cookies allow a website, among other things, to store and retrieve information about the browsing habits of a user or their device and, depending on the information they contain and the way the device is used, they can be used to recognise the user.</p>`
      },
      {
        title: '2. Types of cookies used by this website',
        body: `<p><strong>Technical cookies:</strong> These allow the user to navigate through a website, platform or application and to use the different options or services available on it.</p>
               <p><strong>Personalisation cookies:</strong> These allow the user to access the service with certain general characteristics predefined according to a series of criteria on the user's terminal.</p>
               <p><strong>Analytics cookies:</strong> These, processed by us or by third parties, allow us to quantify the number of users and to measure and statistically analyse how users interact with the service offered.</p>`
      },
      {
        title: '3. Disabling and deleting cookies',
        body: `<p>You have the option to allow, block or delete the cookies installed on your device through the settings of the browser installed on your computer. By disabling cookies, some of the available services may stop working. The way to disable cookies is different for each browser, but it can usually be done from the Tools or Options menu.</p>
               <p>For more information on how to configure cookies depending on the browser you are using, please visit the corresponding links for your browser (Chrome, Firefox, Safari, Edge, etc.).</p>`
      },
      {
        title: '4. Acceptance of the cookie policy',
        body: `<p>Reglado Consultores assumes that you accept the use of cookies if you continue browsing. However, it displays information about its Cookie Policy at the bottom or top of every page of the portal with each login so that you are aware of it.</p>`
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
