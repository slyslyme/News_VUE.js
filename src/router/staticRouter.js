import TheLayout from '@/pages/layout/TheLayout'
import AppLogin from '@/pages/login/AppLogin'
import FuncHome from '@/pages/functions/home/FuncHome'
import FuncModNews from '@/pages/functions/forms/FuncModNews'
import FuncAddNews from '@/pages/functions/forms/FuncAddNews'
import FuncAddType from '@/pages/functions/forms/FuncAddType'
import FuncModType from '@/pages/functions/forms/FuncModType'
import FuncAddUser from '@/pages/functions/forms/FuncAddUser'
import FuncModUser from '@/pages/functions/forms/FuncModUser'
import FuncComment from '@/pages/functions/forms/FuncComment'


/* 静态页面路由 */
const staticRouter = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: '登录',
    component: AppLogin
  },
  {
    path: '/',
    component: TheLayout,
    menu: true,              //菜单目录要添加此值，login等非菜单目录不需要
    children: [              //一级菜单，children[0]即是链接，要指明名字、图标、组件
      {
        path: '/index',
        name: '首页',
        icon: 'el-icon-menu',
        component: FuncHome
      }
    ]
  },
  {
    path: '/',
    component: TheLayout,
    menu: true,
    name: '新闻管理',
    icon: 'el-icon-tickets',
    children: [
      {
        path: '/forms/addnews',
        name: '新闻添加',
        component: FuncAddNews
      }, {
        path: '/forms/modnews',
        name: '新闻维护',
        component: FuncModNews
      },
    ]
  },
  {
    path: '/',
    component: TheLayout,
    menu: true,
    name: '新闻类别管理',
    icon: 'el-icon-edit-outline',
    children: [
      {
        path: '/forms/addtype',
        name: '新闻类别添加',
        component: FuncAddType
      }, {
        path: '/forms/modtype',
        name: '新闻类别维护',
        component: FuncModType
      },
    ]
  },
  {
    path: '/',
    component: TheLayout,
    menu: true,
    name: '用户管理',
    icon: 'el-icon-circle-plus-outline',
    children: [
      {
        path: '/forms/adduser',
        name: '添加用户',
        component: FuncAddUser
      }, {
        path: '/forms/moduser',
        name: '用户维护',
        component: FuncModUser
      },
    ]
  },
  {
    path: '/',
    component: TheLayout,
    menu: true,
    name: '新闻评论管理',
    children: [
      {
        path: '/forms/comments',
        name: '评论管理',
        icon: 'el-icon-message',
        component: FuncComment
      },
    ]
  },

]

export default staticRouter
