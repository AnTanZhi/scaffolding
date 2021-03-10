import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import system from '@/api/system'
import { MessageBox, Message } from 'element-ui';

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  onlineId: ""
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ONLINEID: (state, onlineId) => {
    state.onlineId = onlineId
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userLogin: username.trim(), password: password }).then(response => {
        sessionStorage.setItem('userInfo', JSON.stringify(response.data))
        const { data } = response
        commit('const/SET_USERINFO', data, { root: true })
        commit('SET_TOKEN', data.accessToken)
        setToken(data.accessToken)
        resolve(response)
      })
    })
  },
  // get user info
  getInfo({ commit, state, rootState, dispatch }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        commit('const/SET_USERINFO', data, { root: true })
        commit('SET_ROLES', [1, 2, 3, 4])
        system.getFile(data.headCode).then(r => {
          let url = String(rootState.upload.uploadHost).split("").reverse().join("");
          url = url.substring(5);
          url = url.split("").reverse().join("");
          commit('const/SET_USERIMG', `${url}${r.data.path}`, { root: true })
          /* 链接Websocket */
          connectWebsocket(data, rootState.upload.uploadHost, { dispatch, commit })
        })
        // this.$router.push('/rongZiCanShu/pinLv')
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        closeWebSocket()
        dispatch('tagsView/delAllViews', null, { root: true })
        router.push('/login')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },
  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'
    commit('SET_TOKEN', token)
    setToken(token)
    const { roles } = await dispatch('getInfo')
    resetRouter()
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    router.addRoutes(accessRoutes)
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}
const closeWebSocket = () => {
  console.log('准备断开')
  if (window.webSocket) {
    console.log('断开链接')
    window.webSocket.close()
  }
}
const connectWebsocket = (data, url, { dispatch, commit }) => {
  if ('WebSocket' in window) {
    url = url.substring(7)
    url = url.split('')
    url = url.splice(0, url.length - 5);
    url = url.join('')
    console.log(url, '-0-0-')
    window.webSocket = new WebSocket(
      `ws://${url}/websocket/${data.id}`
    )
    window.webSocket.onopen = (event) => {
      console.log('ws://${url}/websocket/${userId}已连接', event)
    }
    window.webSocket.onmessage = function (event) {
      console.log('收到推送', event.data)
      handleMessage(JSON.parse(event.data), { dispatch, commit })
    }
  }
}
const handleMessage = (data, { dispatch, commit }) => {
  switch (Number(data.type)) {
    /* 消息提示 */
    case 0:
      Message({
        type: 'info',
        message: data.message,
        duration: 0,
        showClose: true
      })
      break
    /* 踢出 */
    case 1:
      console.log('账号在其他地方登录')
      MessageBox.alert('您的账号已在其他地方登录', '下线通知', {
        confirmButtonText: '确定',
        callback: action => {
          dispatch('user/logout', null, { root: true })
        }
      })
      break
    /* 在线用户的id */
    case 3:
      commit('SET_ONLINEID', data.message)
      break
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
