<template>
  <div>
    <el-card>
      <p>用户管理</p>
    </el-card>
    <el-card style="margin-top: 20px;">
      <el-form :inline="true" :model="formInline" ref="formInline" :rules="formInline1" label-position="left" label-width="90px">
        <el-form-item label="查找用户" prop="username">
          <el-input v-model="formInline.username" placeholder="请输入用户名"></el-input>
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
        <el-table-column prop="email" label="邮箱" header-align="center" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" header-align="center" align="center"></el-table-column>
        <el-table-column label="操作" header-align="center" align="center">
          <template slot-scope="scope">
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
    </el-card>
  </div>
</template>

<script>


  export default {
    name: 'FuncModUser',
    data () {
      return {
        formInline: {
          username : '',
        },
        tableData: [],
        formInline1: {
          param1: [
            {required: true, message: '请输入3-8字符的用户名', trigger: 'blur'},
            {min: 3, max: 8, message: '长度为3-8个字符', trigger: 'blur'}
          ]
        },
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0,
        dialogFormVisible: false,
      }
    },

    mounted() {
      this.allSearch()
    },
    methods: {
      allSearch() {
        var data = []
        this.$axios
          .post('/user')
          .then(response => {
            console.log(response.data.data.length)
            if (response.data.code == 201 || response.data.code == 202 || response.data.code == 204) {
              this.$message({showClose: true, message: '页面加载失败！', type: 'error'});
              return false;
            }
            else{
              withCredentials: true
              for (let i = 0; i < response.data.data.length; i++) {
                var obj = {}
                obj.username = response.data.data[i].username
                obj.phone = response.data.data[i].phone
                obj.email = response.data.data[i].email
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

      /* 提交查询数据 */
      onSubmit(formInline) {
        this.tableData = []
        this.formInline["action"] = "select"
        this.$refs.formInline.validate((valid) => {
          if (valid) {
            var data = []
            this.$axios
              .post('/user', this.$qs.stringify(this.formInline), {headers: {'Content-Type': "application/x-www-form-urlencoded"}})
              .then(response => {
                if (response.data.code == 202) {
                  this.$message({showClose: true, message: '用户加载失败！', type: 'error'});
                  return false;
                }
                else {
                  withCredentials: true
                  for (let i = 0; i < response.data.data.length; i++) {
                    var obj = {}
                    obj.username = response.data.data[i].username
                    obj.email = response.data.data[i].email
                    obj.phone = response.data.data[i].phone
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
        this.form.index = index + (this.currentPage - 1) * this.pageSize
        this.form.name = row.name
        this.form.date = row.date
        this.form.address = row.address
        this.dialogFormVisible = true
      },

      /* 删除用户 */
      handleDelete (index, row) {
        this.$confirm(
          "是否删除此用户？",
          "确定删除",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            var username = row.username
            var email = row.email
            var phone = row.phone
            var dform  ={}
            dform["action"] = "delete"
            dform.username = username
            dform.email = email
            dform.phone = phone
            this.$axios
              .post('/user', this.$qs.stringify(dform), {headers: {'Content-Type': "application/x-www-form-urlencoded"}})
              .then(response => {
                if(response.data.code == 200) {
                  this.tableData.splice(index + (this.currentPage - 1) * this.pageSize, 1)
                  this.$message({
                    type :"success",
                    message:"删除成功！"
                  })
                  this.allSearch()
                }
                else{
                  this.$message({
                    type :"erroe",
                    message:"删除失败！"
                  })
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

    }
  }
</script>

<style scoped>

</style>
