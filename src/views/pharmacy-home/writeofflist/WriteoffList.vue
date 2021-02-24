<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:fixed="{ row }">
        <div class="el-button el-button--text" @click="showMore(row.orderId)">
          查看
        </div>
      </template>
    </List>
    <!-- 弹框 -->
    <!-- <el-dialog title="推送详情" :visible.sync="dialogVisible" width="35%">
      <div class="pushContentBox">
        <div class="pushName">
          <div class="pushTitle">推送对象</div>
          <div class="name">赵飞楼</div>
        </div>
        <div class="pushContent">
          <div class="pushTitle">推送内容</div>
          <div class="content">
            慈心堂医院不是金砖玉瓦叠摞起来的商品，而是用一颗颗闪光的心聚烁起
            的文明坐标。她承苍天布运之道；蒙厚土运载之德；传国运明君惠施正治；
            寄父母良师养育之恩；谢善友相助深情——斯乃慈心堂得以诞生、发展之
            因果。
          </div>
        </div>
        <div class="pushTime">
          <div class="pushTitle">推送时间</div>
          <div class="time">2019-10-08 09:20:35</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog> -->
  </section>
</template>

<script>
import { List, mixin } from '@/components'
import { getWriteOffList } from '@/api/phaIndex'

export default {
  name: 'TableList',
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: getWriteOffList })],
  data() {
    return {
      query: {
        currentNum: 1,
        pageSize: 10,
        timeType: 0,
        searchType: 0,
        pharmacyId: this.$store.state.user.store.id,
        field: 'expense_time',
        sorted: 'DESC',
      },
      // 查看弹框是否显示
      dialogVisible: false,
    }
  },

  methods: {
    // 跳转详情页
    showMore(id) {
      this.$router.push({
        path: `/home/writeoff/detail/${id}`,
      })
    },
  },
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [
              { label: '兑换时间', value: 0 },
              { label: '预约时间', value: 1 },
            ],
          },
          keys: ['timeType'],
        },
        search: {
          props: {
            options: [
              { label: '就诊人', value: 0 },
              { label: '预留手机', value: 1 },
              { label: '操作人', value: 2 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
      }
    },
    columns() {
      return {
        index: {
          hidden: true,
        },
        opt: {
          hidden: true,
        },
        createTime: {
          minWidth: 160,
        },
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/styles/_variables.scss';
.operation {
  color: $--color-primary;
}
::v-deep .el-dialog__title {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(26, 26, 26, 1);
}

::v-deep .el-dialog__footer {
  display: flex;
  justify-content: space-around;
  .el-button {
    width: 80px;
    line-height: 28px;
    padding: 0;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    text-align: center;
    border-radius: 2px;
  }
}

::v-deep .el-dialog {
  .el-dialog__body {
    padding: 15px 20px;
  }
  .pushContentBox {
    .pushName,
    .pushContent,
    .pushTime {
      margin-bottom: 20px;
      // border: 1px solid red;
      display: flex;
      .pushTitle {
        width: 65px;
        margin-right: 10px;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(102, 102, 102, 1);
      }
      .name,
      .content,
      .time {
        flex: 1;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
}
::v-deep .table-wrap .cell {
  font-size: 16px;
}
::v-deep .el-table .cell.el-tooltip {
  font-size: 14px;
  padding-left: 6px;
}
.watch {
  cursor: pointer;
}
</style>
