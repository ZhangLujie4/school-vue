<template>
  <div class="send-message">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="是否群发" prop="isAll">
        <el-switch v-model="form.isAll" @change="onChange"></el-switch>
      </el-form-item>
      <el-form-item label="收件人" prop="receiver">
        <el-select v-model="form.receiver" placeholder="选择收件人" :disabled="form.isAll">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送信息" prop="message">
        <el-input
          type="textarea"
          autosize
          placeholder="请输入内容"
          v-model="form.message">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">发送信息</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import {postRequest, getItem} from '../../utils/api'

  export default {
    props: {
      detail: {
        type: Object
      }
    },
    data() {
      return {
        form: {
          receiver: '',
          message: '',
          isAll: false
        },
        rules: {
          receiver: [
            {required: true, message: '请选择收件人',trigger: 'blur'}
          ],
          message: [
            {required: true, message: '请写上内容', trigger: 'blur'}
          ]
        },
        options: []
      };
    },
    methods: {
      onSubmit(formName) {
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            postRequest('/message/create', {
              classId: _this.detail.classId,
              sender: _this.detail.id,
              receiver: _this.form.receiver,
              message: _this.form.message
            }).then(function (res) {
              let response = res.data;
              if (response.code == 0) {
                _this.$message({
                  message: '发送成功',
                  type: 'success'
                });
              } else {
                _this.$message.error('发送失败,'+response.msg);
              }
            }).catch(function () {
              _this.$message.error('请求失败！');
            });
          } else {
            return false;
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      onChange(status) {
        if (status == true) {
          this.form.receiver = 'all';
        } else {
          this.form.receiver = '';
        }
      }
    },
    created() {
      let _this = this;
      getItem('/student/list/'+this.detail.classId).then(function (res) {
        let response = res.data;
        if (response.code == 0) {
          _this.options = response.data;
        }
      }).catch(function () {
        _this.$message.error('请求失败！');
      });
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">

</style>
