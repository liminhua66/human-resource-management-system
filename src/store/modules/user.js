import { login } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    token: getToken()
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload
    },
    removeToken(state) {
      state.token = ''
      removeToken()
    }
  },
  actions: {
    async login({ commit }, data) {
      try {
        const res = await login(data)
        commit('setToken', res)
        setToken(res)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
