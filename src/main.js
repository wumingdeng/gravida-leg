import Vue from 'vue'
import Vuex from 'vuex';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App.vue'
import routes from './routes';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource'
import store from './store/store';
import g from './globals/global.js';

Vue.use(VueResource)
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);

	
Vue.http.options.credentials = true;

// 创建一个路由对象用于管理页面的路由
const router = new VueRouter({
  mode: 'history',
  routes: routes,
});

router.afterEach(route => {
    g.page = route.fullPath.substring(1); //保存当前路由 刷新的时候用
    console.log(g.page)
})

window.eventBus = new Vue({});

new Vue({
  el: '#app',
  router,	
  store,
  render: h => h(App)
})


