import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

import View from '../views/View.vue';

const routes: RouteConfig[] = [
  { path: '/', component: View, },
  { path: '/contract/:address', component: View, },
];

Vue.use(VueRouter);
const router = new VueRouter({
  routes,
  mode: 'hash',
});

export default router;
