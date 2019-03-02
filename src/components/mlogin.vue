<template>
  <div class="background" :style="background">
  <div class="login">
    <div class="login_real">
      <el-form status-icon :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item  prop="username">
          <el-input type="text" v-model="ruleForm.username" prefix-icon="icon-signin-denglu" placeholder="请输入用户名" auto-complete="on"></el-input>
        </el-form-item>
        <el-form-item  prop="password">
          <el-input v-model="ruleForm.password" type="password" prefix-icon="icon-signin-mima" placeholder="请输入密码" @keyup.enter.native="submitForm('ruleForm')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  v-model="ruleForm" @click="submitForm('ruleForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
    <vue-particles
      color="#fff"
      :particleOpacity="0.7"
      :particlesNumber="30"
      shapeType="star"
      :particleSize="5"
      linesColor="#fff"
      :linesWidth="2"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>
  </div>
</template>

<script>
  export default {
    name: "loginmanager",
    data() {
      return {
        background: {
          backgroundImage: "url(" + require("../assets/mlogin.jpg") + ")",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        },
        ruleForm: {
          username: '',
          password: '',
        },
        rules: {
          username: [{ required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }]
        },
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.ruleForm);
            this.$axios
              .post('/mLogin', this.$qs.stringify(this.ruleForm), {headers: {'Content-Type': "application/x-www-form-urlencoded"}})
              .then(response => {
                withCredentials: true
                console.log(response.data);
                if(response.data.code == 20){
                  this.$router.push({path:'/mindex', query: {username:this.ruleForm.username}});
                  return true;
                }
                else if(response.data.code == 202){
                  this.$message.error("用户名或密码错误！");
                  return false;
                }
                else{
                  this.$message.error("密码错误！");
                  return false;
                }
              })
              .catch(error => {
                console.log(error)
              })
          } else {
            return false;
          }
        })
      },
    }

  }
</script>

<style scoped>
 .login_real{
   width: 50%;
   height: 400px;
   float: right;
 }
 .background{
   position:fixed;
   top: 0;
   left: 0;
   width:100%;
   height:100%;
   min-width: 1000px;
   z-index:-10;
   zoom: 1;
   background-color: #fff;
   background-repeat: no-repeat;
   background-size: cover;
   -webkit-background-size: cover;
   -o-background-size: cover;
   background-position: center 0;
 }
</style>
<style>
  .el-form{
    margin: auto;
    padding-top: 29%;
  }
  .el-input{
    width: 250px;
  }
  .el-button{
    width: 250px;
  }

</style>
