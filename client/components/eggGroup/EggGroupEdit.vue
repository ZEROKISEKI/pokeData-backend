<template>
  <div class="eggGroup-edit">
    <Form ref="eggGroup" :rules="rulesValidate" :model="eggGroup" :label-width="80">
      <Row type="flex" justify="start" :gutter="16">
        <i-col span="8">
          <Card>
            <FormItem label="蛋群名称" prop="name">
              <i-input v-model="eggGroup.name"></i-input>
            </FormItem>
            <FormItem label="背景颜色" prop="background">
              <ColorPicker v-model="eggGroup.background"></ColorPicker>
              <i-input v-model="eggGroup.background" class="block-input"></i-input>
            </FormItem>
            <FormItem label="边距颜色" prop="border">
              <ColorPicker v-model="eggGroup.border"></ColorPicker>
              <i-input v-model="eggGroup.border" class="block-input"></i-input>
            </FormItem>
            <Button type="primary" long @click="updateEggGroup" v-if="checkRoute">提交</Button>
            <Button type="primary" long @click="addEggGroup" v-else>添加</Button>
          </Card>
        </i-col>
      </Row>
    </Form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'EggGroupEdit',
  data() {
    return {
      eggGroup: {
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
    ...mapActions(['UpdateEggGroup', 'AddEggGroup', 'FetchEggGroup']),
    updateEggGroup() {
      const { id } = this.$route.params
      const self = this
      this.$refs['eggGroup'].validate(async (valid) => {
        if(valid) {
          try {
            const eggGroup = await self.UpdateEggGroup({
              id,
              eggGroup: self.eggGroup
            })
            self.$Message.success('修改蛋群数据信息成功～')
            self.eggGroup = eggGroup
            self.$router.push({
              name: 'eggGroup-list'
            })
          } catch(err) {
            self.$Message.error(err.message)
          }
        } else {
          self.$Message.error('信息填写错误, 请检查无误后再提交!')
        }
      })
    },
    addEggGroup() {
      const self = this
      this.$refs['eggGroup'].validate(async (valid) => {
        if(valid) {
          try {
            await self.AddEggGroup(self.eggGroup)
            self.$Message.success('添加蛋群数据成功～')
            self.$router.push({
              name: 'eggGroup-list'
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
      this.FetchEggGroup(id).then(data => {
        this.eggGroup = Object.assign({}, data)
      }).catch(err => {
        this.$Message.error(err.message)
      })
    }
  }
}
</script>
<style lang="scss">
div.eggGroup-edit {
  padding: 50px;
  .block-input {
    width: auto;
  }
}
</style>