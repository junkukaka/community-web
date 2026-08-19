import { createStore } from 'vuex'
import { clearAuthStorage, getAuthToken, setAuthToken } from './auth.js'

//注意这里创建的是store对象，不是vuex对象
const store = createStore({
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
    wikiMenus:[],
    communityMenus: [],
    lang: {},
    memberAlert:0,
    // 存储token
    Authorization: getAuthToken()
  },
  mutations: {
    SET_DRAWER(state, payload) {
      state.drawer = payload
    },
    // 修改token，并将token存入localStorage
    changeLogin(state, member) {
      state.Authorization = member.Authorization;
      setAuthToken(member.Authorization);
    },
    // 删除 token
    removeLogin(state){
      state.Authorization = '';
      state.member = null;
      clearAuthStorage();
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
