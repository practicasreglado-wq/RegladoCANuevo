# Subir proyecto a GitHub y comandos del día a día

## 1. Preparar el repositorio local

Abre una terminal en la raíz del proyecto y ejecuta:

```bash
git init
git add .
git commit -m "primer commit"
```

## 2. Crear el repositorio en GitHub

1. Ve a [github.com](https://github.com) e inicia sesión.
2. Haz clic en **New** (o el botón **+** arriba a la derecha → *New repository*).
3. Dale un nombre al repositorio (ej. `RegladoCA`).
4. Déjalo en **Public** o **Private** según prefieras.
5. **No** marques ninguna opción de inicialización (README, .gitignore, licencia) — ya tenemos commits locales.
6. Haz clic en **Create repository**.

## 3. Conectar el repositorio local con GitHub

GitHub te mostrará los comandos. Son estos (cambia la URL por la tuya):

```bash
git remote add origin https://github.com/TU_USUARIO/RegladoCA.git
git branch -M main
git push -u origin main
```

Desde ese momento tu código está en GitHub.

---

## Comandos del día a día

### Ver el estado de tus archivos

```bash
git status
```
Muestra qué archivos tienen cambios, cuáles están listos para commitear y cuáles no.

### Ver los cambios antes de commitear

```bash
git diff
```

### Preparar archivos para el commit

```bash
# Un archivo específico
git add nombre-del-archivo.js

# Todos los cambios
git add .
```

### Guardar los cambios (commit)

```bash
git commit -m "descripción corta de lo que hiciste"
```
El mensaje debe describir el **qué** y el **por qué**, no el cómo. Ejemplo:
- `"agrega formulario de contacto"`
- `"corrige error en cálculo de precio con descuento"`

### Subir cambios a GitHub

```bash
git push
```
La primera vez usaste `-u origin main`; después solo `git push` es suficiente.

### Bajar cambios desde GitHub (si trabajas en equipo o desde otra PC)

```bash
git pull
```

### Ver el historial de commits

```bash
git log --oneline
```

---

## Trabajo con ramas (branches)

Las ramas te permiten trabajar en una nueva funcionalidad sin afectar el código principal.

```bash
# Crear una rama nueva y moverte a ella
git checkout -b nombre-de-la-rama

# Ver todas las ramas
git branch

# Cambiar a una rama existente
git checkout nombre-de-la-rama

# Subir la rama a GitHub
git push -u origin nombre-de-la-rama

# Fusionar la rama con main (primero muévete a main)
git checkout main
git merge nombre-de-la-rama

# Eliminar la rama cuando ya no la necesitas
git branch -d nombre-de-la-rama
```

---

## Ignorar archivos con .gitignore

Crea un archivo `.gitignore` en la raíz del proyecto para que git no suba archivos que no deben estar en el repositorio:

```
# Dependencias
node_modules/

# Variables de entorno (nunca subir esto)
.env
.env.local

# Archivos del sistema operativo
.DS_Store
Thumbs.db

# Archivos de build (opcionales, depende del proyecto)
dist/
build/
```

---

## Flujo típico de trabajo diario

```bash
git pull                          # 1. Traer últimos cambios
# ... haces tus cambios en el código ...
git status                        # 2. Ver qué cambió
git add .                         # 3. Preparar cambios
git commit -m "qué hiciste"       # 4. Guardar localmente
git push                          # 5. Subir a GitHub
```

---

## Deshacer cosas

| Situación | Comando |
|---|---|
| Deshacer cambios en un archivo (sin commitear) | `git checkout -- nombre-archivo` |
| Sacar un archivo del staging (git add) | `git restore --staged nombre-archivo` |
| Deshacer el último commit (mantiene los cambios) | `git reset --soft HEAD~1` |
| Ver a qué apunta HEAD | `git log --oneline -5` |

---

## Recursos útiles

- [Documentación oficial de Git (español)](https://git-scm.com/book/es/v2)
- [GitHub Docs](https://docs.github.com/es)
- [Visualizar ramas interactivo](https://learngitbranching.js.org/?locale=es_ES)
