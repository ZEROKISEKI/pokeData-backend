<template>
  <div class="skill-list">
    <Table :columns="columns" :data="skills"></Table>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { formatDate, formatTime } from '@/utils/moment'
import { PokeData } from 'proto'
export default {
  name: 'SkillList',
  data() {
    return {
      columns: [
        {
          title: 'ID',
          key: 'skillId',
          align: 'center',
          width: 80,
          fixed: 'left'
        },
        {
          title: '技能编号',
          key: 'number',
          align: 'center',
          width: 100,
          render: (h, param) => {
            const { number } = param.row
            return h('span', `${number > 100 ? '0' : ''}${number > 10 ? '0' : ''}${number}`)
          }
        },
        {
          title: '技能名称',
          key: 'name',
          align: 'center',
          width: 100
        },
        {
          title: '属性',
          key: 'property',
          align: 'center',
          width: 80
        },
        {
          title: '分类',
          key: 'kind',
          align: 'center',
          width: 80,
          render: (h, param) => {
            let kind
            switch(param.row.kind) {
              case PokeData.PBSkillKind.PHYSICAL:
                kind = '物理'
                break
              case PokeData.PBSkillKind.SPECIAL:
                kind = '特殊'
                break
              case PokeData.PBSkillKind.CHANGED:
                kind = '变化'
                break
            }
            return h('span', kind)
          }
        },
        {
          title: '威力',
          key: 'power',
          align: 'center',
          width: 80,
          render: (h, param) => h('span', param.row.power === 0 ? '-' : param.row.power)
        },
        {
          title: '命中率',
          key: 'hit',
          align: 'center',
          width: 80,
          render: (h, param) => h('span', param.row.hit === 0 ? '-' : param.row.hit)
        },
        {
          title: 'PP',
          key: 'pp',
          align: 'center',
          width: 80,
          render: (h, param) => {
            const { pp = {} } = param.row
            return h('span', pp.min || '暂无信息')
          }
        },
        {
          title: '范围',
          key: 'range',
          align: 'center',
          width: 150,
          render: (h, param) => {
            let range
            switch(param.row.range) {
              case PokeData.PBSkillRange.TO_ALL:
                range = '除自身以外场上全部可以攻击到的宝可梦'
                break
              case PokeData.PBSkillRange.TO_ONE:
                range = '除自身以外场上一只可以攻击到的宝可梦'
                break
              case PokeData.PBSkillRange.TO_OWN:
                range = '自身'
                break
            }
            return h('span', range)
          }
        },
        {
          title: '显示',
          key: 'visible',
          width: 80,
          align: 'center',
          render: (h, param) => {
            const { visible } = param.row
            return h('span', visible ? '可见' : '不可见')
          }
        },
        {
          title: '创建时间',
          key: 'createTime',
          width: 150,
          align: 'center',
          render: (h, param) => {
            const { createTime } = param.row
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
          render: (h, param) => {
            const { modifyTime } = param.row
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
          fixed: 'right',
          width: 150,
          render: (h, param) => {
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
                      name: 'skill-edit',
                      params: {
                        id: param.row.skillId
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
                      await this.RemoveSkill(param.row.skillId)
                      this.$Message.success('删除成功~')
                      this.FetchSkills({
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
      skills: ({ skill }) => skill.skills
    })
  },
  methods: {
    ...mapActions(['FetchSkills', 'RemoveSkill'])
  },
  created() {
    ({ offset: this.offset = 0, limit: this.limit = 20 } = this.$route.query)
    this.FetchSkills({
      offset: this.offset,
      limit: this.limit
    }).catch(err => {
      this.$Message.error(err.message)
    })
  }
}
</script>
<style lang="scss">
div.skill-list {
  padding: 20px;
}
</style>