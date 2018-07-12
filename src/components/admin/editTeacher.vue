<template>
  <div class="edit-teacher">
    <el-form :rules="rules" :model="teacherForm" ref="teacherForm" label-width="100px">
      <el-form-item label="教师姓名" prop="teaName">
        <el-input v-model="teacherForm.teaName"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="teaSex">
        <el-radio-group v-model="teacherForm.teaSex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生日" prop="teaBirth">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          v-model="teacherForm.teaBirth">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="入职年份" prop="teaYear">
        <el-date-picker
          v-model="teacherForm.teaYear"
          type="year"
          value-format="yyyy"
          placeholder="选择年">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="学院专业班级">
        <el-cascader v-model="defaultOptions" :options="options" change-on-select @change="changeValue"></el-cascader>
      </el-form-item>
      <el-form-item label="电子邮件">
        <el-input type="email" v-model="teacherForm.teaEmail"></el-input>
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input type="tel" v-model="teacherForm.teaPhone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('teacherForm')">提交修改</el-button>
        <el-button @click="resetPass">重置密码</el-button>
        <el-button type="danger" @click="itemDelete">删除</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getItem, postRequest, deleteItem} from '../../utils/api'

  export default {
    data() {
      return {
        teacherForm: {
          teaId: '',
          teaName: '',
          teaSex: '',
          teaBirth: '',
          teaYear: '',
          teaNum: '',
          classId: '',
          classNum: '',
          instituteId: '',
          majorId: '',
          teaPhone: '',
          teaEmail: ''
        },
        options: [],
        defaultOptions: [],
        rules: {
          teaName: [
            {required: true, message: '教师姓名不能为空', trigger: 'blur'}
          ]
        }
      };
    },
    created() {
      let _this = this;
      getItem('/class/allSelect').then((res) => {
        let response = res.data;
        if (response.code === 0) {
          _this.options = response.data;
        } else {
          _this.$message.error(response.msg);
        }
      }).catch(() => {
        _this.$message.error('请求失败！');
      });
      getItem('/teacher/detail/' + this.$route.query.id).then((res) => {
        let response = res.data;
        if (response.code === 0) {
          _this.teacherForm.teaId = response.data.id;
          _this.teacherForm.teaName = response.data.name;
          _this.teacherForm.teaSex = response.data.sex;
          _this.teacherForm.teaBirth = response.data.birth;
          if (response.data.year != null) {
            _this.teacherForm.teaYear = response.data.year.toString();
          }
          _this.teacherForm.teaNum = response.data.index;
          _this.teacherForm.classId = response.data.classId;
          _this.teacherForm.classNum = response.data.classNum;
          _this.teacherForm.instituteId = response.data.institute;
          _this.teacherForm.majorId = response.data.major;
          _this.teacherForm.teaEmail = response.data.email;
          _this.teacherForm.teaPhone = response.data.phone;
          _this.defaultOptions = [
            response.data.institute,
            response.data.major,
            response.data.classNum
          ];
        } else {
          _this.$message.error(response.msg);
        }
      }).catch(() => {
        _this.$message.error('请求失败！');
      });
    },
    methods: {
      submitForm(formName) {
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            postRequest('/teacher/update', _this.teacherForm).then((res) => {
              let response = res.data;
              if (response.code === 0) {
                _this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                _this.$router.push({ path: '/editTeacher', query: {id: _this.teacherForm.teaId}})
              } else {
                _this.$message.error(response.msg);
              }
            }).catch(() => {
              _this.$message.error('请求失败！');
            });
          } else {
            return false;
          }
        })
      },
      resetPass() {
        let _this = this;
        getItem('/teacher/reset/' + this.$route.query.id).then((res) => {
          let response = res.data;
          if (response.code === 0) {
            _this.$message({
              message: '密码重置成功',
              type: 'success'
            });
          } else {
            _this.$message.error(response.msg);
          }
        }).catch(() => {
          _this.$message.error('请求失败！');
        });
      },
      itemDelete() {
        let _this = this;
        deleteItem('/teacher/delete/' + this.$route.query.id).then((res) => {
          let response = res.data;
          if (response.code == 0) {
            _this.$message({
              message: '删除成功',
              type: 'success'
            })
            _this.$router.push({ path: '/updateTeacher'});
          } else {
            _this.$message.error(response.msg);
          }
        }).catch(() => {
          _this.$message.error('请求失败！');
        });
      },
      changeValue(val) {
        if (val.length == 1) {
          this.teacherForm.instituteId = val[0];
          this.teacherForm.majorId = '';
          this.teacherForm.classNum = '';
          this.teacherForm.classId = '';
        }
        if (val.length == 2) {
          this.teacherForm.instituteId = val[0];
          this.teacherForm.majorId = val[1];
          this.teacherForm.classNum = '';
          this.teacherForm.classId = '';
        }
        if (val.length == 3) {
          this.teacherForm.instituteId = val[0];
          this.teacherForm.majorId = val[1];
          this.teacherForm.classNum = val[2];
          this.teacherForm.classId = val[0] + val[1] + val[2];
        }
      }
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">

</style>

