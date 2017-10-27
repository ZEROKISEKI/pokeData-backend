<!-- 对象数组专用选择框 -->
<template>
  <div class="poke-checkbox">
    <CheckboxGroup v-model="checkboxSource" @on-change="handleCheckedChange">
      <Checkbox v-for="option in options" :key="option"
                :label="option">
        {{ display ? display(option) : option }}
      </Checkbox>
    </CheckboxGroup>
  </div>
</template>
<script>
export default {
  name: 'PokeCheckbox',
  props: {
    // 元数据
    source: Array,
    // 选项对应的label
    label: String,
    options: Array,
    // 多选框展示的内容
    display: null,
    // 选择框时额外添加给source的数据格式
    unit: {
      type: Object,
      default: null
    },
  },
  data() {
    return {
      checkboxSource: [],
      originalSource: [],
      checkboxUnit: {}
    }
  },
  methods: {
    init() {
      const deepCloneData = JSON.parse(JSON.stringify(this.source))
      this.checkboxSource = deepCloneData.map(item => item[this.label])
      this.originalSource = deepCloneData
      this.checkboxUnit = Object.assign({
        [this.label]: null
      }, JSON.parse(JSON.stringify(this.unit)))
    },
    handleCheckedChange(list) {
      const add = list.length > this.originalSource.length
      if(add) {
        for(let i = 0; i < list.length; i++) {
          const item = list[i]
          if(!this.originalSource.find(e => e[this.label] === item)) {
            const newData = JSON.parse(JSON.stringify(this.checkboxUnit))
            newData[this.label] = item
            this.originalSource.push(newData)
          }
        }
      } else {
        for(let i = 0; i < this.originalSource.length; i++) {
          const item = this.originalSource[i]
          if(list.indexOf(item[this.label]) === -1) {
            this.originalSource.splice(i, 1)
          }
        }
      }

      // 按照给出的选项的顺序进行排序
      this.originalSource.sort((a, b) => {
        return this.options.indexOf(a[this.label]) - this.options.indexOf(b[this.label])
      })

      this.$emit('update:source', this.originalSource)
    }
  },
  created() {
    this.init()
  },
  watch: {
    source(newValue) {
      this.init()
    }
  }
}
</script>