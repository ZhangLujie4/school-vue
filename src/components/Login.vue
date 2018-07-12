<template>
  <div class="login">
    <el-form :model="loginForm" :rules="rules" status-icon ref="form" v-loading="loading">
      <h3>系统登录</h3>
      <el-form-item>
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for='item in options'
                     :key=item.value
                     :label="item.label"
                     :value=item.value>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="username">
        <el-input type="text" v-model="loginForm.username" placeholder="账号"/>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="loginForm.password" placeholder="密码"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="submitClick">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
 </template>

<script type="text/ecmascript-6">
  import {postRequest} from '../utils/api'
  export default{
    data(){
      return {
        loginForm: {
          username: '100026810001',
          password: '888888'
        },
        rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}]
        },
        options: [{
          value: 0,
          label: '教师'
        },{
          value: 1,
          label: '学生'
        },{
          value: 2,
          label: '管理员'
        }],
        value: 0,
        loading: false
      }
    },
    created() {
      if (localStorage.length != 0) {
        let user = localStorage.getItem('user');
        this.$router.push({path: user});
      }
    },
    methods: {
      submitClick: function () {
        var _this = this;
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true;
            let user = '';
            if (this.value === 0) {
              user = '/teacher'
            } else if (this.value === 1) {
              user = '/student'
            } else {
              user = '/admin'
            }
            let url = user + '/login'
            postRequest(url,{
              username: this.loginForm.username,
              password: this.loginForm.password
            }).then(function (res) {
              var response = res.data;
              _this.loading = false;
              if (response.code === 0) {
                localStorage.data = JSON.stringify(response.data.id);
                localStorage.user = user;
                _this.$router.push({path: user});
              } else {
                _this.$alert(response.msg);
              }
            }).catch(function (res) {
              _this.loading = false;
              _this.$alert('请求失败！');
            })
          } else {
            return false
          }
        })
      }
    }

  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">
  .login
    width: 100%
</style>
