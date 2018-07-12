<template>
  <div class="teacher">
    <el-tabs v-model="activeName">
      <el-tab-pane label="信息新闻" name="first">
        <router-link to="/teaBasicInfo">
          <el-button type="text">基本资料</el-button>
        </router-link>
        <router-link to="/teaSchoolNews">
          <el-button type="text">学校新闻</el-button>
        </router-link>
      </el-tab-pane>
      <el-tab-pane label="班级操作" name="second">
        <router-link to="/teaSchedule">
          <el-button type="text">教师课表</el-button>
        </router-link>
        <router-link to="/teaDataResource">
          <el-button type="text">资源上传下载</el-button>
        </router-link>
        <router-link to="/teaClassMessage">
          <el-button type="text">班级消息</el-button>
        </router-link>
        <router-link to="/teaSendMessage">
          <el-button type="text">发送消息</el-button>
        </router-link>
      </el-tab-pane>
      <el-tab-pane label="教师操作" name="third">
        <router-link to="/teaSignIn">
          <el-button type="text">学生签到</el-button>
        </router-link>
        <router-link to="/teaCallSign">
          <el-button type="text">教师点到</el-button>
        </router-link>
        <router-link to="/teaRecordSign">
          <el-button type="text">签到汇总</el-button>
        </router-link>
        <el-button type="text" @click="logout">登出</el-button>
      </el-tab-pane>
    </el-tabs>
    <router-view :detail="detail" :socket="socket" :institute-data="instituteData">
    </router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getItem,deleteItem} from '../utils/api'

  export default {
    data() {
      return {
        teacher: JSON.parse(localStorage.data),
        detail: {},
        instituteData: {},
        activeName: 'first'
      }
    },
    created() {
      var _this = this
      this.websocket();
      getItem('/teacher/detail/'+_this.teacher).then(function (res) {
        var response = res.data;
        if (response.code === 0) {
          _this.detail = response.data;
          let instituteId = response.data.institute;
          _this.getInstitute(instituteId);
        } else {
          _this.$alert(response.msg);
        }
      }).catch(function() {
        _this.$alert("请求失败！");
      });
      _this.$router.push({path:'/teaBasicInfo'})
    },
    methods: {
      websocket() {
        let _this = this
        let ws = new WebSocket('ws://' + global.webSocketHost + "/webSocket/" + this.teacher);
        this.socket = ws;
        ws.onopen = function (event) {
          console.info('建立连接');
        }
        ws.onclose = function (event) {
          console.info('连接关闭');
        }
        ws.onmessage = function (event) {
          _this.$notify.success({
            title: '新消息',
            message: event.data
          });
        }
        ws.onerror = function () {
          _this.$notify.error({
            title: 'Error',
            message: 'websocket通信发生错误！'
          });
        }
        ws.onbeforeunload = function () {
          ws.close();
        }
      },
      logout() {
        if (localStorage.getItem('value1') != null) {
          var _this = this;
          var value1 = localStorage.getItem('value1');
          deleteItem('/signIn/delete/' + value1).then(function (res) {
            let response = res.data;
            if (response.code === 0) {
              _this.$message({
                message: '在线签到关闭成功，时间停止',
                type: 'success'
              });
            } else {
              _this.$message.error('在线签到关闭失败');
            }
          }).catch(function () {
            _this.$message.error('请求失败！');
          });
          let dateStr = _this.getDateStr();
//          postRequest('/signIn/outline', {
//            lessonId: value1,
//            signDate: dateStr
//          }).then(function (res) {
//            let response = res.data;
//            if (response.code != 0) {
//              _this.$message.error(response.msg);
//            }
//          }).catch(function () {
//            _this.$message.error('请求时便！');
//          });
        }
        localStorage.clear();
        this.socket.close();
        this.$router.replace({path: '/'})
      },
      getInstitute(instituteId) {
        var _this = this;
        getItem('/institute/instruction/'+instituteId).then(function (res) {
          var response = res.data;
          if (response.code == 0) {
            _this.instituteData = response.data;
          } else {
            _this.$alert(response.msg);
          }
        }).catch(function () {
          _this.$alert('请求失败！');
        });
      },
      getDateStr() {
        let date = new Date();
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let dateStr = date.getFullYear() + '-' + month + '-' + day;
        return dateStr;
      }
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">
  .el-tabs__header {
    margin: 0
  }

  .el-button--text {
    margin-right: 32px;
  }

  .right {
    display: inline-block;
    width: 50%;
  }

  .left {
    width: 50%;
  }

  .text {
    font-size: 14px;
  }

  .item {
    display: flex;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
  }
</style>
