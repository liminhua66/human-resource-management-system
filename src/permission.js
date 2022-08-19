import router from '@/router'
import store from '@/store'

const whileList = ['/login', '/404']

router.beforeEach((to, from, next) => {
  // 判断有无token
  if (store.getters.token) {
    // 当去往的页面不是 login 时，跳转至首页
    // console.log('to', to)
    if (to.path === '/login') {
      next('/')
    } else {
      // 直接放行
      next()
    }
  } else {
    // 不处于登录状态
    if (whileList.includes(to.path)) {
      // 如果去往login 或 404，直接放行
      next()
    } else {
      // 如果不是，去往登录页
      next('/login')
    }
  }
})
