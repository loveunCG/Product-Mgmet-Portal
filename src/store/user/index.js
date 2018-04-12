import * as firebase from 'firebase'
import router from '../../router'
var md5 = require('js-md5')

export default {
  state: {
    user: null,
    product: [],
    latestUid: ' '
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
      localStorage.setItem('user_token', payload)
      console.log(state.user)
    },
    setLastestUid (state, payload) {
      state.latestUid = payload
      console.log(state.latestUid)
    },
    loadProduct (state, payload) {
      state.product = (payload)
      console.log('that is product', state.product)
    },
    pushProduct (state, payload) {
      state.product[Object.keys(payload)] = (payload)
    },
    clearUser (state) {
      state.user = null
      localStorage.removeItem('user_token')
    }
  },
  actions: {
    loadingProduct ({commit}) {
      console.log('--------------------', this.getters.latestUid)
      firebase.database().ref('/products/').orderByKey().once('value').then((snapshot) => {
        var latestUid
        if (Object.keys(snapshot.val()).length < 2) {
          console.log(this.state.product)
        } else {
          commit('setLastestUid', latestUid)
          commit('loadProduct', snapshot.val())
          console.log('----------------', Object.keys(snapshot.val()).length)
        }
      }).catch(err => {
        console.log(err)
        return []
      })
    },
    pushProduct ({commit}, payload) {
      commit('pushProduct', payload)
    },
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              name: user.displayName,
              email: user.email,
              photoUrl: user.photoURL
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              name: user.displayName,
              email: user.email,
              photoUrl: user.photoURL
            }
            commit('setUser', newUser)
            router.push('/dashboard')
          }
        )
        .catch(
          error => {
            firebase.database().ref('/users/' + md5(payload.email)).once('value').then((snapshot) => {
              var authUser = ''
              var isAvailabled = false
              if (!snapshot.val()) {

              } else if (snapshot.val() && snapshot.val().usr_password === md5(payload.password)) {
                isAvailabled = true
              }
              if (isAvailabled) {
                const newUser = {
                  id: authUser.key,
                  name: authUser.usr_name,
                  email: authUser.usr_email,
                  status: authUser.usr_status,
                  photoUrl: authUser.usr_role
                }
                commit('setUser', newUser)
                router.push('/dashboard')
              } else {
                commit('setLoading', true)
                commit('setError', error)
              }
            })
          }
        )
    },
    signUserInGoogle ({commit}) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              name: user.displayName,
              email: user.email,
              photoUrl: user.photoURL
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    signUserInFacebook ({commit}) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              name: user.displayName,
              email: user.email,
              photoUrl: user.photoURL
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', true)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    signUserInGithub ({commit}) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider())
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              name: user.displayName,
              email: user.email,
              photoUrl: user.photoURL
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    signUserInTwitter ({commit}) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithPopup(new firebase.auth.TwitterAuthProvider())
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              name: user.displayName,
              email: user.email,
              photoUrl: user.photoURL
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    autoSignIn ({commit}, payload) {
      commit('setUser', {
        id: payload.uid,
        name: payload.displayName,
        email: payload.email,
        photoUrl: payload.photoURL
      })
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    product (state) {
      return state.product
    },
    latestUid (state) {
      return state.latestUid
    }
  }
}
