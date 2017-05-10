<template>
  <div id="app">
   <transition name="fade"
		            mode="out-in">
			<router-view></router-view>
		</transition>
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
    right:60px;
    top:5px;
  }
  /* 主内容区 */
main{display: -ms-flexbox;display: flex;  min-height: 800px;  border: solid 10px #E9ECF1;  background-color: #FCFCFC;
}
main .main-left{text-align: center;-ms-flex: 0 0 200px;flex: 0 0 200px;
}
main .main-right{-ms-flex:1;flex:1; background-color: #fff; padding: 50px 70px;
}
</style>
