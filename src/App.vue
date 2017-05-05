<template>
  <div id="app">
  <div>
    <img src="./assets/logo.png">
  </div>
   <main>
        <div class="main-left">
            <el-menu default-active="2" class="" @open="handleOpen" @close="handleClose" theme="dark">
              <el-submenu index="1">
                <template slot="title">导航一<div class="notice">{{cout}}</div></template>
                <el-menu-item-group title="分组一">
                  <el-menu-item index="1-1">选项1</el-menu-item>
                  <el-menu-item index="1-2">选项2</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="分组2">
                  <el-menu-item index="1-3">选项3</el-menu-item>
                </el-menu-item-group>
                <el-submenu index="1-4">
                  <template slot="title">选项4</template>
                  <el-menu-item index="1-4-1">选项1</el-menu-item>
                </el-submenu>
              </el-submenu>
              <el-menu-item index="2">导航二</el-menu-item>
              <el-menu-item index="3">导航三</el-menu-item>
            </el-menu>
        </div>
        <div  class="main-right" >
            <router-view class="view"></router-view>
        </div>
    </main>
  </div>
</template>

<script>
export default {
  data () {
    return {
     cout:10
    }
  },
  methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
}
</script>

<style lang="css" rel="stylesheet/css">
  .notice {
    width:20px;
    height:20px;
    line-height:20px;
    font-size:10px;
    color:#fff;
    text-align:center;
    background-color:#f00;
    border-radius:50%;
    position:absolute;
    right:-10px;
    top:-10px;
  }
  /* 主内容区 */
main{display: -ms-flexbox;display: flex;  min-height: 800px;  border: solid 40px #E9ECF1;  background-color: #FCFCFC;
}
main .main-left{text-align: center;-ms-flex: 0 0 200px;flex: 0 0 200px;
}
main .main-right{-ms-flex:1;flex:1; background-color: #fff; padding: 50px 70px;
}
</style>
