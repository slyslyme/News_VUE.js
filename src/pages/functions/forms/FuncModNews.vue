<template>
  <div>
    <el-card>
      <p>新闻维护</p>
    </el-card>
    <el-card style="margin-top: 20px;">
      <el-form :inline="true" :model="formInline" ref="formInline" :rules="rules" label-position="left" label-width="110px">
        <el-form-item label="新闻标题：" prop="title">
          <el-input v-model="formInline.title" placeholder="请输入新闻标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('formInline')">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top: 20px;">
      <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" header-align="center" sortable align="center">
        <el-table-column label="#" type="index" min-width="70" header-align="center" align="center"></el-table-column>
        <el-table-column prop="title" label="新闻标题" header-align="center" align="center"></el-table-column>
        <el-table-column prop="typename" label="新闻类别" header-align="center" align="center"></el-table-column>
        <el-table-column prop="author" label="作者" header-align="center" align="center"></el-table-column>
        <el-table-column prop="date" label="发布时间"header-align="center" sortable align="center"></el-table-column>
        <el-table-column v-if="hide()" prop="content" label="content"header-align="center" sortable align="center"></el-table-column>
        <el-table-column v-if="hide()" prop="isHead" label="head"header-align="center" sortable align="center"></el-table-column>
        <el-table-column v-if="hide()" prop="isImage" label="image"header-align="center" sortable align="center"></el-table-column>
        <el-table-column v-if="hide()" prop="isHot" label="hot"header-align="center" sortable align="center"></el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
      <el-dialog title="新闻修改" :visible.sync="dialogFormVisible">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-position="left" label-width="90px">
          <el-form-item label="新闻标题" prop="title">
            <el-input v-model="ruleForm.title" placeholder="请选择新闻标题"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input v-model="ruleForm.author" placeholder="请选择新闻作者"></el-input>
          </el-form-item>
          <el-form-item label="新闻类型" prop="typename">
            <el-select v-model="ruleForm.typename" placeholder="请选择新闻类型">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item  label="新闻头条" prop="type[0]">-->
            <!--<el-checkbox-group v-model="ruleForm.type">-->
              <!--<el-checkbox label="头条" name="type[0]" border></el-checkbox>-->
            <!--</el-checkbox-group>-->
          <!--</el-form-item>-->
          <!--<el-form-item  label="新闻热点" prop="type[1]">-->
            <!--<el-checkbox-group v-model="ruleForm.type">-->
              <!--<el-checkbox label="热点" name="type[1]" border></el-checkbox>-->
            <!--</el-checkbox-group>-->
          <!--</el-form-item>-->
          <el-form-item label="新闻内容" prop="content">
            <div class="edit_container">
              <quill-editor
                v-model="ruleForm.content"
                ref="myQuillEditor"
                style="height: 200px;"
                :options="editorOption">
              </quill-editor>
            </div>
          </el-form-item>
        </el-form>
        <br><br><br><br><br>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="modifyUser()">确 定</el-button>
        </div>

      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import {quillEditor} from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  export default {
    name: 'FuncFormBase',
    components: {
      quillEditor
    },
    data () {
      return {
        formInline: {
          title: ''
        },
        tableData: [],
        rules: {
          param1: [{required: true, message: '请输入', trigger: 'blur'}, {min: 3, max: 5, message: '长度在 3 到 15 个字符', trigger: 'blur'}]
        },
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0,
        dialogFormVisible: false,
        ruleForm : {
          title:'',
          content:'',
          author: '',
          typename: '',
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
          newsType: [{ required: true, message: '请选择新闻类型', trigger: 'blur' }],
          content: [{ required: true, message: '请输入新闻内容', trigger: 'blur' }]
        },
        newForm : {}
      }
    },

    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      },
    },

    mounted() {
      this.allSearch();
      this.findType();
      console.log("11111")
    },

    methods: {
      /* 隐藏多余列 */
      hide(){},
      /* 初始化数据 */
      allSearch() {
        var data = []
        this.$axios
          .post('/news')
          .then(response => {
            console.log(response.data)
            if (response.data.code == 202) {
              this.$message({showClose: true, message: '新闻加载失败！', type: 'error'});
              return false;
            }
            else {
              withCredentials: true
              for (let i = 0; i < response.data.data.length; i++) {
                var obj = {}
                obj.title = response.data.data[i].title
                obj.typename = response.data.data[i].typename
                obj.date = response.data.data[i].date
                obj.author = response.data.data[i].author
                obj.isHead = response.data.data[i].isHead
                obj.isHot = response.data.data[i].isHot
                obj.content = response.data.data[i].content
                data[i] = obj
              }
              this.tableData = data
              if (response.data.data.length > 0) {
                this.pageTotal = response.data.data.length;
              }
              else {
                this.pageTotal = 0;
              }
            }
          })
          .catch(error => {
            console.log(error)
          })

      },

      /* 加载查询数据 */
      onSubmit(formInline) {
        this.tableData = []
        this.formInline["action"] = "select"
        this.$refs.formInline.validate((valid) => {
          if (valid) {
            var data = []
            this.$axios
              .post('/news', this.$qs.stringify(this.formInline), {headers: {'Content-Type': "application/x-www-form-urlencoded"}})
              .then(response => {
                if (response.data.code == 202) {
                  this.$message({showClose: true, message: '没有该新闻下的评论！', type: 'error'});
                  return false;
                }
                else {
                  withCredentials: true
                  for (let i = 0; i < response.data.data.length; i++) {
                    var obj = {}
                    obj.title = response.data.data[i].title
                    obj.typename = response.data.data[i].typename
                    obj.date = response.data.data[i].date
                    obj.author = response.data.data[i].author
                    data[i] = obj
                  }
                  this.tableData = data
                  if (response.data.data.length > 0) {
                    this.pageTotal = response.data.data.length;
                  }
                  else {
                    this.pageTotal = 0;
                  }
                }
              })
              .catch(error => {
                console.log(error)
              })
          }else{
            return false;
          }
        })
      },

      handleEdit (index, row) {
        this.ruleForm.index = index + (this.currentPage - 1) * this.pageSize
        this.ruleForm.title = row.title
        this.ruleForm.date = row.date
        this.ruleForm.typename = row.typename
        this.ruleForm.author = row.author
        this.ruleForm.content = row.content
        if(row.isHead == 1){
          this.ruleForm.type[0] = "头条"
        }
        if(row.isHot == 1) {
          this.ruleForm.type[1] = "热点"
        }
        this.dialogFormVisible = true
        this.newForm.old = row.title
      },

      handleDelete (index, row) {
        this.$confirm(
          "是否删除此条新闻？",
          "确定删除",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            var title = row.title
            var typename = row.typename;
            var author = row.author;
            var date = row.date;
            var dform  ={}
            dform["action"] = "delete"
            dform.title = title
            dform.typename = typename
            dform.author = author
            dform.date = date
            this.$axios
              .post('/news', this.$qs.stringify(dform), {headers: {'Content-Type': "application/x-www-form-urlencoded"}})
              .then(response => {
                if(response.data.code == 200) {
                  this.tableData.splice(index + (this.currentPage - 1) * this.pageSize, 1)
                  this.$message({
                    type :"success",
                    message:"删除成功！"
                  })
                  this.allSearch()
                }
                else if(response.data.code == 202){
                  this.$message({type :"erroe", message:"删除失败！"})
                }
              })
              .catch(error => {
                console.log("nono")
                console.log(error)
              })
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },


      handleSizeChange (size) {
        this.pagesize = size
      },
      handleCurrentChange (currentPage) {
        this.currentPage = currentPage
      },

      /* 初始化查询新闻类别 */
      findType() {
        var form = {}
        form.action = "type"
        this.$axios
          .post('/news', this.$qs.stringify(form), {headers: {'Content-Type': "application/x-www-form-urlencoded"}})
          .then(response => {
            console.log(response.data.code)
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
      },
      modifyUser () {
        this.tableData[this.ruleForm.index].title = this.ruleForm.title
        this.tableData[this.ruleForm.index].date = this.ruleForm.date
        this.tableData[this.ruleForm.index].typename = this.ruleForm.typename
        this.tableData[this.ruleForm.index].author = this.ruleForm.author
        this.tableData[this.ruleForm.index].content = this.ruleForm.content
        this.tableData[this.ruleForm.index].isHead = this.ruleForm.type[0]
        this.tableData[this.ruleForm.index].isHot = this.ruleForm.type[1]
        this.newForm.title = this.ruleForm.title
        this.newForm.date = this.ruleForm.date
        this.newForm.typename = this.ruleForm.typename
        this.newForm.author = this.ruleForm.author
        this.newForm.content = this.ruleForm.content
        if(this.ruleForm.type[0]=="热点"){
          this.newForm.isHead = 1
        }

        this.newForm.isHot = this.ruleForm.type[1]
        this.newForm.action = "update"
        this.dialogFormVisible = false
        console.log(JSON.stringify(this.newForm))
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.$axios
              .post('/news', this.$qs.stringify(this.newForm), {headers: {'Content-Type': "application/x-www-form-urlencoded"}})
              .then(response => {
                withCredentials: true
                if(response.data.code == 200){
                  this.$message({message: '修改《' + this.ruleForm.title + '》成功！', type: 'success'})
                  return true;
                } else{
                  this.$message({showClose: true, message: '修改《' + this.ruleForm.title + '》失败！', type: 'error'});
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
