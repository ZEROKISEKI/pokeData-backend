<template>
  <div class="register">
    <i-input size="large" v-model="username" placeholder="用户名" icon="person"></i-input>
    <i-input size="large" type="password"
             v-model="password" placeholder="密码" icon="locked"></i-input>
    <i-input size="large" v-model="inviteCode" placeholder="邀请码, 选填"></i-input>
    <Button type="primary" @click="submit()" long>注册</Button>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'Register',
  data() {
    return {
      username: '',
      password: '',
      inviteCode: ''
    }
  },
  methods: {
    ...mapActions(['register']),
    async submit() {
      if (!this.username || !this.password) {
        this.$Message.error('大佬注册个账号不要连密码和用户名都不填啊...')
        return
      }
      let inviteCode
      if (this.inviteCode) {
        inviteCode = this.inviteCode
      }
      try {
        await this.register({
          username: this.username,
          password: this.password,
          inviteCode
        })
        this.$Message.success('注册账号成功')
        this.$router.push({
          name: 'login',
          path: '/login'
        })
      } catch (err) {
        this.$Message.error(err.message)
      }
    }
  }
}
</script>
<style lang="scss">

</style>