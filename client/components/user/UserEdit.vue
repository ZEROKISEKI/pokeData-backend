<template>
  <div class="user-edit">
    <Form ref="user" :model="user" :rules="rules" :label-width="80">
      <Row type="flex" justify="start" :gutter="16">
        <i-col span="10">
          <FormItem label="账号名称" prop="username">
            <i-input v-model="user.username" placeholder="请填写名称..."></i-input>
          </FormItem>
          <!-- TODO 待修改账号密码表单 -->
          <FormItem label="账号密码" prop="password">
            <Button type="primary" v-if="checkRoute && !openPassword"
                    @click="openPassword = true">修改密码</Button>
            <i-input type="password" v-model="password" placeholder="请输入密码..."
                     icon="close" @on-click="openPassword = false"
                     v-else-if="checkRoute && openPassword"></i-input>
            <i-input type="password" v-model="user.password"
                     placeholder="请输入密码..." v-else></i-input>
          </FormItem>
          <FormItem label="账号权限">
            <RadioGroup v-model="user.role">
              <Radio v-for="(option, index) in roleOptions"
                     :label="option.value" :key="index">{{ option.text }}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="账号状态">
            <i-switch v-model="user.isLocked" size="large">
              <span slot="open">已锁</span>
              <span slot="close">未锁</span>
            </i-switch>
          </FormItem>
          <FormItem label="账号邀请码">
            <i-input v-model="user.inviteCode" :disabled="checkRoute"></i-input>
          </FormItem>
          <FormItem label="账号头像">
            <poke-upload :defaultUrl="defaultAvatar"
                         :image.sync="user.avatar" :imageOption="imageOption"></poke-upload>
          </FormItem>
          <FormItem>
            <Button type="primary" long @click="updateUser" v-if="checkRoute">提交</Button>
            <Button type="primary" long @click="addUser" v-else>添加</Button>
          </FormItem>
        </i-col>
      </Row>
    </Form>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { PokeData } from 'proto'
import PokeUpload from '@/components/common/Upload'
import { qiniuImageOptions } from '@/utils/qiniu'
export default {
  name: 'UserEdit',
  components: {
    PokeUpload
  },
  data() {
    const { id } = this.$route.params
    const password = []
    if(!id) {
      password.push({
        required: true, message: '该项为必填项', trigger: 'blur'
      })
    }
    return {
      user: {
        avatar: '',
        role: PokeData.PBUserRole.NORMAL_USER,
        inviteCode: '',
        isLocked: false,
      },
      rules: {
        username: [
          { required: true, message: '该项为必填项', trigger: 'blur '}
        ],
        password
      },
      defaultAvatar: 'user/default.jpg',
      imageOption: qiniuImageOptions.imageAuto200x100,
      password: '',
      openPassword: false
    }
  },
  computed: {
    roleOptions() {
      return [
        {
          text: '普通用户',
          value: PokeData.PBUserRole.NORMAL_USER
        },
        {
          text: '普通管理员',
          value: PokeData.PBUserRole.NORMAL_ADMIN
        },
        {
          text: '超级管理员',
          value: PokeData.PBUserRole.SUPER_ADMIN
        }
      ]
    },
    checkRoute() {
      return !!this.$route.params.id
    }
  },
  methods: {
    ...mapActions(['FetchUser', 'AddUser', 'UpdateUser']),
    async updateUser() {
      const { id } = this.$route.params
      const self = this
      this.$refs['user'].validate(async (valid) => {
        if(valid) {
          const user = Object.assign({}, self.user)
          if(self.openPassword && self.password) {
            user.password = self.password
          }
          const modifyUser = await self.UpdateUser({
            id,
            user
          })
          self.$Message.success('修改账号信息成功～')
          self.user = modifyUser
          self.$router.push({
            name: 'user-list'
          })
        } else {
          self.$Message.error('信息填写错误, 请检查无误后再提交!')
        }
      })
    },
    async addUser() {
      const self = this
      this.$refs['user'].validate(async (valid) => {
        if(valid) {
          try {
            await self.AddUser(self.user)
            self.$Message.success('添加账号成功～')
            self.$router.push({
              name: 'user-list'
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
      this.FetchUser(id).then(data => {
        this.user = Object.assign({}, data)
      }).catch(err => {
        this.$Message.error(err.message)
      })
    }
  }
}
</script>
<style lang="scss">
div.user-edit {
  padding: 50px;
}
</style>