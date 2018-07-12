<template>
  <div class="schedule">
        <el-table
          :data="schedule"
          :span-method="objectSpanMethod"
          border
          style="width: 100%">
          <el-table-column prop="id" label="星期"></el-table-column>
          <el-table-column label="星期一">
            <template slot-scope="scope">
              <div :class="{mon: (scope.row.monday.lessonName != null)}">
                <p>{{ scope.row.monday.lessonName }}</p>
                <p>{{ scope.row.monday.lessonPlace }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="星期二">
            <template slot-scope="scope">
              <div :class="{tue: (scope.row.tuesday.lessonName != null)}">
                <p>{{ scope.row.tuesday.lessonName }}</p>
                <p>{{ scope.row.tuesday.lessonPlace }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="星期三">
            <template slot-scope="scope">
              <div :class="{wed: (scope.row.wednesday.lessonName != null)}">
                <p>{{ scope.row.wednesday.lessonName }}</p>
                <p>{{ scope.row.wednesday.lessonPlace }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="星期四">
            <template slot-scope="scope">
              <div :class="{thu: (scope.row.thursday.lessonName != null)}">
                <p>{{ scope.row.thursday.lessonName }}</p>
                <p>{{ scope.row.thursday.lessonPlace }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="星期五">
            <template slot-scope="scope">
              <div :class="{fri: (scope.row.friday.lessonName != null)}">
                <p>{{ scope.row.friday.lessonName }}</p>
                <p>{{ scope.row.friday.lessonPlace }}</p>
              </div>
            </template>
          </el-table-column>
        </el-table>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getItem} from '../../utils/api'

  export default {
    props: {
      detail: {
        type: Object
      }
    },
    created() {
      var _this = this
      getItem('/lesson/schedule/'+_this.detail.id).then(function (res) {
        let response = res.data;
        if (response.code === 0) {
          _this.schedule = response.data
        } else {
          _this.$alert(response.msg)
        }
      }).catch(function () {
        _this.$alert("请求失败!")
      })
    },
    data() {
      return {
        schedule: []
      }
    },
    methods: {
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 1) {
          if (row.monday.lessonSeveral != null) {
            return {
              rowspan: row.monday.lessonSeveral,
              colspan: 1
            }
          }
        }
        if (columnIndex === 2) {
          if (row.tuesday.lessonSeveral != null) {
            return {
              rowspan: row.tuesday.lessonSeveral,
              colspan: 1
            }
          }
        }
        if (columnIndex === 3) {
          if (row.wednesday.lessonSeveral != null) {
            return {
              rowspan: row.wednesday.lessonSeveral,
              colspan: 1
            }
          }
        }
        if (columnIndex === 4) {
          if (row.thursday.lessonSeveral != null) {
            return {
              rowspan: row.thursday.lessonSeveral,
              colspan: 1
            }
          }
        }
        if (columnIndex === 5) {
          if (row.friday.lessonSeveral != null) {
            return {
              rowspan: row.friday.lessonSeveral,
              colspan: 1
            }
          }
        }
      }
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">
  .schedule
    .mon
      background-color: #3eece9
    .tue
      background-color: #9dff6b
    .wed
      background-color: #ffa1df
    .thu
      background-color: #f6ff7a
    .fri
      background-color: #c23bff
</style>
