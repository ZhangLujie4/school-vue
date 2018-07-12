<template>
  <div class="edit-news">
    <div>
      <el-form :model="newsInfo" :rules="rules" ref="news">
        <el-form-item label="新闻标题" prop="newsTitle">
          <el-input :rows="2" type="textarea" v-model="newsInfo.newsTitle"></el-input>
        </el-form-item>
        <el-form-item label="新闻内容" prop="newsContent">
          <el-input :rows="18" type="textarea" v-model="newsInfo.newsContent"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('news')">上传新闻</el-button>
          <el-button @click="resetForm('news')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {postRequest} from '../../utils/api'

  export default {
    data() {
      return {
        newsInfo: {
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
    methods: {
      submitForm(formName) {
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            postRequest('/news/create', _this.newsInfo).then(function (res) {
              let response = res.data;
              if (response.code === 0) {
                _this.$message({
                  message: '上传成功',
                  type: 'success'
                })
              } else {
                _this.$message.error(response.msg);
              }
            }).catch(function () {
              _this.$message.error('请求失败！');
            });
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">

</style>
