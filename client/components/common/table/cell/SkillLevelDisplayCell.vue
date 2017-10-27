<template>
  <div class="skill-level-display-cell">
    <Row type="flex" :gutter="8" justify="center">
      <i-col span="24" style="padding-left: 4px;">
        <table class="version-table" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <th v-for="version in convertVersions"
                :width="countWidth(version)"
                :key="version.abstr">{{ version.abstr }}</th>
            <!--:style="getVersionColor(version)"-->
          </tr>
          <tr>
            <td :colspan="cell.len" :key="index"
                v-for="(cell, index) in sortVersions">{{ cell.level }}</td>
          </tr>
        </table>
      </i-col>
    </Row>
  </div>
</template>
<script>
export default {
  name: 'SkillLevelDisplayCell',
  props: {
    row: {
      type: Object
    },
    generation: [Number, String],
    versions: {
      type: Array
    }
  },
  data() {
    return {
      cellData: {
        value: []
      }
    }
  },
  computed: {
    convertVersions() {
      const data = JSON.parse(JSON.stringify(this.cellData.value))
      // 从低到高排序
      data.sort((a, b) => {
        return a.version.length - b.version.length
      })
      const result = []
      for(let item of data) {
        result.push(...item.version)
      }
      return result
    },
    sortVersions() {
      const data = JSON.parse(JSON.stringify(this.cellData.value))
      data.sort((a, b) => {
        return a.version.length - b.version.length
      })
      const result = []
      for(let item of data) {
        result.push({
          level: item.level,
          len: item.version.length
        })
      }
      return result
    },
  },
  methods: {
    init() {
      this.cellData = this.row.generations.find(e => e.number === this.generation)
    },
    getVersionColor(version) {
      const result = this.versions.find(v => v.abstr === version.abstr)
      if(result) {
        return {
          backgroundColor: result.background,
          color: result.font,
        }
      }
    },
    countWidth(version) {
      const data = JSON.parse(JSON.stringify(this.cellData.value))
      let count = 0
      for(let item of data) {
        for(let k of item.version) {
          count += k.abstr.length
        }
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
div.skill-level-display-cell {
  > .ivu-row-flex {
    > .ivu-col {
      // padding: 0!important;
    }
  }
  .version-cell {
    display: inline-block;
    padding: 1px 4px;
  }
  .level-cell {

  }
  .version-table {
    width: 100%;
    margin-left: -8px;
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