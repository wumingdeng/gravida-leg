/**
 * @file
 * Created by hanan on 16/10/15.
 */

import login from '../views/login.vue';
import order from '../views/orders/order.vue';
import home from '../views/home.vue';
import visit from '../views/visits/visits.vue';
import visiter from '../views/visits/visiter.vue';
import report from '../views/visits/report.vue';
import user from '../views/users/user.vue';
import hospital from '../views/hospital/hospital.vue';
import test from '../views/test.vue';
import NotFound from '../views/NotFound.vue';
import h5Editor from '../views/h5Editor/editor.vue';
import weightconfig from '../views/h5Editor/editorweight.vue';
import {setCookie,getCookie,delCookie} from "../util/cookieUnit.js";
export default [
   {path: '*', component: NotFound, name: 'notfound'},
  {
    path: '/',
    component: home,
    children: [
        { path: '/', component: order,name:"未付款记录"},
        { path: '/fukuan', component: order,name:"已付款记录"},
        { path: '/shouhuo', component: order,name:"已收货记录"},
        { path: '/weishouhuo', component: order,name:"未收货记录"},
        { path: '/visit', component: visit,name:"就诊列表"},
        { path: '/report/:no', component: report,name:"客人报告"},
        { path: '/visiter/:no', component: visiter,name:"客人信息"},
        { path: '/user', component: user,name:"用户管理"},
        { path: '/hospital', component: hospital,name:"医院管理"},
        { path: '/h5Editor', component: h5Editor,name:""},
        { path: '/weight', component: weightconfig,name:""},
    ],
    beforeEnter:(to,from,next)=>{
        window.scrollTo(0,0)
        var user = getCookie('user')
        console.log(user)
        if(user==undefined || user==null|| user=='null'){
            console.log("返回登陆界面")
            next('/login')
        }else{
           console.log('当前页面')
            next()
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