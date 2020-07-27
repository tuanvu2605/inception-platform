import Vue from 'vue'
import App from './App.vue'

import vuetify from './plugins/vuetify';
import Element from 'element-ui'
import Cookies from 'js-cookie'
import enLang from 'element-ui/lib/locale/lang/en'
import router from './router'
import store from './store'



import '../src/icons'
import '../src/styles/index.scss'

Vue.config.productionTip = false

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  locale: enLang // 如果使用中文，无需设置，请删除
})

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')


