<template>
  <div class="property-list">
    <Table :columns="columns" :data="properties" width="660"></Table>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { formatDate, formatTime } from '@/utils/moment'
export default {
  name: 'PropertyList',
  data() {
    return {
      columns: [
        {
          title: 'ID',
          key: 'propertyId',
          width: 60,
          align: 'center'
        },
        {
          title: '属性名称',
          key: 'name',
          width: 150,
          align: 'center',
          render: (h, params) => {
            const { background, border, name } = params.row
            return h('div', {
              style: {
                display: 'inline-block',
                padding: '0 10px',
                backgroundColor: background,
                borderColor: border,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: '20px'
              }
            }, [
              h('span', {
                style: {
                  color: '#fff',
                  fontSize: '16px'
                }
              }, name)
            ])
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
                      name: 'property-edit',
                      params: {
                        id: params.row.propertyId
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
                      await this.RemoveProperty(params.row.propertyId)
                      this.$Message.success('删除成功~')
                      this.FetchProperties().catch(err => {
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
      properties: ({ baseConfig }) => baseConfig.properties
    })
  },
  methods: {
    ...mapActions(['FetchProperties', 'RemoveProperty'])
  },
  created() {
    this.FetchProperties().catch(err => {
      this.$Message.error(err.message)
    })
  }
}
</script>
<style lang="scss">
div.property-list {
  padding: 20px;
  .ivu-table-wrapper {
    margin: 0 auto;
  }
}
</style>