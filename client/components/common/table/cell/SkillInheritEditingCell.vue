<template>
  <div class="skill-inherit-editing-cell">
    <Row type="flex" :gutter="8">
      <i-col span="24">
        <poke-select :source.sync="cellData"
                     label="name"
                     :remoteMethod="FetchPokemonsMessage"
                     remoteDataKey="pokemons"
                     :transfer="true"
                     :keys="['name', 'icon']"
                     :multiple="true"
                     placeholder="选择宝可梦"></poke-select>
      </i-col>
    </Row>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import pokeSelect from '@/components/common/Select'
export default {
  name: 'SkillInheritEditingCell',
  props: {
    row: {
      type: Object
    },
    generation: [Number, String],
  },
  components: {
    pokeSelect
  },
  data() {
    return {
      cellData: []
    }
  },
  methods: {
    ...mapActions(['FetchPokemonsMessage']),
    init() {
      const data = this.row.generations.find(e => e.number === this.generation)
      if(data) {
        this.cellData = data.parents
      }
    }
  },
  created() {
    this.init()
  }
}
</script>
<style lang="scss">
div.skill-inherit-editing-cell {
  .ivu-row-flex {
    padding: 10px;
  }
}
</style>