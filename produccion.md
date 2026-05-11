# Checklist de produccion

Este documento recoge los puntos pendientes y las comprobaciones recomendadas antes de subir la web de Reglado Consultores a produccion.

## Cambios tecnicos recomendados antes de publicar

### 1. Revisar cabeceras de seguridad para iframes internos

Actualmente la configuracion de Apache puede bloquear los iframes propios del proyecto:

- `/logo3d.html`
- `/mapa/index.html`

En `public/.htaccess` revisar:

- `X-Frame-Options: DENY`
- `Content-Security-Policy` con `frame-ancestors 'none'`

Opciones:

- Cambiar a `X-Frame-Options: SAMEORIGIN`.
- Cambiar `frame-ancestors 'none'` por `frame-ancestors 'self'`.
- O crear excepciones especificas para los HTML embebidos.

### 2. Ajustar la CSP para scripts externos

El mapa y el logo 3D cargan dependencias desde CDN:

- `unpkg.com` para React, Babel, D3 y TopoJSON.
- `cdnjs.cloudflare.com` para Three.js.

La CSP actual solo permite scripts desde `'self'`, por lo que en produccion puede bloquear estos recursos.

Opciones recomendadas:

- Mejor opcion: servir esas dependencias localmente o empaquetarlas en el build.
- Opcion rapida: ampliar `script-src` para permitir los CDN necesarios.

### 3. Validar RGPD tambien en backend

El checkbox de RGPD se valida en el cliente, pero el backend PHP deberia validar tambien que llega aceptado.

Acciones:

- Enviar `rgpd: form.rgpd` desde `ContactSection.vue`.
- Rechazar en `api/contact.php` si `rgpd` no es `true`.

### 4. Optimizar el mapa interactivo

El mapa precarga datos municipales de muchas provincias para que la busqueda sea inmediata. Esto mejora la experiencia una vez cargado, pero puede penalizar rendimiento en movil o conexiones lentas.

Mejoras posibles:

- Crear un indice ligero de busqueda.
- Cargar municipios bajo demanda.
- Mantener precarga solo despues de la primera interaccion real.
- Revisar peso total de los JSON municipales.

### 5. Revisar uso de Babel standalone en produccion

`public/mapa/index.html` usa scripts `type="text/babel"`. Esto es comodo para prototipo, pero no ideal en produccion.

Recomendacion:

- Compilar el atlas del mapa antes del despliegue.
- Evitar transformar JSX en el navegador del usuario.

### 6. Revisar assets pesados

Hay videos e imagenes de peso considerable. Antes de produccion:

- Comprimir videos MP4.
- Revisar si conviene servir versiones WebM.
- Confirmar que imagenes grandes estan optimizadas.
- Mantener `preload` y carga diferida solo donde aporte valor real.

## Configuracion obligatoria de servidor

### 1. Variables de entorno

Crear un archivo `.env` en el servidor o configurar variables del entorno con:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `CONTACT_TO`
- `ALLOWED_ORIGIN`

No subir `.env` al repositorio.

### 2. Instalar dependencias PHP

En el servidor debe existir `vendor/autoload.php`.

Comando:

```bash
composer install --no-dev --optimize-autoloader
```

### 3. Instalar dependencias Node y generar build

Comandos:

```bash
npm ci
npm run build
```

Subir/servir el contenido generado de `dist/` junto con los archivos publicos necesarios y el endpoint PHP.

### 4. Configurar Apache

Comprobar:

- `mod_rewrite` activo.
- `mod_headers` activo.
- `mod_deflate` activo.
- `mod_expires` activo.
- Fallback SPA funcionando.
- `/api/contact.php` no debe redirigir a `index.html`.

### 5. HTTPS

Antes de produccion:

- Activar certificado SSL.
- Forzar HTTPS.
- Activar HSTS solo cuando el dominio ya funcione correctamente por HTTPS.

## Comprobaciones funcionales antes de publicar

- La home carga correctamente.
- El menu navega a todas las secciones.
- Las rutas legales funcionan:
  - `/aviso-legal`
  - `/privacidad`
  - `/cookies`
  - `/accesibilidad`
- Las rutas antiguas redirigen a sus anclas.
- El mapa interactivo carga y permite buscar municipios.
- El logo 3D se muestra correctamente.
- El formulario envia correos reales.
- La autorespuesta llega al usuario.
- El rate limit del formulario funciona.
- El formulario muestra error si SMTP falla.
- El idioma ES/EN cambia correctamente.
- El banner de cookies se guarda y no reaparece tras aceptar.

## Comprobaciones visuales

Revisar en:

- Desktop grande.
- Portatil.
- Tablet.
- Movil iOS.
- Movil Android.

Puntos concretos:

- Header fijo sin tapar contenido.
- Menu movil abre y cierra correctamente.
- Textos largos no se cortan.
- Botones tactiles tienen tamano suficiente.
- El carrusel de servicios funciona con scroll.
- La seccion del mapa no bloquea el scroll accidentalmente.
- El formulario es usable en movil.
- No hay solapamientos entre texto, imagenes y botones.

## SEO y metadatos

Antes de publicar:

- Revisar `title` y `description` principal.
- Anadir Open Graph:
  - `og:title`
  - `og:description`
  - `og:image`
  - `og:url`
- Anadir Twitter Card si se quiere mejorar vista previa social.
- Crear `robots.txt`.
- Crear `sitemap.xml`.
- Definir URL canonica del dominio final.
- Revisar textos legales con datos reales definitivos.

## Seguridad

- Confirmar que `.env` no es accesible publicamente.
- Confirmar que `composer.json`, `composer.lock`, `package.json` y `package-lock.json` no son accesibles si se sirven desde la misma raiz publica.
- Revisar permisos de archivos.
- No dejar errores PHP visibles en produccion.
- Activar logs de errores en servidor.
- Revisar que el endpoint de contacto solo acepte `POST`.
- Mantener rate limit.
- Valorar CAPTCHA o Turnstile si empieza a llegar spam.

## Rendimiento

- Ejecutar Lighthouse o PageSpeed.
- Revisar Core Web Vitals.
- Comprimir imagenes.
- Comprimir videos.
- Revisar carga inicial de scripts.
- Evitar cargar el mapa completo antes de que el usuario llegue a la seccion.
- Confirmar cache larga para assets versionados.
- Confirmar `index.html` sin cache agresiva.

## Analitica y seguimiento

Si el cliente lo necesita:

- Configurar Google Analytics, Matomo u otra herramienta.
- Revisar consentimiento de cookies si se instalan cookies no tecnicas.
- Configurar Google Search Console.
- Configurar Bing Webmaster Tools si procede.

## Git y entrega

Antes de cerrar:

- Revisar `git status`.
- Confirmar si `docs/github.md` debe estar eliminado o restaurado.
- Separar cambios propios de cambios ajenos si hace falta.
- Crear commit final con mensaje claro.
- Etiquetar version si se trabaja con releases.

## Orden recomendado de trabajo

1. Corregir CSP y cabeceras de iframe.
2. Validar RGPD en backend.
3. Decidir si el mapa se compila o se mantiene con CDN/Babel.
4. Optimizar assets pesados.
5. Preparar `.env` y SMTP real.
6. Ejecutar `npm run build`.
7. Probar build en entorno similar a produccion.
8. Revisar responsive y formulario.
9. Activar HTTPS y cabeceras finales.
10. Publicar.

