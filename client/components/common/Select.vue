<!--只适合于一层对象的情况-->
<!--如果是对象里面套对象或数组之类的复杂形式的还是另用其他方式-->
<template>
  <div class="poke-select">
    <i-select :value="convertSource"
              :multiple="multiple"
              :placeholder="placeholder"
              :filterable="filterable"
              :remote="remote"
              :loading="loading"
              :disabled="selectDisabled"
              :remote-method="remote ? handleRemoteMethod : null"
              @on-change="handleSelectChange">
      <i-option v-for="(option, index) in options"
                :disabled="optionDisabled"
                :key="index" :value="option[label]">{{ option[label] }}</i-option>
    </i-select>
  </div>
</template>
<script>
export default {
  name: 'PokeSelect',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: true
    },
    remote: {
      type: Boolean,
      default: true
    },
    remoteMethod: {
      type: Function,
      default: null
    },
    remoteDataKey: {
      type: String,
      default: null
    },
    source: {
      // 一般是Array || Object, 由于无法在传入之前进行转换
      // 所以采用null
      // type: [Array, Object],
      required: true,
      default: {}
    },
    selectOptions: {
      type: Array,
      default: function () {
        return []
      }
    },
    selectDisabled: {
      type: Boolean,
      default: false
    },
    optionDisabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      required: true
    },
    /**
     * keys的元素为字符串时，表示source和options对应同一个属性名
     * keys的元素为数组时，数组第一项表示source属性名，第二项表示options属性名
     * keys的元素为{ name: xxx, default: xxx }，source对应属性名使用默认值
     */
    keys: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data() {
    return {
      result: this.source ? this.source : (this.multiple ? [] : {}),
      loading: false,
      options: this.remote ? [] : this.selectOptions,
      convertSource: this.multiple ?
        this.source.map(item => item[this.label]) : (this.source ? this.source[this.label] : null)
    }
  },
  computed: {

  },
  methods: {
    handleSelectChange(event) {
      if(this.multiple) {
        const oldSelect = this.result.filter(option => event.indexOf(option[this.label]) !== -1)
        const options = this.options.filter(option => {
          return event.indexOf(option[this.label]) !== -1 &&
            !oldSelect.find(e => e[this.label] === option[this.label])
        })
        const result = [...oldSelect.map(option => Object.assign({}, option)), ...options.map(option => {
          const result = {}
          for(const key of this.keys) {
            if(typeof key === 'string') {
              result[key] = option[key]
            } else if(typeof key === 'object') {
              if(Array.isArray(key)) {
                result[key[0]] = option[key[1]]
              } else {
                if(typeof key.default === 'object') {
                  result[key.name] = Array.isArray(key.default) ? [...key.default] : Object.assign({}, key.default)
                } else {
                  result[key.name] = key.default
                }
              }
            }
          }
          return result
        })]
        this.result.splice(0, this.result.length)
        for(let option of result) {
          this.result.push(option)
        }
      } else {
        const option = this.options.find(option => option[this.label] === event)
        for(const key of this.keys) {
          if(typeof key === 'string') {
            this.result[key] = option[key]
          } else if(typeof key === 'object') {
            if(Array.isArray(key)) {
              this.result[key[0]] = option[key[1]]
            } else {
              if(typeof key.default === 'object') {
                this.result[key.name] = Array.isArray(key.default) ? [...key.default] : Object.assign({}, key.default)
              } else {
                this.result[key.name] = key.default
              }
            }
          }
        }
        this.$emit('update:source', this.result)
      }
    },
    async handleRemoteMethod(query) {
      if(query !== '') {
        this.loading = true
        try {
          const data = await this.remoteMethod(query)
          if(this.remoteDataKey) {
            this.options = data[this.remoteDataKey]
          } else {
            this.options = data
          }
          this.loading = false
        } catch(err) {
          this.$Message.error(err.message)
        }
      }
    }
  },
  mounted() {

  },
  created() {
  }
}
</script>
<style lang="scss">
div.poke-select {
  .ivu-select.ivu-select-multiple {
    .ivu-select-selection {
      padding: 0 4px;
      text-align: left;
    }
  }
}
</style>