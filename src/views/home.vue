
<template>
    <div>
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
    <main>
        <div class="main-left">
            <el-menu default-active="/" theme="dark" :router="true">
              <el-submenu index="1">
                <template slot="title">订单管理</template>
                  <el-menu-item index="/">未付款<div v-if="s1_cout>0" class="notice">{{s1_cout}}</div></el-menu-item>
                  <el-menu-item index="/fukuan">已付款<div v-if="s2_cout>0" class="notice">{{s2_cout}}</div></el-menu-item>
                  <el-menu-item index="/weishouhuo">未发货<div v-if="s3_cout>0" class="notice">{{s3_cout}}</div></el-menu-item>
                  <el-menu-item index="/shouhuo">已发货<div v-if="s4_cout>0" class="notice">{{s4_cout}}</div></el-menu-item>
              </el-submenu>
              <el-menu-item index="2">导航二</el-menu-item>
              <el-menu-item index="3">导航三</el-menu-item>
            </el-menu>
        </div>
        <div class="main-right">
            <transition name="fade"
		            mode="out-in">
			<router-view></router-view>
		</transition>
        </div>
    </main>
    </div>
</template>

<script>
export default {
    data() {
        return {
            sysName:'VUEADMIN',
            collapsed:false,
            sysUserName: '',
            sysUserAvatar: '',
            s1_cout:1,
            s2_cout:2,
            s3_cout:3,
            s4_cout:4
        }
    },
    methods: {
        //退出登录
        logout: function () {
            var _this = this;
            this.$confirm('确认退出吗?', '提示', {
                //type: 'warning'
            }).then(() => {
                sessionStorage.removeItem('user');
                _this.$router.push('/login');
            }).catch(() => {

            });
        },
        //折叠导航栏
        collapse:function(){
            this.collapsed=!this.collapsed;
        },
        showMenu(i,status){
            this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
        }
    },
    mounted() {
        console.log("home")
        var user = {
            name:"fizzo",
            avatar:"https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png",
        }
        sessionStorage.setItem('user', JSON.stringify(user));

        var user = sessionStorage.getItem('user');
        if (user) {
            user = JSON.parse(user);
            this.sysUserName = user.name || '';
            this.sysUserAvatar = user.avatar || '';
        }

    }
}
</script>

<style lang="css" rel="stylesheet/css">
  
  /* 主内容区 */
main{display: -ms-flexbox;display: flex;  min-height: 800px;  border: solid 5px #E9ECF1;  background-color: #FCFCFC;
}
main .main-left{text-align: center;-ms-flex: 0 0 200px;flex: 0 0 200px;padding: 5px 5px;
}
main .main-right{-ms-flex:1;flex:1; background-color: #fff; padding: 5px 5px;
}

    .header {
        height: 60px;
        line-height: 60px;
        background:#20a0ff;
        color:#fff;
    }

    .header .userinfo {
        text-align: right;
        padding-right: 35px;
        float: right;
    }
    .header .userinfo .userinfo-inner {
        cursor: pointer;
        color:#fff;
    }
    .header .userinfo .userinfo-inner img {
        width: 40px;
        height: 40px;
        border-radius: 20px;
        margin: 10px 0px 10px 10px;
        float: right;
    }
    .header .logo {
        height:60px;
        font-size: 22px;
        padding-left:20px;
        padding-right:20px;
        border-color: rgba(238,241,146,0.3);
        border-right-width: 1px;
        border-right-style: solid;
    }
    .header .logo img {
        width: 40px;
        float: left;
        margin: 10px 10px 10px 18px;
    }
    .header  .logo .txt {
        color:#fff;
    }
    .header .logo-width{
        width:230px;
    }
    .header .logo-collapse-width{
        width:60px
    }
    .header .tools{
        padding: 0px 23px;
        width:14px;
        height: 60px;
        line-height: 60px;
        cursor: pointer;
    }
</style>
