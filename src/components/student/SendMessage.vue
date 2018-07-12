<template>
  <div class="send-message">
    <el-form ref="form" :model="form" :rules="rules">
      <!--<el-form-item label="是否群发" prop="isAll">-->
        <!--<el-switch v-model="form.isAll" @change="onChange"></el-switch>-->
      <!--</el-form-item>-->
      <el-form-item label="收件人" prop="receiver">
        <!--:disabled="form.isAll"-->
        <el-select v-model="form.receiver" placeholder="选择收件人">
          <el-option-group
            v-for="group in options"
            :key="group.label"
            :label="group.label">
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-option-group>
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
          message: ''
        },
        rules: {
          receiver: [
            {required: true, message: '请选择收件人',trigger: 'blur'}
          ],
          message: [
            {required: true, message: '请写上内容', trigger: 'blur'}
          ]
        },
        options: [{
          label: '老师',
          options: []
        },{
          label: '同学',
          options: []
        }]
      };
    },
    methods: {
      onSubmit(formName) {
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.info(_this.messageForm);
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
                _this.$message.error('发送失败');
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
      }
    },
    created() {
      let _this = this;
      getItem('/teacher/list/'+this.detail.classId).then(function (res) {
        let response = res.data;
        if (response.code == 0) {
          _this.options[0].options = response.data;
          console.info(_this.teacherList);
        }
      }).catch(function () {
        _this.$message.error('请求失败！');
      });
      getItem('/student/list/'+this.detail.classId).then(function (res) {
        let response = res.data;
        if (response.code == 0) {
          _this.options[1].options = response.data;
          console.info(_this.studentList);
        }
      }).catch(function () {
        _this.$message.error('请求失败！');
      });
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">

</style>
