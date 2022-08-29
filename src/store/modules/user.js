import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {},
    hrsaasTime: 0
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
    },
    setHrsaasTime(state, payload) {
      state.hrsaasTime = payload
    }
  },
  actions: {
    async login({ commit }, data) {
      try {
        const res = await login(data)
        commit('setToken', res)
        commit('setHrsaasTime', +new Date())
        setToken(res)
      } catch (error) {
        console.log(error)
      }
    },
    async getUserInfo({ commit }) {
      const res = await getUserInfo()
      const baseInfo = await getUserDetailById(res.userId)
      const info = { ...res, ...baseInfo }
      console.log(info)
      commit('setUserInfo', info)
    },
    logout({ commit }) {
      commit('removeToken')
      commit('removeUserinfo')
    }
  }
}
