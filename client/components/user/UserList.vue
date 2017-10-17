<template>
  <div class="user-list">
    <Table :columns="columns" :data="users"></Table>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { formatDate, formatTime } from '@/utils/moment'
import { PokeData } from 'proto'
export default {
  name: 'UserList',
  data() {
    return {
      columns: [
        {
          title: 'ID',
          key: 'userId',
          align: 'center',
          width: 80
        },
        {
          title: '账号名称',
          key: 'username',
          align: 'center',
          width: 150
        },
        {
          title: '账号权限',
          key: 'role',
          align: 'center',
          width: 100,
          render: (h, params) => {
            let role
            switch(params.row.role) {
              case PokeData.PBUserRole.NORMAL_USER:
                role = '普通用户'
                break
              case PokeData.PBUserRole.NORMAL_ADMIN:
                role = '普通管理员'
                break
              case PokeData.PBUserRole.SUPER_ADMIN:
                role = '超级管理员'
                break
            }
            return h('span', role)
          }
        },
        {
          title: '账号状态',
          key: 'isLocked',
          align: 'center',
          width: 60,
          render: (h, params) => {
            return h('span', params.row.isLocked ? '已锁' : '未锁')
          }
        },
        {
          title: '账号使用邀请码',
          key: 'inviteCode',
          align: 'center',
          width: 150,
          render: (h, params) => {
            return h('span', params.row.inviteCode ? params.row.inviteCode : '未使用邀请码')
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center',
          width: 150,
          render: (h, params) => {
            const { createTime } = params.row
            if (typeof createTime !== 'undefined' && createTime) {
              const date = new Date(createTime)
              return [
                h('span', formatDate(date)),
                h('br'),
                h('span', formatTime(date))
              ]
            } else {
              return h('span', ' - ')
            }
          }
        },
        {
          title: '上次修改时间',
          key: 'lastModifyTime',
          align: 'center',
          width: 150,
          render: (h, params) => {
            const { lastModifyTime } = params.row
            if (typeof lastModifyTime !== 'undefined' && lastModifyTime) {
              const date = new Date(lastModifyTime)
              return [
                h('span', formatDate(date)),
                h('br'),
                h('span', formatTime(date))
              ]
            } else {
              return h('span', ' - ')
            }
          }
        },
        {
          title: '上次登录时间',
          key: 'lastLoginTime',
          align: 'center',
          width: 150,
          render: (h, params) => {
            const { lastLoginTime } = params.row
            if (typeof lastLoginTime !== 'undefined' && lastLoginTime) {
              const date = new Date(lastLoginTime)
              return [
                h('span', formatDate(date)),
                h('br'),
                h('span', formatTime(date))
              ]
            } else {
              return h('span', ' - ')
            }
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 150,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.$router.push({
                      name: 'user-edit',
                      params: {
                        id: params.row.userId
                      }
                    })
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: async () => {
                    try {
                      await this.RemoveUser(params.row.userId)
                      this.$Message.success('删除用户成功~')
                      this.FetchUsers({
                        offset: this.offset,
                        limit: this.limit
                      }).catch(err => this.$Message.error(err.message))
                    } catch(err) {
                      this.$Message.error(err.message)
                    }
                  }
                }
              }, '删除')
            ]);
          }
        }
      ]
    }
  },
  computed: {
    ...mapState({
      users: ({ user }) => user.users
    })
  },
  methods: {
    ...mapActions(['FetchUsers', 'RemoveUser'])
  },
  created() {
    ({ offset: this.offset = 0, limit: this.limit = 20 } = this.$route.query)
    this.FetchUsers({
      offset: this.offset,
      limit: this.limit
    }).catch(err => this.$Message.error(err.message))
  }
}
</script>
<style scoped lang="scss">
div.user-list {
  padding: 20px;
}
</style>