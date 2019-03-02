<template>
  <div>
    <el-card>
      <p>评论管理</p>
    </el-card>
    <el-card style="margin-top: 20px;">
      <el-form :inline="true" :model="formInline" ref="formInline" :rules="formInline1" label-position="left" label-width="90px">
        <el-form-item label="新闻标题" prop="title">
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
        <el-table-column prop="username" label="用户名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="content" label="评论内容" header-align="center" align="center"></el-table-column>
        <el-table-column prop="newsId" label="新闻标题" header-align="center" align="center"></el-table-column>
        <el-table-column prop="date" label="评论时间" header-align="center" align="center"></el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope" align="center">
            <el-button
              align="center"
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
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'FuncComment',
    data () {
      return {
        formInline: {
          title: '',
        },
        tableData: [],
        formInline1: {
          title: [{required: true, message: '请输入3-20字符的新闻标题', trigger: 'blur'},
            {min: 3, max: 8, message: '长度为3-20个字符', trigger: 'blur'}]
        },
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0,
        dialogFormVisible: false,
      }
    },
    // mounted() {
    //   var formall = {};
    //   this.allSearch(formall);
    // },

    methods: {
      /* 加载全部数据 */
      allSearch() {
        var data = []
        formall.action = "queryall"
        this.$axios
          .post('/newType', this.$qs.stringify(this.formall), {headers: {'Content-Type': "application/x-www-form-urlencoded"}})
          .then(response => {
            if (response.data.code == 201 || response.data.code == 202 || response.data.code == 204) {
              this.$message({showClose: true, message: '页面加载失败！', type: 'error'});
              return false;
            }
            else{
              withCredentials: true
              for (let i = 0; i < response.data.length; i++) {
                var obj = {}
                obj.typeName = response.data[i].typeName
                data[i] = obj
              }
              this.tableData = data
              if (response.data.length > 0) {
                this.pageTotal = response.data.length;
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
            this.tableData = []
            var newData = []
            this.$axios
              .post('/comment', this.$qs.stringify(this.formInline), {headers: {'Content-Type': "application/x-www-form-urlencoded"}})
              .then(response => {
                if (response.data.code == 202) {
                  this.$message({showClose: true, message: '没有该新闻下的评论！', type: 'error'});
                  return false;
                }
                else {
                  withCredentials: true
                  console.log(response.data.data.length);
                  for (let i = 0; i < response.data.data.length; i++) {
                    var obj = {}
                    obj.username = response.data.data[i].userName
                    obj.newsId = response.data.data[i].newsId
                    obj.content = response.data.data[i].content
                    obj.date = response.data.data[i].date
                    data[i] = obj
                  }
                  this.tableData = data
                  console.log(this.tableData)
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

      handleDelete (index, row) {
        this.$confirm(
          "删除这条消息后将不再显示。",
          "确定删除",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            var newsId = row.newsId
            var username = row.username;
            var content = row.content;
            var date = row.date;
            var dform  ={}
            dform["action"] = "delete"
            dform.newsId = newsId
            dform.userName = username
            dform.content = content
            dform.date = date
            this.$axios
              .post('/comment', this.$qs.stringify(dform), {headers: {'Content-Type': "application/x-www-form-urlencoded"}})
              .then(response => {
                if(response.data.code == 200) {
                  // this.row.splice(index, 1); //前端可以看到删除
                  this.tableData.splice(index + (this.currentPage - 1) * this.pageSize, 1)
                  this.$message({
                    type :"success",
                    message:"删除成功！"
                  })
                }
              })
              .catch(error => {
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
      // modifyUser () {
      //   this.tableData[this.form.index].name = this.form.name
      //   this.tableData[this.form.index].date = this.form.date
      //   this.tableData[this.form.index].address = this.form.address
      //   this.dialogFormVisible = false
      //   this.$message({
      //     message: '修改' + this.form.name + '成功！',
      //     type: 'success'
      //   })
      // }
    }
  }
</script>

<style scoped>

</style>
