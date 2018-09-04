import Vue from 'vue'
import Router from 'vue-router'
import MdList from '@/components/MdList'
import Md from '@/components/Md'
import MdEdit from '@/components/MdEdit'
import Icons from '@/components/Icons'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MdList',
      component: MdList
    },
    {
    	path: '/article/:id',
    	name: 'detail',
    	component: Md
    },
    {
      path: '/article/edit/:id',
      name: 'edit',
      component: MdEdit
    },
    {
      path: '/icon/list',
      name: 'icon',
      component: Icons
    }
  ]
})
