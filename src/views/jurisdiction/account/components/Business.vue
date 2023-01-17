<template>
  <el-form
    ref="form"
    :model="model"
    :rules="rules"
    label-width="120px"
    :disabled="isDisable"
  >
    <el-form-item label="是否启用自定义" prop="custom">
      <el-radio-group v-model="model.custom" @change="clearValidate">
        <el-radio :label="true">是</el-radio>
        <el-radio :label="false">否</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item
      v-for="(value, key) in model.custom ? model.customBiz : defaultBiz"
      :key="key"
      :label="
        key === 'CONSULT'
          ? '在线咨询'
          : key === 'REPEAT_CLINIC'
          ? '在线复诊'
          : key === 'REPORT_READ'
          ? '报告解读'
          : '慢病续方'
      "
    >
      <el-row :gutter="20" style="overflow: hidden">
        <el-col
          style="display: flex"
          :md="8"
          v-for="(item, index) in value"
          :key="item.configId"
        >
          <el-checkbox
            :disabled="!model.custom"
            v-model="item.state"
            :true-label="1"
            :false-label="0"
            style="margin-right: 10px"
          >
            {{
              item.bizWay === 'GRAPHIC'
                ? '图文'
                : item.bizWay === 'VIDEO'
                ? '视频'
                : item.bizWay === 'PHONE'
                ? '电话'
                : ''
            }}
          </el-checkbox>
          <el-form-item
            :prop="`customBiz.${key}.${index}.itemIds`"
            :rules="rules.newBizPrice"
            style="margin-bottom: 22px"
          >
            <el-select
              :disabled="!model.custom"
              v-model="item.itemIds"
              placeholder="请选择"
              @change="changeVal"
            >
              <el-option
                v-for="(it, iti) in feeOptions"
                :key="iti"
                :label="`${it.itemName} ¥ ${it.price}`"
                :value="it.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item
            :prop="`customBiz.${key}.${index}.bizPrice`"
            :rules="rules.bizPrice"
            style="margin-bottom: 22px"
          >
            <el-input
              :disabled="!model.custom"
              style="max-width: 80%; vertical-align: middle"
              v-model="item.bizPrice"
            >
              <template v-slot:prepend>¥</template>
            </el-input>
            / 次
          </el-form-item> -->
        </el-col>
      </el-row>
    </el-form-item>
  </el-form>
</template>

<script>
import { getFeeItem } from '@/api/business'
import { deepClone } from '@/utils'
import { invalidFieldSetFocus } from '@/utils'
import { findDocAccountConfig } from '@/api/authority'

const initData = {
  CONSULT: ['GRAPHIC', 'VIDEO', 'PHONE'].map(bizWay => ({
    bizWay,
    bizPrice: '0.00',
    bizType: 'CONSULT',
    peopleNum: 0,
    state: 0,
    totalState: 0,
  })),
  REPEAT_CLINIC: ['GRAPHIC', 'VIDEO'].map(bizWay => ({
    bizWay,
    bizPrice: '0.00',
    bizType: 'REPEAT_CLINIC',
    peopleNum: 0,
    state: 0,
    totalState: 0,
  })),
  CARRYON_PRESC: ['GRAPHIC', 'VIDEO'].map(bizWay => ({
    bizWay,
    bizPrice: '0.00',
    bizType: 'CARRYON_PRESC',
    peopleNum: 0,
    state: 0,
    totalState: 0,
  })),
  REPORT_READ: ['GRAPHIC'].map(bizWay => ({
    bizWay,
    bizPrice: '0.00',
    bizType: 'REPORT_READ',
    peopleNum: 0,
    state: 0,
    totalState: 0,
  })),
}

export default {
  name: 'Business',
  props: {
    isDisable: {
      type: Boolean,
      default: false,
    },
    doctorId: String,
    defDeptId: String,
    titleId: String,
  },
  data() {
    this.rules = {
      bizPrice: [
        {
          validator: (rule, value, callback) => {
            if (Number.isNaN(-value) || value === '') {
              callback(new Error('请输入数字'))
            } else if (value > 1e8) {
              callback(new Error('最大价格1亿'))
            } else if (!/^\d{1,8}(\.\d{0,2})?$/.test(value)) {
              callback(new Error('最多两位小数'))
            } else {
              callback()
            }
          },
          trigger: 'blur',
        },
      ],
      itemIds: [
        {
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('请选择'))
            } else {
              callback()
            }
          },
          trigger: 'change',
        },
      ],
    }

    return {
      feeOptions: [],
      model: {
        custom: false,
        customBiz: {},
      },

      defaultBiz: {},
    }
  },
  created() {
    this.fetchConfig()
    this.getFeeItem()
  },
  methods: {
    changeVal(e) {
      console.log(e)
    },
    //获取收费项目
    async getFeeItem() {
      this.feeOptions = await getFeeItem()
    },
    fetchConfig: async function () {
      if (!this.defDeptId || this.defDeptId == '0' || !this.titleId) {
        // this.$message({
        //   type: 'error',
        //   message: '未设置账号科室与药房，无法获取业务设置',
        //   showClose: true,
        // })
        return
      }

      const { custom, customBiz, defaultBiz } = await findDocAccountConfig({
        doctorId: this.doctorId,
        deptId: this.defDeptId,
        titleId: this.titleId,
      })

      this.model.custom = custom

      this.model.customBiz = customBiz.reduce((_, config) => {
        const index = { GRAPHIC: 0, VIDEO: 1, PHONE: 2 }[config.bizWay]
        _[config.bizType][index] = config
        return _
      }, deepClone(initData))
      Object.keys(this.model.customBiz).forEach(key => {
        if (key == 'CARRYON_PRESC') {
          this.model.customBiz[key] = this.model.customBiz[key].slice(0, 1)
        }
        if (key == 'CONSULT') {
          this.model.customBiz[key] = this.model.customBiz[key].slice(0, 2)
        }
      })

      this.defaultBiz = defaultBiz.reduce((_, config) => {
        console.log(_, config, 222)
        console.log({ GRAPHIC: 0, VIDEO: 1, PHONE: 2 }[config.bizWay])
        const index = { GRAPHIC: 0, VIDEO: 1, PHONE: 2 }[config.bizWay]
        _[config.bizType][index] = config
        return _
      }, deepClone(initData))
      Object.keys(this.defaultBiz).forEach(key => {
        if (key == 'CARRYON_PRESC') {
          this.defaultBiz[key] = this.defaultBiz[key].slice(0, 1)
        }
        if (key == 'CONSULT') {
          this.defaultBiz[key] = this.defaultBiz[key].slice(0, 2)
        }
      })
      console.log(this.defaultBiz, 'defalut')
    },

    clearValidate() {
      this.$refs.form.clearValidate()
    },

    submit(formName = 'form') {
      return new Promise((resolve, reject) => {
        if (!this.model.custom) {
          resolve({
            custom: this.model.custom,
            bizList: Object.values(this.defaultBiz).flat(2),
          })

          return
        }

        this.$refs[formName].validate(async (valid, invalidFields) => {
          if (valid) {
            resolve({
              custom: this.model.custom,
              bizList: Object.values(this.model.customBiz).flat(2),
            })
          } else {
            reject(invalidFields)
            invalidFieldSetFocus(this.$refs[formName], invalidFields)
          }
        })
      })
    },
  },
}
</script>
