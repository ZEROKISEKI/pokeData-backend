<template>
  <div class="person-list">
    <Table :columns="columns" :data="persons"></Table>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { formatDate, formatTime } from '@/utils/moment'
import { PokeData } from 'proto'
import TableExpand from '@/components/common/table/PersonListExpand'
export default {
  name: 'PersonList',
  data() {
    return {
      columns: [
        {
          type: 'expand',
          fixed: 'left',
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
          key: 'personId',
          align: 'center',
          width: 80,
        },
        {
          title: '人物名称',
          key: 'name',
          align: 'center',
          width: 150
        },
        {
          title: '人物性别',
          key: 'sex',
          align: 'center',
          width: 100,
          render: (h, params) => {
            let sex
            switch(params.row.sex) {
              case PokeData.PBSex.UNKNOW:
                sex = '未知'
                break
              case PokeData.PBSex.MALE:
                sex = '男'
                break
              case PokeData.PBSex.FEMALE:
                sex = '女'
                break
            }
            return h('span', sex)
          }
        },
        {
          title: '人物身高',
          key: 'high',
          align: 'center',
          width: 100,
          render: (h, params) => {
            const { high } = params.row
            return high ? h('span', `${high}cm`) : h('span', '未知')
          }
        },
        {
          title: '人物体重',
          key: 'weight',
          align: 'center',
          width: 100,
          render: (h, params) => {
            const { weight } = params.row
            return weight ? h('span', `${weight}kg`) : h('span', '未知')
          }
        },
        {
          title: '人物生日',
          key: 'birthday',
          align: 'center',
          width: 150,
          render: (h, params) => {
            const { birthday } = params.row
            return birthday ? h('span', birthday) : h('span', '未知')
          }
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
                      name: 'person-edit',
                      params: {
                        id: params.row.personId
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
                      await this.RemovePerson(params.row.personId)
                      this.$Message.success('删除成功~')
                      this.FetchPersons({
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
      persons: ({ person }) => person.persons
    })
  },
  methods: {
    ...mapActions(['FetchPersons', 'RemovePerson'])
  },
  created() {
    ({ offset: this.offset = 0, limit: this.limit = 20 } = this.$route.query)
    this.FetchPersons({
      offset: this.offset,
      limit: this.limit
    }).catch(err => {
      this.$Message.error(err.message)
    })
  }
}
</script>
<style lang="scss">
div.person-list {
  padding: 20px;
}
</style>