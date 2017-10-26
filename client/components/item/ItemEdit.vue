<template>
  <div class="item-edit">
    <Form :model="data" :label-width="80" :rules="rules" ref="data">
      <Row type="flex" justify="start" :gutter="10">
        <i-col span="12">
          <Card>
            <FormItem label="道具名称" prop="name">
              <i-input v-model="data.name" placeholder="请输入道具名称..."></i-input>
            </FormItem>
            <FormItem label="道具说明">
              <i-input v-model="data.description" type="textarea"
                       :rows="3" placeholder="请输入道具说明..."></i-input>
            </FormItem>
            <FormItem label="道具使用">
              <RadioGroup v-model="data.usage">
                <Radio v-for="(option, index) in usageOptions"
                       :label="option.value" :key="index">{{ option.text }}</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="道具场景" class="scene-item">
              <i-switch v-model="data.scene" size="large">
                <span slot="open">对战外</span>
                <span slot="close">对战中</span>
              </i-switch>
            </FormItem>
            <FormItem label="游戏版本" class="appearance-item" prop="appearance">
              <Row type="flex" justify="start" :gutter="16">
                <i-col span="10">
                  <i-select v-model="generation" placeholder="请选择世代">
                    <i-option v-for="(name, index) in generationOptions"
                              :key="index" :value="name">第{{ name }}世代</i-option>
                    <i-option :value="0">请选择世代</i-option>
                  </i-select>
                </i-col>
                <i-col span="10">
                  <i-select v-model="data.appearance" multiple filterable
                            placeholder="请选择游戏版本" :disabled="!generation">
                    <i-option v-for="(version, index) in versionsOptions"
                              :key="index" :value="version.abstr">{{ version.abstr }}</i-option>
                  </i-select>
                </i-col>
              </Row>
            </FormItem>
            <FormItem label="购入价格">
              <InputNumber v-model="data.pay" :min="1"></InputNumber>
            </FormItem>
            <FormItem label="售出价格">
              <InputNumber v-model="data.sale" :min="1"></InputNumber>
            </FormItem>
            <FormItem label="投掷次数">
              <InputNumber v-model="data.throw" :min="0"></InputNumber>
            </FormItem>
            <FormItem label="显示可见">
              <i-switch v-model="data.visible">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
            <FormItem label="道具图片">
              <poke-upload :image.sync="data.image" size="80"></poke-upload>
            </FormItem>
            <FormItem label="道具图标">
              <poke-upload :image.sync="data.icon" size="30"></poke-upload>
            </FormItem>
            <FormItem label="道具别名" class="aliasName-item" prop="aliasName">
              <Row v-for="i in Math.ceil(data.aliasName.length / 3)" :key="i"
                   type="flex" :gutter="16">
                <i-col v-for="index in aliasNameSection(i)" :key="index" span="7">
                  <i-input type="text" v-model="data.aliasName[index]" icon="close"
                           @on-click="removeAliasName(index)"></i-input>
                </i-col>
              </Row>
              <Button type="dashed" long v-if="data.aliasName.length === 0"
                      icon="plus-round" @click="addAliasName">增加别名</Button>
            </FormItem>
            <FormItem>
              <Button type="dashed" long v-if="data.aliasName.length > 0"
                      icon="plus-round" @click="addAliasName">增加别名</Button>
            </FormItem>
            <FormItem label="道具效果" class="effect-item" prop="result">
              <Row v-for="i in data.result.length" type="flex" :gutter="16" :key="i">
                <i-col span="24">
                  <Card class="effect-container">
                    <i-input v-model="data.result[i - 1]"
                             type="textarea" :rows="3" placeholder="请输入效果描述..."></i-input>
                    <Button type="error" long @click="removeEffect(i - 1)">删除</Button>
                  </Card>
                </i-col>
              </Row>
              <Button type="dashed" long v-if="data.result.length === 0"
                      icon="plus-round" @click="addEffect">增加效果</Button>
            </FormItem>
            <FormItem>
              <Button type="dashed" long v-if="data.result.length > 0"
                      icon="plus-round" @click="addEffect">增加效果</Button>
            </FormItem>
          </Card>
        </i-col>
        <i-col span="12">
          <Card class="obtain-card">
            <FormItem class="obtain-item" prop="obtain.one">
              <p class="obtain-title">一次性获得道具方式</p>
              <Row v-for="i in data.obtain.one.length" type="flex" :gutter="16" :key="i">
                <i-col span="24">
                  <Card class="obtain-container">
                    <Row class="obtain-version" type="flex" :gutter="8"
                         v-for="(version, index) in data.obtain.one[i - 1].version"
                         :key="index">
                      <i-col span="8">
                        <i-select v-model="version.abstr" filterable
                                  @on-change="handleObtainChange($event, 'one', version)">
                          <i-option v-for="option in versions"
                                    :key="option.abstr"
                                    :value="option.abstr"
                                    :disabled="checkVersion(option, 'one', i - 1, index)">{{ option.abstr }}</i-option>
                        </i-select>
                      </i-col>
                      <i-col span="12">
                        <i-input type="text" placeholder="输入详细名称..." v-model="version.name"></i-input>
                      </i-col>
                      <i-col span="4">
                        <Button type="primary" size="small" shape="circle"
                                @click="removeObtainVersion('one', i - 1, index)">删除版本</Button>
                      </i-col>
                    </Row>
                    <Button type="success" long @click="addObtainVersion('one', i - 1)"
                            style="margin-bottom: 10px;">增加版本</Button>
                    <i-input type="textarea"
                             v-model="data.obtain.one[i - 1].way"
                             :rows="3"
                             placeholder="请输入获得方式描述..."></i-input>
                    <Button type="error" long @click="removeObtain('one', i - 1)">删除条目</Button>
                  </Card>
                </i-col>
              </Row>
            </FormItem>
            <FormItem>
              <Button type="dashed" long icon="plus-round" @click="addObtain('one')">增加条目</Button>
            </FormItem>
            <FormItem class="obtain-item" prop="obtain.repeat">
              <p class="obtain-title">重复获得道具方式</p>
              <Row v-for="i in data.obtain.repeat.length" type="flex" :gutter="16" :key="i">
                <i-col span="24">
                  <Card class="obtain-container">
                    <Row class="obtain-version" type="flex" :gutter="8"
                         v-for="(version, index) in data.obtain.repeat[i - 1].version"
                         :key="index">
                      <i-col span="8">
                        <i-select v-model="version.abstr" filterable
                                  @on-change="handleObtainChange($event, 'repeat', version)">
                          <i-option v-for="option in versions"
                                    :key="option.abstr"
                                    :value="option.abstr"
                                    :disabled="checkVersion(option, 'repeat', i - 1, index)">{{ option.abstr }}</i-option>
                        </i-select>
                      </i-col>
                      <i-col span="12">
                        <i-input type="text" placeholder="输入详细名称..." v-model="version.name"></i-input>
                      </i-col>
                      <i-col span="4">
                        <Button type="primary" size="small" shape="circle"
                                @click="removeObtainVersion('repeat', i - 1, index)">删除版本</Button>
                      </i-col>
                    </Row>
                    <Button type="success" long @click="addObtainVersion('repeat', i - 1)"
                            style="margin-bottom: 10px;">增加版本</Button>
                    <i-input type="textarea"
                             v-model="data.obtain.repeat[i - 1].way"
                             :rows="3"
                             placeholder="请输入获得方式描述..."></i-input>
                    <Button type="error" long @click="removeObtain('repeat', i - 1)">删除条目</Button>
                  </Card>
                </i-col>
              </Row>
            </FormItem>
            <FormItem>
              <Button type="dashed" long icon="plus-round" @click="addObtain('repeat')">增加条目</Button>
            </FormItem>
          </Card>
          <Card style="margin-top: 10px;">
            <Button type="primary" long @click="updateItem" v-if="checkRoute">提交</Button>
            <Button type="primary" long @click="addItem" v-else>添加</Button>
          </Card>
        </i-col>
      </Row>
    </Form>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { PokeData } from 'proto'
import PokeUpload from '@/components/common/Upload'
export default {
  name: 'ItemEdit',
  components: {
    PokeUpload
  },
  data() {
    return {
      generation: 0,
      // 设置默认形式
      data: {
        image: '',
        icon: '',
        usage: PokeData.PBItemUsage.ONCE,
        aliasName: [],
        appearance: [],
        result: [],
        obtain: {
          one: [],
          repeat: []
        }
      },
      rules: {
        name: [
          { required: true, message: '该项为必填项', trigger: 'blur' }
        ],
        aliasName: [
          {
            type: 'array',
            defaultField: { type: 'string', required: true, message: '请填写完整别名, 不留空白' },
            trigger: 'blur'
          }
        ],
        appearance: [
          {
            type: 'array',
            min: 1,
            required: true,
            trigger: 'change',
            message: '请选择该道具首次出现的游戏版本'
          }
        ],
        result: [
          {
            type: 'array',
            defaultField: { type: 'string', required: true, message: '请填写完整, 留空白请删除' },
            trigger: 'blur'
          }
        ],
        'obtain.one': [
          {
            type: 'array',
            defaultField: {
              type: 'object',
              fields: {
                way: {
                  required: true,
                  type: 'string',
                  message: '获得方式如果空白请删除或填无',
                },
                version: {
                  type: 'array',
                  defaultField: {
                    type: 'object',
                    fields: {
                      abstr: {
                        required: true,
                        type: 'string',
                        message: '请选择版本,不选则删除该项'
                      },
                      name: {
                        required: true,
                        type: 'string',
                        message: '请填写版本全名,空白请删除或填无'
                      }
                    }
                  }
                }
              }
            },
          }
        ],
        'obtain.repeat': [
          {
            type: 'array',
            defaultField: {
              type: 'object',
              fields: {
                way: {
                  required: true,
                  type: 'string',
                  message: '获得方式如果空白请删除或填无',
                },
                version: {
                  type: 'array',
                  defaultField: {
                    type: 'object',
                    fields: {
                      abstr: {
                        required: true,
                        type: 'string',
                        message: '请选择版本,不选则删除该项'
                      },
                      name: {
                        required: true,
                        type: 'string',
                        message: '请填写版本全名,空白请删除或填无'
                      }
                    }
                  }
                }
              }
            },
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      item: ({ item }) => Object.assign({}, item.item),
      versions: ({ baseConfig }) => baseConfig.versions
    }),
    usageOptions() {
      return [
        {
          text: '一次性使用',
          value: PokeData.PBItemUsage.ONCE
        },
        {
          text: '不可使用',
          value: PokeData.PBItemUsage.UNAVAILABLE
        },
        {
          text: '多次使用',
          value: PokeData.PBItemUsage.REPEATED
        }
      ]
    },
    generationOptions() {
      const result = []
      // 优化查找的方式
      for(let i = 0; i < this.versions.length; i++) {
        if (result.indexOf(this.versions[i].generation) === -1) {
          result.push(this.versions[i].generation)
        }
      }
      return result.sort((a, b) => a - b)
    },
    versionsOptions() {
      return this.versions.filter(version => version.generation === this.generation)
    },
    checkRoute() {
      return !!this.$route.params.id
    }
  },
  methods: {
    ...mapActions(['FetchItem', 'AddItem', 'FetchVersions', 'UpdateItem']),
    aliasNameSection(index) {
      const result = []
      for(let i = (index - 1) * 3; i < index * 3; i++) {
        if (typeof this.data.aliasName[i] !== 'undefined') {
          result.push(i)
        }
      }
      return result
    },
    addAliasName() {
      this.data.aliasName.push('')
    },
    removeAliasName(index) {
      this.data.aliasName.splice(index, 1)
      this.$refs['data'].validateField('aliasName')
    },
    addEffect() {
      this.data.result.push('')
    },
    removeEffect(index) {
      this.data.result.splice(index, 1)
      this.$refs['data'].validateField('result')
    },
    addObtain(kind) {
      this.data.obtain[kind].push({
        version: [],
        way: ''
      })
    },
    removeObtain(kind, index) {
      this.data.obtain[kind].splice(index, 1)
      this.$refs['data'].validateField(`obtain.${kind}`)
    },
    addObtainVersion(kind, index) {
      this.data.obtain[kind][index].version.push({
        name: '',
        abstr: ''
      })
    },
    removeObtainVersion(kind, i, index) {
      this.data.obtain[kind][i].version.splice(index, 1)
    },
    checkVersion(option, kind, i, index) {
      return this.data.obtain[kind][i].version.filter((e, n) => n !== index)
        .filter(e => e.abstr === option.abstr).length > 0
    },
    handleObtainChange(abstr, kind, version) {
      ({ name: version.name } = this.versions.find(version => version.abstr === abstr))
      this.checkObtain(kind)
    },
    checkObtain(kind) {
      this.$refs['data'].validateField(`obtain.${kind}`)
    },
    async updateItem() {
      const { id } = this.$route.params
      const self = this
      this.$refs['data'].validate(async (valid) => {
        if(valid) {
          try {
            const item = await self.UpdateItem({
              id,
              item: self.data
            })
            self.$Message.success('修改道具成功~')
            self.data = item
            self.$router.push({
              name: 'item-list'
            })
          } catch(err) {
            this.$Message.error(err.message)
          }
        } else {
          this.$Message.error('请确认信息是否填写完整或填写有误')
        }
      })
    },
    async addItem() {
      const self = this
      this.$refs['data'].validate(async (valid) => {
        if(valid) {
          try {
            await self.AddItem(self.data)
            self.$Message.success('添加道具成功~')
            self.$router.push({
              name: 'item-list'
            })
          } catch(err) {
            this.$Message.error(err.message)
          }
        } else {
          this.$Message.error('请确认信息是否填写完整或填写有误')
        }
      })
    },
  },
  created() {
    const { id } = this.$route.params
    const self = this
    this.FetchVersions().then(({ versions }) => {
      if(id) {
        self.FetchItem(id).then(data => {
          self.data = Object.assign({}, data)
          if(self.data.appearance.length) {
            const version = versions.filter(version => {
              return version.abstr === self.data.appearance[0]
            })
            if(version.length) {
              self.generation = version[0].generation
            }
          }
        }).catch(err => {
          self.$Message.error(err.message)
        })
      }
    }).catch(err => self.$Message.error(err.message))
  },
  mounted() {
  }
}
</script>
<style lang="scss">
div.item-edit {
  padding: 10px;
  .aliasName-item {
    .ivu-row-flex {
      margin-bottom: 10px;
    }
  }
  .scene-item {
    .ivu-switch-large {
      width: 80px;
    }
    .ivu-switch-large.ivu-switch-checked:after {
      left: 57px;
    }
  }
  .effect-item {
    .effect-container {
      margin-bottom: 10px;
      .ivu-btn {
        margin-top: 5px;
      }
    }
  }
  .obtain-card {
    .ivu-form-item > .ivu-form-item-content {
      margin-left: 0!important;
    }
  }
  .obtain-item {
    margin-bottom: 18px;
    .ivu-form-item-error-tip {
      padding-top: 0;
    }
    .obtain-title {
      margin-bottom: 5px;
      text-align: center;
      font-weight: bold;
      font-size: 18px;
    }
    .obtain-container {
      margin-bottom: 10px;
      .obtain-version {
        margin-bottom: 5px;
        .ivu-col {
          padding-left: 8px!important;
          padding-right: 8px!important;
        }
      }
      .obtain-version .ivu-btn {
        margin-top: 0;
      }
      .ivu-btn {
        margin-top: 10px;
      }
    }
  }
}
.ivu-btn-dashed {
  border-color: #888;
}
</style>