<template>
  <el-row class="c__filter" @click.native.stop>
    <el-col v-if="hasPopover" class="c__filter-switch" :span="4">
      <el-popover
        trigger="manual"
        :width="popoverWidth"
        v-model="isOpen"
        placement="bottom-start"
        transition="el-zoom-in-top"
        :visible-arrow="false"
        :offset="-20"
        :popper-class="
          popoverWidth ? 'c__filter-popper' : 'c__filter-popper no-width'
        "
        @click.stop
      >
        <div class="popper-container">
          <div class="fixedHeightBox">
            <div
              class="item"
              v-for="{ props, data = {}, keys } in data.popover"
              :key="isArray(keys) ? keys.join('') : keys"
            >
              <span
                class="item-label is-right"
                :style="{ width: `${calcWords + 1}em` }"
              >
                {{ props.label }}：
              </span>

              <component
                v-if="props.is"
                :is="props.is"
                :style="props.is === 'el-input' ? { maxWidth: '192px' } : {}"
                size="mini"
                v-bind="data.attrs"
                v-on="data.on"
                v-model="values[isArray(keys) ? keys[0] : keys]"
              >
                <slot />
              </component>

              <el-select
                v-else
                size="mini"
                v-bind="data.attrs"
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

          <div class="btns" style="padding-top: 10px;">
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
        </div>

        <div slot="reference">
          <label for="is-open">{{ data.label || '筛选条件' }}</label>
          <el-switch v-model="isOpen" id="is-open"></el-switch>
        </div>
      </el-popover>
    </el-col>

    <el-col :span="hasPopover ? 20 : 24">
      <el-row :gutter="20">
        <el-col
          v-if="hasDatePicker"
          v-bind="
            alwaysShowBtn
              ? {
                  xs: 24,
                  sm: 6,
                  lg: 6,
                  xl: 7,
                }
              : {
                  xs: 24,
                  sm: 12,
                  lg: hasPopover ? { span: 12 } : 12,
                }
          "
        >
          <!-- lg: hasPopover ? { span: 10, offset: 2 } : 10, -->
          <template>
            <div class="flex-start-center" style="min-width: 530px;">
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
                  :type="data.time ? 'daterange' : 'datetimerange'"
                  :format="data.time ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'"
                  :value-format="data.time ? 'yyyyMMdd' : 'yyyyMMddHHmmss'"
                  size="small"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
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
          </template>
        </el-col>

        <el-col
          v-bind="
            alwaysShowBtn
              ? { xs: 24, sm: 6, lg: 6, xl: 7 }
              : {
                  xs: 24,
                  sm: hasDatePicker ? 12 : 24,
                  lg: {
                    span: hasDatePicker ? 10 : 16,
                    offset: hasPopover ? 2 : 2,
                  },
                }
          "
          v-if="data.search"
        >
          <el-input
            v-if="data.search"
            class="input-with-select"
            v-model="values[data.search.keys[1]]"
            size="small"
            placeholder="请输入内容"
            clearable
            @clear="resolveEmitChange"
            @keyup.native.enter="resolveEmitChange"
          >
            <template v-slot:prepend>
              <el-select
                class="prepend-select"
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
            <template v-slot:append v-if="!data.search.props.hideBtn">
              <el-button
                icon="el-icon-search"
                @click="resolveEmitChange"
              ></el-button>
            </template>
          </el-input>
        </el-col>

        <el-col
          :xs="24"
          :sm="6"
          :lg="6"
          :xl="7"
          v-for="{ props, data = {}, keys } in data.inline"
          :key="isArray(keys) ? keys.join('') : keys"
          class="c__filter-inline"
        >
          <span
            class="item-label is-right"
            :style="{ width: `${calcWords + 1}em` }"
          >
            <template v-if="props.noColon">{{ props.label }}</template>
            <template v-else>{{ props.label }}：</template>
          </span>

          <component
            v-if="props.is !== 'el-select'"
            :is="props.is"
            size="small"
            v-bind="data.attrs"
            v-on="data.on"
            v-model="values[isArray(keys) ? keys[0] : keys]"
            @keyup.native.enter="resolveEmitChange"
          >
            <slot />
          </component>

          <el-select
            v-else
            size="small"
            v-on="data.on"
            collapse-tags
            v-bind="data.attrs"
            style="width: 100%;"
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
        </el-col>

        <el-col
          :xs="24"
          :sm="6"
          :lg="6"
          :xl="3"
          style="text-align: right; float: right;"
          v-if="alwaysShowBtn"
        >
          <el-button
            type="primary"
            size="small"
            style="font-size: 16px; padding: 7px 15px;"
            @click="resolveEmitChange(), (isOpen = false)"
            >搜索</el-button
          >
          <el-button
            style="font-size: 16px; padding: 7px 15px;"
            size="small"
            @click="clearFilterData('inline')"
            >{{ resetBtnText }}</el-button
          >
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { cloneDeep, isArray } from 'lodash'
import { InputRange } from './components'

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
    popoverWidth: {
      type: [String, Number],
    },
    alwaysShowBtn: {
      type: Boolean,
      default: false,
    },
    resetBtnText: {
      type: String,
      default: '清空',
    },
  },
  data() {
    this.pickerOptions = {
      shortcuts: [
        {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          },
        },
        {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          },
        },
        {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          },
        },
      ],
    }

    this.keys = {
      date: {
        start: this.data.date?.keys[1] || 'startTime',
        end: this.data.date?.keys[2] || 'endTime',
      },
    }
    this.time = {
      date: {
        start: this.data.time?.keys[0] || 'beginTime',
        end: this.data.time?.keys[1] || 'overTime',
      },
    }
    return {
      values: {},
      isOpen: false,
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
  },
  watch: {
    value: {
      handler: function () {
        this.cacheValue = cloneDeep(this.value)
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

      isClear && this.$emit('change', cacheValue)
    },
    resolveEmitChange() {
      const data = cloneDeep(this.values)
      data.currentNum = 1
      Object.entries(data).forEach(([key, value]) => {
        isArray(value) &&
          this.need2Split[key] &&
          ([data[key], data[this.need2Split[key]]] = value)

        if (!value && this.need2Split[key]) {
          data[this.need2Split[key]] = ''
        }
        //分开拼接项
        if (key.indexOf('+') > 0) {
          data[key.split('+')[0]] = value.split('+')[0]
          data[key.split('+')[1]] = value.split('+')[1]
          delete data[key]
        }
      })
      this.$emit('change', data)
    },

    clearFilterData(prop) {
      //这段用于去除不可清除的项（如全部订单中的接收方）
      let canClearData = Object.values(this.data[prop])
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
      this.values.searchKeywords = ''
      this.$emit('change', this.values)
    },
  },
}
</script>

<style lang="scss">
@import '~@/styles/_variables.scss';
$select-width: 110px;

.c__filter {
  .el-input__inner,
  .el-range-input {
    font-size: 16px;
    color: #333 !important;
  }
  .prepend-select {
    width: $select-width;
  }

  .prepend-select-date {
    vertical-align: top;

    .el-input__inner {
      margin-right: -1px;
      width: calc(#{$select-width} + 1px);
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right-color: transparent;
      font-size: 16px;
      color: #333;
    }

    & + .el-input__inner {
      width: calc(100% - #{$select-width});
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      font-size: 16px;
      color: #333;
    }
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}

.c__filter-switch {
  display: flex;
  align-items: center;
  height: 32px;

  label {
    padding-right: 16px;
    font-size: 16px;
    color: #666666;
  }
}

.c__filter-popper {
  margin-top: 6px !important;
  box-shadow: 0 6px 4px -4px rgba(0, 0, 0, 0.1) !important;
  border-radius: 0;
  border: none;

  &.no-width {
    right: $app-router-view-margin;
  }

  .popper-container {
    padding: 0 10%;

    .item {
      display: flex;
      align-items: center;
    }
    .fixedHeightBox {
      max-height: 60vh;
      overflow-y: auto;
      > div + div {
        margin-top: 10px;
      }
    }
  }

  .item-label {
    display: inline-block;
    margin-right: 10px;
    width: 5em;
    font-size: 16px;
  }
  .el-input__inner,
  .el-button--small {
    font-size: 16px;
  }
  .el-input__inner {
    color: #333;
  }
}

.c__filter-inline {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 80px;
  font-size: 16px;
  .item-label {
    display: inline-block;
    margin-right: 10px;
    width: 5em;
    white-space: nowrap;
    font-size: 16px;
  }
}
</style>
