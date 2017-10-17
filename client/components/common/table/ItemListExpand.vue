<template>
  <div class="item-list-expand">
    <Row v-if="row.aliasName && row.aliasName.length > 0">
      <i-col span="24">
        <p class="title">道具别名: </p>
        <p>{{ aliasName }}</p>
      </i-col>
    </Row>
    <Row v-if="row.description">
      <i-col span="24">
        <p class="title">道具说明: </p>
        <p>{{ row.description }}</p>
      </i-col>
    </Row>
    <Row v-if="row.result && row.result.length > 0">
      <i-col span="24">
        <p class="title">道具效果: </p>
        <p v-for="effect in row.result">{{ effect }}</p>
      </i-col>
    </Row>
  </div>
</template>
<script>
export default {
  name: 'ItemListExpand',
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  computed: {
    aliasName() {
      return this.row.aliasName.join('、')
    }
  }
}
</script>
<style lang="scss">
div.item-list-expand {
  div.ivu-row {
    margin-bottom: 10px;
    .title {
      font-weight: bolder;
      font-size: 16px;
      margin-bottom: 5px;
    }
  }
}
</style>