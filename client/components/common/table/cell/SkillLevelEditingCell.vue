<template>
  <div class="skill-level-editing-cell">
    <Row v-for="(value, index) in cellData.value"
         type="flex"
         :gutter="8"
         :key="index">
      <i-col span="24">
        <poke-select :source="value.version"
                     placeholder="选择游戏版本"
                     :transfer="true"
                     :remote="false"
                     :multiple="true"
                     label="abstr"
                     :selectOptions="generationVersions"
                     :keys="['name', 'abstr']"></poke-select>
      </i-col>
      <i-col span="12">
        <InputNumber v-model="value.level" :max="100" :min="0"></InputNumber>
      </i-col>
      <i-col span="12">
        <Button type="error" long @click="removeTab(index)">删除</Button>
      </i-col>
    </Row>
    <div class="add-version-container">
      <Button long icon="plus-round" type="ghost" @click="addTab"></Button>
    </div>
  </div>
</template>
<script>
import PokeSelect from '@/components/common/Select'
export default {
  name: 'SkillLevelEditingCell',
  props: {
    row: {
      type: Object
    },
    generation: [Number, String],
    versions: {
      type: Array
    }
  },
  components: {
    PokeSelect
  },
  data() {
    return {
      cellData: {
        value: []
      },
      generationVersions: []
    }
  },
  methods: {
    init() {
      this.cellData = this.row.generations.find(e => e.number === this.generation)
      this.generationVersions = this.versions.filter(version => {
        return version.generation === this.generation
      })
    },
    removeTab(index) {
      this.cellData.value.splice(index, 1)
    },
    addTab() {
      this.cellData.value.push({
        version: [],
        level: 0
      })
    },
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss">
div.skill-level-editing-cell {
  > .ivu-row-flex {
    margin-bottom: 10px;
    margin-left: 0!important;
    margin-right: 0!important;
    &:first-child {
      margin-top: 10px;
    }
    > .ivu-col.ivu-col-span-24 {
      margin-bottom: 10px;
      .poke-select {
        .ivu-select {
          .ivu-select-selection {
            padding: 0 24px 0 4px;
          }
        }
      }
    }
  }
  .add-version-container {
    padding: 0 8px 5px 8px;
    margin-top: 10px;
    border-bottom: 1px solid #e9eaec;
  }
}
</style>