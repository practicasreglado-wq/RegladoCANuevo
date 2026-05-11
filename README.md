# 🏛️ Reglado Consultores — Vue 3 + Vite

Web institucional de **Reglado Consultores**, construida como **single-page application** con **Vue 3**, **Vite**, **vue-router**, **vue-i18n** (ES / EN), animaciones GSAP + Lenis, y un endpoint PHP para el formulario de contacto.

La arquitectura es **single-page con anclas**: toda la home vive en `/`, con secciones diferenciadas. Las URLs antiguas (`/sobre-nosotros`, `/contacto`, etc.) redirigen a la ancla correspondiente. Las páginas legales (privacidad, cookies, aviso legal, accesibilidad) sí son rutas independientes.

---

## 📁 Estructura del proyecto

```
src/
├── assets/
│   ├── css/
│   │   └── main.css                  ← Variables, reset, utilidades, partículas globales
│   └── images/                       ← Logos, fotos de secciones e iconos
├── components/
│   ├── common/
│   │   └── MapaReglado.vue           ← Mapa interactivo de cobertura nacional (iframe lazy)
│   ├── layout/
│   │   ├── TheNavbar.vue             ← Navbar fija con dropdown, idioma y CTA
│   │   └── TheFooter.vue             ← Footer con datos, navegación, contacto y legales
│   ├── sections/                     ← Secciones del HomeView en orden de aparición
│   │   ├── HeroSection.vue           ← Hero con vídeo scroll-scrubbed
│   │   ├── ServicesSection.vue       ← Grid de 5 servicios con tilt 3D
│   │   ├── BannerSection.vue         ← Banner oscuro con símbolo § y partículas
│   │   ├── AboutSection.vue          ← Sobre nosotros con tag-cards y vídeo
│   │   ├── StatsSection.vue          ← Mapa nacional + marquee de ciudades
│   │   ├── VideoShowcaseSection.vue  ← Sección destacada con vídeo de fondo
│   │   ├── ServicesDeepSection.vue   ← Carrusel scroll-driven de los 5 servicios
│   │   ├── ProgramasSection.vue      ← Subvenciones europeas + Contratación pública
│   │   ├── OrdenanzasSection.vue     ← Lista de ordenanzas fiscales con sticky-copy
│   │   └── ContactSection.vue        ← Formulario de contacto con antispam
│   └── ui/                           ← Componentes UI reutilizables
│       ├── CanvasVideoBackground.vue ← Vídeo del hero como canvas scroll-scrubbed
│       ├── CookieBanner.vue          ← Banner de aceptación de cookies
│       ├── CursorBlend.vue           ← Cursor custom con mix-blend-mode
│       ├── Logo3DBackground.vue      ← Logo 3D rotatorio de fondo (iframe + three.js)
│       ├── MagneticButton.vue        ← Botón que sigue al cursor
│       ├── Marquee.vue               ← Carrusel horizontal infinito
│       ├── ScrollProgress.vue        ← Barra superior e inferior con el % de scroll
│       ├── SplitHeading.vue          ← Título palabra a palabra con reveal animado
│       └── TiltCard.vue              ← Card con efecto tilt 3D al hover
├── composables/
│   ├── useLenis.js                   ← Smooth scroll global con GSAP ScrollTrigger
│   ├── useReveal.js                  ← Directiva v-reveal (IntersectionObserver)
│   └── useGoldParticles.js           ← Genera partículas doradas flotantes
├── i18n/
│   ├── index.js                      ← vue-i18n con detección automática y persistencia
│   └── locales/
│       ├── es.json                   ← Español (por defecto)
│       └── en.json                   ← English
├── router/
│   └── index.js                      ← Rutas + redirecciones legacy + scroll behavior
├── views/
│   ├── HomeView.vue                  ← Página principal con todas las secciones
│   ├── PrivacidadView.vue            ← Política de privacidad (ES/EN)
│   ├── CookiesView.vue               ← Política de cookies (ES/EN)
│   ├── AvisoLegalView.vue            ← Aviso legal (ES/EN)
│   ├── AccesibilidadView.vue         ← Declaración de accesibilidad
│   └── NotFoundView.vue              ← Página 404
├── App.vue                           ← Layout raíz: navbar + router-view + footer + overlays
└── main.js                           ← Entrada: monta Vue, router, i18n, CSS

api/
└── contact.php                       ← Endpoint del formulario (PHPMailer + SMTP + antispam)

public/
├── .htaccess                         ← Apache: SPA fallback, cabeceras de seguridad, cache, gzip
├── favicon.png
├── logo3d.html                       ← Iframe con el logo 3D rotatorio (three.js)
├── mapa/                             ← Iframe del mapa interactivo (React + d3)
├── frames/                           ← Frames .webp para el vídeo scroll-scrubbed del hero
├── video/                            ← Vídeos de las secciones
└── iconos/                           ← Iconos de los 5 servicios
```

---

## 🎨 Paleta de colores

Definida en `src/assets/css/main.css` como variables CSS:

| Variable                | Valor      | Uso                              |
|-------------------------|------------|----------------------------------|
| `--color-navy`          | `#1a2d4e`  | Navbar, fondos oscuros           |
| `--color-navy-deep`     | `#111e33`  | Footer, secciones extra oscuras  |
| `--color-gold`          | `#c9a84c`  | Acentos, CTAs, bordes, hover     |
| `--color-gold-dark`     | `#a8872e`  | Hover intenso del dorado         |
| `--color-gold-text`     | `#7a6418`  | Dorado oscuro para texto (WCAG AA sobre blanco) |
| `--color-bg-light`      | `#f5f6f8`  | Fondo de secciones claras        |
| `--color-bg-cream`      | `#faf8f3`  | Fondo crema (sección About)      |
| `--color-text`          | `#1a2d4e`  | Color de texto principal         |
| `--color-text-muted`    | `#5a6478`  | Texto secundario                 |
| `--color-border`        | `#e4e6ec`  | Bordes finos                     |

---

## 🚀 Instalación y uso

```bash
# 1. Instalar dependencias del frontend
npm install

# 2. Instalar dependencias del backend PHP (PHPMailer)
composer install

# 3. Copiar el .env de ejemplo y rellenar credenciales SMTP
cp .env.example .env
# Editar .env con: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, CONTACT_TO, ALLOWED_ORIGIN

# 4. Arrancar servidor de desarrollo (Vite)
npm run dev

# 5. Build para producción
npm run build

# 6. Preview del build
npm run preview
```

**Importante:** En desarrollo, Vite (`localhost:5173`) sirve el frontend y hace proxy de `/api/*` a Apache (XAMPP). Por eso necesitas tanto `npm install` como `composer install` y el `.env` configurado para que el formulario funcione localmente.

---

## 🌍 Multiidioma (i18n)

- El idioma se detecta automáticamente desde el navegador (`navigator.language`)
- La selección manual se guarda en `localStorage` (clave `locale`)
- Idiomas disponibles: **Español** (ES, por defecto) e **Inglés** (EN)
- Para añadir un nuevo idioma:
  1. Crear `src/i18n/locales/xx.json` con la misma estructura que `es.json`
  2. Importarlo en `src/i18n/index.js` y añadirlo al array `SUPPORTED`
  3. Añadir el botón en el bloque `.lang` de `TheNavbar.vue`

---

## ✨ Funcionalidades destacadas

- 🌐 **Multiidioma** Español/Inglés con detección automática del idioma del navegador
- 🎬 **Logo 3D rotatorio** de fondo en toda la web, gira con el scroll
- 🎠 **Carrusel de servicios** con triple navegación: scroll, bolitas del HUD y flechas laterales (desktop) + mini-flechas junto a las bolitas (desktop y móvil)
- 🗺️ **Mapa interactivo** de cobertura nacional con animaciones y "fly-to" a ciudades al hacer clic en el marquee
- ✨ **Animaciones cuidadas**: barra de progreso de scroll, partículas doradas flotantes, reveal-on-scroll, botones magnéticos, cards con efecto tilt 3D
- 📝 **Formulario de contacto** con validación cliente + servidor, antispam y envío por SMTP autenticado (PHPMailer)
- 🍪 **Banner de cookies** persistente con aceptación guardada en navegador
- ♿ **Accesibilidad**: aria-labels traducidos, soporte completo de `prefers-reduced-motion`, navegación por teclado en todos los controles interactivos
- 📱 **Responsive** con experiencias adaptadas a desktop, tablet y móvil
- 🔄 **Single-page con anclas**: todas las secciones viven en una sola URL con scroll suave (Lenis)

---

## 🔐 Seguridad

Esta plantilla está endurecida contra los ataques web más comunes. En palabras llanas, así está protegida:

- 🛡️ **CSP (Content Security Policy)** en `public/.htaccess`: le dice al navegador qué dominios pueden cargar scripts, estilos y fuentes. Bloquea automáticamente cualquier intento de cargar código de sitios no autorizados.
- 🔒 **SRI (Subresource Integrity)** en las librerías externas (three.js, d3, topojson...): si alguien hackea una CDN y la modifica, el navegador detecta el cambio y se niega a ejecutarla.
- 🚫 **Anti-clickjacking** (`X-Frame-Options: DENY` + `frame-ancestors 'none'`): nadie puede meter esta web dentro de un iframe oculto para engañar al usuario haciéndole clic donde no debe.
- 📬 **Antispam del formulario** con tres capas:
  - *Honeypot*: campo invisible que solo rellenan los bots
  - *Time-trap*: rechaza envíos en menos de 3 segundos
  - *Rate limit*: máximo 3 envíos por IP cada 10 minutos
- 🔐 **HTTPS forzado y HSTS** preparados (solo hay que descomentar 2 líneas del `.htaccess` cuando despliegues con certificado SSL).
- 🏝️ **Iframes con sandbox**: el contenido del mapa y del logo 3D vive en burbujas aisladas y no puede afectar al resto de la página.
- ✉️ **Comunicación entre iframes con origen verificado**: solo se aceptan mensajes que vengan del mismo dominio, no de cualquier sitio.
- 🧹 **Páginas legales sin `v-html`**: el texto se renderiza como datos estructurados, no como HTML crudo. Imposible inyectar código aunque alguien manipulara el origen.
- 🔑 **Credenciales del SMTP en variables de entorno** (`.env`), nunca en el código fuente. El `.gitignore` excluye `.env` automáticamente.
- 🗂️ **Bloqueo de acceso directo** a archivos sensibles (`.env`, `composer.json`, `.git`...) desde el navegador.
- 🛂 **Identificación de IP segura**: el rate limit del formulario usa solo `REMOTE_ADDR` (no se puede falsificar como `X-Forwarded-For`).

Si añades servicios externos en el futuro (Analytics, Hotjar, mapas de Google...), recuerda añadir esos dominios al CSP en `public/.htaccess`.

---

## 🗺️ Rutas y anclas

### Rutas reales (vistas independientes)

| Ruta              | Vista                | Descripción                       |
|-------------------|----------------------|-----------------------------------|
| `/`               | HomeView             | Todas las secciones en single-page |
| `/privacidad`     | PrivacidadView       | Política de privacidad (ES/EN)    |
| `/aviso-legal`    | AvisoLegalView       | Aviso legal (ES/EN)               |
| `/cookies`        | CookiesView          | Política de cookies (ES/EN)       |
| `/accesibilidad`  | AccesibilidadView    | Declaración de accesibilidad      |
| `/*`              | NotFoundView         | Página 404                        |

### Redirecciones legacy (URLs antiguas → anclas)

Mantenemos compatibilidad con URLs históricas. Cada una redirige a su sección dentro de `/`:

| URL antigua                   | Redirige a               |
|-------------------------------|--------------------------|
| `/sobre-nosotros`             | `/#sobre-nosotros`       |
| `/inspecciones-tributarias`   | `/#inspecciones`         |
| `/consultoria-juridica`       | `/#juridica`             |
| `/consultoria-tecnica`        | `/#tecnica`              |
| `/consultoria-economica`      | `/#economica`            |
| `/consultoria-energetica`     | `/#energetica`           |
| `/subvenciones-europeas`      | `/#subvenciones`         |
| `/contrataciones`             | `/#contrataciones`       |
| `/contacto`                   | `/#contacto`             |

### Anclas internas del HomeView

`#top` · `#sobre-nosotros` · `#servicios` · `#inspecciones` · `#juridica` · `#tecnica` · `#economica` · `#energetica` · `#subvenciones` · `#contrataciones` · `#contacto`

---

## ✏️ Personalización rápida

1. **Textos y traducciones** → `src/i18n/locales/es.json` y `en.json`
2. **Colores** → variables CSS en `src/assets/css/main.css`
3. **Logo** → reemplazar los archivos en `src/assets/images/REGLADO_*.png`
4. **Logo 3D animado** → editar el modelo three.js en `public/logo3d.html`
5. **Datos del formulario** → configurar `.env` con credenciales SMTP reales; el endpoint vive en `api/contact.php`
6. **Mapa interactivo** → datos y configuración en `public/mapa/`
7. **Iconos de servicios** → reemplazar PNG en `public/iconos/`
8. **Imágenes de secciones** → reemplazar en `src/assets/images/`
9. **Frames del hero scroll** → regenerar con FFmpeg y depositar en `public/frames/h4/`

---

## 📦 Stack técnico

- **Framework:** Vue 3.4 (Composition API + `<script setup>`)
- **Build:** Vite 5
- **Router:** vue-router 4 (createWebHistory + scroll behavior)
- **i18n:** vue-i18n 9 (Composition API, legacy: false)
- **Smooth scroll:** Lenis 1.3
- **Animaciones:** GSAP 3 + ScrollTrigger
- **3D:** three.js (cargado por CDN dentro de un iframe, no entra al bundle principal)
- **Mapa:** React + d3 + topojson (cargados por CDN dentro de un iframe)
- **Banderas:** flag-icons
- **Backend:** PHP 8 + PHPMailer (vía Composer)
- **Servidor:** Apache (XAMPP en local, cabeceras de seguridad en `.htaccess`)
