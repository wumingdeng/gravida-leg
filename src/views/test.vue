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
      
    }
  }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
