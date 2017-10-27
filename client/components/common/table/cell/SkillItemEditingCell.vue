<template>
  <div class="skill-item-editing-cell">
    <Row type="flex" :gutter="8" justify="center">
      <i-col span="12" v-for="(item, index) in cellData.items"
             :key="index" style="margin-bottom: 5px;">
        <Tooltip content="技能机编号,输入整数" :transfer="true"
                 :placement="index % 2 === 0 ? 'left' : 'right'">
          <i-input v-model="cellData.items[index]" :number="true"
                   icon="close" @on-click="removeItem(index)"></i-input>
        </Tooltip>
      </i-col>
    </Row>
    <div class="add-item-container">
      <Button long icon="plus-round" type="ghost" @click="addItem"></Button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SkillItemEditingCell',
  props: {
    row: {
      type: Object
    },
    generation: [Number, String]
  },
  data() {
    return {
      cellData: {
        items: []
      }
    }
  },
  methods: {
    init() {
      const data = this.row.generations.find(e => e.number === this.generation)
      if(data) {
        this.cellData = data
      }
    },
    addItem() {
      if(this.cellData.items) {
        this.cellData.items.push('')
      }
    },
    removeItem(index) {
      this.cellData.items.splice(index, 1)
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss">
div.skill-item-editing-cell {
  border-bottom: 1px solid #e9eaec;
  padding-bottom: 10px;
  .ivu-row-flex {
    padding: 10px;
  }
  .add-item-container {
    padding: 0 10px;
  }
}
</style>