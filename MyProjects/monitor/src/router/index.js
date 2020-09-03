import Vue from 'vue'
import Router from 'vue-router'

import HelloWorld from '@/components/HelloWorld'
import Error_lists from '@/components/Error_lists'
import Home from '@/components/Home'
import Error_Details from '@/components/Error_Details'
import Config from '@/components/Config'
import Daily from '@/components/Daily'
import Config2 from '@/components/Config2'
import Urls from '@/components/Urls'
import Browsers from '@/components/Browsers'
import Script from '@/components/Script'
import Ips from '@/components/Ips'
import Network from '@/components/Network'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home
    },
    {
      path: '/error_lists',
      name: 'Error_lists',
      component: Error_lists
    },
    {
      path: '/helloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/Error_Details',
      name: 'Error_Details',
      component: Error_Details
    },
    {
      path: '/config',
      name: 'Config',
      component: Config
    },
    {
      path: '/config2',
      name: 'Config2',
      component: Config2
    },
    {
      path: '/daily',
      name: 'Daily',
      component: Daily
    },
    {
      path: '/urls',
      name: 'Urls',
      component: Urls
    },
    {
      path: '/browsers',
      name: 'Browsers',
      component: Browsers
    },
    {
      path: '/script',
      name: 'Script',
      component: Script
    },
     {
      path: '/ips',
      name: 'Ips',
      component: Ips
    },
     {
      path: '/network',
      name: 'Network',
      component: Network
    }
  ]
})
