import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
// import mlogin from '@/components/mlogin'
// import mindex from '@/components/mindex'
import staticRouter from './staticRouter'

Vue.use(Router)


const router = new Router({
  routes: staticRouter
})

export default router
