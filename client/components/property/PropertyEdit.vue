<template>
  <div class="property-edit">
    <Form ref="property" :rules="rulesValidate" :model="property" :label-width="80">
      <Row type="flex" justify="start" :gutter="16">
        <i-col span="8">
          <Card>
            <FormItem label="属性名称" prop="name">
              <i-input v-model="property.name"></i-input>
            </FormItem>
            <FormItem label="背景颜色" prop="background">
              <ColorPicker v-model="property.background"></ColorPicker>
              <i-input v-model="property.background" class="block-input"></i-input>
            </FormItem>
            <FormItem label="边距颜色" prop="border">
              <ColorPicker v-model="property.border"></ColorPicker>
              <i-input v-model="property.border" class="block-input"></i-input>
            </FormItem>
            <Button type="primary" long @click="updateProperty" v-if="checkRoute">提交</Button>
            <Button type="primary" long @click="addProperty" v-else>添加</Button>
          </Card>
        </i-col>
      </Row>
    </Form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'PropertyEdit',
  data() {
    return {
      property: {
        background: '',
        border: ''
      },
      rulesValidate: {
        name: [
          { required: true, message: '该项为必填项', trigger: 'blur' }
        ],
        background: [
          { type: 'string', pattern: /^#[0-9A-Fa-f]{6}$/,
            len: 7, message: '颜色值必须为类似#12ABFF这样的值'}
        ],
        border: [
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
    ...mapActions(['UpdateProperty', 'AddProperty', 'FetchProperty']),
    updateProperty() {
      const { id } = this.$route.params
      const self = this
      this.$refs['property'].validate(async (valid) => {
        if(valid) {
          try {
            const property = await self.UpdateProperty({
              id,
              property: self.property
            })
            self.$Message.success('修改属性数据信息成功～')
            self.property = property
            self.$router.push({
              name: 'property-list'
            })
          } catch(err) {
            self.$Message.error(err.message)
          }
        } else {
          self.$Message.error('信息填写错误, 请检查无误后再提交!')
        }
      })
    },
    addProperty() {
      const self = this
      this.$refs['property'].validate(async (valid) => {
        if(valid) {
          try {
            await self.AddProperty(self.property)
            self.$Message.success('添加属性数据成功～')
            self.$router.push({
              name: 'property-list'
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
      this.FetchProperty(id).then(data => {
        this.property = Object.assign({}, data)
      }).catch(err => {
        this.$Message.error(err.message)
      })
    }
  }
}
</script>
<style lang="scss">
div.property-edit {
  padding: 50px;
  .block-input {
    width: auto;
  }
}
</style>