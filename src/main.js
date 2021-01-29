import Vue from 'vue'
import App from './App.vue'
import http from './http';
import vuetify from './plugins/vuetify';
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$http= http
Vue.prototype.$store = store

//全局注册时间格式化
Vue.filter('date-format',function(input, pattern = '') {
  let dt = new Date(input);
  //获取年月日
  let y = dt.getFullYear();
  let m = (dt.getMonth() + 1).toString().padStart(2, '0');
  let d = dt.getDate().toString().padStart(2,'0');
  //获取时分秒
  let hh = dt.getHours().toString().padStart(2,'0');
  let mm = dt.getMinutes().toString().padStart(2,'0');
  let ss = dt.getSeconds().toString().padStart(2,'0');

  if(pattern.toLowerCase() === 'yyyy-mm-dd'){
    return `${y}-${m}-${d}`;
  }else{
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
  }

});

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')