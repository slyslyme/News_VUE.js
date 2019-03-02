<template>
  <div>
    <el-card>
      <p>新闻类别添加</p>
    </el-card>
    <br/>
    <el-card style="height: auto;">
      <div class="news">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-position="left" label-width="90px">
          <el-form-item label="新闻类别" prop="typename">
            <el-input v-model="ruleForm.typename" placeholder="请输入新闻类别"></el-input>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" v-model="ruleForm" @click="submitForm('ruleForm')">添加类别</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'FuncAddType',
    data () {
      return {
        ruleForm : {
          typename: '',
        },
        rules : {
          typeName: [{ required: true, message: '请输入4字类别名称', trigger: 'blur' },
            { min: 4, max: 4, message: '请输入4个字符', trigger: 'blur' }],
        }
      }
    },
    computed: {

    },
    methods: {
      submitForm(formName) {
        this.ruleForm.action="add"
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.ruleForm);
            this.$axios
              .post('/newType', this.$qs.stringify(this.ruleForm), {headers: {'Content-Type': "application/x-www-form-urlencoded"}})
              .then(response => {
                withCredentials: true
                console.log(response.data)
                if(response.data.code == 200){
                  this.$message({showClose: true, message: '添加类别成功！', type: 'success'});
                  return true;
                } else if(response.data.code == 207){
                  this.$message({showClose: true, message: '该类别已存在！', type: 'error'});
                  return false;
                }else{
                  this.$message({showClose: true, message: '添加类别失败！', type: 'error'});
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

</style>
<style>
  .news{
    width: 80%;
  }
</style>
