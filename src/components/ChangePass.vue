<template>
  <div class="changePass">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" label-position="left">
      <el-form-item label="原密码" prop="password">
        <el-input type="password" v-model="ruleForm.password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="ruleForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input type="password" v-model="ruleForm.checkPassword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import {postRequest} from '../utils/api'

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
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入原密码'));
        } else {
          callback();
        }
      };
      var validatePass1 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else {
          if (this.ruleForm.checkPassword !== '') {
            this.$refs.ruleForm.validateField('checkPassword');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次确认密码'));
        } else if (value != this.ruleForm.newPassword) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          password: '',
          newPassword: '',
          checkPassword: ''
        },
        rules: {
          password: [{validator: validatePass, trigger: 'blur'}],
          newPassword: [{validator: validatePass1, trigger: 'blur'}],
          checkPassword: [{validator: validatePass2, trigger: 'blur'}]
        }
      }
    },
    methods: {
      submitForm(formName) {
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let path = localStorage.getItem('user');
            postRequest(path + '/password', {
              username: JSON.parse(localStorage.data),
              password: _this.ruleForm.password,
              newPassword: _this.ruleForm.newPassword
            }).then(function (res) {
              let response = res.data;
              if (response.code === 0) {
                _this.$alert('密码修改成功，请重新登录');
                localStorage.clear();
                _this.socket.close();
                _this.$router.replace({path:'/'})
              } else {
                _this.$alert(response.msg);
              }
            }).catch(function () {
              _this.$alert('请求失败！');
            });
          } else {
            console.log('error!');
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
