import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
/*   {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  }, */

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'HomePage', icon: 'dashboard' }
    }]
  },

  {
    path: '/statistics',
    component: Layout,
    children: [{
      path: 'statistics',
      name: 'Statistics',
      component: () => import('@/views/statistics/index'),
      meta: { title: 'Statistics', icon: 'table' }
    }]
  },

  {
    path: '/about',
    component: Layout,
    children: [{
      path: 'about',
      name: 'About',
      component: () => import('@/views/about/index'),
      meta: { title: 'About', icon: 'example' }
    }]
  },

  {
    path: '/search',
    component: Layout,
    redirect: '/search/structure',
    name: 'Search',
    meta: { title: 'Search', icon: 'form' },
    children: [
      {
        path: 'structure',
        name: 'Structure',
        component: () => import('@/views/structure/index'),
        meta: { title: 'Transcript structure' }
      },
      {
        path: 'information',
        name: 'Information',
        component: () => import('@/views/information/index'),
        meta: { title: 'Annotation' },
        children: [
          {
            path: 'geneSearch',
            name: 'GeneSearch',
            component: () => import('@/views/information/geneSearch/index'),
            meta: { title: 'Gene Information' }
          },
          {
            path: 'transcriptSearch',
            name: 'TranscriptSearch',
            component: () => import('@/views/information/transcriptSearch/index'),
            meta: { title: 'Transcript Information' }
          }
        ]
      },
      {
        path: 'expression',
        name: 'Expression',
        component: () => import('@/views/expression/index'),
        meta: { title: 'Expression Level' },
        children: [
          {
            path: 'geneSearch',
            name: 'GeneSearch',
            component: () => import('@/views/expression/geneSearch/index'),
            meta: { title: 'Gene Search' }
          },
          {
            path: 'transcriptSearch',
            name: 'TranscriptSearch',
            component: () => import('@/views/expression/transcriptSearch/index'),
            meta: { title: 'Transcript Search' }
          }
        ]
      }
    ]
  },

  {
    path: '/sample',
    component: Layout,
    redirect: '/sample/table',
    name: 'Sample',
    meta: { title: 'Tools', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Browser', icon: 'table' }
      },
      {
        path: 'diseaseMap',
        name: 'DiseaseMap',
        component: () => import('@/views/diseaseMap/index'),
        meta: { title: 'Imputation', icon: 'table' }
      }
    ]
  },

/*   {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  }, */

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

// 以下代码是动态权限管理，让路由在用户登出或重新登录时恢复初始干净状态。
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
