import Vue from 'vue'
import App from './App'
import router from './router'
//导入全局样式表
import './assets/global.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'
//引入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// require styles富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'


//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=> {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //在最后必须 return config
  return config
})
//所有组件都可以通过this.$http 发送请求
Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(ElementUI)
//富文本编辑器,注册为全局组件
Vue.use(VueQuillEditor)
Vue.component('zk-table', ZkTable)
//全局事件过滤器的操作
Vue.filter('dateFormat',function (originVal) {
  const dt = new Date(originVal)
  const y  = dt.getFullYear()
  const m  = (dt.getMonth()+1+'').padStart(2,'0')
  const d  = (dt.getDate()+'').padStart(2,'0')
  const hh  = (dt.getHours()+'').padStart(2,0)
  const mm = (dt.getMinutes()+'').padStart(2,0)
  const ss = (dt.getSeconds()+'').padStart(2,0)
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
