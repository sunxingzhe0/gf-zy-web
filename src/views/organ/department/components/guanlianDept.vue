<template>
  <div>
    <!-- 子科室弹框 -->
    <el-dialog
      :title="` ${faDept.name} - 关联科室,${faDept.sonDeptNum}个`"
      :visible.sync="isShow"
      width="80%"
    >
      <List v-model="query" :columns="columns" :tableData="tableData">
        <template v-slot:slot_recommend="{ row }">
          <el-switch v-model="row.recommend" @change="setRecommend(row)">
          </el-switch>
        </template>
        <template v-slot:slot_doctorNum="{ row }">
          <router-link
            v-if="row.doctorNum != 0"
            class="el-button el-button--text el-button--mini"
            :to="{
              path: '/jurisdiction/account/list',
              query: {
                deptId: row.id,
              },
            }"
          >
            {{ row.doctorNum }}
          </router-link>
          <p v-else>{{ row.doctorNum }}</p>
        </template>
        <template v-slot:slot_state="{ row }">
          <el-switch v-model="row.state" @change="setEnable(row)"> </el-switch>
        </template>
        <template v-slot:slot_seq="{ row }">
          <!-- v-if="!row.pid" -->
          <EditableText
            icon="el-icon-edit"
            v-model="row.seq"
            @confirm="handleSort($event, row.id)"
            @cancel="cancel"
          ></EditableText>
        </template>
      </List>
    </el-dialog>
  </div>
</template>

<script>
import { List, mixin, EditableText } from '@/components'
import {
  getDepList,
  setRecommendState,
  setEnableState,
  sortDept,
} from '@/api/organization'
export default {
  components: {
    EditableText,
    List,
  },
  mixins: [mixin([{ fetchListFunction: getDepList }])],
  props: {
    faDept: {
      type: Object,
    },
  },
  data() {
    return {
      title: '',
      isAdd: false,
      isShow: false,
      query: {
        pageSize: 10,
        currentNum: 1,
        // pid: '1',
      },
      columns: {
        seq: {
          label: '排序',
          prop: 'slot_seq',
          minWidth: 120,
        },
        index: {
          hidden: true,
        },
        recommend: {
          prop: 'slot_recommend',
        },
        state: {
          prop: 'slot_state',
        },
        doctorNum: {
          label: '科室医生',
          prop: 'slot_doctorNum',
          minWidth: 140,
        },
        intro: {
          label: '科室简介',
          minWidth: 140,
        },
        createTime: {
          minWidth: 140,
        },
        faDeptNam: {
          hidden: true,
        },
        level: {
          hidden: true,
        },
      },
    }
  },

  methods: {
    cancel() {},
    open(row) {
      this.query.currentNum = 1
      console.log(row.id)
      this.query.deptOuterId = row.id
      this.isShow = true
      this.$_fetchTableData(getDepList)
    },

    // 排序 - 子科室
    async handleSort(bool, id) {
      await sortDept({
        seq: bool,
        id: id,
      })
      this.$message.success('操作成功！')
      this.$_fetchTableData(getDepList)
      this.$emit('update')
    },
    //变更推荐状态
    async setRecommend(row) {
      await setRecommendState({
        id: row.id,
        state: row.recommend,
      })
      this.$_fetchTableData(getDepList)
      this.$message.success(row.recommend ? '科室推荐成功!' : '已取消科室推荐')
      this.$emit('update')
    },
    // 变更启用状态
    async setEnable(row) {
      await setEnableState({
        id: row.id,
        state: row.state,
      })
      this.$_fetchTableData(getDepList)
      this.$message.success(row.state ? '科室启用成功!' : '科室禁用成功')
      //变更后重新获取可选父级列表(变更父级状态)
      if (row.level == 1) {
        this.getDeptList()
      }
      this.$emit('update')
    },
  },
}
</script>
<style lang="scss" scoped>
.list {
  ::v-deep.c__list .table-wrap {
    max-height: 58vh;
  }
}
</style>
