
<template>
    <el-row class="container">
        <el-col :span="24" class="header">
            <el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
                {{collapsed?'':sysName}}
            </el-col>
            <el-col :span="4" class="userinfo">
                <el-dropdown trigger="hover">
                    <span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar" /> {{sysUserName}}</span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>我的消息</el-dropdown-item>
                        <el-dropdown-item>设置</el-dropdown-item>
                        <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-col>
        <el-col :span="24" class="main">
            <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
                <el-menu default-active="/weifukuan" theme="dark" :router="true" unique-opened>
                    <el-submenu index="1" v-if="getWeight('0')">
                        <template slot="title">订单管理</template>
                        <el-menu-item index="/weifukuan">未付款
                            <div v-if="s1_cout>0" class="notice">{{s1_cout}}</div>
                        </el-menu-item>
                        <el-menu-item index="/fukuan">已付款
                            <div v-if="s2_cout>0" class="notice">{{s2_cout}}</div>
                        </el-menu-item>
                        <el-menu-item index="/weishouhuo">未发货
                            <div v-if="s3_cout>0" class="notice">{{s3_cout}}</div>
                        </el-menu-item>
                        <el-menu-item index="/shouhuo">已发货
                            <div v-if="s4_cout>0" class="notice">{{s4_cout}}</div>
                        </el-menu-item>
                    </el-submenu>
                    <el-menu-item index="/user" v-if="getWeight('1')">用户管理</el-menu-item>
                    <el-menu-item index="/hospital" v-if="getWeight('2')">医院管理</el-menu-item>
                    <el-submenu index="2">
                        <template slot="title">文本配置</template>
                        <el-menu-item index="/gravida_list">孕周配置</el-menu-item>
                        <el-menu-item index="/weight_list">体重评估配置</el-menu-item>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title">入库分销</template>
                        <el-menu-item index="/in_storage">入库</el-menu-item>
                        <el-menu-item index="/out_storage">出库</el-menu-item>
                        <el-menu-item index="/goods_list">记录明细</el-menu-item>
                    </el-submenu>
                    <el-submenu index="4">
                        <template slot="title">货品配置</template>
                        <el-menu-item index="/goods_config">货号配置</el-menu-item>
                        <el-menu-item index="/desc_config">原因配置</el-menu-item>
                    </el-submenu>
                </el-menu>
            </aside>
            <section class="content-container">
                <div class="grid-content bg-purple-light">
                    <el-col :span="24" class="breadcrumb-container">
                        <strong class="title">{{$route.name}}</strong>
                        <el-breadcrumb separator="/" class="breadcrumb-inner">
                            <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                                {{ item.name }}
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                    <el-col :span="24" class="content-wrapper">
                        <transition name="fade" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </el-col>
                </div>
            </section>
        </el-col>
    </el-row>
</template>

<script>
import { setCookie, getCookie, delCookie } from "../util/cookieUnit.js";
import g from "../globals/global.js";
export default {
    data() {
        return {
            sysName: '孕妇鞋销售管理系统',
            collapsed: false,
            sysUserName: '',
            sysUserAvatar: '',
            s1_cout: 0,
            s2_cout: 0,
            s3_cout: 0,
            s4_cout: 0,
            weight: []
        }
    },
    methods: {
        //退出登录
        logout: function() {
            var _this = this;
            this.$confirm('确认退出吗?').then(_ => {
                _this.$http.get(g.debugUrl + "signOut").then((res) => {
                    if (res.body.ok == 1) {
                        console.log("signOut")
                        setCookie('user', null);
                        _this.$router.push('/');
                    } else {
                        this.$alert('退出失败', '警告', {
                            confirmButtonText: '确定'
                        });
                    }
                },
                    (res) => {
                        console.log(res)
                    })
            }).catch(_ => {
                this.$alert('退出失败', '警告', {
                    confirmButtonText: '确定'
                });
            });
        },
        //折叠导航栏
        collapse: function() {
            console.log("asdjfjaslkdjfkl")
            this.collapsed = !this.collapsed;
        },
        showMenu(i, status) {
            this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
        },
        getWeight(index) {
            console.log(this.weight.toString())
            return this.weight.indexOf(index) > -1
        },
        //getOrdersCount
        getOrderCount() {
            this.$http.get(g.debugUrl + "getOrdersCount").then((res) => {
                if (res.body.d) {
                    var counts = res.body.d.count
                    var rows = res.body.d.rows
                    console.log("counts.length :"+counts.length)
                    for(var i=0;i<counts.length;i++){
                        var co = counts[i]
                        var row = rows[i]
                        if(row.status === 0){
                            this.$data.s1_cout = co.count
                        }else if(row.status === 1){
                            this.$data.s2_cout = co.count
                        }else if(row.status === 2){
                            this.$data.s3_cout = co.count
                        }else if(row.status === 3){
                            this.$data.s4_cout = co.count
                        }
                    }
                }
            },
                (res) => {
                    this.$data.listLoading = false
                })
        }
    },
    created() {
        var user = getCookie('user');
        if (user) {
            user = JSON.parse(user);
            if (user) {
                this.sysUserName = user.familyname || '';
                this.sysUserAvatar = user.avatar || '';
                this.weight = user.weight.split(',')
            }
        }
    },
    mounted() {
        eventBus.$on("onselectedOrder", function(arg) {
            console.log("剩余"+arg)
            var status = arg.st
            var count = arg.count
            switch (status) {
                case 0:
                    this.$data.s1_cout = count
                    this.$data.s2_cout++
                    break;
                case 1:
                    this.$data.s2_cout = count
                    this.$data.s3_cout++
                    break;
                case 2:
                    this.$data.s3_cout = count
                    this.$data.s4_cout++
                    break;
                case 3:
                    this.$data.s4_cout = count
                    break;
                default:
                    break
            }
        }.bind(this))
        this.getOrderCount()
    }
}
</script>

<style lang="css" rel="stylesheet/css">
/* 主内容区 */

main {
    display: -ms-flexbox;
    display: flex;
    min-height: 800px;
    border: solid 1px #FCFCFC;
    background-color: #FCFCFC;
}

main .main-left {
    text-align: center;
    -ms-flex: 0 0 200px;
    flex: 0 0 200px;
    padding: 5px 5px;
}

main .main-right {
    -ms-flex: 1;
    flex: 1;
    background-color: #fff;
    padding: 5px 5px;
}

.container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
}

.header {
    height: 60px;
    line-height: 60px;
    background: #20a0ff;
    color: #fff;
}

.header .userinfo {
    text-align: right;
    padding-right: 35px;
    float: right;
}

.header .userinfo .userinfo-inner {
    cursor: pointer;
    color: #fff;
}

.header .userinfo .userinfo-inner img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin: 10px 0px 10px 10px;
    float: right;
}

.header .logo {
    height: 60px;
    font-size: 22px;
    padding-left: 20px;
    padding-right: 20px;
    border-color: rgba(238, 241, 146, 0.3);
    border-right-width: 1px;
    border-right-style: solid;
}

.header .logo img {
    width: 40px;
    float: left;
    margin: 10px 10px 10px 18px;
}

.header .logo .txt {
    color: #fff;
}

.header .logo-width {
    width: 230px;
}

.header .logo-collapse-width {
    width: 60px
}

.header .tools {
    padding: 0px 23px;
    width: 14px;
    height: 60px;
    line-height: 60px;
    cursor: pointer;
}

.main {
    display: flex;
    position: absolute;
    top: 60px;
    bottom: 0px;
    overflow: hidden;
}

.main aside {
    flex: 0 0 230px;
    width: 230px;
}

.main aside .el-menu {
    height: 100%;
}

.main aside .collapsed {
    width: 60px;
}

.main aside .collapsed .item {
    position: relative;
}

.main aside .collapsed .submenu {
    position: absolute;
    top: 0px;
    left: 60px;
    z-index: 99999;
    height: auto;
    display: none;
}

.main .menu-collapsed {
    flex: 0 0 60px;
    width: 60px;
}

.main .menu-expanded {
    flex: 0 0 230px;
    width: 230px;
}

.main .content-container {
    flex: 1;
    overflow-y: scroll;
    padding: 20px;
}

.main .content-container .breadcrumb-container .title {
    width: 200px;
    float: left;
    color: #475669;
}

.main .content-container .breadcrumb-container .breadcrumb-inner {
    float: right;
}

.main .content-container .content-wrapper {
    background-color: #fff;
    box-sizing: border-box;
}
</style>
