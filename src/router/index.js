import Vue from 'vue'

import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
const Login = () =>
  import(/* webpackChunkName:"Login_Home_Welcome" */ '../components/Login.vue')

// import Home from '../components/Home.vue'
const Home = () =>
  import(/* webpackChunkName:"Login_Home_Welcome" */ '../components/Home.vue')

// import Welcome from '../components/Welcome.vue'
const Welcome = () =>
  import(
    /* webpackChunkName:"Login_Home_Welcome" */ '../components/Welcome.vue'
  )

// import Rights from '../components/power/Rights.vue'

const Rights = () =>
  import(
    /* webpackChunkName:"User_Roles_Rights" */ '../components/power/Rights.vue'
  )
// import Roles from '../components/power/Roles.vue'
const Roles = () =>
  import(
    /* webpackChunkName:"Login_Home_Welcome" */ '../components/power/Roles.vue'
  )
// import Users from '../components/user/Users.vue'
const Users = () =>
  import(
    /* webpackChunkName:"Login_Home_Welcome" */ '../components/user/Users.vue'
  )

// import Cate from '../components/goods/Cate.vue'
const Cate = () =>
  import(/* webpackChunkName:"Cate_Params" */ '../components/goods/Cate.vue')
// import Params from '../components/goods/Params.vue'
const Params = () =>
  import(/* webpackChunkName:"Cate_Params" */ '../components/goods/Params.vue')

// import List from '../components/goods/List.vue'
const List = () =>
  import(
    /* webpackChunkName:"List_AddGoods_EditGoods" */ '../components/goods/List.vue'
  )
// import AddGoods from '../components/goods/AddGoods.vue'
const AddGoods = () =>
  import(
    /* webpackChunkName:"List_AddGoods_EditGoods" */ '../components/goods/AddGoods.vue'
  )
const EditGoods = () =>
  import(
    /* webpackChunkName:"List_AddGoods_EditGoods" */ '../components/goods/EditGoods.vue'
  )

// import Order from '../components/order/Order.vue'
const Order = () =>
  import(/* webpackChunkName:"Order_Report" */ '../components/order/Order.vue')
// import Report from '../components/report/report.vue'
const Report = () =>
  import(
    /* webpackChunkName:"Order_Report" */ '../components/report/report.vue'
  )

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home,
    redirect: 'welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: List
      },
      {
        path: '/goods/add',
        component: AddGoods
      },
      {
        path: '/goods/edit',
        component: EditGoods
      },
      {
        path: '/orders',
        component: Order
      },
      {
        path: '/reports',
        component: Report
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪来
  // next() 放行 next('/login') 强制跳转
  if (to.path === '/login') return next()
  // 获取 token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
