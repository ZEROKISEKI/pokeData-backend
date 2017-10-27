<template>
  <div class="skill-item-display-cell">
    <Row type="flex" :gutter="8" justify="center" align="middle">
      <i-col span="24">
        <p v-for="(item, index) in cellData.items"
           :key="index">TM{{ formatItemDisplay(item) }}</p>
      </i-col>
    </Row>
  </div>
</template>
<script>
export default {
  name: 'SkillItemDisplayCell',
  props: {
    row: {
      type: Object
    },
    generation: [Number, String],
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
    formatItemDisplay(item) {
      return `${item < 100 ? '0' : ''}${item < 10 ? '0' : ''}${item}`
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss">
div.skill-item-display-cell {
  height: 100%;
  > .ivu-row-flex {
    height: inherit;
    font-size: 14px;
  }
}
</style>