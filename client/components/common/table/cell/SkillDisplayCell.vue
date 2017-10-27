<template>
  <div class="skill-display-cell">
    <Row type="flex" :gutter="8" align="middle" justify="center">
      <i-col span="24" class="col-icon">
        <Avatar :src="qiniuImage(row.icon)" shape="circle" v-if="row.icon"
                style="background-color: transparent;"></Avatar>
        <p>{{ row.name }}</p>
      </i-col>
    </Row>
  </div>
</template>
<script>
import { qiniuHost, qiniuImageOptions } from '@/utils/qiniu'
export default {
  name: 'SkillDisplayCell',
  props: {
    row: {
      type: Object
    }
  },
  components: {

  },
  data() {
    return {
      imageOption: qiniuImageOptions.image100x100
    }
  },
  computed: {

  },
  methods: {
    qiniuImage(url) {
      return `${qiniuHost}/${url}?${this.imageOption}`
    },
  },
  created() {

  }
}
</script>
<style lang="scss">
div.skill-display-cell {
  > .ivu-row-flex {
    // border-right: 1px solid #e9eaec;
    height: 100%;
    .ivu-col {
      height: inherit;
    }
    .col-icon {

    }
    .col-name {

    }
  }
}
</style>