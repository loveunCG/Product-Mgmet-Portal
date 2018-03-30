// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import * as firebase from 'firebase'
import {store} from './store'
import VueRouter from 'vue-router'
import Msg from 'vue-message'
import VueLocalStorage from 'vue-localstorage'
import Vuelidate from 'vuelidate'

Vue.use(Msg)
Vue.use(Vuelidate)
Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(VueLocalStorage)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyAapuI-3vHhKUVyDIUbETbyH7-gsDJB_uU',
      authDomain: 'wooow-01.firebaseapp.com',
      databaseURL: 'https://wooow-01.firebaseio.com',
      projectId: 'wooow-01',
      storageBucket: 'wooow-01.appspot.com'
    })
  }
}).$mount()
