<template>
  <div class="newsDetail">
    <div class="back">
      <i class="el-icon-back" @click="goBack">返回</i>
    </div>
    <div class="title">
      <p>{{ newsInfo.newsTitle }}</p>
    </div>
    <div class="context">
      <pre width="100%">{{ newsInfo.newsContent }}</pre>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getItem} from '../utils/api'

  export default {
    data() {
      return {
        newsId: '',
        newsInfo: {}
      }
    },
    created() {
      var _this = this;
      this.newsId = this.$route.query.id;
      console.info(this.newsId);
      getItem('/news/detail/' + this.newsId).then(function (res) {
        var response = res.data;
        if (response.code == 0) {
          _this.newsInfo = response.data;
        } else {
          _this.$alert(response.msg);
        }
      }).catch(function () {
        _this.$alert('请求失败！');
      });
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      }
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">
  .newsDetail
    .back
      .el-icon-back
        font-size: 18px
        line-height: 25px
    .title
      display: inline-block
      width: 100%
      text-align: center
      line-height: 25px
      font-size: 20px
      font-weight: 700
    .content
      word-wrap: break-word
      white-space: normal
  pre
    white-space: pre-wrap
    white-space: -moz-pre-wrap
    white-space: -pre-wrap
    white-space: -o-pre-wrap
    word-wrap: break-word
    line-height: 20px
</style>
