<template>
  <div class="online-sign" v-show="isSign" v-loading="loading">
    <div id="map"></div>
    <el-row>
      <el-col>课程名称</el-col>
      <el-col>{{ onlineSign.lessonName }} 星期{{ onlineSign.lessonWeekday }}
        {{ onlineSign.lessonPlace }}</el-col>
      <el-col></el-col>
    </el-row>
    <div v-show="submitSign">
    <el-row>
      <el-col>签到点</el-col>
      <el-col>lng: {{ point.lon }} lat: {{ point.lat }}</el-col>
    </el-row>
    <el-row>
      <el-col>当前位置</el-col>
      <el-col>lng: {{ currentPoint.lon }} lat: {{ currentPoint.lat }}</el-col>
    </el-row>
    <el-row>
      <el-col>相距</el-col>
      <el-col>{{ distance }}</el-col>
    </el-row>
    </div>
    <el-button type="text" @click="signIn">在线签到</el-button>
  </div>
</template>

<script type="text/ecmascript-6">
  import BMap from 'BMap'
  import {getItem,postRequest} from '../../utils/api'
  import {isMobile} from '../../utils/utils'

  export default {
    props: {
      detail: {
        type: Object
      }
    },
    data() {
      return {
        point: {
          lon: 116.331398,
          lat: 39.897445
        },
        onlineSign: {},
        currentPoint: {
          lon: 116.331398,
          lat: 39.897445
        },
        distance: 0.0,
        isSign: false,
        submitSign: false,
        loading: false
      }
    },
    created() {
      var _this = this;
      this.loading = true;
      getItem('/signIn/available/'+this.detail.classId).then(function (res) {
        let response = res.data;
        if (response.code == 0) {
          _this.loading = false;
          _this.onlineSign = response.data;
          _this.point.lon = response.data.teaLon;
          _this.point.lat = response.data.teaLat;
          _this.isSign = true;
        } else {
          _this.loading = false;
          _this.$message.error(response.msg);
          _this.isSign = false;
        }
      }).catch(function () {
        _this.loading = false;
        _this.$message.error('请求失败！');
      });
    },
    methods: {
      signIn() {
        var _this = this;
        this.loading = true;
        var pointA = new BMap.Point(_this.point.lon, _this.point.lat);
        var map = new BMap.Map("map");
//        if (!isMobile()) {
//          navigator.geolocation.getCurrentPosition(
//            function (position) {
//              _this.currentPoint.lon = position.coords.longitude;
//              _this.currentPoint.lat = position.coords.latitude;
//              var pointB = new BMap.Point(_this.currentPoint.lon, _this.point.lat);
//              _this.distance = map.getDistance(pointA, pointB);
//              _this.updateDistance();
//            }
//          );
//        }
//        else {
          var geolocation = new BMap.Geolocation();
          geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
              _this.currentPoint.lon = r.point.lng;
              _this.currentPoint.lat = r.point.lat;
              var pointB = new BMap.Point(_this.currentPoint.lon, _this.point.lat);
              _this.distance = map.getDistance(pointA, pointB);
              _this.updateDistance();
            } else {
              _this.loading = false;
              _this.$message.error('failed'+this.getStatus());
            }
          },{enableHighAccuracy: true})
//        }
      },
      updateDistance() {
        var _this = this;
        console.info(_this.onlineSign.distance);
        if (_this.distance <= _this.onlineSign.distance) {
          postRequest('/signIn/stuCreate', {
            lessonId: _this.onlineSign.lessonId,
            lessonNum: _this.onlineSign.lessonNum,
            stuName: _this.detail.name,
            stuId: _this.detail.id
          }).then(function (res) {
            let response = res.data;
            _this.submitSign = true;
            if (response.code != 0) {
              _this.loading = false;
              _this.$message.error(response.msg);
            } else {
              _this.loading = false;
              _this.$message({
                message: '签到成功',
                type: 'success'
              });
            }
          }).catch(function () {
            _this.loading = false;
            _this.$message.error('请求失败！');
          });
        } else {
          _this.loading = false;
          _this.$message.error('签到失败，距离签到点太远');
        }
      }
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">

</style>
