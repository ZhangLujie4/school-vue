<template>
  <div class="basicInfo">
    <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>个人资料</span>
        <router-link to="/stuChangePass">
          <el-button style="float: right; padding: 3px 0" type="text">修改密码</el-button>
        </router-link>
      </div>
      <div class="text item">
        <div class="left">
          <p>学号：{{ detail.id }}</p>
          <p>姓名：{{ detail.name }}</p>
          <p>性别：{{ detail.sex }}</p>
          <p>生日：{{ detail.birth }}</p>
        </div>
        <div class="right">
          <p>入学年份：{{ detail.year }}级</p>
          <p>学院名称：{{ detail.instituteName }}</p>
          <p>专业班级：{{ detail.majorName }}  {{ detail.classNum }}班</p>
          <p>班级编号：{{ detail.classId }}</p>
        </div>
      </div>
    </el-card>
    </div>
    <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item title="学院资料" name="1">
        <div>
          <p>学院：{{ instituteData.instituteName }}</p>
          <p>简介：{{ instituteData.description }}</p>
        </div>
      </el-collapse-item>
      <el-collapse-item title="教师资料" name="2">
        <div>
          <p>姓名：{{ teacherData.name }}</p>
          <p>电话：{{ teacherData.phone }}</p>
          <p>邮箱：{{ teacherData.email }}</p>
        </div>
      </el-collapse-item>
    </el-collapse>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getItem} from '../../utils/api'

  export default {
    props: {
      detail: {
        type: Object
      },
      teacherData: {
        type: Object
      },
      instituteData: {
        type: Object
      }
    },
    data() {
      return {
        activeNames:['2']
      }
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">

</style>
