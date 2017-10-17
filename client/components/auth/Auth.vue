<template>
  <div id="auth">
    <Row type="flex" justify="center" align="middle" class="auth">
      <i-col span="4">
        <div class="authForm">
          <Tabs :value="authOP" @on-click="changeAuthOP()">
            <TabPane label="注册" name="register"></TabPane>
            <TabPane label="登录" name="login"></TabPane>
          </Tabs>
          <router-view></router-view>
        </div>
      </i-col>
    </Row>
  </div>
</template>
<script>
export default {
  components: {

  },
  name: 'Auth',
  data() {
    return {}
  },
  computed: {
    authOP() {
      return this.$route.name
    }
  },
  methods: {
    checkAuthOP(name) {
      return this.$route.name === name ? 'primary': 'ghost'
    },
    changeAuthOP() {
      if (this.authOP === 'register') {
        this.$router.push({ name: 'login' })
      } else {
        this.$router.push({ name: 'register' })
      }
    }
  },
}
</script>
<style lang="scss">
div#auth {
  height: 100%;
}
.auth {
  height: 100%;
}
div.authForm {
  input.ivu-input {
    margin-bottom: 10px;
  }
  div.ivu-tabs-bar {
    border-bottom: 0;
  }
  div.ivu-tabs-nav-scroll {
    display: flex;
    justify-content: center;
  }
}
</style>