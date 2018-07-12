<template>
  <div class="admin">
    <el-tabs v-model="activeName">
      <el-tab-pane label="编辑新闻" name="first">
        <router-link to="/editNews">
          <el-button type="text">写新闻</el-button>
        </router-link>
        <router-link to="/adminSchoolNews">
          <el-button type="text">修改新闻</el-button>
        </router-link>
      </el-tab-pane>
      <el-tab-pane label="管理用户" name="second">
        <router-link to="/uploadExcel">
          <el-button type="text">上传EXCEL</el-button>
        </router-link>
        <router-link to="/updateTeacher">
          <el-button type="text">编辑老师</el-button>
        </router-link>
        <router-link to="/updateStudent">
          <el-button type="text">编辑学生</el-button>
        </router-link>
      </el-tab-pane>
      <el-tab-pane label="账户操作" name="third">
        <router-link to="/adminChangePass">
          <el-button type="text">修改密码</el-button>
        </router-link>
        <el-button type="text" @click="logout">登出</el-button>
      </el-tab-pane>
    </el-tabs>
    <router-view>
      {{ admin }}管理员,欢迎使用该系统
    </router-view>
  </div>

</template>

<script type="text/ecmascript-6">
  import {getItem} from '../utils/api'

  export default {
    data() {
      return {
        admin: JSON.parse(localStorage.data),
        activeName: 'first'
      }
    },
    methods: {
      logout() {
        localStorage.clear();
        this.$router.replace({path:'/'})
      }
    },
    created() {
      this.$router.push({ path:'/uploadExcel' });
    }
  }
</script>

<style>
  .el-tabs__header {
    margin: 0
  }

  .el-button--text {
    margin-right: 32px;
  }

  .right {
    display: inline-block;
    width: 50%;
  }

  .left {
    width: 50%;
  }

  .text {
    font-size: 14px;
  }

  .item {
    display: flex;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
  }

</style>

