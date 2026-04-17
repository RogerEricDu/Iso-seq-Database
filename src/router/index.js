import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/homepage'),
    hidden: true  // 不在侧边栏显示
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    children: [{
      path: 'index',
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
