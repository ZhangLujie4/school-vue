<template>
  <div class="edit-student">
    <el-form :rules="rules" :model="studentForm" ref="studentForm" label-width="100px">
      <el-form-item label="学生姓名" prop="stuName">
        <el-input v-model="studentForm.stuName"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="stuSex">
        <el-radio-group v-model="studentForm.stuSex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生日" prop="stuBirth">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          v-model="studentForm.stuBirth">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="入学年份" prop="stuYear">
        <el-date-picker
          v-model="studentForm.stuYear"
          type="year"
          value-format="yyyy"
          placeholder="选择年">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="班级序号">
        <el-input-number @change="stuNumChange" v-model="stuNum" :min="1" :max="99"></el-input-number>
      </el-form-item>
      <el-form-item label="学院专业班级">
        <el-cascader v-model="defaultOptions" :options="options" change-on-select @change="changeValue"></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('studentForm')">提交修改</el-button>
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
        studentForm: {
          stuId: '',
          stuName: '',
          stuSex: '',
          stuBirth: '',
          stuYear: '',
          stuNum: '',
          classId: '',
          classNum: '',
          instituteId: '',
          majorId: ''
        },
        stuNum: 1,
        options: [],
        defaultOptions: [],
        rules: {
          stuName: [
            {required: true, message: '学生姓名不能为空', trigger: 'blur'}
          ],
          stuYear: [
            {required: true, message: '入学年份不能为空', trigger: 'blur'}
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
      getItem('/student/detail/' + this.$route.query.id).then((res) => {
        let response = res.data;
        if (response.code === 0) {
          _this.stuNum = parseInt(response.data.index);
          _this.studentForm.stuId = response.data.id;
          _this.studentForm.stuName = response.data.name;
          _this.studentForm.stuSex = response.data.sex;
          _this.studentForm.stuBirth = response.data.birth,
          _this.studentForm.stuYear = response.data.year.toString(),
          _this.studentForm.stuNum = response.data.index,
          _this.studentForm.classId = response.data.classId,
          _this.studentForm.classNum = response.data.classNum,
          _this.studentForm.instituteId = response.data.institute,
          _this.studentForm.majorId = response.data.major;
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
      pad(num, n) {
        return Array(n>num?(n-(''+num).length+1):0).join(0)+num;
      },
      submitForm(formName) {
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.info(_this.studentForm);
            postRequest('/student/update', _this.studentForm).then((res) => {
              let response = res.data;
              if (response.code === 0) {
                _this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                _this.$router.push({ path: '/editStudent', query: {id: _this.studentForm.stuId}})
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
        getItem('/student/reset/' + this.$route.query.id).then((res) => {
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
        deleteItem('/student/delete/' + this.$route.query.id).then((res) => {
          let response = res.data;
          if (response.code == 0) {
            _this.$message({
              message: '删除成功',
              type: 'success'
            })
            _this.$router.push({ path: '/updateStudent'});
          } else {
            _this.$message.error(response.msg);
          }
        }).catch(() => {
          _this.$message.error('请求失败！');
        });
      },
      changeValue(val) {
        if (val.length == 1) {
          this.studentForm.instituteId = val[0];
          this.studentForm.majorId = '';
          this.studentForm.classNum = '';
          this.studentForm.classId = '';
        }
        if (val.length == 2) {
          this.studentForm.instituteId = val[0];
          this.studentForm.majorId = val[1];
          this.studentForm.classNum = '';
          this.studentForm.classId = '';
        }
        if (val.length == 3) {
          this.studentForm.instituteId = val[0];
          this.studentForm.majorId = val[1];
          this.studentForm.classNum = val[2];
          this.studentForm.classId = val[0] + val[1] + val[2];
        }
      },
      stuNumChange(val) {
        this.studentForm.stuNum = this.pad(val, 2);
      }
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">

</style>
