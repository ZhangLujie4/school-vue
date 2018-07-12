<template>
  <div class="update-student">
    <div style="margin-top: 10px;">
      <el-input placeholder="请输入内容" v-model="input">
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option value="1" label="学号"></el-option>
          <el-option value="2" label="姓名"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="selectList"></el-button>
      </el-input>
    </div>
    <div>
      <el-table
        ref="multipleTable"
        tooltip-effect="dark"
        :data="studentList"
        @row-click="rowClick"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="学号" sortable width="150"></el-table-column>
        <el-table-column prop="name" label="姓名" sortable></el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 10px;">
      <el-button type="primary" @click="submitDelete">删除</el-button>
      <el-button @click="resetDelete">取消选中</el-button>
      <el-button type="success" @click="addItem">新增</el-button>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import {getItem, postRequest, deleteItem} from '../../utils/api'

  export default {
    data() {
      return {
        input: '',
        select: '',
        studentList: [],
        thisList: [],
        multipleSelection: [],
        deleteList: []
      };
    },
    created() {
      this.updateStudent();
    },
    methods: {
      updateStudent() {
        let _this = this;
        getItem('/student/all').then((res) => {
          let response = res.data;
          if (response.code === 0) {
            _this.studentList = response.data;
            _this.thisList = response.data;
            _this.selectList();
          } else {
            _this.$message.error(response.msg);
          }
        }).catch(() => {
          _this.$message.error('请求失败！');
        });
      },
      selectList() {
        let _this = this;
        if (_this.input == '') {
          _this.studentList = _this.thisList;
        } else if (_this.select == 2) {
          _this.studentList = _this.thisList.filter(function (item) {
            return item.name.indexOf(_this.input) == -1 ? false : true;
          });
        } else if (_this.select == 1) {
          _this.studentList = _this.thisList.filter(function (item) {
            return item.id.indexOf(_this.input) == -1 ? false : true;
          })
        } else {
          _this.studentList = _this.thisList;
        }
      },
      submitDelete() {
        if (this.multipleSelection.length === 0) {
          this.$message.error('删除不能为空');
        } else {
          this.deleteStudent(this.deleteList);
        }
      },
      deleteStudent() {
        let _this = this;
        postRequest('/student/deleteList', {
          stuIdList: _this.deleteList
        }).then(function (res) {
          let response = res.data;
          if (response.code === 0) {
            _this.updateStudent();
            _this.$message({
              message: '删除成功',
              type: 'success'
            });
          } else {
            _this.$message.error(response.msg);
          }
        }).catch(function () {
          _this.$message.error('请求失败！');
        });
      },
      resetDelete() {
        this.$refs.multipleTable.clearSelection();
      },
      addItem() {
        this.$router.push({ path: '/addStudent'});
      },
      rowClick(row) {
        this.$router.push({ path: '/editStudent', query: {id: row.id}});
      },
      handleSelectionChange(val) {
        let _this = this;
        this.multipleSelection = val;
        this.deleteList = new Array();
        this.multipleSelection.forEach((item) => {
          _this.deleteList.push(item.id);
        })
      }
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">
  .el-select
    .el-input
      width: 130px
</style>
