<template>
  <div class="login">
    <i-input size="large" v-model="username" placeholder="用户名" icon="person"></i-input>
    <i-input size="large" type="password" v-model="password" placeholder="密码" icon="locked"></i-input>
    <Button type="primary" @click="submit()" long>登录</Button>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    ...mapActions(['login']),
    async submit() {
      if (!this.username || !this.password) {
        this.$Message.error('用户名或密码没有填写完整!')
        return
      }
      try {
        await this.login({
          username: this.username,
          password: this.password
        })
        this.$Message.success('登录成功~')
        this.$router.push({
          name: 'manage',
        })
      } catch (err) {
        this.$Message.error(err.message)
      }
    }
  }
}
</script>
<style scoped lang="scss">

</style>