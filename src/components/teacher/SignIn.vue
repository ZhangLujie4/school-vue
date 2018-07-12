<template>
  <div class="sign-in" v-loading="loading">
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="70px">
      <el-form-item label="课程" prop="classId">
        <el-select v-model="form.classId" :disabled="isDisabled" clearable placeholder="请选择">
          <el-option
            v-for="item in teaList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            <span style="float: left">{{ item.label }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="距离" prop="distance">
        <el-input v-model="form.distance" placeholder="请输入距离（整数）"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="selectItem('form')" plain>开始点到</el-button>
      </el-form-item>
    </el-form>
  </div>
    <div v-show="start">
  <div>
    <el-row :gutter="20">
      <el-col :span="8"><div class="timer">开始时间</div></el-col>
      <el-col :span="8"><div class="timer">{{ startTime }}</div></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8"><div class="timer">结束时间</div></el-col>
      <el-col :span="8"><div class="timer">{{ endTime }}</div></el-col>
    </el-row>
  </div>
  <div class="stop-timer">
    <el-button type="primary" @click="stopTimer" plain>结束点到</el-button>
  </div>
  <div>
    <el-row :gutter="20">
      <el-col :span="8"><div class="timer">应到</div></el-col>
      <el-col :span="8"><div class="timer">{{ allAmount }}人</div></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="8"><div class="timer">实到</div></el-col>
      <el-col :span="8"><div class="timer">{{ nowAmount }}人</div></el-col>
    </el-row>
  </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getItem, postRequest, deleteItem} from '../../utils/api'
  import BMap from 'BMap'
  import {isMobile} from '../../utils/utils'

  export default {
    props: {
      detail: {
        type: Object
      },
      socket: {
        type: WebSocket
      }
    },
    data() {
      return {
        teaList: [],
        form: {
          classId: '',
          distance: ''
        },
        rules: {
          classId: [
            {required: true, message: '课程不能为空',trigger: 'blur'}
          ],
          distance: [
            {required: true, message: '距离不能为空', trigger: 'blur'}
          ]
        },
        startTime: '',
        endTime: '',
        timer: '',
        isDisabled: false,
        allAmount: 0,
        nowAmount: 0,
        start: false,
        point: {lon: 116.331398, lat: 39.897445},
        loading: false
      }
    },
    methods: {
      selectItem(formName) {
        var _this = this;
        this.loading = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.isDisabled = true;
            this.start = true;
            this.getAmount();
//            if (!isMobile()) {
//              navigator.geolocation.getCurrentPosition(function (position) {
//                _this.$alert(position.coords.longitude, position.coords.latitude);
//                _this.point.lon = position.coords.longitude;
//                _this.point.lat = position.coords.latitude;
//                console.info(position.coords.longitude, position.coords.latitude);
//                console.info(_this.point.lon, _this.point.lat);
//                _this.startOnlineSign();
//              }), function (error) {
//                _this.loading = false;
//                console.info('Error occurred. Error code: '+error.code);
//              }
//            }
//            else {
              var geolocation = new BMap.Geolocation();
              geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                  _this.point.lon = r.point.lng;
                  _this.point.lat = r.point.lat;
                  _this.startOnlineSign();
                } else {
                  _this.$message.error('无法定位当前位置！');
                }
              }, {enableHighAccuracy: true})
//            }

            _this.updateNowAmount(_this.form.classId, _this.getDateStr());

            this.startTime = _this.getCurrentTime();
            localStorage.setItem('startTime', _this.startTime);
            localStorage.setItem('classId', _this.form.classId);
            localStorage.setItem('distance', _this.form.distance);
            this.timer = setInterval(function () {
              _this.endTime = _this.getCurrentTime();
            }, 1000)
            console.info(_this.form.classId);
          } else {
            return false;
          }
        });
      },
      getCurrentTime() {
        let time = new Date();
        let hour = time.getHours() > 9 ? time.getHours() : '0'+time.getHours();
        let minute = time.getMinutes() > 9 ? time.getMinutes() : '0'+time.getMinutes();
        let second = time.getSeconds() > 9 ? time.getSeconds() : '0'+time.getSeconds();
        let startTime = time.toLocaleDateString()+' '+hour+':'+minute+':'+second;
        return startTime;
      },
      stopTimer() {
        var _this = this;
        this.loading = true;
        deleteItem('/signIn/delete/'+this.form.classId).then(function (res) {
          let response = res.data;
          if (response.code === 0) {
            _this.loading = false;
            _this.$message({
              message: '在线签到关闭成功，时间停止',
              type: 'success'
            });
          } else {
            _this.loading = false;
            _this.$message.error('在线签到关闭失败');
          }
        }).catch(function () {
          _this.loading = false;
          _this.$message.error('请求失败！');
        });
        let dateStr = _this.getDateStr();
        postRequest('/signIn/outline',{
          lessonId: _this.form.classId,
          signDate: dateStr
        }).then(function (res) {
          let response = res.data;
          if (response.code != 0) {
            _this.$message.error(response.msg);
          }
        }).catch(function () {
          _this.$message.error('请求失败！');
        });
        clearInterval(this.timer);
        localStorage.removeItem('classId');
        localStorage.removeItem('startTime');
        localStorage.removeItem('distance');
        this.isDisabled = false;
        this.start = false;
      },
      updateNowAmount(lessonId, date) {
        var _this = this;
        postRequest('/signIn/nowAmount', {
          lessonId: lessonId,
          signDate: date
        }).then(function (res) {
         let response = res.data;
         if (response.code === 0) {
           _this.nowAmount = response.data.nowAmount;
         } else {
           _this.$message.error(response.msg);
         }
        }).catch(function () {
          _this.$message.error('请求失败！');
        });
      },
      getDateStr() {
        let date = new Date();
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let dateStr = date.getFullYear() + '-' + month + '-' + day;
        return dateStr;
      },
      getAmount() {
        var _this = this;
        getItem('/lesson/amount/'+this.form.classId).then(function (res) {
          let response = res.data;
          if (response.code === 0) {
            _this.allAmount = response.data.amount;
          }
        }).catch(function () {
          _this.$message.error('请求失败！');
        });
      },
      startOnlineSign() {
        var _this = this;
        postRequest('/signIn/online',{
          lessonId: _this.form.classId,
          teaLon: _this.point.lon,
          teaLat: _this.point.lat,
          distance: _this.form.distance
        }).then(function (res) {
          let response = res.data;
          if (response.code === 0) {
            _this.loading = false;
            _this.$message({
              message: '启动在线签到成功，计时开始',
              type: 'success'
            });
          } else {
            _this.loading = false;
            _this.$message.error('在线签到启动失败');
          }
        }).catch(function () {
          _this.loading = false;
          _this.$message.error('请求失败！');
        });
      }
    },
    created() {
      var _this = this;
      this.loading = true;
      _this.socket.onmessage = function (event) {
        console.info(event.data);
        if (event.data === "signSuccess") {
          let dateStr = _this.getDateStr();
          _this.updateNowAmount(_this.form.classId, dateStr);
        } else {
          _this.$notify.success({
            title: '新消息',
            message: event.data
          });
        }
      }
      getItem('/lesson/teaList/' + this.detail.id).then(function (res) {
        let response = res.data;
        if (response.code === 0) {
          _this.loading = false;
          _this.teaList = response.data;
        } else {
          _this.loading = false;
          _this.$message.error(response.msg);
        }
      }).catch(function () {
        _this.loading = false;
        _this.$message.error('请求失败！');
      });

      if (localStorage.getItem('classId') != null) {
        _this.form.classId = localStorage.getItem('classId');
        _this.form.distance = localStorage.getItem('distance');
        _this.getAmount();
        _this.isDisabled = true;
        _this.startTime = localStorage.getItem('startTime');
        _this.timer = setInterval(function () {
          var time = new Date();
          _this.endTime = _this.getCurrentTime();
        }, 1000);
        _this.start = true;
        let dateStr = _this.getDateStr();
        _this.updateNowAmount(_this.form.classId, dateStr);
      }
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">
  .timer
    margin-top: 25px
    line-height: 25px
    font-size: 25px
  .stop-timer
    margin-top: 25px
</style>
