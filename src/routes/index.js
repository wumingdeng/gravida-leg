/**
 * @file
 * Created by hanan on 16/10/15.
 */
// const Hello = r => require(['views/hello'], r);
// const NotFound = r => require(['views/notfound'], r);
// const Test = r => require(['views/Test'], r);
// const Home = r => require(['views/home/home'],r);
// const Teacher = r => require(['views/teachers/teacher'],r);
// const TeacherList = r => require(['views/teachers/teacherList'],r);
// const Pro = r => require(['views/teachers/pro'],r);

// // 根目录
// const rootPath = '';

// // 页面路由
// const routes = [
//   {path: '', component: Home, name: 'home'},
//   {path: '/hello', component: Hello, name: 'hello',
//   	children:[
//   		{path: 'test', component: Test, name:'test'}
//   	]
//   },
//   {path: '/teacherList', component: TeacherList, name: 'teacherList'},
//   {path: '/teacher', component: Teacher, name:'teacher'},
//   {path: '/pro', component: Pro, name:'pro'}
// ].map(route => {
//   route.path = rootPath + route.path;
//   return route;
// });

// // 404 页
// routes.push({path: '*', component: NotFound, name: 'notfound'});

// export default routes;

// Pages
import home from '../views/login.vue';
import order from '../views/order.vue';

export default [
  {
    path: '/',
    component: order
  }
];