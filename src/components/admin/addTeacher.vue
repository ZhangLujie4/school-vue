<template>
  <div class="add-teacher" style="margin-top: 10px;">
    <el-form :model="teacherForm" :rules="rules" ref="teacherForm" label-width="100px">
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
        <el-button type="primary" @click="submitForm('teacherForm')">添加教师</el-button>
        <el-button @click="resetForm('teacherForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getItem, postRequest} from '../../utils/api'

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
    },
    methods: {
      submitForm(formName) {
        let _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            postRequest('/teacher/create', _this.teacherForm).then((res) => {
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
          this.teacherForm.instituteId = val[0];
        }
        if (val.length == 2) {
          this.teacherForm.instituteId = val[0];
          this.teacherForm.majorId = val[1];
        }
        if (val.length == 3) {
          this.teacherForm.instituteId = val[0];
          this.teacherForm.majorId = val[1];
          this.teacherForm.classNum = val[2];
          this.teacherForm.classId = val[0] + val[1] + val[2];
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
