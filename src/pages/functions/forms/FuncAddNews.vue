<template>
  <div>
    <el-card>
      <p>添加新闻</p>
    </el-card>
    <br/>
    <el-card style="height: auto;">
      <div class="news">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-position="left" label-width="90px">
        <el-form-item label="新闻标题" prop="title">
          <el-input v-model="ruleForm.title" placeholder="请选择新闻标题"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="ruleForm.author" placeholder="请选择新闻作者"></el-input>
        </el-form-item>
        <el-form-item label="新闻类型" prop="typeName">
          <el-select v-model="ruleForm.typeName" placeholder="请选择新闻类型">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="新闻头条" prop="type[0]">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox label="头条" name="type[0]" border></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item  label="新闻热点" prop="type[1]">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox label="热点" name="type[1]" border></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="新闻内容" prop="content">
          <div class="edit_container">
            <quill-editor
              v-model="ruleForm.content"
              ref="myQuillEditor"
              style="height: 400px;"
              :options="editorOption">
            </quill-editor>
          </div>
        </el-form-item>
        <el-form-item style="margin-top: 120px">
          <el-button type="primary" v-model="ruleForm" @click="submitForm">添加新闻</el-button>
        </el-form-item>
      </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import {quillEditor} from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'FuncFormsEdit',
  components: {
    quillEditor
  },
  data () {
    return {
      ruleForm : {
        title:'',
        content:'',
        author: '',
        typeName: '',
        type: [],
      },
      editorOption: {
        placeholder: '请输入新闻内容...',
      },
      options: [],
      rules : {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }],
        author: [{ required: true, message: '请输入作者', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }],
        typeName: [{ required: true, message: '请选择新闻类型', trigger: 'blur' }],
        content: [{ required: true, message: '请输入新闻内容', trigger: 'blur' }]
      }
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    },
  },
  mounted() {
    this.findType();
  },
  methods: {
    /* 添加新闻 */
    submitForm(formName) {
      this.ruleForm.action = "add"
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
          this.$axios
            .post('/news', this.$qs.stringify(this.ruleForm), {headers: {'Content-Type': "application/x-www-form-urlencoded"}})
            .then(response => {
              withCredentials: true
              console.log(response.data)
              console.log(this.$qs.stringify(this.ruleForm) + "22222")
              if (response.data.code == 200) {
                this.$message({showClose: true, message: '添加新闻成功！', type: 'success'});
                return true;
              } else  if (response.data.code == 207){
                this.$message({showClose: true, message: '该标题已被占用！', type: 'error'});
                return false;
              }
              else {
                this.$message({showClose: true, message: '添加失败！', type: 'error'});
                return false;
              }
            })
            .catch(error => {
              console.log(error)
            })
        }else {
          return false;
        }
      })
    },

    /* 初始化查询新闻类别 */
    findType() {
      var form = {}
      form.action = "type"
      this.$axios
        .post('/news', this.$qs.stringify(form), {headers: {'Content-Type': "application/x-www-form-urlencoded"}})
        .then(response => {
          if (response.data.code == 200) {
            withCredentials: true
            this.options = response.data.data
            return true
          }
          else{
            this.$message({showClose: true, message: '初始化类别失败！', type: 'error'});
            return false;
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
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
