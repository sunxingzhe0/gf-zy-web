<template>
  <div
    class="c__filter"
    :style="`height: ${showFilter ? 'auto' : '47px'}`"
    v-if="filterNum > 0"
    ref="tableFilter"
  >
    <div class="c_filter_left">
      <div
        class="c__filter_item c__filter_item_date"
        v-if="data.date || data.time"
      >
        <template v-if="data.date">
          <el-select
            class="prepend-select prepend-select-date"
            v-model="values[data.date.keys[0]]"
            size="small"
            @change="values[keys.date.start] && resolveEmitChange()"
          >
            <el-option
              v-for="{ label, value } in data.date.props.options"
              :key="value"
              :label="label"
              :value="value"
            ></el-option>
          </el-select>
          <el-date-picker
            :offset="-220"
            v-model="values[keys.date.start]"
            ref="dataPicker"
            @focus="clearBtnTap"
            clearable
            :type="
              data.date.props.type ||
              (data.time ? 'daterange' : 'datetimerange')
            "
            :format="
              data.date.props.format ||
              (data.time ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss')
            "
            :value-format="
              data.date.props.valueFormat ||
              (data.time ? 'yyyyMMdd' : 'yyyyMMddHHmmss')
            "
            size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="
              data.isDisabledDate
                ? newPickerOptions
                : data.date.props.pickerOptions || pickerOptions
            "
            v-bind="data.date.props"
            @change="resolveEmitChange"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
        </template>

        <el-time-picker
          v-if="data.time"
          is-range
          v-model="values[time.date.start]"
          range-separator="~"
          value-format="HHmmss"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
          size="small"
          @change="resolveEmitChange"
        >
        </el-time-picker>
      </div>
      <div class="c__filter_item" v-if="data.search">
        <el-input
          style="max-width: 500px"
          v-if="data.search"
          class="input-with-select"
          v-model="values[data.search.keys[1]]"
          size="small"
          :placeholder="data.search.props.placeholder || '请输入内容'"
          clearable
          @clear="resolveEmitChange"
          @keyup.native.enter="resolveEmitChange"
        >
          <template v-slot:prepend>
            <el-select
              class="prepend-select"
              style="min-width: 140px"
              v-model="values[data.search.keys[0]]"
              size="small"
              placeholder="请选择"
              @change="values[data.search.keys[1]] = ''"
            >
              <el-option
                v-for="{ label, value } in data.search.props.options"
                :key="value"
                :label="label"
                :value="value"
              ></el-option>
            </el-select>
          </template>
        </el-input>
      </div>
      <div
        class="c__filter_item"
        v-for="{ props, data = {}, keys } in data.inline"
        :key="isArray(keys) ? keys.join('') : keys"
      >
        <div class="item-label is-right">
          <template v-if="props.noColon">{{ props.label }}</template>
          <template v-else>{{
            props.label ? props.label + '：' : ''
          }}</template>
        </div>

        <component
          v-if="props.is !== 'el-select'"
          :is="props.is"
          size="small"
          v-bind="data.attrs"
          v-on="data.on"
          :value-format="'yyyyMMddHHmmss'"
          v-model="values[isArray(keys) ? keys[0] : keys]"
          @keyup.native.enter="resolveEmitChange"
          style="width: 100%"
        >
          <slot />
        </component>

        <el-select
          v-else
          size="small"
          v-on="data.on"
          collapse-tags
          v-bind="data.attrs"
          style="width: 100%"
          :style="data.style"
          :remote="props.remote"
          v-model="values[keys]"
          :multiple="props.multiple"
          :filterable="props.filterable"
          :remote-method="props['remote-method']"
          :reserve-keyword="props['reserve-keyword']"
        >
          <el-option
            v-for="{ label, value, index } in props.options"
            :key="value"
            :label="label"
            :value="index ? index : value"
          ></el-option>
        </el-select>
      </div>
      <div
        class="c__filter_item"
        v-for="{ props, data = {}, keys } in data.popover"
        :key="isArray(keys) ? keys.join('') : keys"
      >
        <div class="item-label is-right">{{ props.label }}：</div>

        <component
          v-if="props.is"
          :is="props.is"
          :isInteger="props.isInteger"
          size="small"
          v-bind="data.attrs"
          :value-format="'yyyyMMddHHmmss'"
          v-on="data.on"
          v-model="values[isArray(keys) ? keys[0] : keys]"
          style="width: 100%"
        >
          <slot />
        </component>
        <el-select
          v-else-if="props.isTree"
          size="small"
          style="width: 100%"
          v-bind="data.attrs"
          v-on="data.on"
          v-model="showName"
          multiple
          :filter-method="
            data => {
              handleFilter(data, keys)
            }
          "
          @remove-tag="
            data => {
              removeTag(data, keys)
            }
          "
        >
          <el-option :value="values[keys]" style="height: auto; padding: 0">
            <el-tree
              :data="props.options"
              :props="props.treeProps"
              show-checkbox
              :ref="keys"
              node-key="id"
              default-expand-all
              @node-click="handleNodeClick"
              highlight-current
              current-node-key="node"
              :default-checked-keys="
                values[keys] ? values[keys].split(',') : []
              "
              :filter-node-method="filterNode"
              @check="handleChcek($event, keys)"
            >
              <!--  <span slot-scope="{ node, data }" class="custom-tree-node">
                    <span>{{ data.name }}</span>
                    <span>{{ data.resourceNum }}</span>
                  </span> -->
            </el-tree>
          </el-option>
        </el-select>
        <el-select
          v-else
          size="small"
          style="width: 100%"
          v-bind="data.attrs"
          :multiple="props.multiple"
          v-on="data.on"
          v-model="values[keys]"
        >
          <el-option
            v-for="{ label, value, index } in props.options"
            :key="value"
            :label="label"
            :value="index ? index : value"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="c_filter_right">
      <div class="btns">
        <el-button
          type="primary"
          size="small"
          @click="resolveEmitChange(), (isOpen = false)"
          >搜索</el-button
        >
        <el-button size="small" @click="clearFilterData('popover')">
          重置
        </el-button>
      </div>
      <div
        v-if="filterNum > 3"
        class="show-hide"
        @click="showFilter = !showFilter"
        :style="`color: ${showFilter ? '' : '#0AB2C1'};`"
      >
        <span>{{ showFilter ? '收起' : '展开' }}</span>
        <i :class="`el-icon-arrow-${showFilter ? 'up' : 'down'}`"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep, isArray } from 'lodash'
import { InputRange } from './components'
import dayjs from 'dayjs'
export default {
  name: 'TableFilter',
  components: {
    /* eslint-disable-next-line vue/no-unused-components */
    InputRange,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    resetBtnText: {
      type: String,
      default: '清空',
    },
  },
  data() {
    this.newPickerOptions = {
      disabledDate(time) {
        return (
          time.getTime() >
          dayjs(
            dayjs().subtract(1, 'day').format('YYYY-MM-DD') + ' ' + '23:59:59',
          ).valueOf()
        )
      },
      shortcuts: [
        {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            end.setTime(end.getTime() - 1000)
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          },
        },
        {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            end.setTime(end.getTime() - 1000)
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          },
        },
        {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            end.setTime(end.getTime() - 1000)
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          },
        },
      ],
    }
    this.pickerOptions = {
      shortcuts: [
        {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            end.setTime(end.getTime() - 1000)
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          },
        },
        {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            end.setTime(end.getTime() - 1000)
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          },
        },
        {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            end.setTime(end.getTime() - 1000)
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          },
        },
      ],
    }

    this.keys = {
      date: {
        start: this.data.date?.keys[1] || 'defaultstartTime',
        end: this.data.date?.keys[2] || 'defaultendTime',
      },
    }
    this.time = {
      date: {
        start: this.data.time?.keys[0] || 'defaultbeginTime',
        end: this.data.time?.keys[1] || 'defaultoverTime',
      },
    }
    return {
      values: {},
      showName: '',
      isOpen: false,
      showFilter: false,
    }
  },
  computed: {
    calcWords() {
      return Math.max(
        ...Object.values(this.data).map(_ =>
          isArray(_)
            ? Math.max(..._.map(({ props }) => props.label?.length ?? 0))
            : 0,
        ),
      )
    },
    hasPopover() {
      return this.data.popover?.length
    },
    hasDatePicker() {
      return !!this.data.date
    },
    //获取筛选条件数量
    filterNum() {
      let dateNum = 0
      let searchNum = 0
      let popoverNum = 0
      let inlineNum = 0
      if (this.data) {
        dateNum = this.data.date ? 2 : 0
        searchNum = this.data.search ? 1 : 0
        popoverNum = this.data.popover ? this.data.popover.length : 0
        inlineNum = this.data.inline ? this.data.inline.length : 0
        return dateNum + searchNum + popoverNum + inlineNum
      } else {
        return 0
      }
    },
  },
  watch: {
    value: {
      handler: function () {
        if (this.value.isFilterMore) {
          this.showFilter = false
          this.value.isFilterMore = false
        }
        this.cacheValue = cloneDeep(this.value)
        console.log(this.value, '----')
        if (
          this.value.isOtherPage &&
          (this.value.billTypes || this.value.status)
        )
          return //指定页面不清除筛选项
        this.setDefault(this.cacheValue, false)
      },
      immediate: true,
      deep: true,
    },
  },
  created() {
    this.hiddenPopover = () => {
      this.isOpen = false
    }
    document.body.addEventListener('click', this.hiddenPopover)
  },
  beforeDestroy() {
    document.body.removeEventListener('click', this.hiddenPopover)
  },
  methods: {
    //触发筛选函数
    handleFilter(data, key) {
      this.$refs[key][0].filter(data)
    },
    //筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    //移除tag
    removeTag(data, key) {
      console.log()
      let res = this.$refs[key][0].getCheckedNodes(true, true)
      //删除tag移除项
      res.forEach((item, index) => {
        item.name === data && res.splice(index, 1)
      })
      this.values[key] = res.map(item => item.id).join(',')
      //重新设置选中
      this.$refs[key][0].setCheckedNodes(this.values[key].split(','))
    },
    //点击树节点
    handleNodeClick() {},
    //树节点选中时
    handleChcek(data, key) {
      console.log(this.$refs)
      //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
      const res = this.$refs[key][0].getCheckedNodes(true, true)
      this.values[key] = res.map(item => item.id).join(',')
      this.showName = res.map(item => item.name)
      console.log(this.showName)
    },
    clearBtnTap() {
      this.$nextTick(() => {
        // 点击清空按钮弹层不收起
        let prevBtn = document.querySelector(
          '.el-picker-panel__footer .el-button.el-picker-panel__link-btn.el-button--text.el-button--mini',
        )
        console.log(prevBtn)
        if (prevBtn) {
          prevBtn.addEventListener('click', () => {
            this.$refs.dataPicker.focus()
          })
        }
      })
    },
    isArray,
    setDefault(cacheValue, isClear) {
      console.log(cacheValue)
      this.need2Split = {
        [this.keys.date.start]: this.keys.date.end,
        [this.time.date.start]: this.time.date.end,
      }

      const handleValue = ({ props, keys }) => {
        if (isArray(keys)) {
          ;['el-date-picker', 'InputRange', 'el-time-picker'].includes(
            props.is,
          ) && (this.need2Split[keys[0]] = keys[1])

          return keys.map((key, index) =>
            this.need2Split.key
              ? [key, [cacheValue[key], cacheValue[keys[index + 1]]]]
              : [key, cacheValue[key]],
          )
        } else {
          return [[keys, cacheValue[keys]]]
        }
      }
      this.values = {
        ...this.value,
        ...Object.fromEntries(
          Object.values(this.data).reduce(
            (r, value) =>
              r.concat(
                isArray(value)
                  ? value.reduce((_, value) => _.concat(handleValue(value)), [])
                  : handleValue(value),
              ),
            [],
          ),
        ),
      }
      this.values = {
        ...this.values,
        [this.keys.date.start]:
          !isClear &&
          this.values[this.keys.date.start] &&
          this.values[this.keys.date.end]
            ? [this.value[this.keys.date.start], this.value[this.keys.date.end]]
            : null,
        [this.time.date.start]:
          !isClear &&
          this.values[this.time.date.start] &&
          this.values[this.time.date.end]
            ? [this.value[this.time.date.start], this.value[this.time.date.end]]
            : null,
        [this.time.date.start]:
          !isClear && this.value[this.time.date.start]
            ? [this.value[this.time.date.start], this.value[this.time.date.end]]
            : null,
        [this.time.date.end]:
          !isClear && this.value[this.time.date.end]
            ? this.value[this.time.date.end]
            : null,
      }
      //拼接项回显
      Object.entries(this.values).forEach(([key]) => {
        if (key.indexOf('+') > 0) {
          this.values[key] =
            this.values[key.split('+')[0]] && this.values[key.split('+')[1]]
              ? this.values[key.split('+')[0]] +
                '+' +
                this.values[key.split('+')[1]]
              : ''
          delete this.values[key.split('+')[0]]
          delete this.values[key.split('+')[1]]
        }
      })
      console.log(this.values)
      isClear && this.$emit('change', cacheValue)
    },
    resolveEmitChange(page) {
      const data = cloneDeep(this.values)
      // this.values.currentNum = 1
      data.currentNum = 1

      // this.$EventBus.$emit('currentNumChange', 1)
      Object.entries(data).forEach(([key, value]) => {
        isArray(value) &&
          this.need2Split[key] &&
          ([data[key], data[this.need2Split[key]]] = value)

        if (!value && this.need2Split[key]) {
          data[this.need2Split[key]] = null
        }
        //分开拼接项
        if (key.indexOf('+') > 0) {
          data[key.split('+')[0]] = value.split('+')[0]
          data[key.split('+')[1]] = value.split('+')[1]
          delete data[key]
        }
      })
      if (page) {
        //对账页面处理多选参数
        const params = JSON.parse(JSON.stringify(data))
        if (Array.isArray(params.billTypes)) {
          params.billTypes = params.billTypes.join(',')
        }

        if (Array.isArray(params.status)) {
          params.status = params.status.join(',')
        }
        if (params.isFilterMore) {
          delete params.isFilterMore
        }
        /*  */
        this.$emit('change', params)
        /*  */
        // setTimeout(() => {
        //   this.values.billTypes = data.billTypes
        //   this.values.status = data.status
        // }, 1000)
        this.$EventBus.$emit('currentNumChange', params)
        return
      }

      this.$emit('change', data)
      this.$EventBus.$emit('currentNumChange', data)
    },

    clearArrayFilter(props) {
      //这段用于去除不可清除的项（如全部订单中的接收方）
      let canClearData = Object.values(props)
      for (let i = canClearData.length - 1; i >= 0; i--) {
        if (canClearData[i].canNotClear) {
          canClearData.splice(i, 1)
        }
      }
      // 将prop的所有项设置值为空并复制（覆盖）到this.values里
      const data = canClearData
        .map(({ keys }) => keys)
        .flat()
        .reduce((r, value) => r.concat([[value, '']]), [])
      Object.assign(this.values, Object.fromEntries(data), {
        currentNum: 1,
      })
    },
    clearFilterData() {
      /* 清除popover或inline筛选项 */
      const types = ['popover', 'inline']
      types.forEach(v => {
        console.log(v)
        this.data[v] && this.clearArrayFilter(this.data[v])
      })

      //这段是用来拆分startTime类似的数组的
      Object.entries(this.values).forEach(([key, value]) => {
        isArray(value) &&
          this.need2Split[key] &&
          ([this.values[key], this.values[this.need2Split[key]]] = ['', ''])
      })

      // 系统消息情况特殊条件判断
      if (this.values.readType == '') {
        this.values.readType = 0
      }
      console.log(this.$route.path)
      // 掌医缴费状态特殊条件判断
      if (
        this.$route.path == '/payment/reg/list' ||
        this.$route.path == '/payment/out-patient/list'
      ) {
        if (this.values.billState == '') {
          this.values.billState = 0
        }
        if (this.values.deptId == '') {
          this.values.deptId = null
        }
      }
      // 公告管理特殊条件判断
      if (this.$route.path == '/set-up/announcements/list') {
        this.values.deptId = null
        this.values.roleId = null
        this.values.state = null
      }

      // 清除关键字
      this.values.searchKeywords = null
      this.$emit('change', this.values)
      this.$EventBus.$emit('currentNumChange', this.values)
    },
  },
}
</script>

<style lang="scss">
@import '~@/styles/_variables.scss';
$select-width: 145px;

.c__filter {
  display: flex;
  width: 100%;
  transition: height 0.2s ease-in-out;
  overflow: hidden;
  .c_filter_left {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .c_filter_right {
    display: flex;
    width: 185px;
    flex-shrink: 0;
    .show-hide {
      display: flex;
      width: 50px;
      height: 32px;
      align-items: center;
      flex-shrink: 0;
      margin-left: 10px;
      font-size: 13px;
      cursor: pointer;
      span {
        margin-right: 5px;
      }
    }
    .btns {
      flex: 1;
      text-align: right;
    }
  }
  .c__filter_item {
    display: flex;
    width: 33.3%;
    align-items: center;
    padding: 0 15px 15px 0;
    .item-label {
      min-width: 70px;
      flex-shrink: 0;
      text-align: left;
      font-size: 14px;
    }
  }
  .c__filter_item_date {
    width: 520px;
  }
}
.c__filter {
  .el-input__inner,
  .el-range-input {
    font-size: 14px;
    color: #333 !important;
  }
  .prepend-select {
    max-width: $select-width;
  }

  .prepend-select-date {
    vertical-align: top;

    .el-input__inner {
      margin-right: -1px;
      width: calc(#{$select-width} + 1px);
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right-color: transparent;
      font-size: 14px;
      color: #333;
    }

    & + .el-input__inner {
      width: calc(100% - #{$select-width});
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      font-size: 14px;
      color: #333;
    }
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
