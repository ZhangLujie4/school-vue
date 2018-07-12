<template>
  <div class="record-sign">
    <div>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="课程" prop="lessonNum">
          <el-select v-model="form.lessonNum" placeholder="请选择">
            <el-option
              v-for="item in lessons"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <div v-for="sign in signs">
        <p>{{ sign.signDate }} {{ sign.isSign }}</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {postRequest,getItem} from '../../utils/api'

  export default {
    props: {
      detail: {
        type: Object
      }
    },
    data() {
      return {
        lessons: [],
        form: {
          lessonNum: ''
        },
        rules: {
          lessonNum:[
            {required: true, message: '选择不能为空',trigger: 'blur'}
          ]
        },
        signs: []
      }
    },
    created() {
      let _this = this;
      getItem('/class/lessons/'+this.detail.classId).then(function (res) {
        let response = res.data;
        if (response.code == 0) {
          _this.lessons = response.data;
        }
      }).catch(function () {
        _this.$message.error('请求失败！');
      });
    },
    methods: {
      onSubmit(formName) {
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            postRequest('/signIn/list', {
              lessonNum: _this.form.lessonNum,
              stuId: _this.detail.id
            }).then(function(res) {
              let response = res.data;
              if (response.code == 0) {
                _this.signs = response.data;
                _this.signs.forEach(function (item) {
                  let date = new Date(item.signDate);
                  let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                  let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                  item.signDate = date.getFullYear() + "-" + month + "-" + day;
                  if (item.isSign == true) {
                    item.isSign = '已签到';
                  } else {
                    item.isSign = '未签到';
                  }
                  return item;
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
        })
      }
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">

</style>
