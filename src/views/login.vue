<template>
  <div style='text-align:center'>
    <img  width='400' src='../assets/logopng.png' style='margin-bottom:-170px'>
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <el-form-item prop="account">
        <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass" style='margin-bottom:10px'>
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-checkbox style='margin-right:300px' v-model="checked" checked class="remember">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import api from "../util/api.js";
  import {setCookie,getCookie,delCookie} from "../util/cookieUnit.js";
  import g from "../globals/global.js";
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: '',
          checkPass: ''
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            this.$data.logining = true;
            var loginParams = { username: this.ruleForm2.account, password: this.ruleForm2.checkPass };
            this.$http.post(g.debugUrl+"login",loginParams).then((res)=>{
              if(res.body.ok == 1){
                var user = res.body.d
                g.login = true
                var user = {
                    username:user.username,
                    avatar:"https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png",
                    familyname:user.familyname,
                    weight:user.weight,
                    doctor_no:"1001"
                }
                setCookie('user', JSON.stringify(user));
                this.$router.push({name:'未付款记录'})
              } else if(res.body.ok == 0){
                  this.$alert('登陆失败', '警告', {
                  confirmButtonText: '确定'
                });
              }   
              this.$data.logining = false          
          },
          (res)=>{
              this.$data.logining = false      
          })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    mounted (){
      var user = getCookie('user');
      if (user) {
          user = JSON.parse(user);
          if(user){
            this.ruleForm2.account = user.username || '';
            this.ruleForm2.checkPass = user.password || '';
          }
      }
    }
  }

</script>

<style lang="css" rel="stylesheet/css">
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
    .login-container .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .login-container .remember {
      margin: 0px 0px 10px 0px;
    }
      
</style>