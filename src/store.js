import Vue from 'vue'
import Vuex from 'vuex'

//使用Vuex插件
Vue.use(Vuex)

//注意这里创建的是store对象，不是vuex对象
const store = new Vuex.Store({
  state: {
    member: null,
    drawer: true,
    clientWith: null,
    ifMobile: false,
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
    changeLogin(state, member) {
      state.Authorization = member.Authorization;
      localStorage.setItem('Authorization', member.Authorization);
      localStorage.setItem('token', member.Authorization);
    },
    // 删除 token
    removeLogin(){
      localStorage.removeItem('token');
    }
  },
  actions: {},
  getters: {
    getMember(state){
      return state.member;
    }
  },
  modules: {}
})
//导出对象
export default store