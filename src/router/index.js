import Vue from 'vue'
import Router from 'vue-router'
import TheChangeRateTable from '../components/TheChangeRateTable'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: TheChangeRateTable
    }
  ]
})
