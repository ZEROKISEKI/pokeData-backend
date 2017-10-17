<template>
  <Row class="manage" type="flex">
    <i-col span="24">
      <div class="manage-header">
        <div class="manage-header-left">
          <Button>
            <Icon type="navicon" color="#9ba7b5" size="32"></Icon>
          </Button>
        </div>
        <div class="manage-header-right">
        </div>
      </div>
    </i-col>
    <i-col span="4" class="manage-menu" ref="manageMenu">
      <Menu theme="light" width="auto" @on-select="routeTo">
        <Submenu name="pokemon">
          <template slot="title">
            <Icon type="ios-paper"></Icon>
            宝可梦模块
          </template>
          <MenuItem name="pokemon-list">宝可梦列表</MenuItem>
          <MenuItem name="pokemon-edit">添加宝可梦</MenuItem>
        </Submenu>
        <Submenu name="item">
          <template slot="title">
            <Icon type="ios-people"></Icon>
            道具模块
          </template>
          <MenuItem name="item-list">道具列表</MenuItem>
          <MenuItem name="item-edit">添加道具</MenuItem>
        </Submenu>
        <Submenu name="skill">
          <template slot="title">
            <Icon type="stats-bars"></Icon>
            技能模块
          </template>
          <MenuItem name="skill-list">技能列表</MenuItem>
          <MenuItem name="skill-edit">添加技能</MenuItem>
        </Submenu>
        <Submenu name="person">
          <template slot="title">
            <Icon type="ios-people"></Icon>
            人物模块
          </template>
          <MenuItem name="person-list">人物列表</MenuItem>
          <MenuItem name="person-edit">添加人物</MenuItem>
        </Submenu>
        <Submenu name="user">
          <template slot="title">
            <Icon type="ios-people"></Icon>
            用户管理
          </template>
          <MenuItem name="user-list">用户列表</MenuItem>
          <MenuItem name="user-edit">添加用户</MenuItem>
        </Submenu>
        <Submenu name="baseConfig">
          <template slot="title">
            <Icon type="stats-bars"></Icon>
            基础配置
          </template>
          <MenuGroup title="游戏版本">
            <MenuItem name="version-list">版本列表</MenuItem>
            <MenuItem name="version-edit">添加版本</MenuItem>
          </MenuGroup>
          <MenuGroup title="蛋群">
            <MenuItem name="eggGroup-list">蛋群列表</MenuItem>
            <MenuItem name="eggGroup-edit">添加蛋群</MenuItem>
          </MenuGroup>
          <MenuGroup title="属性">
            <MenuItem name="property-list">属性列表</MenuItem>
            <MenuItem name="property-edit">添加属性</MenuItem>
          </MenuGroup>
          <MenuGroup title="特性">
            <MenuItem name="feature-list">特性列表</MenuItem>
            <MenuItem name="feature-edit">添加特性</MenuItem>
          </MenuGroup>
        </Submenu>
      </Menu>
    </i-col>
    <i-col span="20" class="manage-content">
      <router-view></router-view>
    </i-col>
  </Row>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  components: {},
  name: 'Manage',
  data() {
    return {}
  },
  computed: {
    ...mapState({
      userId: ({ auth }) => auth.userId,
      username: ({ auth }) => auth.username,
    })
  },
  methods: {
    ...mapActions(['logged']),
    routeTo(name) {
      this.$router.push({ name })
    }
  },
  created() {
    this.logged()
    this.$nextTick(() => {
      // TODO 寻找不需要使用DOM就能达到效果的方法
      document.getElementsByClassName('manage-menu')[0].style['min-height']
        = `${document.body.clientHeight - 53}px`
    })
  }
}
</script>
<style lang="scss">

  .manage {
    border: 1px solid #d7dde4;
    border-bottom: 0;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: auto;
    height: 100%;
    align-content: stretch;
    justify-content: stretch;
  }

  .manage-header {
    background: #495060;
    padding: 10px 0;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .manage-header-left {
      flex: 0 1 auto;
      margin-left: 15px;
      .ivu-btn {
        background: transparent;
        border: 0;
        padding: 0;
      }
    }

    .manage-header-right {
      flex: 0 1 auto;
      font-size: 16px;
      margin-right: 15px;
      a {
        color: #9ba7b5;
      }
    }
  }

  .manage-menu {
    .ivu-menu {
      height: 100%;
      a {
        color: inherit;
      }
    }
  }

</style>