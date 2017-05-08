<template>
    <div>
    <img src="../assets/logo.png">
    <h1>{{ msg }}</h1>
    <el-button @click.native="startHacking">Let's do it</el-button>
    </div>
</template>


<script>
import api from "../util/api.js";
export default {
  data () {
    return {
      msg: 'Use Vue 2.0 Today!'
    }
  },
  methods: {
    startHacking () {
        
        if(this.$parent.$data.cout > 0){
            this.$parent.$data.cout = --this.$parent.$data.cout
        }

        // this.$notify({
        //     title: 'It Works',
        //     message: 'We have laid the groundwork for you. Now it\'s your time to build something epic!',
        //     duration: 6000
        // })
        var postData =  api.getOrderTracesByJson("YTO","12345678") 

        this.$http.post(api.url,
          postData).then((response) => {
            if(response.body.err){
              
            }else{
              if(response.body.ok == 1){
					   }else{
					   }
        }       
      }, (response) => {
      });
    }
  }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
