<template>
  <div class="feature-list-expand">
    <Row v-if="row.effect && row.effect.length > 0">
      <i-col span="24">
        <p class="title">特性效果: </p>
        <p v-for="effect in row.effect">{{ effect }}</p>
      </i-col>
    </Row>
  </div>
</template>
<script>
export default {
  props: {
    row: {
      type: Object,
      required: true
    }
  }
}
</script>
<style lang="scss">
div.feature-list-expand {
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