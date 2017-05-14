// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

// css
require('bulma/css/bulma.css')
require('font-awesome/css/font-awesome.min.css')

Vue.config.productionTip = false

global.axios = axios

global.url = window.location.href.split('/')
global.url = global.url[0] + '//' + global.url[2]
global.axios.defaults.baseURL = global.url

// for dev purposes
if (global.url === 'http://localhost:8080') {
  global.url = 'http://localhost:6100'
  global.axios.defaults.baseURL = 'http://localhost:6100'
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
