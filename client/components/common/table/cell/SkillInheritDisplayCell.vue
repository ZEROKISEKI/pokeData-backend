<template>
  <div class="skill-inherit-display-cell">
    <Row type="flex" :gutter="8" justify="center">
      <i-col span="12" v-for="(pokemon, index) in cellData"
             :key="index">
        <Tooltip :content="pokemon.name" :transfer="true"
                 :placement="index % 2 === 0 ? 'left' : 'right'" v-if="pokemon.icon">
          <Avatar shape="circle" :src="qiniuImage(pokemon.icon)"
                  style="background-color: transparent;"></Avatar>
        </Tooltip>
      </i-col>
    </Row>
  </div>
</template>
<script>
import { qiniuHost, qiniuImageOptions } from '@/utils/qiniu'
export default {
  name: 'SkillInheritDisplayCell',
  props: {
    row: {
      type: Object
    },
    generation: [Number, String],
  },
  data() {
    return {
      cellData: [],
      imageOption: qiniuImageOptions.image100x100
    }
  },
  computed: {

  },
  methods: {
    init() {
      const data = this.row.generations.find(e => e.number === this.generation)
      if(data) {
        this.cellData = data.parents
      }
    },
    qiniuImage(url) {
      return `${qiniuHost}/${url}?${this.imageOption}`
    },
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss">
div.skill-inherit-display-cell {
  div.ivu-row-flex {
    padding-top: 10px;
    .ivu-col {
      margin-bottom: 5px;
    }
  }
}
</style>