<template>
  <div>
    <el-upload
      v-loading="loading"
      element-loading-text="上传中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      action="#"
      list-type="picture-card"
      :file-list="fileList"
      :on-change="onChange"
      :http-request="httpRequest"
      :on-remove="onRemove"
      :on-preview="onPreview"
      :limit="limit"
      :class="`${fileList.length === limit?'hideCard':''}`"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog title="图片预览" :visible.sync="previewImgDialogVisible">
      <img style="width: 100%" src="http://destiny001.gitee.io/image/cxk.gif">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKID0JUYTAeuviIgt1we9Qp7FBslY8cv661w',
  SecretKey: 'rWyDJIC2nQsSvDJF0d9Xoz88veDvW8hC'
})
console.log(cos)
export default {
  name: 'UploadImg',
  props: {
    limit: {
      type: Number,
      default: 1
    },
    beforeUploadCheck: {
      type: Function
    }
  },
  data() {
    return {
      fileList: [
        // { name: 'default', url: 'http://destiny001.gitee.io/image/cxk.gif' },
        // { name: 'default1', url: 'http://destiny001.gitee.io/image/cxk.gif' }
      ],
      imgUrl: '',
      previewImgDialogVisible: false,
      loading: false
    }
  },
  mounted() {

  },
  methods: {
    onChange(file, fileList) {
      // file 当前上传的图片
      // fileList 图片列表
      //   console.log('上传图片', file, fileList)
      this.fileList = fileList
    },
    httpRequest(data) {
    //   console.log(data)
    //   console.log('===')
      this.loading = true
      cos.putObject({
        Bucket: 'picture-storage-1313544701', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-nanjing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: data.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        StorageClass: 'STANDARD',
        Body: data.file, // 上传文件对象
        onProgress: function(progressData) {
          console.log(JSON.stringify(progressData))
        // 这个就是上传的百分比
        // params.percent 表示当前上传的进度
        }
      }, (err, data) => {
        // console.log(err || data)
        this.loading = false
        if (!err && data.statusCode === 200) {
          if (err || data.statusCode !== 200) {
            return this.$message.error('上传失败,请重试')
          }
          this.$emit('onSuccess', {
            url: 'https://' + data.Location
          })
        }
      })
    },
    onRemove(file, fileList) {
    //   console.log({ file })
    //   console.log({ fileList })
      this.fileList = fileList
    },
    onPreview(file) {
    //   console.log(file.url)
      this.previewImgDialogVisible = true
      this.imgUrl = file.url
    },
    beforeUpload(file) {
      if (this.beforeUploadCheck && !this.beforeUploadCheck()) {
        return false
      }
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error(`请上传正确的图片格式\n${types.join(',')}`)
        return false
      }
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片大小限制5M')
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss">
.hideCard {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
