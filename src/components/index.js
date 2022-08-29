// import PageTools from './PageTools'

/* export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
  }
} */

// 自动批量注册组件
const requireComponent = require.context('./', true, /\.vue$/)
const list = requireComponent.keys().map(requireComponent)

export default (Vue) => {
//   Vue.component('PageTools', PageTools)
  list.forEach(ele => {
    Vue.component(ele.default.name, ele.default)
  })
}
