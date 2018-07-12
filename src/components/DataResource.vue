<template>
  <div class="data-resource">
    <div>
      <el-button type="primary" @click="uploadShow">{{ uploadText }}<i class="el-icon-upload el-icon--right"></i></el-button>
    </div>
    <div v-show="upload">
    <el-upload
      class="upload-demo"
      action="none"
      drag
      :before-upload="beforeAvatarUpload"
    multiple>
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <div class="el-upload__tip" slot="tip">每次只能上传一个文件，且不超过100MB</div>
    </el-upload>
    </div>
    <div class="download">
      <template>
        <el-table :data="dataInfos" style="width: 100%">
          <el-table-column prop="createTime" width="150" sortable label="上传时间"></el-table-column>
          <el-table-column prop="dataName" sortable label="文件名"></el-table-column>
          <el-table-column width="80">
            <template slot-scope="scope">
              <a :href="['http://47.95.215.194/api/zjut/data/download/'+scope.row.dataId]">
                <el-button size="mini" type="success" circle icon="el-icon-download"></el-button>
              </a>
            </template>
          </el-table-column>
        </el-table>
      </template>

    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import {uploadFileRequest} from '../utils/api'
  import {getItem} from '../utils/api'

  export default {
    props: {
      detail: {
        type: Object
      }
    },
    created() {
     this.updateData();
    },
    data() {
      return {
        file: '',
        upload: false,
        uploadText: "上传",
        dataInfos: []
      }
    },
    methods: {
      uploadShow() {
        if (this.upload == false) {
          this.upload = true
          this.uploadText = "收起"
        } else {
          this.upload = false
          this.uploadText = "上传"
        }
      },
      beforeAvatarUpload(file) {
        let _this = this;
        let formData = new FormData();
        formData.append('file', file);
        formData.append('classId', this.detail.classId);
        var data = formData;
        uploadFileRequest('/data/upload', data).then(function (res) {
          var response = res.data;
          if (response.code === 0) {
            _this.updateData();
            _this.$message({
              message: "文件上传成功",
              type: 'success'
            });
          } else {
            _this.$message.error(response.msg);
          }
        }).catch(function () {
          _this.$message.error("请求失败！");
        })
      },
      updateData() {
        var _this = this
        getItem('/data/class/'+_this.detail.classId).then(function (res) {
          var response = res.data;
          if (response.code === 0) {
            _this.dataInfos = response.data;
            _this.dataInfos.forEach(function (item) {
              var date = new Date(item.createTime);
              var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
              var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
              var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
              var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
              item.createTime = date.getFullYear() + "-" + month + "-" + day;
              return item
            })
          } else {
            _this.$alert(response.msg);
          }
        }).catch(function() {
          _this.$alert("请求失败！");
        })
      }
    }
  }
</script>

<style type="text/stylus" lang="stylus" rel="stylesheet/stylus">

</style>
