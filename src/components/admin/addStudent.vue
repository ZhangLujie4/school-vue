<template>
  <div class="add-student" style="margin-top: 10px;">
    <el-form :model="studentForm" :rules="rules" ref="studentForm" label-width="100px">
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
      <el-form-item label="学院专业班级">
        <el-cascader v-model="defaultOptions" :options="options" change-on-select @change="changeValue"></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('studentForm')">添加学生</el-button>
        <el-button @click="resetForm('studentForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getItem, postRequest} from '../../utils/api'

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
    },
    methods: {
      submitForm(formName) {
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            postRequest('/student/create', _this.studentForm).then((res) => {
              let response = res.data;
              if (response.code == 0) {
                _this.$message({
                  message: '添加成功',
                  type: 'success'
                });
              } else {
                _this.$message.error(response.msg);
              }
            }).catch(()=>{
              _this.$message.error('请求失败！');
            });
          } else {
            return false;
          }
        });
      },
      changeValue(val) {
        if (val.length == 1) {
          this.studentForm.instituteId = val[0];
        }
        if (val.length == 2) {
          this.studentForm.instituteId = val[0];
          this.studentForm.majorId = val[1];
        }
        if (val.length == 3) {
          this.studentForm.instituteId = val[0];
          this.studentForm.majorId = val[1];
          this.studentForm.classNum = val[2];
          this.studentForm.classId = val[0] + val[1] + val[2];
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.defaultOptions = [];
      }
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">

</style>
