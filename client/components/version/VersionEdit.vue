<template>
  <div class="version-edit">
    <Form ref="version" :model="version" :label-width="80" :rules="rulesValidate">
      <Row type="flex" justify="start" :gutter="16">
        <i-col span="8">
          <FormItem label="版本名称" prop="abstr">
            <i-input v-model="version.abstr"></i-input>
          </FormItem>
          <FormItem label="版本全名" prop="name">
            <i-input v-model="version.name"></i-input>
          </FormItem>
          <FormItem label="版本世代" prop="generation">
            <InputNumber v-model="version.generation" :min="1" :max="100"></InputNumber>
          </FormItem>
          <FormItem label="背景颜色" prop="background">
            <ColorPicker v-model="version.background"></ColorPicker>
            <i-input v-model="version.background" class="block-input"></i-input>
          </FormItem>
          <FormItem label="字体颜色" prop="font">
            <ColorPicker v-model="version.font"></ColorPicker>
            <i-input v-model="version.font" class="block-input"></i-input>
          </FormItem>
          <FormItem>
            <Button type="primary" long @click="updateVersion" v-if="checkRoute">提交</Button>
            <Button type="primary" long @click="addVersion" v-else>添加</Button>
          </FormItem>
        </i-col>
      </Row>
    </Form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'VersionEdit',
  data() {
    return {
      version: {
        background: '',
        font: ''
      },
      rulesValidate: {
        abstr: [
          { required: true, message: '该项为必填项', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '该项为必填项', trigger: 'blur' }
        ],
        generation: [
          // { required: true, message: '该项为必填项', trigger: 'blur' }
        ],
        background: [
          { type: 'string', pattern: /^#[0-9A-Fa-f]{6}$/,
            len: 7, message: '颜色值必须为类似#12ABFF这样的值'}
        ],
        font: [
          { type: 'string', pattern: /^#[0-9A-Fa-f]{6}$/,
            len: 7, message: '颜色值必须为类似#12ABFF这样的值'}
        ]
      }
    }
  },
  computed: {
    checkRoute() {
      return this.$route.params.id
    }
  },
  methods: {
    ...mapActions(['FetchVersion', 'UpdateVersion', 'AddVersion']),
    // TODO 考虑加上装饰器
    async updateVersion() {
      const { id } = this.$route.params
      const self = this
      this.$refs['version'].validate(async (valid) => {
        if(valid) {
          try {
            const version = await self.UpdateVersion({
              id,
              version: self.version
            })
            self.$Message.success('修改游戏版本信息成功～')
            self.version = version
            self.$router.push({
              name: 'version-list'
            })
          } catch(err) {
            self.$Message.error(err.message)
          }
        } else {
          self.$Message.error('信息填写错误, 请检查无误后再提交!')
        }
      })
    },
    async addVersion() {
      const self = this
      this.$refs['version'].validate(async (valid) => {
        if(valid) {
          try {
            await self.AddVersion(self.version)
            self.$Message.success('添加游戏版本成功～')
            self.$router.push({
              name: 'version-list'
            })
          } catch(err) {
            self.$Message.error(err.message)
          }
        } else {
          self.$Message.error('信息填写错误, 请检查无误后再提交!')
        }
      })
    }
  },
  created() {
    const { id } = this.$route.params
    if(id) {
      this.FetchVersion(id).then(data => {
        this.version = Object.assign({}, data)
      }).catch(err => {
        this.$Message.error(err.message)
      })
    }
  }
}
</script>
<style lang="scss">
div.version-edit {
  padding: 50px;
  .block-input {
    width: auto;
  }
}
</style>