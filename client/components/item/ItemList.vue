<template>
  <div class="item-list">
    <Table :columns="columns" :data="items"></Table>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { formatTime, formatDate } from '@/utils/moment'
import { PokeData } from 'proto'
import TableExpand from '@/components/common/table/ItemListExpand'
export default {
  name: 'ItemList',
  components: {
    TableExpand
  },
  data() {
    return {
      columns: [
        {
          type: 'expand',
          width: 50,
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
          key: 'itemId',
          width: 60,
          align: 'center',
        },
        {
          title: '道具名称',
          key: 'name',
          align: 'center',
          render: (h, params) => {
            const { icon } = params.row
            if (typeof icon !== 'undefined' && icon) {
              return h('div', [
                // TODO 添加图标
                h('span', params.row.name)
              ])
            } else {
              return h('span', params.row.name)
            }
          }
        },
        {
          title: '道具使用',
          key: 'usage',
          align: 'center',
          render: (h, params) => {
            let usage
            switch (params.row.usage) {
              case PokeData.PBItemUsage.ONCE:
                usage = '一次性使用'
                break
              case PokeData.PBItemUsage.UNAVAILABLE:
                usage = '不可使用'
                break
              case PokeData.PBItemUsage.REPEATED:
                usage = '多次使用'
                break
            }
            return h('span', usage)
          }
        },
        {
          title: '道具场景',
          key: 'scene',
          align: 'center',
          render: (h, params) => {
            const { scene } = params.row
            // TODO 增加 Item scene使用场景关于null的判断
            if (typeof scene !== 'undefined') {
              return h('span', scene ? '对战外' : '对战内')
            } else {
              return h('span', ' - ')
            }
          }
        },
        {
          title: '购入价格',
          key: 'pay',
          align: 'center',
          render: (h, params) => {
            const { pay } = params.row
            return h('span', pay ? `${pay}元` : '- ')
          }
        },
        {
          title: '售出价格',
          key: 'sale',
          align: 'center',
          render: (h, params) => {
            const { sale } = params.row
            return h('span', sale ? `${sale}元` : '- ')
          }
        },
        {
          title: '投掷次数',
          key: 'throw',
          align: 'center',
          render: (h, params) => h('span', params.row.throw ? params.row.throw : '无法投掷')
        },
        {
          title: '首次出现',
          key: 'appearance',
          align: 'center',
          render: (h, params) => {
            const { appearance } = params.row
            return h('span', appearance.join('/'))
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
                      name: 'item-edit',
                      params: {
                        id: params.row.itemId
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
                      await this.RemoveItem(params.row.itemId)
                      this.$Message.success('删除道具成功~')
                      this.FetchItems({
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
      items: ({ item }) => item.items
    })
  },
  methods: {
    ...mapActions(['FetchItems', 'RemoveItem'])
  },
  created() {
    ({ offset: this.offset = 0, limit: this.limit = 20 } = this.$route.query)
    this.FetchItems({
      offset: this.offset,
      limit: this.limit
    }).catch(err => {
      this.$Message.error(err.message)
    })
  }
}
</script>
<style lang="scss">

</style>