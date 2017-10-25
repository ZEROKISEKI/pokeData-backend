<!-- --------------------------使用方式:------------------------------>
<!--<poke-upload :multiple="true" :images.sync="xxx"></poke-upload>-->
<!--<poke-upload :multiple="false" :image.sync="xxx">-->
<template>
  <div class="poke-upload" :class="multiple ? 'multiple-upload' : ''">
    <div v-if="multiple" v-for="(item, index) in files"
         :key="index" class="image-list" :style="displaySize">
      <img v-if="item" :src="qiniuImage(item)" :width="size" :height="size" />
      <div class="upload-cover">
        <Icon type="trash-a" @click.native="removeImage(index)"></Icon>
      </div>
    </div>
    <Upload
      ref="data" accept="image/*"
      :max-size="maxSize"
      :headers="headers"
      :multiple="multiple"
      :show-upload-list="false"
      action="/upload/image"
      :default-file-list="defaultList"
      :before-upload="handleBeforeUpload"
      :on-error="handleError"
      :on-success="handleSuccess">
      <template v-if="multiple">
        <div class="upload multiple-upload" :style="displaySize">
          <Icon type="plus-round" :size="size"></Icon>
        </div>
      </template>
      <template v-else>
        <!-- 单图展示图片 -->
        <div class="upload" v-if="defaultUrl || image">
          <img v-if="defaultUrl && !image" :src="qiniuImage(defaultUrl)" />
          <img v-if="image" :src="qiniuImage(image)">
          <div class="upload-cover">
            <Icon type="plus-round" :style="displayPlus"></Icon>
          </div>
        </div>
        <div v-if="!defaultUrl && !image" class="empty-container" :style="displaySize">
          <Icon type="plus-round" :size="size"></Icon>
        </div>
      </template>
      <Spin size="large" fix v-if="!uploadComplete">
        <Icon type="load-c" size='18' class="demo-spin-icon-load"></Icon>
        <div>上传图片中</div>
      </Spin>
    </Upload>
  </div>
</template>
<script>
import { qiniuHost, qiniuImageOptions } from '@/utils/qiniu'
export default {
  name: 'PokeUpload',
  props: {
    // 多图上传的图片集合
    images: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 单图上传的图片
    image: {
      type: String,
    },
    // 用于单张图片上传时的默认展示
    defaultUrl: {
      type: String,
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    imageOption: {
      type: String,
      default: qiniuImageOptions.imageBase
    },
    maxSize: {
      type: Number,
      default: 2048
    },
    // 上传框的大小
    size: {
      type: String,
      default: '100'
    }
  },
  data() {
    const token = localStorage.getItem('jwt')
    return {
      headers: {
        'authorization': `Bearer ${token}`
        // 'Content-Type': 'application/octet-stream',
        // 'Accept': 'application/octet-stream'
      },
      files: this.images || [],
      list: [],
      uploadComplete: true
    }
  },
  computed: {
    defaultList() {
      if (!this.multiple) {
        return []
      } else {
        return this.images.map(image => {
          return {
            name: image.substring(image.lastIndexOf('/')),
            url: image
          }
        })
      }
    },
    displaySize() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`
      }
    },
    displayPlus() {
      return {
        fontSize: `${this.size / 2}px`,
        marginLeft: `-${this.size * 0.75 / 4}px`,
        marginTop: `-${this.size / 4}px`
      }
    }
  },
  methods: {
    handleBeforeUpload() {
      if(this.uploadComplete) {
        this.uploadComplete = false
      }
      return true
    },
    handleError(error, file, fileList) {
      if(error && error.status === 401) {
        this.$Message.error('不正确或没有身份授权, 请先进行登录')
      } else {
        this.$Message.error(`文件${file.name}上传失败, 请重新尝试~`)
      }
    },
    handleSuccess(response, file, fileList) {
      if(!this.multiple) {
        this.$emit('update:image', response[0].key)
        this.uploadComplete = true
        this.$Message.success('图片上传成功~')
      } else {
        // TODO 修改获取上传图片的方式
        const list = fileList.filter(e => !e.hasOwnProperty('url'))
        if (list.every(e => e.hasOwnProperty('response'))) {
          for(let key in list) {
            const res = list[key].response
            this.files.push(res[0].key)
          }
          this.$emit('update:images', this.files)
          this.uploadComplete = true
          this.$Message.success('图片上传成功~')
        }
      }
    },
    removeImage(index) {
      this.files.splice(index, 1)
      this.$emit('update:images', this.files)
    },
    qiniuImage(url) {
      return `${qiniuHost}/${url}?${this.imageOption}`
    }
  },
  mounted() {
    if(this.multiple) {
      this.list = this.$refs['data'].fileList
    }
  }
}
</script>
<style lang="scss">
div.poke-upload {
  .upload-cover {
    display: block;
    opacity: 0;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
    transition: all .4s;
    i {
      color: #fff;
      font-size: 40px;
      cursor: pointer;
      margin: 0 2px;
    }
    .ivu-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -15px;
      margin-top: -20px;
    }
  }
  .empty-container {
    display: inline-block;
    width: 100px;
    position: relative;
    text-align: center;
    line-height: 1;
    border: 3px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
    box-sizing: content-box;
    cursor: pointer;
  }
  .ivu-upload {
    .upload {
      display: inline-block;
      position: relative;
      text-align: center;
      line-height: 1;
      border-style: solid;
      border-color: transparent;
      border-width: 3px 3px 1px 3px;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
      margin-right: 4px;
    }
    .upload:hover .upload-cover {
      opacity: 1;
    }
  }
  .ivu-spin-fix {
    background-color: transparent;
  }
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  @keyframes ani-demo-spin {
    from { transform: rotate(0deg);}
    50%  { transform: rotate(180deg);}
    to   { transform: rotate(360deg);}
  }
}
div.poke-upload.multiple-upload {
  display: flex;
  flex-wrap: wrap;
  .image-list {
    flex: 0 1 auto;
    width: 100px;
    height: 100px;
    border: 3px solid transparent;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 10px;
    border-radius: 4px;
    box-sizing: content-box;
    position: relative;
    margin-bottom: 10px;
  }
  .image-list:hover .upload-cover {
    opacity: 1;
  }
  .ivu-upload {
    .upload.multiple-upload {
      display: inline-block;
      width: 100px;
      position: relative;
      text-align: center;
      line-height: 1;
      border: 3px solid transparent;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
      margin-right: 4px;
      box-sizing: content-box;
    }
  }
}
</style>