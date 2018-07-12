<template>
  <div class="school-news">
  <div>
  <el-carousel indicator-position="outside">
    <el-carousel-item v-for="item in imgMap" :key="item.index">
      <img class="image" :src='item.src' />
      <img class="image-background" :src='item.src' />
    </el-carousel-item>
  </el-carousel>
  </div>
  <div>
  <el-table :data="newsList" @row-click="rowClick">
    <el-table-column prop="createTime" label="日期" sortable width="100"></el-table-column>
    <el-table-column label="标题">
      <template slot-scope="scope" class="scope-style">
        {{ scope.row.newsTitle }}
      </template>
    </el-table-column>
  </el-table>
  </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getItem} from '../utils/api'

  export default {
    data() {
      return {
        newsList: [],
        imgMap: [
          {index: 0, src: require('../common/img/one.png')},
          {index: 1, src: require('../common/img/two.png')},
          {index: 2, src: require('../common/img/three.png')},
          {index: 3, src: require('../common/img/four.png')},
        ],
        items: 4
      }
    },
    created() {
      var _this = this;
      getItem('/news/all').then(function (res) {
        let response = res.data;
        if (response.code == 0) {
          _this.newsList = response.data;
          _this.newsList.forEach(function (item) {
            var date = new Date(item.createTime);
            var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
            var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
            item.createTime = date.getFullYear() + "-" + month + "-" + day;
            return item;
          })
        } else {
          _this.$message.error(response.msg);
        }
      }).catch(function () {
        _this.$message.error('请求失败！');
      });
    },
    methods: {
      rowClick(row, event, column) {
        console.info(row.newsId);
        let user = '/stuNewsDetail'
        if (localStorage.getItem('user') === '/teacher') {
          user = '/teaNewsDetail'
        }
        this.$router.push({ path: user, query: {id: row.newsId}});
      }
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">

  .el-carousel__item:nth-child(2n) {
    background-color: #98ffc0;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #b3ece7;
  }

  .school-news
    .image
      display: table-cell
      height: 100%
      margin: 0 auto
      vertical-align: middle
      text-align: center
    .image-background
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -1
      filter: blur(10px)
    .cell
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
</style>
