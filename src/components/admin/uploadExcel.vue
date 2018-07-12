<template>
  <div class="upload-excel" v-loading="loading">
    <div>
      <el-tag type="danger">
        {{ tip }}
      </el-tag>
    </div>
    <div>
      <p class="text">上传学院信息</p>
      <a href="http://47.95.215.194/api/zjut/data/template/institute">
        <el-button type="text">模板下载</el-button>
      </a>
      <el-card>
        <el-upload
          action="none"
          :before-upload="uploadInstituteExcel">
          <el-button icon="el-icon-upload2" type="success">上传EXCEL</el-button>
        </el-upload>
      </el-card>
      <p class="text">上传专业信息</p>
      <a href="http://47.95.215.194/api/zjut/data/template/major">
        <el-button type="text">模板下载</el-button>
      </a>
      <el-card>
        <el-upload
          action="none"
          :before-upload="uploadMajorExcel">
          <el-button icon="el-icon-upload2" type="success">上传EXCEL</el-button>
        </el-upload>
      </el-card>
      <p class="text">上传班级信息</p>
      <a href="http://47.95.215.194/api/zjut/data/template/class">
        <el-button type="text">模板下载</el-button>
      </a>
      <el-card>
        <el-upload
          action="none"
          :before-upload="uploadClassExcel">
          <el-button icon="el-icon-upload2" type="success">上传EXCEL</el-button>
        </el-upload>
      </el-card>
      <p class="text">上传教师信息</p>
      <a href="http://47.95.215.194/api/zjut/data/template/teacher">
        <el-button type="text">模板下载</el-button>
      </a>
      <el-card>
        <el-upload
          action="none"
          :before-upload="uploadTeacherExcel">
          <el-button icon="el-icon-upload2" type="success">上传EXCEL</el-button>
        </el-upload>
      </el-card>
      <p class="text">上传课程信息</p>
      <a href="http://47.95.215.194/api/zjut/data/template/lesson">
        <el-button type="text">模板下载</el-button>
      </a>
      <el-card>
        <el-upload
          action="none"
          :before-upload="uploadLessonExcel">
          <el-button icon="el-icon-upload2" type="success">上传EXCEL</el-button>
        </el-upload>
      </el-card>
      <p class="text">上传学生信息</p>
      <a href="http://47.95.215.194/api/zjut/data/template/student">
        <el-button type="text">模板下载</el-button>
      </a>
      <el-card>
        <el-upload
          action="none"
          :before-upload="uploadStudentExcel">
          <el-button icon="el-icon-upload2" type="success">上传EXCEL</el-button>
        </el-upload>
      </el-card>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {uploadFileRequest} from '../../utils/api'

  export default {
    data() {
      return {
        tip: '第一次使用时请按顺序上传信息文件',
        loading: false
      };
    },
    methods: {
      uploadExcel(file, fileName) {
        this.loading = true;
        let _this = this;
        let formData = new FormData();
        formData.append('file', file);
        uploadFileRequest('/' + fileName + '/excel', formData).then(function (res) {
          let response = res.data;
          if (response.code === 0) {
            _this.loading = false;
            _this.$message({
              message: '上传成功',
              type: 'success'
            });
          } else {
            _this.loading = false;
            _this.$message.error(response.msg);
          }
        }).catch(() => {
          _this.loading = false;
          _this.$message.error('请求失败！');
        });
      },
      uploadInstituteExcel(file) {
        this.uploadExcel(file, 'institute');
      },
      uploadMajorExcel(file) {
        this.uploadExcel(file, 'major');
      },
      uploadClassExcel(file) {
        this.uploadExcel(file, 'class');
      },
      uploadTeacherExcel(file) {
        this.uploadExcel(file, 'teacher');
      },
      uploadLessonExcel(file) {
        this.uploadExcel(file, 'lesson');
      },
      uploadStudentExcel(file) {
        this.uploadExcel(file, 'student');
      }
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">

  .upload-excel
    .text
      display: inline-block
      font-size: 25px
      line-height: 30px
</style>
