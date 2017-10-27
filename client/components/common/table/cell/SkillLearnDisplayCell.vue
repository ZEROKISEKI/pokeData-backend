<template>
  <div class="skill-learn-display-cell">
    <Row type="flex" :gutter="8" justify="center">
      <i-col span="24">
        <table class="version-table" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <th v-for="version in cellData.version"
                :width="countWidth(version)"
                :key="version.abstr">{{ version.abstr }}</th>
          </tr>
          <tr>
            <td :colspan="cellData.version.length" v-if="cellData.version.length > 0">
              <Icon type="checkmark"></Icon>
            </td>
          </tr>
        </table>
      </i-col>
    </Row>
  </div>
</template>
<script>
export default {
  name: 'SkillLearnDisplayCell',
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
  data() {
    return {
      cellData: {
        version: []
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
    countWidth(version) {
      const data = JSON.parse(JSON.stringify(this.cellData.version))
      let count = 0
      for(let item of data) {
        count += item.abstr.length
      }
      return `${100 * version.abstr.length / count}%`
    }
  },
  created() {
    this.init()
  },
}
</script>
<style lang="scss">
div.skill-learn-display-cell {
  > .ivu-row-flex {
    margin-right: 0!important;
    margin-left: 0!important;
    > .ivu-col {
      padding-left: 0!important;
      padding-right: 0!important;
    }
  }
  .version-table {
    width: 100%;
    tr:first-child {
      th, td {
        border-top: 1px solid #e9eaec;
      }
    }
    thead th {
      border: 0;
    }
    th, td {
      text-align: center;
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>