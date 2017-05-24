/**
 * @file
 * Created by hanan on 16/10/15.
 */

import login from '../views/login.vue';
import order from '../views/order.vue';
import home from '../views/home.vue';
import fukuan from '../views/orders/fukuan.vue';
import shouhuo from '../views/orders/shouhuo.vue';
import weifukuan from '../views/orders/weifukuan.vue';
import weishouhuo from '../views/orders/weishouhuo.vue';
import visit from '../views/visits/visits.vue';
import visiter from '../views/visits/visiter.vue';
import report from '../views/visits/report.vue';
import user from '../views/users/user.vue';
import hospital from '../views/hospital/hospital.vue';
import test from '../views/test.vue';
import NotFound from '../views/NotFound.vue';
import {setCookie,getCookie,delCookie} from "../util/cookieUnit.js";
export default [
   {path: '*', component: NotFound, name: 'notfound'},
  {
    path: '/',
    component: home,
    children: [
        { path: '/', component: weifukuan,name:"未付款记录"},
        { path: '/fukuan', component: fukuan,name:"已付款记录"},
        { path: '/shouhuo', component: shouhuo,name:"已收货记录"},
        { path: '/weishouhuo', component: weishouhuo,name:"未收货记录"},
        { path: '/visit', component: visit,name:"就诊列表"},
        { path: '/report/:no', component: report,name:"客人报告"},
        { path: '/visiter/:no', component: visiter,name:"客人信息"},
        { path: '/user', component: user,name:"用户管理"},
        { path: '/hospital', component: hospital,name:"医院管理"},
    ],
    beforeEnter:(to,from,next)=>{
        window.scrollTo(0,0)
        console.log("beforeEnter")
        var user = getCookie('user')
        console.log(user)
        console.log("beforeEnter")
        if(user){
          next()
        }else{
          next('/login')
        }
    }
  },
  {
    path: '/login',
    component: login,
    name:"login"
  },
   {
    path: '/test',
    component: test,
    name:"test"
  }
];