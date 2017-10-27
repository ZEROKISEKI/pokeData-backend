<template>
  <div class="skill-editing-cell">
    <Row type="flex" :gutter="8">
      <i-col span="24">
        <poke-select :source="row"
                     label="name"
                     :remoteMethod="FetchPokemonsMessage"
                     remoteDataKey="pokemons"
                     :transfer="true"
                     :keys="['name', 'icon', 'number', 'properties']"
                     placeholder="选择宝可梦"></poke-select>
      </i-col>
    </Row>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import pokeSelect from '@/components/common/Select'
export default {
  name: 'SkillEditingCell',
  props: {
    row: {
      type: Object,
      default: {}
    }
  },
  components: {
    pokeSelect
  },
  data() {
    return {}
  },
  computed: {

  },
  methods: {
    ...mapActions(['FetchPokemonsMessage'])
  }
}
</script>
<style lang="scss">
div.skill-editing-cell {
  > .ivu-row-flex {
    padding: 10px;
  }
}
</style>