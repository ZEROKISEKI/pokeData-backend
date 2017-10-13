<template>
  <div class="feature-list">
    <Table :columns="columns" :data="features" width="1100"></Table>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { formatTime, formatDate } from '@/utils/moment'
import TableExpand from '@/components/common/table/FeatureListExpand'
export default {
  name: 'FeatureList',
  components: {
    TableExpand
  },
  data() {
    return {
      columns: [
        {
          type: 'expand',
          width: 60,
          render: (h, params) => {
            return h(TableExpand, {
              props: {
                row: params.row
              }
            })
          }
        },
        {
          title: 'ID',
          key: 'featureId',
          width: 60,
          align: 'center'
        },
        {
          title: '特性名称',
          key: 'name',
          width: 150,
          align: 'center'
        },
        {
          title: '特性说明',
          key: 'description',
          width: 300,
          align: 'center'
        },
        {
          title: '显示',
          key: 'visible',
          width: 80,
          align: 'center',
          render: (h, params) => {
            const { visible } = params.row
            return h('span', visible ? '可见' : '不可见')
          }
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
                      name: 'feature-edit',
                      params: {
                        id: params.row.featureId
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
                      await this.RemoveFeature(params.row.featureId)
                      this.$Message.success('删除成功~')
                      this.FetchFeatures({
                        offset: this.offset,
                        limit: this.limit
                      }).catch(err => {
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
      features: ({ baseConfig }) => baseConfig.features
    })
  },
  methods: {
    ...mapActions(['FetchFeatures', 'RemoveFeature'])
  },
  created() {
    ({ offset: this.offset = 0, limit: this.limit = 20 } = this.$route.query)
    this.FetchFeatures({
      offset: this.offset,
      limit: this.limit
    }).catch(err => {
      this.$Message.error(err.message)
    })
  }
}
</script>
<style lang="scss">
div.feature-list {
  padding: 20px;
  .ivu-table-wrapper {
    margin: 0 auto;
  }
}
</style>