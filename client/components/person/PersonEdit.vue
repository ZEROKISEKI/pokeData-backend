<template>
  <div class="person-edit">
    <Form ref="person" :model="person" :rules="rules" :label-width="80">
      <Card>
        <Row type="flex" :gutter="16" style="margin-bottom: 10px;">
          <i-col span="24">
            <Card>
              <p slot="title">人物基本信息</p>
              <Row type="flex" :gutter="16">
                <i-col span="9">
                  <FormItem label="人物名称" prop="name">
                    <i-input v-model="person.name" placeholder="请填写人物名称..."></i-input>
                  </FormItem>
                  <FormItem label="人物别名" class="aliasName-item" prop="aliasName">
                    <Row v-for="i in Math.ceil(person.aliasName.length / 3)"
                         :key="i" type="flex" :gutter="16">
                      <i-col v-for="index in aliasNameSection(i)" :key="index" span="7">
                        <i-input type="text" v-model="person.aliasName[index]" icon="close"
                                 @on-click="removeAliasName(index)"></i-input>
                      </i-col>
                    </Row>
                    <Button type="dashed" long v-if="person.aliasName.length === 0"
                            icon="plus-round" @click="addAliasName">增加别名</Button>
                  </FormItem>
                  <FormItem>
                    <Button type="dashed" long v-if="person.aliasName.length > 0"
                            icon="plus-round" @click="addAliasName">增加别名</Button>
                  </FormItem>
                  <FormItem label="人物身高" prop="high" class="high-item">
                    <i-input v-model="person.high" :number="true">
                      <span slot="append">cm</span>
                    </i-input>
                  </FormItem>
                  <FormItem label="人物体重" prop="weight" class="weight-item">
                    <i-input v-model="person.weight" :number="true">
                      <span slot="append">kg</span>
                    </i-input>
                  </FormItem>
                  <FormItem label="人物性别">
                    <RadioGroup v-model="person.sex">
                      <Radio v-for="(option, index) in sexOptions"
                             :label="option.value" :key="index">{{ option.text }}</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem label="人物生日" prop="birthday">
                    <DatePicker :value="person.birthday" format="yyyy-MM-dd"
                                type="date" placeholder="请选择日期" @on-change="changeDate"></DatePicker>
                  </FormItem>
                  <FormItem label="显示可见">
                    <i-switch v-model="person.visible">
                      <span slot="open">是</span>
                      <span slot="close">否</span>
                    </i-switch>
                  </FormItem>
                </i-col>
                <i-col span="15">
                  <FormItem label="人物立绘" prop="avatar">
                    <poke-upload :image.sync="person.avatar" size="80"></poke-upload>
                  </FormItem>
                </i-col>
              </Row>
            </Card>
          </i-col>
        </Row>
        <Row type="flex" :gutter="16" style="margin-bottom: 10px;">
          <i-col span="12">
            <Card>
              <p slot="title">人物年龄信息</p>
              <FormItem label="人物年龄" prop="age" class="age-item">
                <div v-for="i in person.age.length" :key="i" class="container">
                  <Row type="flex" :gutter="8">
                    <i-col span="5">
                      <i-input v-model="person.age[i - 1].value" :number="true"></i-input>
                    </i-col>
                    <i-col span="19">
                      <i-input v-model="person.age[i - 1].duration"
                               placeholder="请输入该年龄对应时期..."></i-input>
                    </i-col>
                  </Row>
                  <Row type="flex" :gutter="8">
                    <i-col span="24">
                      <Button type="primary" long @click="removeAge(i - 1)">删除条目</Button>
                    </i-col>
                  </Row>
                </div>
                <Button type="dashed" long v-if="person.age.length === 0"
                        icon="plus-round" @click="addAge">增加条目</Button>
              </FormItem>
              <FormItem v-if="person.age.length > 0">
                <Button type="dashed" long icon="plus-round" @click="addAge">增加条目</Button>
              </FormItem>
            </Card>
          </i-col>
          <i-col span="12">
            <Card>
              <p slot="title">人物自定义栏目信息</p>
              <FormItem label="栏目属性" prop="others" class="tab-item">
                <div v-for="i in person.others.length" :key="i" class="container">
                  <Row type="flex" :gutter="16">
                    <i-col span="7">
                      <i-input v-model="person.others[i - 1].key"
                               placeholder="请输入栏目名..."></i-input>
                    </i-col>
                    <i-col span="17">
                      <i-input v-model="person.others[i - 1].value"
                               placeholder="请输入栏目值..."></i-input>
                    </i-col>
                  </Row>
                  <Row type="flex" :gutter="16">
                    <i-col span="24">
                      <Button type="primary" long @click="removeTab(i - 1)">删除条目</Button>
                    </i-col>
                  </Row>
                </div>
                <Button type="dashed" long v-if="person.others.length === 0"
                        icon="plus-round" @click="addTab">增加栏目</Button>
              </FormItem>
              <FormItem v-if="person.others.length > 0">
                <Button type="dashed" long icon="plus-round" @click="addTab">增加栏目</Button>
              </FormItem>
            </Card>
          </i-col>
        </Row>
        <Row type="flex" :gutter="16" justify="center" style="margin-bottom: 10px;">
          <i-col span="24">
            <div class="pokemons-item">
              <Form :ref="`personPokemons-${i}`"
                    v-for="i in person.pokemons.length"
                    :key="i"
                    :model="person.pokemons[i - 1]"
                    :label-width="90"
                    label-position="left"
                    class="container">
                <Card style="background-color: #eee;">
                  <Row type="flex" :gutter="16" class="personPokemons-top">
                    <i-col span="10">
                      <Card style="height: 100%;" shadow>
                        <p slot="title">训练师相关</p>
                        <FormItem label="训练师图标">
                          <poke-upload :image.sync="person.pokemons[i - 1].person.image"></poke-upload>
                        </FormItem>
                        <FormItem label="训练师名称">
                          <i-input placeholder="输入名称..."
                                   v-model="person.pokemons[i - 1].person.name"></i-input>
                        </FormItem>
                        <FormItem label="训练师身份">
                          <i-input placeholder="example: 捉虫小子"
                                   v-model="person.pokemons[i - 1].person.identity"></i-input>
                        </FormItem>
                        <FormItem label="训练师道具">
                          <poke-select :source="person.pokemons[i - 1].items"
                                       placeholder="请选择道具(请搜索输入选择)"
                                       label="name"
                                       :remoteMethod="FetchItemsMessage"
                                       remoteDataKey="items"
                                       :keys="['name', 'icon']"
                                       :multiple="true"></poke-select>
                        </FormItem>
                        <FormItem label="持有宝可梦">
                          <poke-select :source="person.pokemons[i - 1].pokemons"
                                       placeholder="请选择宝可梦(请搜索输入选择)"
                                       label="name"
                                       :remoteMethod="FetchPokemonsMessage"
                                       remoteDataKey="pokemons"
                                       :keys="selectKeys.poke"
                                       :multiple="true"></poke-select>
                        </FormItem>
                      </Card>
                    </i-col>
                    <i-col span="14">
                      <Row type="flex" :gutter="16">
                        <i-col span="12">
                          <Card shadow>
                            <p slot="title">挑战地点</p>
                            <FormItem :label-width="1">
                              <i-input placeholder="example: 石英高原"
                                       v-model="person.pokemons[i - 1].place"></i-input>
                            </FormItem>
                          </Card>
                        </i-col>
                        <i-col span="12">
                          <Card shadow>
                            <p slot="title">出现游戏版本</p>
                            <FormItem :label-width="1">
                              <poke-select :source="person.pokemons[i - 1].version"
                                           placeholder="请选择出现的游戏版本(支持搜索过滤)"
                                           :remote="false"
                                           :filterable="true"
                                           :multiple="true" label="abstr"
                                           :selectOptions="versions"
                                           :keys="['name', 'abstr']"></poke-select>
                            </FormItem>
                          </Card>
                        </i-col>
                      </Row>
                      <Row type="flex" :gutter="16">
                        <i-col span="24">
                          <Card shadow>
                            <p slot="title">获得战利品</p>
                            <FormItem :label-width="1">
                              <Row type="flex" :gutter="16">
                                <i-col span="8">
                                  <i-input v-model="person.pokemons[i - 1].money.value"
                                           placeholder="请输入战利品...（比如金钱, BP）"></i-input>
                                </i-col>
                                <i-col span="16">
                                  <i-input v-model="person.pokemons[i - 1].money.way"
                                           placeholder="请输入战斗方式...(比如单打对战)"></i-input>
                                </i-col>
                              </Row>
                            </FormItem>
                          </Card>
                        </i-col>
                      </Row>
                      <Row type="flex" :gutter="16">
                        <i-col span="24">
                          <Card shadow style="margin-bottom: 0;">
                            <p slot="title">其他说明</p>
                            <FormItem :label-width="1">
                              <i-input type="textarea" :rows="3"
                                       placeholder="如有其他说明请写在这里..."
                                       v-model="person.pokemons[i - 1].description"></i-input>
                            </FormItem>
                          </Card>
                        </i-col>
                      </Row>
                    </i-col>
                  </Row>
                  <Row type="flex" :gutter="16" class="personPokemons-bottom">
                    <i-col span="24">
                      <Card>
                        <p slot="title">持有神奇宝贝一览</p>
                        <FormItem :label-width="1" class="pokemons-item">
                          <Row v-for="index in Math.ceil(person.pokemons[i - 1].pokemons.length / 3)"
                               :key="index" type="flex" :gutter="16" justify="center">
                            <i-col span="7"
                                   v-for="k in pokemonsSection(index, i - 1)"
                                   :key="k">
                              <Card>
                                <Row type="flex" justify="space-around" :gutter="8">
                                  <i-col span="24">
                                    <Avatar v-if="getPokemons(i - 1, k).avatar"
                                            shape="circle"
                                            :src="qiniuImage(getPokemons(i - 1, k).avatar)"></Avatar>
                                    <Avatar v-else shape="circle" icon="help"></Avatar>
                                  </i-col>
                                  <i-col span="24">
                                    <p>{{ getPokemons(i - 1, k).name }}</p>
                                  </i-col>
                                  <i-col :span="getPokemons(i - 1, k).properties.length > 1 ? 12 : 24"
                                         style="margin-bottom: 8px;"
                                         v-for="property in getPokemons(i - 1, k).properties"
                                         :key="property">
                                    <span :style="displayProperty(property)">{{ property }}</span>
                                  </i-col>
                                  <i-col span="12">
                                    <i-input v-model="getPokemons(i - 1, k).level">
                                      <span slot="prepend">Lv</span>
                                    </i-input>
                                  </i-col>
                                  <i-col span="12">
                                    <feature-select :source.sync="getPokemons(i - 1, k).feature[0]"
                                                    placeholder="选择宝可梦特性"
                                                    label="name"
                                                    :query="getPokemons(i - 1, k).name">

                                    </feature-select>
                                  </i-col>
                                  <i-col span="24">
                                    <CheckboxGroup v-model="getPokemons(i - 1, k).sex">
                                      <Checkbox v-for="sex in pokeSexOptions"
                                                :disabled="checkPokeSex(i - 1, k, sex)"
                                                :key="sex.value"
                                                :label="sex.value">{{ sex.text }}</Checkbox>
                                    </CheckboxGroup>
                                  </i-col>
                                  <i-col span="24" style="margin-bottom: 10px;">
                                    <poke-select :source.sync="getPokemons(i - 1, k).item"
                                                 placeholder="携带道具(请搜索输入选择)"
                                                 label="name"
                                                 :remoteMethod="FetchItemsMessage"
                                                 remoteDataKey="items"
                                                 :keys="['name', 'icon']"></poke-select>
                                  </i-col>
                                  <i-col span="24">
                                    <poke-select :source="getPokemons(i - 1, k).skills"
                                                 placeholder="技能(请搜索输入选择)"
                                                 label="name"
                                                 :remoteMethod="FetchSkillsMessage"
                                                 remoteDataKey="skills"
                                                 :multiple="true"
                                                 :optionDisabled="getPokemons(i - 1, k).skills.length >= 4"
                                                 :keys="['name', 'property']"></poke-select>
                                  </i-col>
                                </Row>
                              </Card>
                            </i-col>
                          </Row>
                        </FormItem>
                      </Card>
                    </i-col>
                  </Row>
                  <Row type="flex" :gutter="16" style="margin-bottom: 0;">
                    <i-col span="24">
                      <Button type="error" long
                              icon="close" @click="removePersonPokemons(i - 1)">删除条目</Button>
                    </i-col>
                  </Row>
                </Card>
              </Form>
            </div>
          </i-col>
          <i-col span="10">
            <Button type="primary" long icon="plus-round"
                    @click="addPersonPokemons">添加人物持有宝可梦信息</Button>
          </i-col>
        </Row>
      </Card>
    </Form>
    <Card style="margin-top: 10px;">
      <Row type="flex" :gutter="16" justify="center">
        <i-col span="10">
          <Button type="primary" long @click="updatePerson" v-if="checkRoute">提交</Button>
          <Button type="primary" long @click="addPerson" v-else>添加</Button>
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
import FeatureSelect from '@/components/common/form/PokeFeatureSelect'
import { qiniuHost, qiniuImageOptions } from '@/utils/qiniu'
export default {
  name: 'PersonEdit',
  components: {
    PokeUpload,
    PokeSelect,
    FeatureSelect,
  },
  data() {
    return {
      person: {
        aliasName: [],
        age: [],
        others: [],
        pokemons: [],
        avatar: '',
        sex: PokeData.PBSex.MALE,
      },
      // 用于poke-select的keys配置
      selectKeys: {
        poke: ['name', 'icon', 'avatar', 'properties', {
          name: 'sex',
          default: []
        }, {
          name: 'feature',
          default: []
        }, {
          name: 'skills',
          default: []
        }, {
          name: 'item',
          default: {}
        }]
      },
      rules: {
        name: [
          { required: true, message: '该项为必填项', trigger: 'blur' }
        ],
        aliasName: [
          {
            type: 'array',
            defaultField: {
              type: 'string', required: true, message: '请填写完整,如不填需要删除'
            }
          }
        ],
        high: [
          { type: 'number', message: '身高必须为数字', trigger: 'blur' }
        ],
        weight: [
          { type: 'number', message: '体重必须为数字', trigger: 'blur' }
        ],
        age: [
          {
            type: 'array',
            defaultField: {
              type: 'object',
              fields: {
                value: {
                  required: true,
                  type: 'integer',
                  min: 1,
                  message: '年龄不可为空, 最小为1,且为整数',
                }
              },
            },
            trigger: 'blur'
          }
        ],
        others: [
          {
            type: 'array',
            defaultField: {
              type: 'object',
              fields: {
                key: { required: true, message: '请填写完整' },
                value: { required: true, message: '该项为必填项' }
              }
            }
          }
        ]
      },
      imageOption: qiniuImageOptions.imageBase
    }
  },
  computed: {
    ...mapState({
      versions: ({ baseConfig }) => baseConfig.versions,
      properties: ({ baseConfig }) => baseConfig.properties
    }),
    sexOptions() {
      return [
        {
          text: '男',
          value: PokeData.PBSex.MALE
        },
        {
          text: '女',
          value: PokeData.PBSex.FEMALE
        },
        {
          text: '未知',
          value: PokeData.PBSex.UNKNOW
        }
      ]
    },
    pokeSexOptions() {
      return [
        {
          text: '♂',
          value: PokeData.PBSex.MALE
        },
        {
          text: '♀',
          value: PokeData.PBSex.FEMALE
        },
        {
          text: '无性别',
          value: PokeData.PBSex.UNKNOW
        }
      ]
    },
    checkRoute() {
      return !!this.$route.params.id
    },
  },
  methods: {
    ...mapActions(['FetchPerson', 'AddPerson', 'UpdatePerson',
      'FetchItemsMessage', 'FetchPokemonsMessage', 'FetchSkillsMessage',
      'FetchVersions', 'FetchProperties']),
    aliasNameSection(index) {
      let result = []
      for(let i = (index - 1) * 3; i < index * 3; i++) {
        if(typeof this.person.aliasName[i] !== 'undefined') {
          result.push(i)
        }
      }
      return result
    },
    checkPokeSex(i, index, option) {
      if (option.value !== PokeData.PBSex.UNKNOW) {
        return this.getPokemons(i, index).sex.indexOf(PokeData.PBSex.UNKNOW) !== -1
      } else {
        return this.getPokemons(i, index).sex.filter(e => e !== PokeData.PBSex.UNKNOW).length > 0
      }
    },
    addAliasName() {
      this.person.aliasName.push('')
    },
    removeAliasName(index) {
      this.person.aliasName.splice(index, 1)
      // 手动校验, 防止出现错误不消失的bug(iview), 下同
      this.$refs['person'].validateField('aliasName')
    },
    addAge() {
      this.person.age.push({})
    },
    removeAge(index) {
      this.person.age.splice(index, 1)
      this.$refs['person'].validateField('age')
    },
    addTab() {
      this.person.others.push({
        key: '',
        value: ''
      })
    },
    removeTab(index) {
      this.person.others.splice(index, 1)
      this.$refs['person'].validateField('others')
    },
    addPersonPokemons() {
      this.person.pokemons.push({
        person: {
          image: '',
          identity: '',
          name: ''
        },
        place: '',
        version: [],
        pokemons: [],
        money: {},
        items: [],
        description: ''
      })
    },
    removePersonPokemons(index) {
      this.person.pokemons.splice(index, 1)
    },
    pokemonsSection(index, i) {
      const result = []
      for(let k = (index - 1) * 3; k < index * 3; k++) {
        if (typeof this.person.pokemons[i].pokemons[k] !== 'undefined') {
          result.push(k)
        }
      }
      return result
    },
    getPokemons(i, index) {
      return this.person.pokemons[i].pokemons[index]
    },
    displayProperty(property) {
      const source = this.properties.find(e => e.name === property)
      return {
        lineHeight: '22px',
        color: '#fff',
        display: 'inline-block',
        width: '100%',
        backgroundColor: `${source.background}`,
        border: `3px solid ${source.border}`
      }
    },
    changeDate(newDate) {
      if(newDate) {
        this.person.birthday = newDate
      }
    },
    qiniuImage(url) {
      return `${qiniuHost}/${url}?${this.imageOption}`
    },
    // 去除多余的属性
    convertPerson() {
      for(const p of this.person.pokemons) {
        for(const pokemon of p.pokemons) {
          if(typeof pokemon.avatar !== 'undefined') {
            delete pokemon.avatar
          }
        }
      }
    },
    async addPerson() {
      const self = this
      this.convertPerson()
      console.log(self.person)
      this.$refs['person'].validate(async (valid) => {
        if(valid) {
          try {
            await self.AddPerson(self.person)
            self.$Message.success('添加人物成功～')
            self.$router.push({
              name: 'person-list'
            })
          } catch(err) {
            self.$Message.error(err.message)
          }
        } else {
          self.$Message.error('信息填写错误, 请检查无误后再提交!')
        }
      })
    },
    async updatePerson() {
      const { id } = this.$route.params
      const self = this
      this.convertPerson()
      this.$refs['person'].validate(async (valid) => {
        if(valid) {
          try {
            const person = await self.UpdatePerson({
              id,
              person: self.person
            })
            self.$Message.success('修改道具成功~')
            self.person = person
            self.$router.push({
              name: 'person-list'
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
      this.FetchProperties(),
      this.FetchVersions()
    ]).then(() => {
      if(id) {
        this.FetchPerson(id).then(data => {
          this.person = Object.assign({}, data)
        }).catch(err => this.$Message.error(err.message))
      }
    }).catch(err => this.$Message.error(err.message))
  }
}
</script>
<style lang="scss">
div.person-edit {
  padding: 10px;
  .high-item, .weight-item {
    .ivu-input-group {
      width: 100px;
    }
  }
  .aliasName-item {
    .ivu-row-flex {
      margin-bottom: 10px;
    }
  }
  .age-item, .tab-item {
    .container {
      .ivu-row-flex {
        margin-bottom: 10px;
      }
    }
  }
  .pokemons-item {
    .container {
      .ivu-card {
        margin-bottom: 10px;
      }
      .ivu-form-item {
        margin-bottom: 10px;
      }
      .personPokemons-top {
        align-items: stretch;
        margin-bottom: 10px;
      }
      .personPokemons-bottom {
        .pokemons-item {
          .ivu-row-flex {
            margin-bottom: 20px;
          }
          .ivu-card .ivu-card-body {
            text-align: center;
          }
          .ivu-avatar {
            width: 100px;
            height: 100px;
            line-height: 1;
            border-radius: 50%;
            .ivu-icon {
              font-size: 100px;
              line-height: 1;
            }
          }
        }
      }
    }
  }
}
.ivu-btn-dashed {
  border-color: #888;
}
</style>