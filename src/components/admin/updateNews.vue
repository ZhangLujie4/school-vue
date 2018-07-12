<template>
  <div class="update-news">
    <div class="back">
      <i class="el-icon-back" @click="goBack">返回</i>
    </div>
    <div>
      <el-form :model="newsInfo" :rules="rules" ref="news">
        <el-form-item label="新闻标题" prop="newsTitle">
          <el-input :rows="2" type="textarea" v-model="newsInfo.newsTitle"></el-input>
        </el-form-item>
        <el-form-item label="新闻内容" prop="newsContent">
          <el-input :rows="18" type="textarea" v-model="newsInfo.newsContent"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交修改</el-button>
          <el-button @click="resetForm">恢复初始</el-button>
          <el-button type="danger" @click="deleteNews" icon="el-icon-delete" circle></el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getItem, deleteItem, postRequest} from '../../utils/api'

  export default {
    data() {
      return {
        newsId: '',
        newsInfo: {
          newsTitle: '',
          newsContent: ''
        },
        news: {
          newsTitle: '',
          newsContent: ''
        },
        rules: {
          newsTitle: [
            {required: true, message: '请输入标题', trigger: 'blur'}
          ],
          newsContent: [
            {required: true, message: '请输入内容', trigger: 'blur'}
          ]
        }
      }
    },
    created() {
      var _this = this;
      this.newsId = this.$route.query.id;
      console.info(this.newsId);
      getItem('/news/detail/' + this.newsId).then(function (res) {
        var response = res.data;
        if (response.code == 0) {
          _this.newsInfo.newsTitle = response.data.newsTitle;
          _this.news.newsTitle = response.data.newsTitle;
          _this.newsInfo.newsContent = response.data.newsContent;
          _this.news.newsContent = response.data.newsContent;
        } else {
          _this.$message.error(response.msg);
        }
      }).catch(function () {
        _this.$message.error('请求失败！');
      });
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      submitForm() {
        let _this = this;
        postRequest('/news/update', {
          newsId: _this.newsId,
          newsTitle: _this.newsInfo.newsTitle,
          newsContent: _this.newsInfo.newsContent
        }).then(function (res) {
          let response = res.data;
          if (response.code === 0) {
            _this.$message({
              message: '修改成功',
              type: 'success'
            });
          } else {
            _this.$message.error('修改失败');
          }
        }).catch(() => {
          _this.$message.error('请求失败！')
        });
      },
      resetForm() {
        this.newsInfo.newsTitle = this.news.newsTitle;
        this.newsInfo.newsContent = this.news.newsContent;
      },
      deleteNews() {
        let _this = this;
        deleteItem('/news/delete/' + this.newsId).then(function (res) {
          let response = res.data;
          if (response.code === 0) {
            _this.$router.push({ path: '/adminSchoolNews'});
            _this.$message({
              message: '删除成功',
              type: 'success'
            });
          } else {
            _this.$message.error('删除失败');
          }
        }).catch(()=>{
          _this.$message.error('请求失败！');
        });
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

