<template>
  <div class="school-news">
    <div>
      <el-table
        ref="multipleTable"
        tooltip-effect="dark"
        :data="newsList"
        @row-click="rowClick"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="createTime" label="日期" sortable width="100"></el-table-column>
        <el-table-column label="标题">
          <template slot-scope="scope">
            {{ scope.row.newsTitle }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-button type="primary" @click="submitDelete">删除</el-button>
      <el-button @click="resetDelete">取消选中</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getItem, postRequest} from '../../utils/api'

  export default {
    data() {
      return {
        newsList: [],
        multipleSelection: [],
        deleteList: []
      }
    },
    created() {
      this.updateNews();
    },
    methods: {
      updateNews() {
        var _this = this;
        getItem('/news/all').then(function (res) {
          let response = res.data;
          if (response.code == 0) {
            _this.newsList = response.data;
            _this.newsList.forEach(function (item) {
              var date = new Date(item.createTime);
              var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
              var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
              item.createTime = date.getFullYear() + "-" + month + "-" + day;
              return item;
            })
          } else {
            _this.newsList = [];
          }
        }).catch(function () {
          _this.$message.error('请求失败！');
        });
      },
      rowClick(row, event, column) {
        this.$router.push({ path: '/updateNews', query: {id: row.newsId}});
      },
      handleSelectionChange(val) {
        let _this = this;
        this.multipleSelection = val;
        let deleteList = new Array();
        this.multipleSelection.forEach((item) => {
          deleteList.push(item.newsId);
        })
        this.deleteList = deleteList;
      },
      deleteNews(deleteList) {
        let _this = this;
        postRequest('/news/deleteList', {
          newsIdList: deleteList
        }).then(function (res) {
          let response = res.data;
          if (response.code === 0) {
            _this.updateNews();
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
      submitDelete() {
        if (this.multipleSelection.length === 0) {
          this.$message.error('删除不能为空');
        } else {
          this.deleteNews(this.deleteList);
        }
      },
      resetDelete() {
        this.$refs.multipleTable.clearSelection();
      }
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">

  .el-carousel__item:nth-child(2n) {
    background-color: #98ffc0;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #b3ece7;
  }

  .school-news
    .cell
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
</style>
