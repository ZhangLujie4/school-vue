<template>
  <div class="classMessage">
    <div class="switch">
      <el-switch
        style="display: block"
        v-model="switchValue"
        active-color="#13ce66"
        inactive-color="#ff4949"
        active-text="收件箱"
        inactive-text="已发送"
        @change="switchChange"
      >
      </el-switch>
    </div>
    <div v-show="receiveFlag">
      <el-collapse v-model="activeName1" accordion>
        <div  v-for="(receive, index) in receiveList">
          <el-collapse-item :title="receive.title" :name="index">
            <div>{{ receive.message }}</div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </div>
    <div v-show="sendFlag">
      <el-collapse v-model="activeName2" accordion>
        <div v-for="(send, index) in sendList">
          <el-collapse-item :title="send.title" :name="index">
            <div>{{ send.message }}</div>
          </el-collapse-item>
        </div>
      </el-collapse>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getItem} from '../../utils/api'

  export default {
    props: {
      detail: {
        type: Object
      }
    },
    data() {
      return {
        switchValue: true,
        receiveList: [],
        sendList: [],
        activeName1: 0,
        activeName2: 0,
        sendFlag: false,
        receiveFlag: true
      }
    },
    methods: {
      switchChange(data) {
        this.sendFlag = !this.sendFlag;
        this.receiveFlag = !this.receiveFlag;
      },
      getFormatTime(date) {
        let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        let minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        let createTime = date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute;
        return createTime;
      }
    },
    created() {
      let _this = this;
      getItem('/message/receive?receiver='+_this.detail.id+'&classId='+_this.detail.classId).then(function (res) {
        let response = res.data;
        if (response.code == 0) {
          _this.receiveList = response.data;
          _this.receiveList.forEach(function (item) {
            let date = new Date(item.createTime);
            item.createTime = _this.getFormatTime(date);
            item.title = 'From ' + item.senderName + ' ' + item.createTime;
            return item;
          });
        }
      }).catch(function () {
        _this.$message.error('请求失败！');
      });
      getItem('/message/send?sender='+_this.detail.id).then(function (res) {
        let response = res.data;
        if (response.code == 0) {
          _this.sendList = response.data;
          _this.sendList.forEach(function (item) {
            let date = new Date(item.createTime);
            item.createTime = _this.getFormatTime(date);
            item.title = 'To ' + item.receiverName + ' ' + item.createTime;
            return item;
          });
        }
      }).catch(function () {
        _this.$message.error('请求失败！');
      });
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">
  .classMessage
    .switch
      text-align: right
      margin-bottom: 20px
</style>
