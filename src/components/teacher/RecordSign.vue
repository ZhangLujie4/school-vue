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
      <el-cascader :options="options" :show-all-levels="false" @change="onSelect"></el-cascader>
    </div>
    <div>
      <div v-for="sign in signs">
        <p>{{ sign.signDate }} | {{ sign.stuId }} | {{ sign.stuName }} | {{ sign.isSign }}</p>
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
        allSigns: [],
        signs: [],
        options: [{
         value: 'time',
         label: '日期',
         children: []
        },{
          value: 'stuId',
          label: '学生',
          children: []
        }]
      }
    },
    created() {
      let _this = this;
      getItem('/lesson/list/'+this.detail.id).then(function (res) {
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
            getItem('/signIn/time/' + _this.form.lessonNum).then(function (res) {
              let response = res.data;
              if (response.code === 0) {
                _this.options[0].children = response.data;
              }
            }).catch(function () {
              _this.$message.error('请求失败！');
            })
            getItem('/signIn/stuId/' + _this.form.lessonNum).then(function (res) {
              let response = res.data;
              if (response.code === 0) {
                _this.options[1].children = response.data;
              }
            }).catch(function () {
              _this.$message.error('请求失败！');
            })
            getItem('/signIn/list/' + _this.form.lessonNum).then(function(res) {
              let response = res.data;
              if (response.code == 0) {
                _this.allSigns = response.data;
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
                _this.allSigns = [];
                _this.signs = [];
                _this.$message.error(response.msg);
              }
            }).catch(function () {
              _this.$message.error('请求失败！');
            });
          } else {
            return false;
          }
        })
      },
      onSelect(index) {
        let _this = this;
        if (index[0] == 'time') {
          _this.signs = _this.allSigns;
          _this.signs = _this.signs.filter(function (item) {
            if (item.signDate == index[1]) {
              return true;
            }
            return false;
          })
        } else {
          _this.signs = _this.allSigns;
          _this.signs = _this.signs.filter(function (item) {
            if (item.stuId == index[1]) {
              return true;
            }
            return false;
          })
        }
      }
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">

</style>
