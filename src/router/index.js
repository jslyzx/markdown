import Vue from 'vue'
import Router from 'vue-router'
import Md from '@/components/Md'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Md',
      component: Md
    }
  ]
})
