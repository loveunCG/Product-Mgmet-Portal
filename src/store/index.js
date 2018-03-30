import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import shared from './shared'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    user: user,
    shared: shared,
    plugins: [createPersistedState()]
  }
})
