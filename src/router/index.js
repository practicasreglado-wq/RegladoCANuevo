import { createRouter, createWebHistory } from 'vue-router'

// Single-page: una sola HomeView con todas las secciones.
// Las URLs antiguas redirigen al ancla correspondiente.
const REDIRECTS = {
  '/sobre-nosotros': '/#sobre-nosotros',
  '/inspecciones-tributarias': '/#inspecciones',
  '/consultoria-juridica': '/#juridica',
  '/consultoria-tecnica': '/#tecnica',
  '/consultoria-economica': '/#economica',
  '/consultoria-energetica': '/#energetica',
  '/subvenciones-europeas': '/#subvenciones',
  '/contrataciones': '/#contrataciones',
  '/contacto': '/#contacto'
}

const routes = [
  { path: '/', component: () => import('@/views/HomeView.vue'), meta: { title: 'Reglado Consultores — Asesoramiento integral para ayuntamientos' } },
  { path: '/privacidad', component: () => import('@/views/PrivacidadView.vue'), meta: { title: 'Política de privacidad — Reglado Consultores' } },
  { path: '/aviso-legal', component: () => import('@/views/AvisoLegalView.vue'), meta: { title: 'Aviso legal — Reglado Consultores' } },
  { path: '/accesibilidad', component: () => import('@/views/AccesibilidadView.vue'), meta: { title: 'Declaración de accesibilidad — Reglado Consultores' } },
  ...Object.entries(REDIRECTS).map(([from, to]) => ({ path: from, redirect: to })),
  { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFoundView.vue'), meta: { title: 'Página no encontrada — Reglado Consultores' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 70, behavior: 'smooth' }
    return { top: 0 }
  }
})

router.afterEach((to) => {
  if (to.meta?.title) document.title = to.meta.title
})

export default router
