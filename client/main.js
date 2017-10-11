import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import routes from './routers'
import VueRouter from 'vue-router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import auth from './utils/auth'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(iView)

import VuexStore from './store'

const store = new Vuex.Store(VuexStore)

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const isLogin = auth.loggedIn()
  if (!isLogin && (to.name === 'auth' || (to.meta && to.meta.requiredAuth))) {
    next({
      path: '/login',
      name: 'login',
      query: {
        redirect: to.fullPath
      }
    })
  } else {
    if (isLogin && (to.name === 'auth' || to.name === 'login' || to.name === 'register')) {
      next({
        path: '/manage',
        name: 'manage'
      })
    } else {
      next()
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
