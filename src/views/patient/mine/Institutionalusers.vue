<template>
  <section class="view__card">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
      tableClass="institutionalusers"
    >
      <template v-slot:slot_nickname="{ row }">
        <!-- <el-avatar :size="60" :src="FILE_URL(row.avatar)"></el-avatar> -->
        <div style="line-height: 30px">
          <el-image
            style="float: left"
            :src="row.avatar ? FILE_URL(row.avatar) : ''"
          >
            <img slot="error" class="image-slot" src="@/assets/headerImg.png" />
          </el-image>
          <span>{{ row.nickname }}</span>
        </div>

        <!-- <img :src="FILE_URL(row.avatar)" alt=""> -->
      </template>
    </List>
  </section>
</template>
<script>
import { List, mixin } from '@/components'
import { getorgUserList } from '@/api/list'
export default {
  components: {
    List,
  },
  mixins: [mixin({ fetchListFunction: getorgUserList })],
  data() {
    return {
      query: {
        pageSize: 10,
        currentNum: 1,
        timeType: 1,
        searchType: 1,
      },
    }
  },
  computed: {
    filter() {
      return {
        date: {
          props: {
            options: [
              // { label: '登录时间', value: 0 },
              { label: '首次登录时间', value: 1 },
              { label: '最近一次登录时间', value: 2 },
            ],
          },
          keys: ['timeType', 'startTime', 'endTime'],
        },
        search: {
          props: {
            options: [
              { label: '昵称', value: 1 },
              { label: '用户ID', value: 0 },
              { label: '平台用户标识', value: 2 },
            ],
          },
          keys: ['searchType', 'searchKeywords'],
        },
        popover: [
          {
            props: {
              label: '消费金额',
              is: 'InputRange',
            },
            keys: ['startMoney', 'endMoney'],
          },
          {
            props: {
              label: '用户来源',
              options: [
                { label: '不限', value: '' },
                { label: '支付宝', value: 'ALI' },
                { label: '微信', value: 'MINI' },
              ],
            },
            keys: 'source',
          },
        ],
      }
    },

    columns() {
      return {
        index: {
          hidden: true,
        },
        //最近一次登录时间
        lastLoginTime: {
          minWidth: 120,
        },
        //第一次登录时间
        firstLoginTime: {
          minWidth: 120,
        },
        payFee: {
          formatter(row) {
            if (row.payFee) {
              return '¥' + row.payFee
            } else {
              return '-'
            }
          },
        },
        //头像
        nickname: {
          prop: 'slot_nickname',
          minWidth: 90,
        },
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.el-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
span {
  margin-left: 15px;
}
.institutionalusers {
  ::v-deep .prepend-select-date {
    width: 210px;
  }
}
::v-deep .c__filter .prepend-select-date .el-input__inner {
  // width: calc(100px +51px);
  width: 100%;
}
::v-deep .table-wrap .cell {
  font-size: 16px;
}
::v-deep .el-table .cell.el-tooltip {
  font-size: 14px;
  padding-left: 6px;
}
</style>
