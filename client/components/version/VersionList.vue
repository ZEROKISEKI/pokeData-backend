<template>
  <div class="version-list">
    <Table :columns="columns" :data="versions" width="870"></Table>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { formatTime, formatDate } from '@/utils/moment'
export default {
  name: 'VersionList',
  data() {
    return {
      columns: [
        {
          title: 'ID',
          key: 'versionId',
          width: 60,
          align: 'center'
        },
        {
          title: '版本名称',
          key: 'abstr',
          width: 150,
          align: 'center',
          render: (h, params) => {
            const { background, font, abstr } = params.row
            return h('span', {
              style: {
                backgroundColor: background,
                color: font,
                padding: '5px 10px',
                fontSize: '16px'
              }
            }, abstr)
          }
        },
        {
          title: '世代',
          key: 'generation',
          align: 'center',
          width: 60,
        },
        {
          title: '详细名称',
          key: 'name',
          align: 'center',
          width: 150,
        },
        {
          title: '创建时间',
          key: 'createTime',
          width: 150,
          align: 'center',
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
          title: '修改时间',
          key: 'modifyTime',
          width: 150,
          align: 'center',
          render: (h, params) => {
            const { modifyTime } = params.row
            if (typeof modifyTime !== 'undefined' && modifyTime) {
              const date = new Date(modifyTime)
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
                      name: 'version-edit',
                      params: {
                        id: params.row.versionId
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
                      await this.RemoveVersion(params.row.versionId)
                      this.$Message.success('删除成功~')
                      this.FetchVersions().catch(err => {
                        this.$Message.error(err.message)
                      })
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
      versions: ({ baseConfig }) => baseConfig.versions
    })
  },
  methods: {
    ...mapActions(['FetchVersions', 'RemoveVersion'])
  },
  created() {
    this.FetchVersions().catch(err => {
      this.$Message.error(err.message)
    })
  }
}
</script>
<style lang="scss">
div.version-list {
  padding: 20px;
  .ivu-table-wrapper {
    margin: 0 auto;
  }
}
</style>