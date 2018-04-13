import 'element-ui/lib/theme-default/index.css'
import 'font-awesome/css/font-awesome.min.css'

import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import VueAxiosPlugin from 'vue-axios-plugin'
import ElementUI from 'element-ui'
//import './assets/theme/theme-green/index.css'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import router from './router'
import apis from './utils/apis'
import App from './App'

Vue.prototype.$apis = apis;

function checkStatus (response) {
  const data = response.data || []
  return {
    status: response.status || 500,
    ...data
  }
}

Vue.use(ElementUI)
Vue.use(VueAxiosPlugin, { checkStatus })

//NProgress.configure({ showSpinner: false });

router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

