import { login, getUserInfo } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {}
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload
    },
    removeToken(state) {
      state.token = ''
      removeToken()
    },
    setUserInfo(state, userInfo) {
      // state.userInfo = userInfo 浅拷贝
      state.userInfo = JSON.parse(JSON.stringify(userInfo))
    },
    removeUserinfo(state) {
      state.userInfo = {}
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
    },
    async getUserInfo({ commit }) {
      const res = await getUserInfo()
      console.log(res)
      commit('setUserInfo', res)
    }
  }
}
