import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// token时限
const timeout = 3600

function isCheckOut() {
  return (Date.now() - store.state.user.hrsaasTime) / 1000 > timeout
}

// 请求拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    // 有token时，检查是否超时
    if (isCheckOut()) {
      store.dispatch('user/logout')
      router.push('/login')
      Message.error('接口超时')
      return Promise.reject(new Error('接口超时'))
    }
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(error.message)
  }
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  const { success, message, data } = response.data
  if (success) {
    // Message.success(message)
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, error => {
  Message.error(error.message)
  return Promise.reject(error)
})

export default service
