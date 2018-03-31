import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'

// Views
import Dashboard from '@/views/Dashboard'
import UserTable from '@/views/UserTable'
import AddProduct from '@/views/product/addProduct'
import AddUser from '@/views/User/AddUser'
import Company from '@/views/Company'
import Category from '@/views/Category'
import City from '@/views/City'
import Store from '@/views/Store'
import Compare from '@/views/Compare'
import Measurement from '@/views/Measurement'
import Package from '@/views/Package'

// Views - Pages
import Product from '@/views/Product'
import LoginN from '@/views/Login'
import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
  mode: 'hash', // Demo is living in GitHub.io, so required!
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/login',
      beforeEnter: AuthGuard,
      name: 'Home',
      component: Full,
      children: [
        {
          path: 'company',
          name: 'Company',
          component: Company
        },
        {
          path: 'measurement',
          name: 'measurement',
          component: Measurement
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'package',
          name: 'package',
          component: Package
        },
        {
          path: 'city',
          name: 'City',
          component: City
        },
        {
          path: 'store',
          name: 'Store',
          component: Store
        },
        {
          path: 'category',
          name: 'Category',
          component: Category
        },
        {
          path: 'user',
          redirect: '/user/usertable',
          name: 'User',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'usertable',
              name: 'UserTable',
              component: UserTable
            },
            {
              path: 'addUser',
              name: 'Add User',
              component: AddUser
            }
          ]
        },
        {
          path: '/product',
          redirect: '/product/table',
          name: 'Pages',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'table',
              name: 'Product',
              component: Product
            },
            {
              path: 'compare',
              name: 'compare product',
              component: Compare
            },
            {
              path: 'add',
              name: 'Product',
              component: AddProduct
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginN
    }
  ]
})
