<template>
  <div class="call-sign" v-loading="loading">
    <div>
      <el-select v-model="lessonId" clearable placeholder="请选择">
        <el-option
          v-for="item in teaList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
          <span style="float: left">{{ item.label }}</span>
        </el-option>
      </el-select>
      <el-input-number v-model="count" :min="1" :max="100"></el-input-number>
      <el-button type="primary" @click="onSubmit">生成随机签到表</el-button>
    </div>
    <div>
      <el-table
      :data="tableData"
      style="width: 100%">
        <el-table-column
          label="学号"
          width="140">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.stuId }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
          width="100">
          <template slot-scope="scope">
            <el-tag size="medium">{{ scope.row.stuName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isSign"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="submitList">提交</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getItem,postRequest} from '../../utils/api'

  export default {
    props: {
      detail: {
        type: Object
      }
    },
    data() {
      return {
        count: 1,
        lessonId: '',
        loading: false,
        teaList: [],
        tableData: []
      }
    },
    created() {
      let _this = this;
      this.loading = true;
      getItem('/lesson/teaList/' + this.detail.id).then(function (res) {
        let response = res.data;
        if (response.code === 0) {
          _this.loading = false;
          _this.teaList = response.data;
        } else {
          _this.loading = false;
          _this.$message.error(response.msg);
        }
      }).catch(function () {
        _this.loading = false;
        _this.$message.error('请求失败！');
      });
    },
    methods: {
      onSubmit() {
        let _this = this;
        if (this.lessonId != '') {
          this.loading = true;
          postRequest('/lesson/random', {
            lessonId: _this.lessonId,
            count: _this.count
          }).then(function (res) {
            let response = res.data;
            if (response.code === 0) {
              _this.loading = false;
              _this.tableData = response.data;
            } else {
              _this.loading = false;
              _this.$message.error(response.msg);
            }
          }).catch(function () {
            _this.loading = false;
            _this.$message.error('请求失败！');
          })
        }
      },
      submitList() {
        let _this = this;
        this.loading = true;
        postRequest('/signIn/callSign', {
          signList: JSON.stringify(_this.tableData)
        }).then(function (res) {
          let response = res.data;
          if (response.code === 0) {
            _this.loading = false;
            _this.$message({
              message: '提交成功',
              type: 'success'
            });
          } else {
            _this.loading = false;
            _this.$message.error('签到提交失败');
          }
        }).catch(function () {
          _this.loading = false;
          _this.$message.error('请求失败！');
        })
      }
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">

</style>
