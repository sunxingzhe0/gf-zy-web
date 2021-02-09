<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:fixed="{ row }">
        <div
          class="operation"
          @click="handleEdit(row.id)"
          :style="{ display: 'block' }"
        >
          修改
        </div>
      </template>

      <!-- 是否推荐 -->
      <template v-slot:slot_status="{ row }">
        <el-switch
          :value="row.status"
          :active-value="false"
          :inactive-value="true"
          @change="setState(row.id, row.status)"
          active-text="上架中"
          inactive-text="已下架"
          :width="60"
          class="textSwitch"
        >
        </el-switch>
      </template>

      <template v-slot:slot_availableInventory="{ row }">
        <EditableText
          icon="el-icon-edit"
          v-model="row.availableInventory"
          @confirm="confirm($event, row.id, 'availableInventory')"
        />
      </template>

      <template v-slot:slot_seq="{ row }">
        <EditableText
          icon="el-icon-edit"
          v-model="row.seq"
          @confirm="confirm($event, row.id, 'seq')"
        />
      </template>

      <template v-slot:footertool>
        <el-button class="addNewGrugs" @click="added()">新增药品</el-button>
        <!-- <el-upload
          class="upload-demo"
          action
          accept=".xlsx"
          :before-upload="handlebefore"
          :on-success="handleSuccess"
          :on-remove="handleremoveon"
          :http-request="httpRequest"
          :limit="1"
        >
          <el-button size="small" type="primary">批量上传</el-button>
        </el-upload> -->
        <el-button type="primary" plain @click="handleClickplain"
          >批量导入</el-button
        >
      </template>
      <template v-slot:slot_retailPrice="{ row }">
        ￥{{ row.retailPrice }}
      </template>
      <!-- 批量操作 -->
      <!-- <template v-slot:footertool>
        <el-button type="primary" @click="goTo()">新增药品</el-button>
      </template> -->
    </List>

    <el-dialog
      title="批量导入"
      :visible="importDialog.visible"
      append-to-body
      custom-class="component__dialog"
      :before-close="handleClose"
    >
      <el-form ref="importForm" label-width="100px">
        <el-form-item prop="upload">
          <el-button size="small" type="primary" @click="download"
            >下载导入模块</el-button
          >
          <el-upload
            class="upload-demo"
            action
            accept=".xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :on-remove="handleRemove"
            :file-list="importDialog.fileList"
            :before-upload="beforeUpload"
            :http-request="httpRequest"
            :on-change="hanleChange"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传 <code>excel</code> 文件，且不超过 2MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <div class="is-center">
          <el-button size="small" @click="importDialog.visible = false">
            取消
          </el-button>
          <el-button size="small" type="primary" @click="submit('importForm')">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </section>
</template>

<script>
import { List, mixin, EditableText } from '@/components'
import { getDrugList, setDrugsState, batchUpload } from '@/api/drugs'
import { packingUnit } from '@/api'
// import { invalidFieldSetFocus } from '@/utils'
import {
  modularLexcel, //导入下载
} from '@/api/dictionary'
import store from '@/store'
const pre = {
  basicPackUnit: [],
  commonPackUnit: [],
}

export default {
  name: 'DrugsManage',
  components: {
    List,
    EditableText,
  },
  mixins: [mixin({ fetchListFunction: getDrugList })],
  watch: {
    //全局监听刷新
    updateListAddNewDrugs() {
      this.$_fetchTableData(getDrugList)
    },

    $route(to, from) {
      //警急库存
      if (this.$route.query?.warnVal) {
        this.getNewList()
      }
      if (
        from.path != '/drugs/drugsmanage/AddNewDrugs' &&
        to.path != '/drugs/drugsmanage/AddNewDrugs' &&
        !this.$route.query.warnVal
      ) {
        this.query = {
          pageSize: 10,
          dateType: 0,
          searchType: 0,
          mechanismId: this.$store.state.user.store.id,
        }
        this.$_fetchTableData(getDrugList)
      }
    },
  },
  created() {
    if (this.$route.query?.warnVal) {
      this.getNewList()
    }
  },
  data() {
    return {
      loading: false,
      fileData: '',
      query: {
        pageSize: 10,
        dateType: 0,
        searchType: 0,
        mechanismId: this.$store.state.user.store.id,
      },
      // 查看弹框是否显示
      dialogVisible: false,
      // 切换
      switchValue: false,
      // 上传弹框表单
      importDialog: {
        loading: false,
        visible: false,
        fileList: [],
      },
      // columns: {
      //   basicUnitText:{
      //      minWidth: 100,
      //   },
      //   regularUnitText:{
      //     minWidth: 100,
      //   }
      // }
    }
  },
  beforeCreated() {
    this.getBasic()
  },
  async beforeRouteEnter(to, from, next) {
    ;[pre.basicPackUnit, pre.commonPackUnit] = await Promise.all([
      packingUnit({
        mechanismId: store.state.user.store.id,
        pageSize: 9999,
        unitType: 'BASIC_PACKAGING_UNIT',
      }),
      packingUnit({
        mechanismId: store.state.user.store.id,
        pageSize: 9999,
        unitType: 'CONVENTIONAL_PACKAGING_UNIT',
      }),
    ])
    ;[pre.basicPackUnit, pre.commonPackUnit] = [
      pre.basicPackUnit.list,
      pre.commonPackUnit.list,
    ]
    console.log(
      pre.commonPackUnit.map(_ => ({
        label: _.unitName,
        value: _.id,
      })),
    )
    next()
  },
  methods: {
    async download() {
      modularLexcel('药品字典模板.xls')
      this.$_fetchTableData(getDrugList)
    },
    async submit() {
      // this.$refs[formName].validate(async (valid, invalidFields) => {
      //   if (!valid) {
      //   } else {
      //     invalidFieldSetFocus(this.$refs[formName], invalidFields)
      //   }
      // })

      // this.importDialog.loading = true
      // this.$message({
      //   type: 'success',
      //   message: '完成',
      //   showClose: true,
      // })
      // const formData = new FormData()
      // formData.append('file', this.importDialog.fileList[0])
      // await batchUpload(formData)

      // this.importDialog.visible = false

      if (this.fileData) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        batchUpload(this.fileData, {
          mechanismId: this.query.mechanismId,
        })
          .then(() => {
            this.$message.success('操作成功!')
            this.$_fetchTableData(getDrugList)
          })
          //  .catch(
          //     setTimeout(() => {
          //
          //       this.$message.error('操作失败')

          //     }, 2000),
          //   )
          .finally(() => {
            setTimeout(() => {
              loading.close()
            }, 1000)
          })
        this.importDialog.visible = false
        this.importDialog.fileList = []
      } else {
        this.$message.success('请上传文件')
      }
    },
    handleClose() {
      this.importDialog.visible = false
    },
    handleRemove() {
      this.importDialog.fileList = []
    },

    //文件上传

    beforeUpload(file) {
      let ExcalBar = ['xls', 'xlsm', 'xltx']
      const isExcal =
        ExcalBar.indexOf(file.name.substring(file.name.lastIndexOf('.') + 1)) >
        -1
          ? true
          : false
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isExcal) {
        this.$message.error('上传excal只能是 excal 格式 !')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 2 MB !')
      }
      return isExcal && isLt2M
    },
    // httpRequest({ file, onProgress, onSuccess, onError }) {
    //   const formData = new FormData()
    //   formData.append('file', file)
    //   Promise.resolve(formData, onProgress)
    //     .then(onSuccess)
    //     .catch(onError)
    //     .finally(() => {
    //       this.importDialog.loading = false
    //     })
    // },
    httpRequest({ file }) {
      const formData = new FormData()
      formData.append('file', file)
      this.fileData = formData
    },
    //批量导入替换上次添加的文件
    hanleChange(file, fileList) {
      this.importDialog.fileList = [fileList[fileList.length - 1]]
    },
    handleClickplain() {
      this.importDialog.visible = true
      this.importDialog.fileList = []
    },
    getNewList() {
      this.query = {
        ...this.query,
        inventoryEnd: this.$route.query.warnVal - 1,
      }
      this.$_fetchTableData()
    },
    async confirm(value, id, type) {
      let datas = {
        id: id,
      }
      datas[type] = value
      await setDrugsState(datas)
      this.$message.success('修改成功')
      this.$_fetchTableData(getDrugList)
    },
    // 修改状态
    async setState(id, state) {
      await setDrugsState({
        id: id,
        status: !state,
      })
      this.$message.success(state ? '药品已上架！' : '药品已下架！')
      this.$_fetchTableData(getDrugList)
    },
    // 编辑
    // async handleEdit(i) {
    //   const res = await editDrugs({
    //     id: i,
    //   })
    //   this.form = res
    // },
    // 获取基本包装单位
    async getBasic() {
      ;[pre.basicPackUnit, pre.commonPackUnit] = await Promise.all([
        packingUnit({
          mechanismId: this.$store.state.user.store.id,
          unitType: 'BASIC_PACKAGING_UNIT',
        }),
        packingUnit({
          mechanismId: this.$store.state.user.store.id,
          unitType: 'CONVENTIONAL_PACKAGING_UNIT',
        }),
      ])
    },
    added() {
      //新增
      this.$router.push({
        path: 'AddNewDrugs',
      })
    },
    handleEdit(row) {
      //修改
      this.$router.push({
        path: 'AddNewDrugstt',
        query: {
          id: row,
        },
      })
    },
  },
  computed: {
    updateListAddNewDrugs() {
      return this.$store.state.updateList.updateListAddNewDrugs
    },
    filter() {
      return {
        date: {
          props: {
            options: [{ label: '创建时间', value: 0 }],
          },
          keys: ['dateType'],
        },
        search: {
          props: {
            options: [
              { label: '药品名称', value: 0 },
              { label: '药品ID', value: 1 },
              { label: '药品通用名', value: 2 },
              { label: '规格', value: 3 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },

        popover: [
          {
            props: {
              label: '基本包装单位',
              options: [
                { label: '不限', value: '' },
                ...pre.basicPackUnit.map(_ => ({
                  label: _.unitName,
                  value: _.id,
                })),
              ],
            },
            keys: 'basicUnitId',
          },
          {
            props: {
              label: '常规包装单位',
              options: [
                { label: '不限', value: '' },
                ...pre.commonPackUnit.map(_ => ({
                  label: _.unitName,
                  value: _.id,
                })),
              ],
            },
            keys: 'regularUnitId',
          },
          {
            props: {
              label: '药品属性',
              options: [
                { label: '不限', value: '' },
                { label: '抗感染类', value: 'ANTI_INFECTION' },
                { label: '生物制品', value: 'BIOLOGICAL_PRODUCTS' },
                { label: '泌尿系统用药', value: 'URINARY_SYSTEM_MEDICATION' },
              ],
            },
            keys: 'drugAttr',
          },
          {
            props: {
              label: '零售价',
              is: 'InputRange',
            },
            keys: ['priceStart', 'priceEnd'],
          },
          {
            props: {
              label: '可用库存',
              is: 'InputRange',
            },
            keys: ['inventoryStart', 'inventoryEnd'],
          },
          {
            props: {
              label: '状态',
              options: [
                { label: '不限', value: '' },
                { label: '上架中', value: false },
                { label: '已下架', value: true },
              ],
            },
            keys: 'status',
          },
          {
            props: {
              label: '属性',
              options: [
                { label: '不限', value: '' },
                { label: '普通', value: false },
                { label: '特殊', value: true },
              ],
            },
            keys: 'attr',
          },
        ],
      }
    },
    columns() {
      return {
        name: {
          minWidth: 100,
        },
        drugAttr: {
          minWidth: 100,
        },
        createTime: {
          minWidth: 160,
        },
        commonName: {
          minWidth: 120,
        },
        basicUnit: {
          minWidth: 120,
        },
        regularUnit: {
          minWidth: 120,
        },
        index: {
          hidden: true,
        },
        basicUnitText: {
          minWidth: 130,
        },
        regularUnitText: {
          minWidth: 130,
        },
        maritalType: {
          prop: 'slot_maritalType',
        },
        status: {
          prop: 'slot_status',
          minWidth: 90,
        },
        availableInventory: {
          prop: 'slot_availableInventory',
          minWidth: 120,
        },
        retailPrice: {
          prop: 'slot_retailPrice',
        },
        seq: {
          minWidth: 120,
          prop: 'slot_seq',
        },
        fixed: {
          minWidth: 120,
          prop: 'slot_fixed',
        },
        attr: {
          //属性
          formatter(row) {
            return row.attr ? '特殊' : '普通'
          },
        },
        split: {
          //是否拆零
          formatter(row) {
            if (row.split == null) {
              return '-'
            } else {
              return row.split ? '是' : '否'
            }
          },
          minWidth: 100,
        },
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/styles/_variables.scss';
.addNewGrugs {
  background: $--color-primary;
  color: #fff;
}
.bulkImport {
  color: $--color-primary;
}
.operation {
  color: $--color-primary;
  cursor: pointer;
}
</style>
