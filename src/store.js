import Vue from 'vue'
import Vuex from 'vuex'

//使用Vuex插件
Vue.use(Vuex)

//注意这里创建的是store对象，不是vuex对象
const store = new Vuex.Store({
  state:{
    user: null,
    drawer: true,
    window: {
      rightDrawerTop : 72,
      mainPaddingLeft : 256,
      mainPaddingRight: 300
    }
  },
  mutations:{
    SET_DRAWER (state, payload){
      state.drawer = payload
    }
  },
  actions:{},
  getters:{},
  modules:{}
})
//导出对象
export default store