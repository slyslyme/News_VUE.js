<template>
  <div>
    <el-card>
      <p>添加用户</p>
    </el-card>
    <br/>
    <el-card style="height: auto;">
      <div class="news">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-position="left" label-width="90px">
          <el-form-item label="用户名" prop="userName" >
            <el-input v-model="ruleForm.userName" placeholder="请输入3-8字符用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off" placeholder="请输入6-15位密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="againPw">
            <el-input type="password" v-model="ruleForm.againPw" autocomplete="off" placeholder="请输入6-15位确认密码"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="ruleForm.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-model="ruleForm" @click="submitForm">添加用户</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'FuncAddUser',
    data () {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.againPw !== '') {
            this.$refs.ruleForm.validateField('againPw');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入手机号'));
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          console.log(reg.test(value));
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      };
      return {
        ruleForm : {
          userName:'',
          password:'',
          againPw:'',
          email: '',
          phone: '',
        },
        rules : {
          userName: [{ required: true, message: '请输入3-8字符的用户名', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }],
          password: [{ required: true,validator: validatePass, trigger: 'blur' }],
          againPw: [{required: true, validator: validatePass2, trigger: 'blur' }],
          email:[{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type:'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
          phone:[{ required: true,validator:checkPhone, trigger: 'blur' }],
        },
      }
    },
    computed: {

    },
    methods: {
      submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.ruleForm.action = "add"
            console.log(this.ruleForm);
            this.$axios
              .post('/user', this.$qs.stringify(this.ruleForm), {headers: {'Content-Type': "application/x-www-form-urlencoded"}})
              .then(response => {
                withCredentials: true
                console.log(response.data)
                if (response.data.code == 200) {
                  this.$message({showClose: true, message: '添加用户成功！', type: 'success'});
                  return true;
                } else if(response.data.code == 207){
                  this.$message({showClose: true, message: '此邮箱已被注册！', type: 'error'});
                  return false;
                }
                else{
                  this.$message({showClose: true, message: '添加用户失败！', type: 'error'});
                  return false;
                }
              })
              .catch(error => {
                console.log(error)
              })
          }else{
            return false;
            console.log("false!!!!!");
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>
<style>
  .news{
    width: 80%;
  }
</style>
