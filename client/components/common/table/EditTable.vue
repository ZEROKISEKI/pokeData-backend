<!-- 基于iview-admin edit-table改造 -->
<!-- 可编辑单元格表格 -->
<!-- 不支持可编辑单元行 -->
<!-- 需要传入的关键props: columns(表格列配置), renders(列对应的单元格的视图), callback(对应的按钮的回调) -->
<template>
  <div class="edit-table">
    <Table :columns="columns" :data="rowData" border disabledHover :width="width"></Table>
  </div>
</template>
<script>
const saveIconBtn = (vm, h, param, callback) => {
  return h('Button', {
    props: {
      type: 'text',
      icon: 'checkmark',
    },
    style: {
      padding: '6px 0'
    },
    on: {
      click: callback ? () => {
        callback()
        // 反馈数据
        vm.feedbackData()
      } : () => {
        vm.rowData[param.index].editingCell[param.column.key]
          = vm.editingStore[param.index].editingCell[param.column.key] = true
        vm.rowData[param.index][param.column.key] = JSON.parse(JSON.stringify(vm.editingStore[param.index][param.column.key]))
        vm.feedbackData()
      }
    }
  })
}

const editIconBtn = (vm, h, param, callback) => {
  return h('Button', {
    props: {
      type: 'text',
      icon: 'edit',
    },
    style: {
      padding: '6px 0'
    },
    on: {
      click: callback ? callback : (event) => {
        vm.rowData[param.index].editingCell[param.column.key] =
          vm.editingStore[param.index].editingCell[param.column.key] = true
      }
    }
  })
}

const cancelIconBtn = (vm, h, param, callback) => {
  return h('Button', {
    props: {
      type: 'text',
      icon: 'close',
    },
    style: {
      padding: '6px 0'
    },
    on: {
      click: callback ? () => {
        callback()
        // vm.feedbackData()
      } : () => {
        // 这里用老data对应位置的值重新初始化
        vm.editingStore[param.index][param.column.key] =
          JSON.parse(JSON.stringify(vm.rowData[param.index][param.column.key]))
        vm.rowData[param.index].editingCell[param.column.key] =
          vm.editingStore[param.index].editingCell[param.column.key] = false
        // vm.feedbackData()
      }
    }
  })
}

const deleteButton = (vm, h, currentRow, param) => {
  return h('Row', {
    props: {
      type: 'flex',
      align: 'middle',
      justify: 'center'
    },
    style: {
      height: '100%'
    }
  }, [
    h('i-col', {
      props: {
        span: '24'
      }
    }, [
      h('Poptip', {
        props: {
          confirm: true,
          title: '您确定要删除这条数据吗?',
          transfer: true
        },
        on: {
          'on-ok': () => {
            vm.editingStore.splice(param.index, 1)
            vm.rowData.splice(param.index, 1)
            vm.feedbackData()
          }
        }
      }, [
        h('Button', {
          style: {
            margin: '0 5px'
          },
          props: {
            type: 'error',
            placement: 'top',
          }
        }, '删除')
      ])
    ])
  ])
}

// TODO 修改默认编辑render
const cellInput = (vm, h, param, column) => {
  return h('Input', {
    props: {
      type: 'text',
      value: vm.editingStore[param.index][column.key]
    },
    on: {
      'on-change' (event) {
        let key = column.key;
        vm.editingStore[param.index][key] = event.target.value;
      }
    }
  });
};


export default {
  name: 'EditTable',
  props: {
    refs: {
      type: String
    },
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    renders: {
      type: Array
    },
    // 加loading需要sync
    loading: {
      type: Boolean
    },
    width: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      rowData: []
    }
  },
  computed: {

  },
  methods: {
    init() {
      // 拿到那些可以进行编辑的列
      let editableCells = this.columns.filter(column => {
        return column.editable && column.editable === true
      })
      // 进行深拷贝(对于undefined和function, Symbol无效，但是在实际场景足够使用)
      let deepCloneData = JSON.parse(JSON.stringify(this.data))
      this.rowData = deepCloneData.map(item => {
        let editingCell = {}
        editableCells.forEach(cell => {
          editingCell[cell.key] = false
        })
        // 初始化对应行的可编辑列的编辑状态(是否正在编辑)
        this.$set(item, 'editingCell', editingCell)
        return item
      })
      // 再次深拷贝
      this.editingStore = JSON.parse(JSON.stringify(this.rowData))
      this.columns.forEach(column => {
        if(column.editable) {
          column.render = (h, param) => {
            let currentRow = this.rowData[param.index]
            const r = this.renders.find(render => render.key === column.key)
            if(r) {
              return r.render(this, h, currentRow, param,
                saveIconBtn, editIconBtn, cancelIconBtn)
            } else {
              return h('Row', {
                props: {
                  type: 'flex',
                  gutter: 16,
                  align: 'middle',
                  justify: 'center'
                }
              }, [
                h('i-col', {
                  props: {
                    span: '20'
                  }
                }, this.editingStore[param.index].editingCell[param.column.key] ? [
                  cellInput(this, h, param, column)
                ] : [
                  h('span', currentRow[column.key])
                ]),
                h('i-col', {
                  props: {
                    span: '4'
                  }
                }, this.editingStore[param.index].editingCell[param.column.key] ? [
                  saveIconBtn(this, h, param),
                  cancelIconBtn(this, h, param)
                ]: [
                  editIconBtn(this, h, param)
                ])
              ])
            }
          }
        }

        if(column.operations) {
          column.render = (h, param) => {
            let currentRowData = this.rowData[param.index]
            return deleteButton(this, h, currentRowData, param)
          }
        }
      })
    },
    feedbackData() {
      const deepCloneData = JSON.parse(JSON.stringify(this.rowData))
      const result = deepCloneData.map(item => {
        this.$delete(item, 'editingCell')
        return item
      })
      this.$emit('update:data', result)
    }
  },
  mounted() {

  },
  created() {
    this.init()
  },
  watch: {
    // 监听数据
    data(newValue) {
      if((newValue.length > this.rowData.length) && !this.loading) {
        // 防止点击添加过快在更新数据上出错
        this.$emit('update:loading', true)
        let editableCells = this.columns.filter(column => {
          return column.editable && column.editable === true
        })
        let deepCloneData = JSON.parse(JSON.stringify(newValue[newValue.length - 1]))
        let editingCell = {}
        // 初始化新增行的各列的编辑状态
        editableCells.forEach(cell => {
          editingCell[cell.key] = false
        })
        this.$set(deepCloneData, 'editingCell', editingCell)
        this.rowData.push(deepCloneData)
        this.editingStore.push(JSON.parse(JSON.stringify(deepCloneData)))
        // 此时添加新数据完毕, 可以继续添加了
        // 可以用setTimeout进行测试
        this.$emit('update:loading', false)
      }
    }
  }
}
</script>
<style lang="scss">
div.edit-table {
  > .ivu-table-wrapper {
    > .ivu-table {
      > .ivu-table-header {

      }
      > .ivu-table-body {
        .ivu-table-cell {
          height: 100%;
        }
      }
    }
  }
  .ivu-table-cell {
    padding-left: 8px;
    padding-right: 8px;
  }
}
</style>