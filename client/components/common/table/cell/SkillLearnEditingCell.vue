<template>
  <div class="skill-learn-editing-cell">
    <Row type="flex" :gutter="8" justify="center">
      <i-col span="24">
        <poke-select :source="cellData.version"
                     placeholder="选择游戏版本"
                     :transfer="true"
                     :remote="false"
                     :multiple="true"
                     label="abstr"
                     :selectOptions="generationVersions"
                     :keys="['name', 'abstr']"></poke-select>
      </i-col>
    </Row>
  </div>
</template>
<script>
import pokeSelect from '@/components/common/Select'
export default {
  name: 'SkillLearnEditingCell',
  props: {
    row: {
      type: Object
    },
    generation: [Number, String],
    versions: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  components: {
    pokeSelect
  },
  data() {
    return {
      cellData: {
        version: []
      },
      generationVersions: []
    }
  },
  methods: {
    init() {
      const data = this.row.generations.find(e => e.number === this.generation)
      if(data) {
        this.cellData = data
      }
      this.generationVersions = this.versions.filter(version => {
        return version.generation === this.generation
      })
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss">
div.skill-learn-editing-cell {
  .ivu-row-flex {
    padding: 10px;
  }
}
</style>