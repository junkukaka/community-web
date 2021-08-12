import Vue from 'vue'
import App from './App.vue'
import http from './http';
import vuetify from './plugins/vuetify';
import router from './router'
import store from './store'
import _ from 'lodash'



import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
import createTipPlugin from '@kangc/v-md-editor/lib/plugins/tip/index';
import '@kangc/v-md-editor/lib/plugins/tip/tip.css';
import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index';
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
import createHighlightLinesPlugin from '@kangc/v-md-editor/lib/plugins/highlight-lines/index';
import '@kangc/v-md-editor/lib/plugins/highlight-lines/highlight-lines.css';
import createMermaidPlugin from '@kangc/v-md-editor/lib/plugins/mermaid/cdn';
import '@kangc/v-md-editor/lib/plugins/mermaid/mermaid.css';

import './components/language/prism-abap.min.js'
import './components/language/prism-bash.min.js'
import './components/language/prism-java.min.js'
import './components/language/prism-json.min.js'
import './components/language/prism-scss.min.js'
import './components/language/prism-sql.min.js'
import './components/language/prism-python.min.js'
import './components/language/prism-scala.min.js'
import './components/language/prism-swift.min.js'
import './components/language/prism-go.min.js'




VueMarkdownEditor.use(createMermaidPlugin());
VueMarkdownEditor.use(createHighlightLinesPlugin());
VueMarkdownEditor.use(createCopyCodePlugin());
VueMarkdownEditor.use(createTodoListPlugin());
VueMarkdownEditor.use(createTipPlugin());
VueMarkdownEditor.use(createEmojiPlugin());
VueMarkdownEditor.use(createLineNumbertPlugin());
VueMarkdownEditor.use(vuepressTheme);
Vue.use(VueMarkdownEditor);

Vue.config.productionTip = false
Vue.prototype.$http= http
Vue.prototype.$store = store
Vue.prototype._ = _

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
  render: h => h(App)
}).$mount('#app')