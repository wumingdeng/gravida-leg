import Vue from 'vue'
import Vuex from 'vuex';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App.vue'
import routes from './routes';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource'
import store from './store/store';
import VueHtml5Editor from 'vue-html5-editor'

Vue.use(VueHtml5Editor,{
        showModuleName: true,
        image: {
            sizeLimit: 512 * 1024,
            compress: true,
            width: 500,
            height: 500,
            quality: 80
        }
      });
Vue.use(VueResource)
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);

	
Vue.http.options.credentials = true;

// 创建一个路由对象用于管理页面的路由
const router = new VueRouter({
  base:'/gm/',
  mode: 'history',
  routes: routes,
});

window.eventBus = new Vue({});

new Vue({
  el: '#app',
  router,	
  store,
  render: h => h(App)
})


