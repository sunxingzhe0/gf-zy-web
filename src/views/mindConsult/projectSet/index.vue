<template>
  <div class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
      tableClass="institutionalusers"
      showSelection
    >
      <template v-slot:footertool>
        <el-button type="primary" @click="add()"> 添加 </el-button>
        <el-button plain type="danger" @click="del()"> 删除 </el-button>
        <el-button plain @click="stateChange(true)"> 启用 </el-button>
        <el-button plain @click="stateChange(false)"> 停用 </el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="add(row)"> 编辑 </el-button>
        <el-button
          type="text"
          v-if="row.enabled === 0"
          style="color: #f74a4a"
          @click="del([row.id])"
        >
          删除
        </el-button>
      </template>

      <template v-slot:slot_enabled="{ row }">
        <el-switch
          v-model="row.enabled"
          :active-value="1"
          :inactive-value="0"
          @change="stateChange(row.enabled === 1 ? true : false, row)"
          active-text="启用中"
          inactive-text="已停用"
          :width="50"
          class="textSwitch"
        ></el-switch>
      </template>
      <template v-slot:slot_sort="{ row }">
        <EditableText
          icon="el-icon-edit"
          v-model="row.sort"
          @confirm="changeSort($event, row)"
        ></EditableText>
      </template>
    </List>
    <el-dialog
      :title="editRow.state ? '新增' : '编辑'"
      :visible.sync="isAdd"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="90px">
        <el-form-item label="名称" prop="name">
          <el-input
            type="text"
            placeholder="请输入"
            v-model="form.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="时长/分钟" prop="duration">
          <el-input
            type="number"
            placeholder="请输入"
            v-model="form.duration"
          ></el-input>
        </el-form-item>
        <el-form-item label="收费项目" prop="diagDictId">
          <el-select
            v-model="form.diagDictId"
            placeholder="请选择"
            style="width: 60%"
            @change="hisDiagChange"
          >
            <el-option
              v-for="item in hisOption"
              :key="item.id"
              :label="item.itemName"
              :value="item.id"
              >{{ item.itemName }}</el-option
            >
          </el-select>
          <el-input
            style="width: 40%"
            v-model="form.quantity"
            placeholder="请输入数量"
            :min="1"
            type="number"
            @change="numChange"
          ></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input
            type="number"
            placeholder="请输入"
            disabled
            v-model="form.price"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            type="number"
            placeholder="请输入"
            v-model="form.sort"
          ></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="enabled">
          <el-radio-group v-model="form.enabled">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer is-center">
        <el-button @click="isAdd = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { List, mixin, EditableText } from '@/components'
import apiProjectSet from '@/api/mindConsult/projectSet'
export default {
  components: {
    List,
    EditableText,
  },
  mixins: [mixin([{ fetchListFunction: apiProjectSet.itemList }])],
  data() {
    this.filter = {
      popover: [
        {
          props: {
            label: '关键字',
            is: 'el-input',
          },
          data: {
            attrs: {
              placeholder: '名称/编码',
              clearable: true,
            },
          },
          keys: 'keywords',
        },

        {
          props: {
            label: '状态',
            options: [
              { label: '不限', value: '' },
              { label: '启用中', value: true },
              { label: '已停用', value: false },
            ],
          },
          keys: 'enabled',
        },
      ],
    }
    return {
      loading: false,
      isAdd: false,
      editRow: {},
      query: {
        pageSize: 10,
        currentNum: 1,
      },
      hisOption: [],
      columns: {
        index: {
          hidden: true,
        },
        fixed: {
          minWidth: 100,
        },
        name: {
          minWidth: 140,
        },
        enabled: {
          prop: 'slot_enabled',
        },
        sort: {
          prop: 'slot_sort',
          minWidth: 140,
        },
      },
      form: {
        enabled: true,
        name: '',
        duration: null,
        price: null,
        sort: 0,
        id: '',
        diagDictId: '',
        quantity: 1,
        unitPrice: '',
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        duration: [{ required: true, message: '请输入时长', trigger: 'blur' }],
        diagDictId: [
          { required: true, message: '请选择收费项目', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getHisoption()
  },
  methods: {
    hisDiagChange(e) {
      this.form.price =
        this.hisOption.find(item => item.id === e).price * this.form.quantity
      this.form.unitPrice = this.hisOption.find(item => item.id === e).price
    },
    add(row) {
      if (row) {
        this.form = {
          ...row,
          quantity:
            parseFloat(row.price) /
            this.hisOption.find(item => item.id === row.diagDictId).price,
          unitPrice: this.hisOption.find(item => item.id === row.diagDictId)
            .price,
          enabled: row.enabled === 1 ? true : false,
        }
      } else {
        this.form = {
          enabled: true,
          name: '',
          duration: null,
          price: null,
          sort: 0,
          id: '',
          diagDictId: '',
          quantity: 1,
          unitPrice: '',
        }
      }
      this.$nextTick(() => {
        this.isAdd = true
      })
    },
    del(id) {
      let data = []
      if (id) {
        data = id
      } else {
        console.log(this.tableData)
        if (this.tableData.multipleSelection.length === 0) {
          this.$message.warning('请选择要操作的数据！')
          return
        }
        data = this.tableData.multipleSelection.map(item => item.id)
      }
      this.$confirm('确定删除该项目?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        await apiProjectSet.batchDel({
          batchIds: data,
        })
        this.$_fetchTableData()
        this.$message({
          type: 'success',
          message: '删除成功!',
        })
      })
    },
    stateChange(state, row) {
      let data = []
      if (row) {
        data = [row.id]
      } else {
        console.log(this.tableData)
        if (this.tableData.multipleSelection.length === 0) {
          this.$message.warning('请选择要操作的数据！')
          return
        }
        data = this.tableData.multipleSelection.map(item => item.id)
      }
      this.$confirm(`确定要${state ? '启用' : '停用'}该项目?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await apiProjectSet.batchChangeEnabled({
            batchIds: data,
            enabled: state,
          })
          this.$_fetchTableData()
          this.$message({
            type: 'success',
            message: '操作成功!',
          })
        })
        .catch(() => {
          if (row) {
            row.enabled = row.enabled === 1 ? 0 : 1
          }
        })
    },
    numChange(e) {
      if (e < 1) {
        this.form.quantity = 1
        this.$message.warning('数量不能小于1')
      } else if (this.form.diagDictId) {
        this.form.price =
          this.hisOption.find(item => item.id === this.form.diagDictId).price *
          this.form.quantity
      }
    },
    async getHisoption() {
      let list = await apiProjectSet.chooseHisDiagDict()
      this.hisOption = list
    },
    async changeSort(val, row) {
      await apiProjectSet.itemEdit({
        ...row,
        enabled: row.enabled === 1 ? true : false,
        sort: val,
      })
      this.$_fetchTableData()
      this.$message({
        type: 'success',
        message: '操作成功!',
      })
    },
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.form.duration = Number(this.form.duration)
          this.form.price = Number(this.form.price)
          if (!this.form.id) {
            await apiProjectSet.itemAdd(this.form)
          } else {
            await apiProjectSet.itemEdit(this.form)
          }

          this.$_fetchTableData()
          this.isAdd = false
          this.$message.success('操作成功!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped></style>
