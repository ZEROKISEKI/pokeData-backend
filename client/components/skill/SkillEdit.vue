<template>
  <div class="skill-edit">
    <Form ref="skill" :model="skill" :rules="rules" :label-width="90">
      <Row type="flex" :gutter="16">
        <i-col span="14">
          <Card>
            <p slot="title">技能基本信息</p>
            <FormItem label="技能编号">
              <InputNumber v-model="skill.number" :min="1"></InputNumber>
            </FormItem>
            <FormItem label="技能名称" prop="name">
              <Row type="flex" :gutter="16">
                <i-col span="10">
                  <i-input v-model="skill.name" placeholder="请输入名字..."></i-input>
                </i-col>
              </Row>
            </FormItem>
            <FormItem label="技能动图" prop="scene">
              <poke-upload :image.sync="skill.scene"></poke-upload>
            </FormItem>
            <FormItem label="技能属性">
              <Row type="flex" :gutter="16">
                <i-col span="8">
                  <i-select v-model="skill.property" placeholder="请选择属性...">
                    <i-option v-for="property in properties"
                              :key="property.name"
                              :value="property.name">{{ property.name }}</i-option>
                  </i-select>
                </i-col>
              </Row>
            </FormItem>
            <FormItem label="技能分类">
              <RadioGroup v-model="skill.kind">
                <Radio v-for="(option, index) in skillKindOptions"
                       :label="option.value" :key="index">{{ option.text }}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="技能描述">
              <i-input type="textarea" :rows="3"
                       v-model="skill.description" placeholder="请输入技能描述..."></i-input>
            </FormItem>
            <Tooltip content="设置为0表示 -" placement="top">
              <FormItem label="技能威力">
                <InputNumber v-model="skill.power" :min="0"></InputNumber>
              </FormItem>
            </Tooltip>
            <Tooltip content="设置为0表示 -" placement="right-start">
              <FormItem label="技能命中率">
                <InputNumber v-model="skill.hit" :min="0" :max="100"></InputNumber>
              </FormItem>
            </Tooltip>
            <FormItem label="技能pp值" prop="pp">
              <Row type="flex" :gutter="16">
                <i-col span="10">
                  <i-input v-model="skill.pp.base">
                    <span slot="prepend">基础值</span>
                  </i-input>
                </i-col>
                <i-col span="10">
                  <i-input v-model="skill.pp.max">
                    <span slot="prepend">最大值</span>
                  </i-input>
                </i-col>
              </Row>
            </FormItem>
            <FormItem label="技能范围">
              <RadioGroup v-model="skill.range">
                <Radio v-for="(option, index) in skillRangeOptions"
                       :label="option.value" :key="index">{{ option.text }}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="Z技能" prop="zSkill">
              <Row type="flex" :gutter="16">
                <i-col span="8">
                  <i-input v-model="skill.zSkill.crystal">
                    <span slot="prepend">Z技能结晶</span>
                  </i-input>
                </i-col>
                <i-col span="8">
                  <i-input v-model="skill.zSkill.name">
                    <span slot="prepend">Z技能名称</span>
                  </i-input>
                </i-col>
                <i-col span="8">
                  <i-input v-model="skill.zSkill.power">
                    <span slot="prepend">Z技能威力</span>
                  </i-input>
                </i-col>
              </Row>
            </FormItem>
            <FormItem label="技能别名" class="aliasName-item" prop="aliasName">
              <Row v-for="i in Math.ceil(skill.aliasName.length / 3)"
                   :key="i" type="flex" :gutter="16">
                <i-col v-for="index in aliasNameSection(i)" :key="index" span="7">
                  <i-input type="text" v-model="skill.aliasName[index]" icon="close"
                           @on-click="removeAliasName(index)"></i-input>
                </i-col>
              </Row>
              <Button type="dashed" long v-if="skill.aliasName.length === 0"
                      icon="plus-round" @click="addAliasName">增加别名</Button>
            </FormItem>
            <FormItem v-if="skill.aliasName.length > 0">
              <Button type="dashed" long icon="plus-round" @click="addAliasName">增加别名</Button>
            </FormItem>
            <FormItem label="显示可见">
              <i-switch v-model="skill.visible">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
          </Card>
        </i-col>
        <i-col span="10">
          <Card style="margin-bottom: 10px;">
            <p slot="title">技能相关特性说明</p>
            <FormItem prop="features" :label-width="1">
              <div class="container" v-for="i in skill.features.length"
                   :key="i" style="margin-bottom: 10px;">
                <i-input v-model="skill.features[i - 1]" icon="close"
                         @on-click="removeFeature(i - 1)"
                         placeholder="example: 不是接触类招式"></i-input>
              </div>
              <Button type="dashed" long v-if="skill.features.length === 0"
                      icon="plus-round" @click="addFeature">增加特性说明</Button>
            </FormItem>
            <FormItem v-if="skill.features.length > 0" :label-width="1">
              <Button type="dashed" long icon="plus-round" @click="addFeature">增加特性说明</Button>
            </FormItem>
          </Card>
          <Card>
            <p slot="title">技能附加效果</p>
            <FormItem prop="effect" :label-width="1">
              <div class="container" v-for="i in skill.effect.length"
                   :key="i" style="margin-bottom: 10px;">
                <i-input v-model="skill.effect[i - 1]" icon="close"
                         @on-click="removeEffect(i - 1)"
                         placeholder="example: 令使用者的攻击提升2级。"></i-input>
              </div>
              <Button type="dashed" long v-if="skill.effect.length === 0"
                      icon="plus-round" @click="addEffect">增加附加效果</Button>
            </FormItem>
            <FormItem v-if="skill.effect.length > 0" :label-width="1">
              <Button type="dashed" long icon="plus-round" @click="addEffect">增加附加效果</Button>
            </FormItem>
          </Card>
        </i-col>
      </Row>
      <Row type="flex" :gutter="16">
        <i-col span="24">
          <Card class="pokemons-card">
            <p slot="title">等级提升习得该技能的宝可梦</p>
            <Button slot="extra" icon="plus" type="text"
                    @click="addSkillPokemon('level')"
                    :loading="addLoading.level">添加宝可梦</Button>
            <edit-table v-if="columns.level.length > 0"
                        :columns="columns.level"
                        :loading.sync="addLoading.level"
                        :renders="renders.level"
                        :data.sync="skill.pokemons.level"></edit-table>
          </Card>
        </i-col>
      </Row>
      <Row type="flex" :gutter="16">
        <i-col span="24">
          <Card class="pokemons-card">
            <p slot="title">遗传习得该技能的宝可梦</p>
            <Button slot="extra" icon="plus" type="text"
                    @click="addSkillPokemon('inherit')"
                    :loading="addLoading.inherit">添加宝可梦</Button>
            <edit-table v-if="columns.inherit.length > 0"
                        :columns="columns.inherit"
                        :loading.sync="addLoading.inherit"
                        :renders="renders.inherit"
                        :data.sync="skill.pokemons.inherit"></edit-table>
          </Card>
        </i-col>
      </Row>
      <Row type="flex" :gutter="16">
        <i-col span="24">
          <Card class="pokemons-card">
            <p slot="title">技能学习机习得该技能的宝可梦</p>
            <Button slot="extra" icon="plus" type="text"
                    @click="addSkillPokemon('item')"
                    :loading="addLoading.item">添加宝可梦</Button>
            <edit-table v-if="columns.item.length > 0"
                        :columns="columns.item"
                        :loading.sync="addLoading.item"
                        :renders="renders.item"
                        :data.sync="skill.pokemons.item"></edit-table>
          </Card>
        </i-col>
      </Row>
      <Row type="flex" :gutter="16">
        <i-col span="24">
          <Card class="pokemons-card">
            <p slot="title">教授习得该技能的宝可梦</p>
            <Button slot="extra" icon="plus" type="text"
                    @click="addSkillPokemon('learn')"
                    :loading="addLoading.learn">添加宝可梦</Button>
            <edit-table v-if="columns.learn.length > 0"
                        :columns="columns.learn"
                        :loading.sync="addLoading.learn"
                        :renders="renders.learn"
                        :data.sync="skill.pokemons.learn"></edit-table>
          </Card>
        </i-col>
      </Row>
      <Row type="flex" :gutter="16">
        <i-col span="24">
          <Card class="pokemons-card">
            <p slot="title">其他途径习得该技能的宝可梦</p>
            <Poptip placement="top" width="100" slot="extra">
              <Button icon="plus" type="text">选择世代列表</Button>
              <div slot="content" class="generations-choice">
                <poke-checkbox :source.sync="skill.pokemons.others"
                               label="generation" :options="generations"
                               :unit="{ data: [] }"
                               :display="GenerationCheckbox">
                </poke-checkbox>
              </div>
            </Poptip>
            <Card v-for="(list, index) in skill.pokemons.others"
                  class="pokemons-others-card"
                  :key="list.generation">
              <p slot="title">第{{ list.generation }}世代</p>
              <Button slot="extra" icon="plus" type="text"
                      @click="addSkillPokemon('others', index)"
                      :loading="addLoading.others[index]">添加宝可梦</Button>
              <edit-table v-if="skill.pokemons.others[index].data.length > 0"
                          :columns="columns.others"
                          :width="650"
                          :loading.sync="addLoading.others[index]"
                          :renders="renders.others"
                          :data.sync="skill.pokemons.others[index].data"></edit-table>
            </Card>
          </Card>
        </i-col>
      </Row>
    </Form>
    <Card style="margin-top: 10px;">
      <Row type="flex" :gutter="16" justify="center">
        <i-col span="10">
          <Button type="primary" long @click="updateSkill" v-if="checkRoute">提交</Button>
          <Button type="primary" long @click="addSkill" v-else>添加</Button>
        </i-col>
      </Row>
    </Card>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { PokeData } from 'proto'
import PokeUpload from '@/components/common/Upload'
import PokeSelect from '@/components/common/Select'
import PokeCheckbox from '@/components/common/Checkbox'
import EditTable from '@/components/common/table/EditTable'
import SkillEditingCell from '@/components/common/table/cell/SkillEditingCell'
import SkillDisplayCell from '@/components/common/table/cell/SkillDisplayCell'
import SkillLevelEditingCell from '@/components/common/table/cell/SkillLevelEditingCell'
import SkillLevelDisplayCell from '@/components/common/table/cell/SkillLevelDisplayCell'
import SkillInheritDisplayCell from '@/components/common/table/cell/SkillInheritDisplayCell'
import SkillInheritEditingCell from '@/components/common/table/cell/SkillInheritEditingCell'
import SkillItemEditingCell from '@/components/common/table/cell/SkillItemEditingCell'
import SkillItemDisplayCell from '@/components/common/table/cell/SkillItemDisplayCell'
import SkillLearnDisplayCell from '@/components/common/table/cell/SkillLearnDisplayCell'
import SkillLearnEditingCell from '@/components/common/table/cell/SkillLearnEditingCell'

// 由于要用到很多次，所以直接抽出来
/**
 *
 * @param vm --- EditTable组件本身
 * @param param --- iview table column 的param
 * @returns {function()} --- 对应按钮的callback, 具体查看EditTable.vue
 */
const saveSkillPokemon = (vm, param) => {
  return () => {
    const rowDataIndex = vm.rowData[param.index].generations.findIndex(e => {
      return e.number === param.column.generation
    })
    const editingStoreIndex = vm.editingStore[param.index].generations.findIndex(e => {
      return e.number === param.column.generation
    })
    vm.rowData[param.index].generations[rowDataIndex] = JSON.parse(JSON.stringify(vm.editingStore[param.index].generations[editingStoreIndex]))
    vm.editingStore[param.index].editingCell[param.column.key] = false
    vm.rowData[param.index].editingCell[param.column.key] = false
  }
}

const cancelSkillPokemon = (vm, param) => {
  return () => {
    const generation = vm.rowData[param.index].generations.find(generation => {
      return generation.number === param.column.generation
    })
    const index = vm.editingStore[param.index].generations.findIndex(generation => {
      return generation.number === param.column.generation
    })
    vm.editingStore[param.index].generations[index] = JSON.parse(JSON.stringify(generation))

    vm.editingStore[param.index].editingCell[param.column.key] = false
    vm.rowData[param.index].editingCell[param.column.key] = false
  }
}

export default {
  name: 'SkillEdit',
  components: {
    PokeUpload,
    PokeSelect,
    PokeCheckbox,
    EditTable,
    SkillLevelEditingCell,
    SkillLevelDisplayCell,
    SkillEditingCell,
    SkillDisplayCell,
    SkillInheritEditingCell,
    SkillInheritDisplayCell,
    SkillItemEditingCell,
    SkillItemDisplayCell,
    SkillLearnDisplayCell,
    SkillLearnEditingCell
  },
  data() {
    return {
      skill: {
        number: 1,
        kind: PokeData.PBSkillKind.PHYSICAL,
        range: PokeData.PBSkillRange.TO_ONE,
        power: 100,
        hit: 100,
        scene: '',
        aliasName: [],
        pp: {},
        features: [],
        effect: [],
        zSkill: {},
        pokemons: {
          level: [],
          inherit: [],
          item: [],
          learn: [],
          others: []
        }
      },
      rules: {
        name: [
          { required: true, message: '该项为必填项', trigger: 'blur' }
        ],
        aliasName:  [
          {
            type: 'array',
            defaultField: {
              type: 'string', required: true, message: '请填写完整别名,如不填需要删除'
            }
          }
        ],
        property: [
          { required: true, message: '技能必须要填写属性', trigger: 'blur' }
        ]
      },
      // 用作表格使用
      columns: {
        level: [],
        inherit: [],
        item: [],
        learn: [],
        others: []
      },
      renders: {
        level: [],
        inherit: [],
        item: [],
        learn: [],
        others: []
      },
      addLoading: {
        level: false,
        inherit: false,
        item: false,
        learn: false,
        others: []
      },
      generations: [],
    }
  },
  computed: {
    ...mapState({
      properties: ({ baseConfig }) => baseConfig.properties,
      versions: ({ baseConfig }) => baseConfig.versions
    }),
    skillKindOptions() {
      return [
        {
          text: '物理',
          value: PokeData.PBSkillKind.PHYSICAL
        },
        {
          text: '特殊',
          value: PokeData.PBSkillKind.SPECIAL
        },
        {
          text: '变化',
          value: PokeData.PBSkillKind.CHANGED
        }
      ]
    },
    skillRangeOptions() {
      return [
        {
          text: '除自身以外场上一只可以攻击到的宝可梦',
          value: PokeData.PBSkillRange.TO_ONE
        },
        {
          text: '除自身以外场上全部可以攻击到的宝可梦',
          value: PokeData.PBSkillRange.TO_ALL
        },
        {
          text: '自身',
          value: PokeData.PBSkillRange.TO_OWN
        }
      ]
    },
    checkRoute() {
      return !!this.$route.params.id
    }
  },
  methods: {
    ...mapActions(['AddSkill', 'UpdateSkill',
      'FetchSkill', 'FetchProperties', 'FetchVersions']),
    initColumns(kind, versions) {
      if(kind !== 'others') {
        for(let i = 0; i < versions.length; i++) {
          if (!this.columns[kind].find(e => e.generation === versions[i].generation)) {
            this.columns[kind].push({
              title: `第${versions[i].generation}世代`,
              key: `generation-${kind}-${versions[i].generation}`,
              align: 'center',
              width: 200,
              generation: versions[i].generation,
              editable: true,
            })
          }
        }
      } else {
        this.columns[kind].push({
          title: '宝可梦习得方式说明',
          key: 'way',
          align: 'center',
          width: 400,
          editable: true,
        })
      }
      this.initRenders(kind)
    },
    initRenders(kind) {
      switch(kind) {
        case 'level': {
          for(let i = 0; i < this.columns['level'].length; i++) {
            this.renders['level'].push({
              key: this.columns['level'][i].key,
              render: (vm, h, currentRow, param, saveIconBtn, editIconBtn, cancelIconBtn) => {
                return h('Row', {
                  props: { type: 'flex', gutter: 16, align: 'middle' },
                  style: { height: '100%' }
                }, this.checkGeneration(param.row, param.column.generation) ? [
                  h('i-col', {
                    props: {
                      span: vm.editingStore[param.index].editingCell[param.column.key] ? '24' : '20'
                    },
                    style: !vm.editingStore[param.index].editingCell[param.column.key] ? {
                      paddingRight: '0',
                    } : {
                      paddingRight: '0',
                      paddingLeft: '0'
                    }
                  }, vm.editingStore[param.index].editingCell[param.column.key] ? [
                    h(SkillLevelEditingCell, {
                      props: {
                        row: vm.editingStore[param.index],
                        generation: param.column.generation,
                        versions: this.versions
                      }
                    })
                  ] : [
                    h(SkillLevelDisplayCell, {
                      props: {
                        row: vm.editingStore[param.index],
                        generation: param.column.generation,
                        versions: this.versions
                      }
                    })
                  ]),
                  h('i-col', {
                    props: {
                      span: vm.editingStore[param.index].editingCell[param.column.key] ? '24' : '4'
                    },
                    style: !vm.editingStore[param.index].editingCell[param.column.key] ? {
                      paddingLeft: '0'
                    } : {}
                  }, vm.editingStore[param.index].editingCell[param.column.key] ? [
                    h('Row', {
                      props: { type: 'flex', gutter: 16, align: 'middle' },
                      style: { marginLeft: '0' }
                    }, [
                      h('i-col', {
                        props: { span: '12' },
                        style: { textAlign: 'right' }
                      }, [saveIconBtn(vm, h, param, saveSkillPokemon(vm, param))]),
                      h('i-col', {
                        props: { span: '12' },
                        style: { textAlign: 'left' }
                      }, [cancelIconBtn(vm, h, param, cancelSkillPokemon(vm, param))])
                    ]),
                  ] : [
                    editIconBtn(vm, h, param)
                  ])
                ]: [
                  h('i-col', {
                    props: {
                      span: '24'
                    }
                  }, [
                    h('Button', {
                      props: {
                        type: 'text',
                        icon: 'plus',
                        long: true
                      },
                      on: {
                        click: () => {
                          vm.rowData[param.index].generations.push({
                            number: param.column.generation,
                            value: []
                          })
                          vm.editingStore[param.index].generations.push({
                            number: param.column.generation,
                            value: []
                          })
                        }
                      }
                    })
                  ])
                ])
              }
            })
          }
          break
        }
        case 'inherit': {
          for(let i = 0; i < this.columns['inherit'].length; i++) {
            this.renders['inherit'].push({
              key: this.columns['inherit'][i].key,
              render: (vm, h, currentRow, param, saveIconBtn, editIconBtn, cancelIconBtn) => {
                return h('Row', {
                  props: { type: 'flex', gutter: 16, align: 'middle' },
                  style: { height: '100%' }
                }, this.checkGeneration(param.row, param.column.generation) ? [
                  h('i-col', {
                    props: {
                      span: vm.editingStore[param.index].editingCell[param.column.key] ? '24' : '20'
                    },
                    style: !vm.editingStore[param.index].editingCell[param.column.key] ? {
                      paddingRight: '0',
                      paddingLeft: '0',
                      height: '100%',
                      borderRight: '1px solid #e9eaec'
                    } : {
                      paddingRight: '0',
                      paddingLeft: '0'
                    }
                  }, vm.editingStore[param.index].editingCell[param.column.key] ? [
                    h(SkillInheritEditingCell, {
                      props: {
                        row: vm.editingStore[param.index],
                        generation: param.column.generation,
                      }
                    })
                  ] : [
                    h(SkillInheritDisplayCell, {
                      props: {
                        row: vm.editingStore[param.index],
                        generation: param.column.generation,
                      }
                    })
                  ]),
                  h('i-col', {
                    props: {
                      span: vm.editingStore[param.index].editingCell[param.column.key] ? '24' : '4'
                    },
                    style: !vm.editingStore[param.index].editingCell[param.column.key] ? {
                      paddingLeft: '0',
                      paddingRight: '0'
                    } : {}
                  }, vm.editingStore[param.index].editingCell[param.column.key] ? [
                    h('Row', {
                      props: { type: 'flex', gutter: 16, align: 'middle' },
                      style: { marginLeft: '0' }
                    }, [
                      h('i-col', {
                        props: { span: '12' },
                        style: { textAlign: 'right' }
                      }, [saveIconBtn(vm, h, param, saveSkillPokemon(vm, param))]),
                      h('i-col', {
                        props: { span: '12' },
                        style: { textAlign: 'left' }
                      }, [cancelIconBtn(vm, h, param, cancelSkillPokemon(vm, param))])
                    ]),
                  ] : [
                    editIconBtn(vm, h, param)
                  ])
                ] : [
                  h('i-col', {
                    props: {
                      span: '24'
                    }
                  }, [
                    h('Button', {
                      props: {
                        type: 'text',
                        icon: 'plus',
                        long: true
                      },
                      on: {
                        click: () => {
                          vm.rowData[param.index].generations.push({
                            number: param.column.generation,
                            parents: []
                          })
                          vm.editingStore[param.index].generations.push({
                            number: param.column.generation,
                            parents: []
                          })
                        }
                      }
                    })
                  ])
                ])
              }
            })
          }
          break
        }
        case 'item': {
          for(let i = 0; i < this.columns['item'].length; i++) {
            this.renders['item'].push({
              key: this.columns['item'][i].key,
              render: (vm, h, currentRow, param, saveIconBtn, editIconBtn, cancelIconBtn) => {
                return h('Row', {
                  props: { type: 'flex', gutter: 16, align: 'middle' },
                  style: { height: '100%' }
                }, this.checkGeneration(param.row, param.column.generation) ? [
                  h('i-col', {
                    props: {
                      span: vm.editingStore[param.index].editingCell[param.column.key] ? '24' : '20'
                    },
                    style: !vm.editingStore[param.index].editingCell[param.column.key] ? {
                      paddingRight: '0',
                      paddingLeft: '0',
                      height: '100%',
                      borderRight: '1px solid #e9eaec'
                    } : {
                      paddingRight: '0',
                      paddingLeft: '0'
                    }
                  }, vm.editingStore[param.index].editingCell[param.column.key] ? [
                    h(SkillItemEditingCell, {
                      props: {
                        row: vm.editingStore[param.index],
                        generation: param.column.generation,
                      }
                    })
                  ] : [
                    h(SkillItemDisplayCell, {
                      props: {
                        row: vm.editingStore[param.index],
                        generation: param.column.generation,
                      }
                    })
                  ]),
                  h('i-col', {
                    props: {
                      span: vm.editingStore[param.index].editingCell[param.column.key] ? '24' : '4'
                    },
                    style: !vm.editingStore[param.index].editingCell[param.column.key] ? {
                      paddingLeft: '0',
                      paddingRight: '0'
                    } : {}
                  }, vm.editingStore[param.index].editingCell[param.column.key] ? [
                    h('Row', {
                      props: { type: 'flex', gutter: 16, align: 'middle' },
                      style: { marginLeft: '0' }
                    }, [
                      h('i-col', {
                        props: { span: '12' },
                        style: { textAlign: 'right' }
                      }, [saveIconBtn(vm, h, param, saveSkillPokemon(vm, param))]),
                      h('i-col', {
                        props: { span: '12' },
                        style: { textAlign: 'left' }
                      }, [cancelIconBtn(vm, h, param, cancelSkillPokemon(vm, param))])
                    ]),
                  ] : [
                    editIconBtn(vm, h, param)
                  ])
                ] : [
                  h('i-col', {
                    props: {
                      span: '24'
                    }
                  }, [
                    h('Button', {
                      props: {
                        type: 'text',
                        icon: 'plus',
                        long: true
                      },
                      on: {
                        click: () => {
                          vm.rowData[param.index].generations.push({
                            number: param.column.generation,
                            items: []
                          })
                          vm.editingStore[param.index].generations.push({
                            number: param.column.generation,
                            items: []
                          })
                        }
                      }
                    })
                  ])
                ])
              }
            })
          }
          break
        }
        case 'learn': {
          for(let i = 0; i < this.columns['learn'].length; i++) {
            this.renders['learn'].push({
              key: this.columns['learn'][i].key,
              render: (vm, h, currentRow, param, saveIconBtn, editIconBtn, cancelIconBtn) => {
                return h('Row', {
                  props: { type: 'flex', gutter: 16, align: 'middle' },
                  style: { height: '100%' }
                }, this.checkGeneration(param.row, param.column.generation) ? [
                  h('i-col', {
                    props: {
                      span: vm.editingStore[param.index].editingCell[param.column.key] ? '24' : '20'
                    },
                    style: !vm.editingStore[param.index].editingCell[param.column.key] ? {
                      paddingRight: '0',
                      paddingLeft: '0',
                      height: '100%',
                      borderRight: '1px solid #e9eaec'
                    } : {
                      paddingRight: '0',
                      paddingLeft: '0'
                    }
                  }, vm.editingStore[param.index].editingCell[param.column.key] ? [
                    h(SkillLearnEditingCell, {
                      props: {
                        row: vm.editingStore[param.index],
                        generation: param.column.generation,
                        versions: this.versions
                      }
                    })
                  ] : [
                    h(SkillLearnDisplayCell, {
                      props: {
                        row: vm.editingStore[param.index],
                        generation: param.column.generation,
                        versions: this.versions
                      }
                    })
                  ]),
                  h('i-col', {
                    props: {
                      span: vm.editingStore[param.index].editingCell[param.column.key] ? '24' : '4'
                    },
                    style: !vm.editingStore[param.index].editingCell[param.column.key] ? {
                      paddingLeft: '0',
                      paddingRight: '0'
                    } : {}
                  }, vm.editingStore[param.index].editingCell[param.column.key] ? [
                    h('Row', {
                      props: { type: 'flex', gutter: 16, align: 'middle' },
                      style: { marginLeft: '0' }
                    }, [
                      h('i-col', {
                        props: { span: '12' },
                        style: { textAlign: 'right' }
                      }, [saveIconBtn(vm, h, param, saveSkillPokemon(vm, param))]),
                      h('i-col', {
                        props: { span: '12' },
                        style: { textAlign: 'left' }
                      }, [cancelIconBtn(vm, h, param, cancelSkillPokemon(vm, param))])
                    ]),
                  ] : [
                    editIconBtn(vm, h, param)
                  ])
                ] : [
                  h('i-col', {
                    props: {
                      span: '24'
                    }
                  }, [
                    h('Button', {
                      props: {
                        type: 'text',
                        icon: 'plus',
                        long: true
                      },
                      on: {
                        click: () => {
                          vm.rowData[param.index].generations.push({
                            number: param.column.generation,
                            version: []
                          })
                          vm.editingStore[param.index].generations.push({
                            number: param.column.generation,
                            version: []
                          })
                        }
                      }
                    })
                  ])
                ])
              }
            })
          }
          break
        }
        case 'others': {
          this.renders['others'].push({
            key: 'way',
            render: (vm, h, currentRow, param, saveIconBtn, editIconBtn, cancelIconBtn) => {
              return h('Row', {
                props: { type: 'flex', gutter: 16, align: 'middle' },
                style: { height: '100%' }
              }, [
                h('i-col', {
                  props: {
                    span: vm.editingStore[param.index].editingCell[param.column.key] ? '24' : '20'
                  },
                  style: {
                    paddingRight: '0',
                  }
                }, vm.editingStore[param.index].editingCell[param.column.key] ? [
                  h('i-input', {
                    props: {
                      type: 'text',
                      placeholder: '请写出习得技能的方式',
                      value: vm.editingStore[param.index].way
                    },
                    style: {
                      padding: '10px'
                    },
                    on: {
                      'on-change' (event) {
                        vm.editingStore[param.index].way = event.target.value;
                      }
                    }
                  })
                ] : [h('span', vm.editingStore[param.index].way)]),
                h('i-col', {
                  props: {
                    span: vm.editingStore[param.index].editingCell[param.column.key] ? '24' : '4'
                  },
                }, vm.editingStore[param.index].editingCell[param.column.key] ? [
                  h('Row', {
                    props: { type: 'flex', gutter: 16, align: 'middle' },
                    style: { marginLeft: '0' }
                  }, [
                    h('i-col', {
                      props: { span: '12' },
                      style: { textAlign: 'right' }
                    }, [saveIconBtn(vm, h, param, () => {
                      vm.rowData[param.index].way = vm.editingStore[param.index].way
                      vm.editingStore[param.index].editingCell[param.column.key] = false
                      vm.rowData[param.index].editingCell[param.column.key] = false
                    })]),
                    h('i-col', {
                      props: { span: '12' },
                      style: { textAlign: 'left' }
                    }, [cancelIconBtn(vm, h, param, () => {
                      vm.editingStore[param.index].way = vm.rowData[param.index].way
                      vm.editingStore[param.index].editingCell[param.column.key] = false
                      vm.rowData[param.index].editingCell[param.column.key] = false
                    })])
                  ]),
                ] : [
                  editIconBtn(vm, h, param)
                ])
              ])
            }
          })
          break
        }
      }
      this.completeColAndRenders(kind)
    },
    completeColAndRenders(kind) {
      this.columns[kind].unshift({
        title: '宝可梦',
        key: 'pokemon',
        align: 'center',
        fixed: 'left',
        width: 150,
        editable: true,
      })
      this.renders[kind].unshift({
        key: 'pokemon',
        render: (vm, h, currentRow, param, saveIconBtn, editIconBtn, cancelIconBtn) => {
          return h('Row', {
            props: { type: 'flex', gutter: 16, align: 'middle' },
            style: {
              height: '100%'
            }
          }, [
            h('i-col', {
              props: {
                span: vm.editingStore[param.index].editingCell[param.column.key] ? '24' : '20'
              },
              style: {
                paddingRight: '0',
                paddingLeft: '0'
              }
            }, vm.editingStore[param.index].editingCell[param.column.key] ? [
              h(SkillEditingCell, {
                props: {
                  row: vm.editingStore[param.index],
                }
              })
            ] : [
              h(SkillDisplayCell, {
                props: {
                  row: vm.editingStore[param.index],
                }
              })
            ]),
            h('i-col', {
              props: {
                span: vm.editingStore[param.index].editingCell[param.column.key] ? '24' : '4'
              },
              style: !vm.editingStore[param.index].editingCell[param.column.key] ? {
                paddingLeft: '0',
                paddingRight: '16px'
              } : {}
            }, vm.editingStore[param.index].editingCell[param.column.key] ? [
              h('Row', {
                props: { type: 'flex', gutter: 16, align: 'middle' },
                style: { marginLeft: '0' }
              }, [
                h('i-col', {
                  props: { span: '12' },
                  style: { textAlign: 'right' }
                }, [saveIconBtn(vm, h, param, () => {
                  vm.$set(vm.rowData[param.index], 'number', vm.editingStore[param.index].number)
                  vm.$set(vm.rowData[param.index], 'icon', vm.editingStore[param.index].icon)
                  vm.$set(vm.rowData[param.index], 'name', vm.editingStore[param.index].name)
                  vm.$set(vm.rowData[param.index], 'properties', vm.editingStore[param.index].properties)
                  vm.rowData[param.index].editingCell[param.column.key] =
                    vm.editingStore[param.index].editingCell[param.column.key] = false
                })]),
                h('i-col', {
                  props: { span: '12' },
                  style: { textAlign: 'left' }
                }, [cancelIconBtn(vm, h, param, () => {
                  vm.$set(vm.editingStore[param.index], 'number', vm.rowData[param.index].number)
                  vm.$set(vm.editingStore[param.index], 'icon', vm.rowData[param.index].icon)
                  vm.$set(vm.editingStore[param.index], 'name', vm.rowData[param.index].name)
                  vm.$set(vm.editingStore[param.index], 'properties', vm.rowData[param.index].properties)
                  vm.rowData[param.index].editingCell[param.column.key] =
                    vm.editingStore[param.index].editingCell[param.column.key] = false
                })])
              ]),
            ] : [
              editIconBtn(vm, h, param)
            ])
          ])
        }
      })

      this.columns[kind].push({
        title: '操作',
        key: 'operations',
        align: 'center',
        fixed: kind === 'others' ? null : 'right',
        width: 100,
        operations: true
      })
    },
    checkGeneration(row, generation) {
      const { generations } = row
      return generations.find(e => e.number === generation)
    },
    initGenerations(versions) {
      for(let i = 0; i < versions.length; i++) {
        if(this.generations.indexOf(versions[i].generation) === -1) {
          this.generations.push(versions[i].generation)
        }
      }
    },
    GenerationCheckbox(option) {
      return `第${option}世代`
    },
    addSkillPokemon(kind, index) {
      switch(kind) {
        case 'level':
        case 'inherit':
        case 'item':
        case 'learn':
          this.skill.pokemons[kind].push({
            number: null,
            name: '',
            icon: '',
            properties: [],
            generations: []
          })
          break
        case 'others': {
          this.skill.pokemons[kind][index].data.push({
            number: null,
            name: '',
            icon: '',
            properties: [],
            way: ''
          })
          break
        }
      }
    },
    aliasNameSection(index) {
      let result = []
      for(let i = (index - 1) * 3; i < index * 3; i++) {
        if(typeof this.skill.aliasName[i] !== 'undefined') {
          result.push(i)
        }
      }
      return result
    },
    addAliasName() {
      this.skill.aliasName.push('')
    },
    removeAliasName(index) {
      this.skill.aliasName.splice(index, 1)
      this.$refs['skill'].validateField('aliasName')
    },
    addFeature() {
      this.skill.features.push('')
    },
    removeFeature(index) {
      this.skill.features.splice(index, 1)
      this.$refs['skill'].validateField('features')
    },
    addEffect() {
      this.skill.effect.push('')
    },
    removeEffect(index) {
      this.skill.effect.splice(index, 1)
      this.$refs['skill'].validateField('effect')
    },
    async addSkill() {
      const self = this
      this.$refs['skill'].validate(async (valid) => {
        if(valid) {
          try {
            await self.AddSkill(self.skill)
            self.$Message.success('添加技能信息成功~')
            self.$router.push({
              name: 'skill-list'
            })
          } catch(err) {
            self.$Message.error(err.message)
          }
        } else {
          self.$Message.error('信息填写错误, 请检查无误后再提交!')
        }
      })
    },
    async updateSkill() {
      const { id } = this.$route.params
      const self = this
      this.$refs['skill'].validate(async (valid) => {
        if(valid) {
          try {
            const skill = await self.UpdateSkill({
              id,
              skill: self.skill
            })
            self.$Message.success('修改技能信息成功~')
            self.skill = skill
            self.$router.push({
              name: 'skill-list'
            })
          } catch(err) {
            self.$Message.error(err.message)
          }
        } else {
          self.$Message.error('信息填写错误, 请检查无误后再提交!')
        }
      })
    }
  },
  created() {
    const { id } = this.$route.params
    Promise.all([
      this.FetchVersions(),
      this.FetchProperties(),
    ]).then((data) => {
      const { versions } = data[0]
      this.initGenerations(versions)
      this.initColumns('level', versions)
      this.initColumns('inherit', versions)
      this.initColumns('item', versions)
      this.initColumns('learn', versions)
      this.initColumns('others')
      if(id) {
        try {
          this.FetchSkill(id).then(data => {
            this.skill = Object.assign({}, this.skill, data)
          }).catch(err => this.$Message.error(err.message))
        } catch(err) {
          this.$Message.error(err.message)
        }
      }
    })
  }
}
</script>
<style lang="scss">
div.skill-edit {
  padding: 10px;
  > .ivu-form {
    > .ivu-row-flex {
      margin-bottom: 10px;
    }
  }
  .aliasName-item {
    .ivu-row-flex {
      margin-bottom: 10px;
    }
  }
  .ivu-input-wrapper {
    // max-width: 200px;
  }
  .pokemons-card {
    margin-bottom: 10px;
  }
  .pokemons-others-card {
    margin-bottom: 10px;
  }
  .generations-choice {
    .ivu-checkbox-group-item {
      display: block;
      text-align: center;
    }
  }
}
.ivu-btn-dashed {
  border-color: #888;
}
</style>