<template>
<div class="student">
  <el-tabs v-model="activeName">
    <el-tab-pane label="信息新闻" name="first">
      <router-link to="/stuBasicInfo">
        <el-button type="text">基本资料</el-button>
      </router-link>
      <router-link to="/stuSchoolNews">
        <el-button type="text">学校新闻</el-button>
      </router-link>
    </el-tab-pane>
    <el-tab-pane label="班级操作" name="second">
      <router-link to="/stuSchedule">
        <el-button type="text">班级课表</el-button>
      </router-link>
      <router-link to="/stuDataResource">
        <el-button type="text">资源上传下载</el-button>
      </router-link>
      <router-link to="/stuClassMessage">
        <el-button type="text">班级消息</el-button>
      </router-link>
      <router-link to="/stuSendMessage">
        <el-button type="text">发送消息</el-button>
      </router-link>
    </el-tab-pane>
    <el-tab-pane label="学生操作" name="third">
      <router-link to="/stuOnlineSign">
        <el-button type="text">在线签到</el-button>
      </router-link>
      <router-link to="/stuRecordSign">
        <el-button type="text">个人签到情况</el-button>
      </router-link>
      <el-button type="text" @click="logout">登出</el-button>
    </el-tab-pane>
  </el-tabs>
  <router-view :detail="detail" :socket="socket" :teacher-data="teacherData" :institute-data="instituteData">
  </router-view>
</div>

</template>

<script type="text/ecmascript-6">
  import {getItem} from '../utils/api'
  import basicInfo from './student/BasicInfo'

  export default {
    data() {
      return {
        student: JSON.parse(localStorage.data),
        detail: {},
        teacherData: {},
        instituteData: {},
        activeIndex: '1-1',
        socket: '',
        activeName: 'first'
      }
    },
    created() {
      var _this = this
      this.websocket();
      getItem('/student/detail/'+_this.student).then(function (res) {
        var response = res.data;
        if (response.code === 0) {
          _this.detail = response.data;
          let classId = response.data.classId;
          _this.getTeacher(classId);
          _this.getInstitute(classId);
        } else {
          _this.$alert(response.msg);
        }
      }).catch(function() {
        _this.$alert("请求失败！");
      });
      _this.$router.push({path:'/stuBasicInfo'})
    },
    methods: {
      websocket() {
        let _this = this
        let ws = new WebSocket('ws://' + global.webSocketHost + "/webSocket/" + this.student);
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
        localStorage.clear();
        this.socket.close();
        this.$router.replace({path:'/'})
      },

      getTeacher(classId) {
        var _this = this;
        getItem('/teacher/information/'+_this.detail.classId).then(function (res) {
          var response = res.data;
          if (response.code == 0 ) {
            _this.teacherData = response.data;
          } else {
            _this.$alert(response.msg);
          }
        }).catch(function () {
          _this.$alert('请求失败！');
        });
      },
      getInstitute(classId) {
        var _this = this;
        getItem('/institute/detail/'+_this.detail.classId).then(function (res) {
          var response = res.data;
          if (response.code == 0) {
            _this.instituteData = response.data;
          } else {
            _this.$alert(response.msg);
          }
        }).catch(function () {
          _this.$alert('请求失败！');
        });
      }
    }
  }
</script>

<style>
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
