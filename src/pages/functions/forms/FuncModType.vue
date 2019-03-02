<template>
  <div>
    <el-card>
      <p>新闻类别维护</p>
    </el-card>
    <el-card style="margin-top: 20px;">
      <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)" header-align="center" sortable  align="center">
        <el-table-column label="#" type="index" min-width="70" header-align="center"></el-table-column>
        <el-table-column prop="typename" label="新闻类别" header-align="center"  align="center"></el-table-column>
        <el-table-column label="操作" header-align="center"  align="center">
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
      <el-dialog title="新闻类别修改" :visible.sync="dialogFormVisible">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-position="left" label-width="90px">
          <el-form-item label="新闻类别" prop="typeName">
            <el-input v-model="ruleForm.typename" placeholder="请输入新闻类别"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="modifyUser()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'FuncModType',
    data () {
      return {
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0,
        dialogFormVisible: false,
        ruleForm : {
          typename: '',
        },
        rules : {
          typename: [{ required: true, message: '请输入4字新闻类别', trigger: 'blur' },
            {min: 4, max: 4, message: '长度为4个字符', trigger: 'blur'}],
        },
        newForm : {}
      }
    },
    mounted() {
      this.allSearch();
    },
    methods: {

      /* 加载全部数据 */
      allSearch() {
        var data = []
        this.$axios
          .post('/newType')
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
                obj.typename = response.data.data[i].typename
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


      /* 操作--打开修改对话框 */
      handleEdit (index, row) {
        console.log("xxxxx  " +index + "   " + JSON.stringify(row))
        this.ruleForm.index = index + (this.currentPage - 1) * this.pageSize
        this.ruleForm.typename = row.typename
        this.newForm.old = row.typename
        this.dialogFormVisible = true
      },

      modifyUser () {
        this.tableData[this.ruleForm.index].typename = this.ruleForm.typename
        this.newForm.typename = this.ruleForm.typename
        this.newForm.action = "update"
        this.dialogFormVisible = false
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.$axios
              .post('/newType', this.$qs.stringify(this.newForm), {headers: {'Content-Type': "application/x-www-form-urlencoded"}})
              .then(response => {
                withCredentials: true
                if(response.data.code == 200){
                  this.$message({message: '修改《' + this.ruleForm.typename + '》成功！', type: 'success'})
                  return true;
                } else{
                  this.$message({showClose: true, message: '修改《' + this.ruleForm.typename + '》失败！', type: 'error'});
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

      /* 操作--删除 */
      handleDelete (index, row) {
        this.$confirm(
          "是否删除此类别？",
          "确定删除",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            var title = row.typename
            var dform  ={}
            dform["action"] = "delete"
            dform.typename = title
            this.$axios
              .post('/newType', this.$qs.stringify(dform), {headers: {'Content-Type': "application/x-www-form-urlencoded"}})
              .then(response => {
                if(response.data.code == 200) {
                  this.tableData.splice(index + (this.currentPage - 1) * this.pageSize, 1)
                  this.$message({
                    type :"success",
                    message:"删除成功！"
                  })
                }else if(response.data.code == 202){
                  this.$message({
                    type :"error",
                    message:"该类别下有新闻，无法删除！"
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

      /* 分页 */
      handleSizeChange (size) {
        this.pagesize = size
      },

      /* 分页 */
      handleCurrentChange (currentPage) {
        this.currentPage = currentPage
      },

    }
  }
</script>

<style scoped>

</style>
