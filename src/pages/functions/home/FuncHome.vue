<template>
  <div class="m-home">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="m-box-card" shadow="hover">
          <div class="m-icon">
            <i class="fa fa-tasks" style="color: #F56C6C;"></i>
          </div>
          <div class="m-content">
            <p>新闻类别</p>
            <p class="m-count">{{this.newsType}}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="m-box-card" shadow="hover">
          <div class="m-icon">
            <i class="fa fa-envelope-o fa-fw" style="color: #E6A23C;"></i>
          </div>
          <div class="m-content">
            <p>新闻总数</p>
            <p class="m-count">{{this.news}}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="m-box-card" shadow="hover">
          <div class="m-icon">
            <i class="fa fa-file-code-o" style="color: #67C23A;"></i>
          </div>
          <div class="m-content">
            <p>新闻点击</p>
            <p class="m-count">{{this.click}}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="m-box-card" shadow="hover">
          <div class="m-icon">
            <i class="fa fa-snowflake-o" style="color: #409EFF;"></i>
          </div>
          <div class="m-content">
            <p>系统用户</p>
            <p>{{ this.user}}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="24" :lg="18">
        <el-card >
          <div id="myChart" class="echart"></div>
        </el-card>
      </el-col>
      <el-col :sm="24" :lg="6">
        <el-row :gutter="20" align>
          <el-col :sm="12" :lg="24">
          </el-col>
          <el-col :sm="12" :lg="24">
            <el-card class="m-box-card" shadow="hover">
              <div style="height: 440px; margin: -20px;background-color: rgb(247, 151, 214);color:#ffffff;">
                <vue-scroll>
                  <div style="padding: 20px;">
                    <p style="font-weight: bold;text-align: center">BestNews管理平台</p>
                    <br>
                    <p>~(˘▾˘~)~(˘▾˘~)</p>
                    <br>
                    <p>
                      欢迎使用我们的BestNews新闻平台！要要切克闹！
                    </p>
                    <br>
                    <p>
                      本新闻平台采用了时下最流行的框架，各种容错，使用感UP UP UP!!!!
                    </p>
                    <br>
                    <p>
                      本系统永久免费，最近更新于2019/01/16
                    </p>
                  </div>
                </vue-scroll>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import VeLine from 'v-charts/lib/line.common'
import VeScatter from 'v-charts/lib/scatter.common'

export default {
  name: 'FuncHome',
  components: {
    VeLine,
    VeScatter
  },
  data () {
    return {
      user: {
        name: '林锦泽',
        loginTime: '2018-01-05 12:00:00',
        loginIp: '172.28.12.34',
        lastTime: '2018-01-01 12:00:00',
        lastIp: '172.28.12.34'
      },
      newsType:'',
      news:'',
      click:'',
      user:'',
      data:[],
      type:[]
    }
  },
  mounted() {
    this.searchHead()
    this.drawLine()
  },
  methods: {
    drawLine() {
      var form={}
      form.action = "mainRight"
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      this.$axios
        .post('/mainIndex',this.$qs.stringify(form), {headers: {'Content-Type': "application/x-www-form-urlencoded"}})
        .then(response => {
          if (response.data.code == 202) {
            this.$message({showClose: true, message: '饼图数据加载失败！', type: 'error'});
            return false
          }
          else {
            withCredentials: true
            this.data = []
            this.data = response.data.data
            console.log("data--"+JSON.stringify(this.data))
            this.type = []
            for(let i = 0; i < response.data.data.length; i++){
              this.type[i] = response.data.data[i].name
            }
            console.log("type--"+this.type)
            myChart.setOption({
              title : {
                text: '新闻比例图',
                subtext: 'BestNews',
                x:'center'
              },
              tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                x : 'center',
                y : 'bottom',
                data: this.type,
              },
              toolbox: {
                show : true,
                feature : {
                  mark : {show: true},
                  dataView : {show: true, readOnly: false},
                  magicType : {
                    show: true,
                    type: ['pie', 'funnel']
                  },
                  restore : {show: true},
                  saveAsImage : {show: true}
                }
              },
              calculable : true,
              series : [
                {
                  name:'半径模式',
                  type:'pie',
                  radius : [20, 110],
                  center : ['50%', '50%'],
                  roseType : 'radius',
                  label: {
                    normal: {
                      show: false
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  lableLine: {
                    normal: {
                      show: false
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  data:this.data,
                }
              ]
            });
          }
        })
        .catch(error => {
          console.log(error)
        })

    },

    searchHead(){
      var form = {}
      form["action"] = "mainHead"
          this.$axios
            .post('/mainIndex',this.$qs.stringify(form), {headers: {'Content-Type': "application/x-www-form-urlencoded"}})
            .then(response => {
              if (response.data.code == 202) {
                this.$message({showClose: true, message: '头部数据加载失败！', type: 'error'});
                return false;
              }
              else if(response.data.code == 200){
                withCredentials: true
                console.log(response.data);
                this.newsType=response.data.data[0].newsType
                this.news=response.data.data[1].news
                this.click=response.data.data[2].click
                this.user=response.data.data[3].user
                return true
              }
              else{
                this.$message({showClose: true, message: '头部数据加载失败！', type: 'error'});
                return false
              }
            })
            .catch(error => {
              console.log(error)
            })
        }

    },
}
</script>

<style scoped lang="scss">
.m-home {
  .m-box-card {
    margin-bottom: 10px;
    color: #666666;
    .m-icon {
      float: left;
      width: 60px;
      i {
        font-size: 40px;
      }
    }
    .m-content {
      margin-left: 60px;
      .m-count {
        font-size: 20px;
      }
    }
  }
  .m-task-box {
    margin-bottom: 20px;
    .m-task-text {
      float: left;
      line-height: 16px;
    }
    .m-task-pro {
      margin-left: 60px;
    }
  }
}

</style>
<style>
  .echart{
    width: 500px;
    height: 400px;
    margin: auto ;
  }
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
