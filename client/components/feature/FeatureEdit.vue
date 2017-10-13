<template>
  <div class="feature-edit">
    <Form ref="feature" :model="feature" :label-width="80" :rules="rulesValidate">
      <Row type="flex" justify="start" :gutter="16">
        <i-col span="10">
          <FormItem label="特性名称" prop="name">
            <i-input v-model="feature.name"></i-input>
          </FormItem>
          <FormItem label="显示可见">
            <i-switch v-model="feature.visible">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
          <FormItem label="特性说明">
            <i-input type="textarea" :rows="3" v-model="feature.description"></i-input>
          </FormItem>
          <FormItem label="特性效果">
            <Row v-for="i in feature.effect.length" :key="i" type="flex" :gutter="16">
              <i-col span="24">
                <div class="effect-container">
                  <i-input v-model="feature.effect[i - 1]"
                           type="textarea" :rows="3" placeholder="请输入效果描述..."></i-input>
                  <Button type="error" long @click="removeEffect(i - 1)">删除</Button>
                </div>
              </i-col>
            </Row>
          </FormItem>
          <FormItem>
            <Button type="dashed" icon="plus-round" long @click="addEffect">增加效果</Button>
          </FormItem>
          <FormItem>
            <Button type="primary" long @click="updateFeature" v-if="checkRoute">提交</Button>
            <Button type="primary" long @click="addFeature" v-else>添加</Button>
          </FormItem>
        </i-col>
      </Row>
    </Form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'FeatureEdit',
  data() {
    return {
      feature: {
        effect: []
      },
      rulesValidate: {
        name: [
          { required: true, message: '该项为必填项', trigger: 'blur' }
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
    ...mapActions(['FetchFeature', 'AddFeature', 'UpdateFeature']),
    addEffect() {
      this.feature.effect.push('')
    },
    removeEffect(index) {
      this.feature.effect.splice(index, 1)
    },
    async addFeature() {
      const self = this
      this.$refs['feature'].validate(async (valid) => {
        if(valid) {
          try {
            await self.AddFeature(self.feature)
            self.$Message.success('添加特性数据信息成功～')
            self.$router.push({
              name: 'feature-list'
            })
          } catch(err) {
            self.$Message.error(err.message)
          }
        } else {
          self.$Message.error('信息填写错误, 请检查无误后再提交!')
        }
      })
    },
    updateFeature() {
      const { id } = this.$route.params
      const self = this
      this.$refs['feature'].validate(async (valid) => {
        if(valid) {
          try {
            const feature = await self.UpdateFeature({
              id,
              feature: self.feature
            })
            self.$Message.success('修改特性数据信息成功～')
            self.feature = feature
            self.$router.push({
              name: 'feature-list'
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
      this.FetchFeature(id).then(data => {
        this.feature = Object.assign({}, data)
      }).catch(err => {
        this.$Message.error(err.message)
      })
    }
  }
}
</script>
<style lang="scss">
div.feature-edit {
  padding: 50px;
  .effect-container {
    padding: 10px;
    border: 1px dashed #888;
    border-radius: 5px;
    margin-bottom: 10px;
    .ivu-btn {
      margin-top: 5px;
    }
  }
}
</style>