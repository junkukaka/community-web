import Vue from 'vue'
import Vuex from 'vuex'

//使用Vuex插件
Vue.use(Vuex)

//注意这里创建的是store对象，不是vuex对象
const store = new Vuex.Store({
  state: {
    user: null,
    drawer: true,
    window: {
      rightDrawerTop: 72,
      mainPaddingLeft: 256,
      mainPaddingRight: 300
    },
    // 存储token
    Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : ''
  },
  mutations: {
    SET_DRAWER(state, payload) {
      state.drawer = payload
    },
    // 修改token，并将token存入localStorage
    changeLogin(state, user) {
      state.Authorization = user.Authorization;
      localStorage.setItem('Authorization', user.Authorization);
      localStorage.setItem('token', user.Authorization);
    }
  },
  actions: {},
  getters: {
    getUser(state){
      return state.user;
    }
  },
  modules: {}
})
//导出对象
export default store