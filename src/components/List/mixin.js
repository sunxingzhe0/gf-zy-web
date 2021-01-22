import Vue from 'vue'

function getMethodName(property) {
  return property.replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
    return 'resolve' + $1.toUpperCase() + $2 + 'Click'
  })
}

function getFetchListFunction(active, config) {
  if (!active) {
    return config[0]?.fetchListFunction
  }
  switch (typeof active) {
    case 'function':
      return active
    case 'string':
      return getFetchListFunction(
        config.find(({ prop }) => prop === active)?.fetchListFunction,
      )

    default:
      throw new Error(
        '请定义列表获取接口: mixin({ fetchListFunction: <api> } | [{ fetchListFunction: <api>, prop: <prop> }])',
      )
  }
}

export default function (options) {
  const config = Array.prototype.concat(options)
  return Vue.extend({
    name: 'ListMixin',
    data() {
      return {
        ...config.reduce((_, { prop }) => {
          const tableData = {
            multipleSelection: [],
            headers: [],
            list: [],
            total: 0,
            done: false,
          }
          if (prop) _[prop] = { tableData, loading: false }
          else {
            _.tableData = tableData
            _.loading = false
          }

          return _
        }, {}),
      }
    },
    computed: {
      table() {
        if (
          this.activeName &&
          config.some(({ prop }) => this.activeName === prop)
        ) {
          return this[this.activeName]
        }

        return this[config[0]?.prop] ?? this
      },
    },
    watch: config.reduce((_, { fetchListFunction, prop }) => {
      const watcher = {
        handler: function () {
          this.$_fetchTableData(fetchListFunction)
        },
        deep: true,
      }

      if (prop) _[prop + '.query'] = watcher
      else _['query'] = watcher

      return _
    }, {}),
    mounted() {
      this.$refs.table &&
        this.$_fetchTableData(this.activeName).then(() => {
          this.fetchTableDataHook?.()
        })
    },
    methods: {
      async $_fetchTableData(active = this.activeName) {
        this.table.loading = true
        const { headers, total, list, extData } = await getFetchListFunction(
          active,
          config,
        )(this.table.query).finally(() => {
          this.table.loading = false
        })

        this.table.tableData = {
          ...this.table.tableData,
          headers,
          list,
          total,
          extData,
        }

        this.$nextTick(() => {
          this.fetchDataHook?.()
          this.table.tableData.done = true
          Array.prototype.concat(this.$refs.table).forEach(_ => {
            _?.doLayout?.()
          })
        })
      },
      $_resolveCellClassName({ column: { property } }) {
        return property &&
          Object.prototype.toString.call(this[getMethodName(property)]) ===
            '[object Function]'
          ? 'clickable'
          : null
      },
      $_handleCellClick(row, { property }) {
        property &&
          Object.prototype.toString.call(this[getMethodName(property)]) ===
            '[object Function]' &&
          this[getMethodName(property)].call(this, ...arguments)
      },
      $_selectionChange(val) {
        this.table.tableData.multipleSelection = val
      },
      $_sortChange({ prop, order }) {
        if (['ascending', 'descending'].includes(order)) {
          this.table.query = {
            ...this.table.query,
            field: prop?.replace(/^slot_/, '') ?? prop,
            sorted: order === 'ascending' ? 'ASC' : 'DESC',
          }
        } else {
          this.table.query = {
            ...this.table.query,
            field: null,
            sorted: null,
          }
        }
      },
    },
  })
}
