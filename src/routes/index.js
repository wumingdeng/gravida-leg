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
import goods_config from '../views/goods/goods_config.vue';
import produce_config from '../views/goods/produce_config.vue';
import desc_config from '../views/goods/desc_config.vue';
import goods_list from '../views/goods/goods_list.vue';
import platform from '../views/platform/platform.vue';
import platform_user from '../views/platform/platform_user.vue';
import operate from '../views/storage/operate.vue';
import test from '../views/test.vue';
import NotFound from '../views/NotFound.vue';
import h5Editor from '../views/h5Editor/editor.vue';
import config from '../views/h5Editor/modifyconfig.vue';

import { setCookie, getCookie, delCookie } from "../util/cookieUnit.js";
export default [
    { path: '*', component: NotFound, name: 'notfound' },
    {
        path: '/home',
        component: home,
        children: [
            { path: '/weifukuan', component: order, name: "待付款记录" },
            { path: '/fukuan', component: order, name: "待备货记录" },
            { path: '/shouhuo', component: order, name: "已收货记录" },
            { path: '/weishouhuo', component: order, name: "待收货记录" },
            { path: '/fahuo', component: order, name: "已发货记录" },
            { path: '/pingjia', component: order, name: "已评价记录" },
            { path: '/all', component: order, name: "所有订单记录" },
            { path: '/visit', component: visit, name: "就诊列表" },
            { path: '/report/:no', component: report, name: "客人报告" },
            { path: '/visiter/:no', component: visiter, name: "客人信息" },
            { path: '/user', component: user, name: "用户管理" },
            { path: '/hospital', component: hospital, name: "医院管理" },
            { path: '/weight_list', component: h5Editor, name: "体重评估配置" },
            { path: '/gravida_list', component: h5Editor, name: "孕周配置" },
            { path: '/config', component: config, name: "修改配置" },
            { path: '/goods_config', component: goods_config, name: "货号配置" },
            { path: '/goods_list', component: goods_list, name: "入库分销记录" },
            { path: '/in_storage', component: operate, name: "入库操作" },
            { path: '/out_storage', component: operate, name: "出库操作" },
            { path: '/produce_config', component: produce_config, name: "商品配置" },
            { path: '/desc_config', component: desc_config, name: "原因配置" },
            { path: '/platform', component: platform, name: "平台配置" },
            { path: '/platform_user', component: platform_user, name: "平台用户" },
        ],
        beforeEnter: (to, from, next) => {
            window.scrollTo(0, 0)
            var user = getCookie('user')
            // console.log(to.path)
            if (user == undefined || user == null || user == 'null') {
                console.log("返回登陆界面")
                next('/')
            } else {
                next()
            }
        }
    },
    {
        path: '/',
        component: login,
        name: "login"
    },
    {
        path: '/test',
        component: test,
        name: "test"
    }

];