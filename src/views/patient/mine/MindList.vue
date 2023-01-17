<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
      showSelection
    >
      <template v-slot:slot_name="{ row }">
        <span>{{ row.name }}</span>
        <span v-if="row.severePatient" class="color-red">{{ '重精' }}</span>
      </template>
      <template
        v-slot:footertool
        v-if="this.$route.path === '/patient/mine/list'"
      >
        <el-button type="primary" @click="add('add')"> 新增分组 </el-button>
        <el-button plain type="danger" @click="add('del')">
          删除分组
        </el-button>
        <el-button plain @click="add('move')"> 移动 </el-button>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="gotoInfo(row)">查看</el-button>
      </template>
    </List>
    <el-dialog
      :title="title"
      :visible.sync="isAdd"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="90px">
        <el-form-item
          label="分组名称"
          v-if="type === 'add' || type === 'edit'"
          prop="name"
        >
          <el-input
            type="text"
            placeholder="请输入"
            v-model="form.name"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="type === 'move'" label="分组名称" prop="diagDictId">
          <el-select v-model="form.id" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.itemName"
              :value="item.id"
              >{{ item.itemName }}</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item v-if="type === 'del'">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            v-model="form.ids"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="item in options"
              :label="item.id"
              :key="item.id"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer is-center">
        <el-button @click="isAdd = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import apiXzPatient from '@/api/mindConsult/appointmentPatient'

export default {
  name: 'mindConsult_appointmentPatient',
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: apiXzPatient.patientList })],
  data() {
    return {
      query: {
        pageSize: 10,
        dateType: 0,
        searchType: 0,
        severePatient: null,
        doctorId:
          this.$route.path === '/patient/patientTube/list'
            ? null
            : this.$store.state.user.userId,
      },
      options: [],
      isAdd: false,
      type: null, //add,edit,del,move
      form: {
        name: '',
        id: '',
        ids: [],
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        id: [{ required: true, message: '请选择分组', trigger: 'blur' }],
      },
      isIndeterminate: false,
      checkAll: false,
    }
  },
  computed: {
    filter() {
      return {
        popover: [
          {
            props: {
              label: '关键字',
              is: 'el-input',
            },
            data: {
              attrs: {
                placeholder: '患者ID/就诊卡号/名称/身份证号/联系电话/家庭地址',
              },
            },
            keys: 'unitName',
          },
          {
            props: {
              label: '性别',
              options: [
                { label: '不限', value: '' },
                { label: '男', value: 1 },
                { label: '女', value: 2 },
              ],
            },
            keys: 'sex',
          },
          {
            props: {
              label: '',
              is: 'el-checkbox',
            },
            data: {
              attrs: {
                label: '仅看重精患者',
              },
              on: {
                change: e => {
                  this.query.severePatient = e ? e : null
                },
              },
            },

            keys: 'severePatient',
          },
        ],
      }
    },
    columns() {
      return {
        patientId: {
          minWidth: 130,
        },
        index: {
          hidden: true,
        },
        name: {
          prop: 'slot_name',
          minWidth: 150,
        },
        status: {
          formatter(row) {
            return row.status == 1
              ? '已预约'
              : row.status == 2
              ? '已请假'
              : row.status == 3
              ? '请假中'
              : '已关闭'
          },
        },
        sex: {
          formatter(row) {
            return row.sex ? '男' : '女'
          },
        },
        birthday: {
          minWidth: 100,
          formatter(row) {
            return row.birthday.split(' ')[0]
          },
        },
        idCard: {
          minWidth: 120,
        },
        phone: {
          minWidth: 100,
        },
      }
    },
    title() {
      let str = ''
      switch (this.type) {
        case 'add':
          str = '新增分组'
          break
        case 'edit':
          str = '编辑分组'
          break
        case 'del':
          str = '删除分组'
          break
        case 'move':
          str = '移动分组'
          break
      }
      return str
    },
  },
  methods: {
    add(type, id) {
      this.type = type
      if (type === 'move' && this.tableData.multipleSelection.length === 0) {
        this.$message.warning('请选择要操作的数据！')
        return
      }
      if (type === 'move' || type === 'del') {
        this.getGroupList()
      }
      if (id) {
        this.form.id = id
      }
      this.isAdd = true
    },
    handleCheckAllChange(val) {
      this.form.ids = val ? this.options.map(item => item.id) : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.options.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.options.length
    },
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          if (this.type === 'add') {
            await apiXzPatient.addGroup({ name: this.form.name })
          }
          if (this.type === 'del') {
            await apiXzPatient.delGroup({ ids: this.form.ids })
            this.isIndeterminate = false
            this.checkAll = false
          }
          if (this.type === 'edit') {
            await apiXzPatient.editGroup({
              id: this.form.id,
              name: this.form.name,
            })
          }
          if (this.type === 'move') {
            await apiXzPatient.moveGroup({
              id: this.form.id,
              patientIds: this.tableData.multipleSelection.map(item => item.id),
            })
          }
          this.$_fetchTableData()
          this.type = null
          this.isAdd = false
          this.form = {
            id: '',
            ids: '',
            name: '',
          }
          this.$message.success('操作成功!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //查看详情
    gotoInfo(row) {
      this.$router.push({
        path:
          this.$route.path === '/patient/patientTube/list'
            ? '/patient/patientTube/mindDetail'
            : '/patient/mine/mindDetail',
        query: {
          id: row.memberId,
          patientId: row.patientId,
          severePatient: row.severePatient,
        },
      })
    },
    async getGroupList() {
      let list = await apiXzPatient.myGroupList({
        doctorId: this.$store.state.user.userId,
      })
      this.options = list
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .c_filter_left {
  .c__filter_item:nth-child(3) {
    width: 120px;
    .item-label {
      width: 0;
      min-width: 0;
    }
  }
}
/* @import '@/styles/_modules-detail.scss'; */

.color-red {
  color: #f74a4a;
  background: rgba(247, 74, 74, 0.15);
  font-size: 12px;
  padding: 2px 4px;
}
.color-org {
  color: #ff6600;
  background: rgba(247, 74, 74, 0.15);
  font-size: 12px;
  padding: 2px 4px;
}
</style>
