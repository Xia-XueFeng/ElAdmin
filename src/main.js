import Vue from 'vue'
import App from './App'
import router from './router'
//导入全局样式表
import './assets/global.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=> {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //在最后必须 return config
  return config
})
//所有组件都可以通过this.$http 发送请求
Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
