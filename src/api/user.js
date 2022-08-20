import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

/**
 * 获取用户基本信息
 * @returns Promise
 */
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}

/**
 * 获取额外的用户信息
 * @param {String} id 用户ID
 * @returns Promise
 */
export function geUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'GET'
  })
}

export function logout() {
}
