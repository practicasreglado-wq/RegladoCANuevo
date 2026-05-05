# 🏛️ Reglado Template — Vue 3 + Vite

Plantilla completa basada en la estructura y paleta de **regladoconsultores.com**,
construida con **Vue 3**, **Vite**, **vue-router** y **vue-i18n** (ES / EN / AR).

---

## 📁 Estructura del proyecto

```
src/
├── assets/
│   └── css/
│       └── main.css              ← Variables CSS, reset, utilidades globales
├── components/
│   ├── layout/
│   │   ├── TheNavbar.vue         ← Navbar fija con scroll, dropdown, cambio de idioma
│   │   ├── TheFooter.vue         ← Footer con contacto y links legales
│   │   └── ServicePageLayout.vue ← Layout reutilizable para páginas de servicios
│   └── sections/
│       ├── HeroSection.vue       ← Hero full-height
│       ├── ServicesSection.vue   ← Grid de 4 servicios
│       ├── BannerSection.vue     ← Banner oscuro con símbolo decorativo
│       ├── AboutSection.vue      ← Sobre nosotros con tags
│       ├── StatsSection.vue      ← Contadores (casos, años, profesionales)
│       └── OrdenanzasSection.vue ← Lista de ordenanzas fiscales
├── i18n/
│   ├── index.js                  ← Configuración vue-i18n (detección automática)
│   └── locales/
│       ├── es.json               ← Español
│       ├── en.json               ← English
│       └── ar.json               ← العربية (RTL automático)
├── router/
│   └── index.js                  ← Rutas con lazy-loading y títulos de página
├── views/
│   ├── HomeView.vue
│   ├── AboutView.vue
│   ├── ContactoView.vue          ← Formulario con validación
│   ├── SubvencionesView.vue
│   ├── ContratacionesView.vue
│   ├── NotFoundView.vue          ← Página 404
│   └── services/
│       ├── InspeccionesView.vue
│       ├── JuridicaView.vue
│       ├── TecnicaView.vue
│       ├── EconomicaView.vue
│       └── EnergeticaView.vue
├── App.vue
└── main.js
```

---

## 🎨 Paleta de colores

| Variable              | Valor      | Uso                          |
|-----------------------|------------|------------------------------|
| `--color-navy`        | `#1a2d4e`  | Fondo hero, navbar, oscuros  |
| `--color-navy-deep`   | `#111e33`  | Footer, stats                |
| `--color-gold`        | `#c9a84c`  | Acentos, CTAs, bordes        |
| `--color-gold-dark`   | `#a8872e`  | Hover del dorado             |
| `--color-bg-light`    | `#f5f6f8`  | Fondo secciones claras       |
| `--color-white`       | `#ffffff`  | Fondo base                   |

---

## 🚀 Instalación y uso

```bash
# 1. Instalar dependencias
npm install

# 2. Arrancar servidor de desarrollo
npm run dev

# 3. Build para producción
npm run build

# 4. Preview del build
npm run preview
```

---

## 🌍 Multiidioma (i18n)

- El idioma se detecta automáticamente desde el navegador
- Se guarda en `localStorage` al cambiar manualmente
- El árabe activa automáticamente dirección RTL (`dir="rtl"`) en `<html>`
- Para añadir un nuevo idioma:
  1. Crear `src/i18n/locales/xx.json`
  2. Importarlo en `src/i18n/index.js`
  3. Añadir el botón en `TheNavbar.vue`

---

## 🗺️ Rutas disponibles

| Ruta                        | Vista                  |
|-----------------------------|------------------------|
| `/`                         | HomeView               |
| `/sobre-nosotros`           | AboutView              |
| `/inspecciones-tributarias` | InspeccionesView       |
| `/consultoria-juridica`     | JuridicaView           |
| `/consultoria-tecnica`      | TecnicaView            |
| `/consultoria-economica`    | EconomicaView          |
| `/consultoria-energetica`   | EnergeticaView         |
| `/subvenciones-europeas`    | SubvencionesView       |
| `/contrataciones`           | ContratacionesView     |
| `/contacto`                 | ContactoView           |
| `/*`                        | NotFoundView (404)     |

---

## ✏️ Personalización rápida

1. **Nombre de empresa** → Busca `TU EMPRESA` en los componentes de layout
2. **Textos** → Edita `src/i18n/locales/es.json` (y en/ar para multiidioma)
3. **Colores** → Modifica las variables en `src/assets/css/main.css`
4. **Logo** → Reemplaza el bloque `.logo` en `TheNavbar.vue` y `TheFooter.vue`
5. **Formulario** → En `ContactoView.vue`, conecta `handleSubmit()` a tu API
