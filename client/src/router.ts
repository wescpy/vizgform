import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import SheetViewer from './components/SheetViewer.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/sheet/:fileId', component: SheetViewer, props: true }
]

export default createRouter({
  history: createWebHistory(),
  routes
})