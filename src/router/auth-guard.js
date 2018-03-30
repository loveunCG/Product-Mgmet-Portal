import {store} from '../store'

export default (to, from, next) => {
  if (store.getters.user || localStorage.getItem('user_token')) {
    next()
  } else {
    next('/login')
  }
}
