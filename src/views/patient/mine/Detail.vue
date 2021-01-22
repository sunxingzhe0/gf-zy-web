<template>
  <section class="view__p-mine-detail">
    <header>
      <h3>谢晓飞</h3>

      <el-row>
        <el-col v-for="_ in 6" :key="_" :span="8">
          <span>就诊卡</span>
          E958422555
        </el-col>
      </el-row>
    </header>

    <el-tabs
      class="clinic__tabs"
      v-model="activeName"
      type="border-card"
      @tab-click="handleTabClick"
    >
      <el-tab-pane label="服务订单" name="service" lazy>
        <List
          v-model="service.query"
          :columns="service.columns"
          :tableData="service.tableData"
        >
          <template v-slot:fixed="{ row }">
            <router-link
              class="el-button el-button--text el-button--mini"
              :to="`/business/order/detail/${row.id}`"
            >
              查看
            </router-link>
          </template>
        </List>
      </el-tab-pane>
      <el-tab-pane label="诊室记录" name="clinic" lazy>
        <ul class="card-wrapper clinic">
          <li
            v-for="{
              id,
              title,
              unread,
              name,
              type,
              datetime,
              text,
              state,
            } in clinic.list"
            :key="id"
          >
            <p>
              <strong>{{ name }}</strong>
              <el-tag :type="type === '视频' ? 'danger' : ''" size="mini">
                {{ type }}
              </el-tag>
            </p>
            <p>{{ datetime }}</p>
            <p class="text-overflow">{{ text }}</p>
            <router-link
              class="el-button el-button--text el-button--mini"
              :to="`/business/clinic?id=${id}`"
            >
              进入
            </router-link>
            <div class="prepend" :data-unread="unread < 100 ? unread : '99+'">
              {{ title }}
            </div>
            <div class="append" :class="{ close: state === '已结束' }">
              {{ state }}
            </div>
          </li>
        </ul>

        <TableFooterTool v-model="clinic.query" />
      </el-tab-pane>
      <el-tab-pane label="就诊记录" name="treat" lazy>
        <ul class="card-wrapper treat">
          <li
            v-for="{
              id,
              datetime,
              name,
              tag,
              dept,
              doctor,
              position,
            } in treat.list"
            :key="id"
            :data-tag="tag"
          >
            <p>门诊记录 {{ datetime }}</p>
            <p>{{ name }}</p>
            <p>
              {{ dept }} {{ doctor }} {{ position }}
              <el-button type="text">申请查看</el-button>
            </p>
          </li>
        </ul>

        <TableFooterTool v-model="treat.query" />
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="log" lazy>
        <List
          v-model="log.query"
          :columns="log.columns"
          :tableData="log.tableData"
        >
        </List>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import { List, mixin, TableFooterTool } from '@/components'
import { formatDate, randomString } from '@/utils'
import { fetchList } from '@/api/list'

export default {
  name: 'Detail',
  props: {
    id: String,
  },
  components: {
    List,
    TableFooterTool,
  },
  mixins: [
    mixin([
      { fetchListFunction: fetchList, prop: 'service' },
      { fetchListFunction: fetchList, prop: 'log' },
    ]),
  ],
  data() {
    return {
      activeName: 'service',

      service: {
        query: {
          pageSize: 10,
          dateType: 0,
          searchType: 0,
        },
        columns: {
          createTime: {
            minWidth: 160,
          },
        },
      },

      clinic: {
        list: Array.from({ length: 12 }).map((_, index) => ({
          id: randomString(),
          title: '在线咨询',
          unread: 4,
          name: '刘晓庆',
          type: index % 2 ? '图文' : '视频',
          datetime: formatDate(new Date(), 'yyyy-MM-dd hh:mm'),
          text:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit modi quasi cum hic doloribus vero, nobis laudantium ut doloremque incidunt cumque aliquam eos at quia! Ad blanditiis voluptate ex labore.',
          state: index % 3 ? '接诊中' : '已结束',
        })),
        query: {
          pageSize: 10,
          currentNum: 1,
        },
      },

      treat: {
        list: Array.from({ length: 12 }).map(() => ({
          id: randomString(),
          datetime: formatDate(new Date(), 'yyyy-MM-dd hh:mm'),
          name: '刘力菲',
          tag: '互联网',
          dept: '皮肤科',
          doctor: '李德旗',
          position: '主治医师',
        })),
        query: {
          pageSize: 10,
          currentNum: 1,
        },
      },

      log: {
        query: {
          pageSize: 10,
          dateType: 0,
          searchType: 0,
        },
        columns: {
          createTime: {
            minWidth: 160,
          },
        },
      },
    }
  },
  methods: {
    handleTabClick({ name, $slots }) {
      if (['clinic', 'treat'].includes(name)) return

      if (this[name]?.tableData.list.length > 0) {
        this.$nextTick(() => {
          $slots.default?.[0].componentInstance?.doLayout?.()
        })
        return
      }

      this.table.tableData.list.length || this.$_fetchTableData()
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_variables.scss';
@import '@/styles/_modules-detail.scss';

.view__p-mine-detail {
  > * + * {
    margin-top: 20px;
  }

  > header {
    padding: 30px;
    background: $--color-primary;
    color: $--color-white;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 2px;

    h3 {
      margin: 0;
    }

    .el-col {
      margin-top: 30px;
    }
  }

  .card-wrapper {
    display: grid;
    justify-content: space-around;
    grid-template-columns: repeat(auto-fill, minmax(300px, 350px));
    margin: -20px 0 0 -20px;
    padding-bottom: 10px;

    > li {
      position: relative;
      margin: 20px 0 0 20px;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      overflow: hidden;

      > p {
        margin: 0;
      }
    }

    &.clinic > li {
      display: flex;
      flex-flow: column;
      justify-content: space-between;
      padding: 20px 20px 20px 100px;
      height: 160px;

      .prepend,
      .append {
        position: absolute;
      }

      .prepend {
        text-align: center;
        line-height: 80px;
        top: -106%;
        left: -125%;
        width: 500px;
        height: 500px;
        border-radius: 50%;
        border: 10px solid $--color-primary-light-9;
        background: $--color-primary;
        color: $--color-white;
        font-size: 24px;
        writing-mode: vertical-rl;

        &::before {
          position: absolute;
          top: 38%;
          right: -10px;
          width: 25px;
          height: 25px;
          background: $--color-danger;
          border: 1px solid $--color-white;
          border-radius: 50%;
          line-height: 25px;
          writing-mode: lr;
          font-size: 12px;
          content: attr(data-unread);
        }
      }

      .append {
        top: -60px;
        right: -60px;
        width: 120px;
        height: 120px;
        line-height: 200px;
        border-radius: 50%;
        text-align: center;
        background: $--color-primary;
        color: $--color-white;
        transform: rotate(45deg);

        &.close {
          background: $--color-info;
        }
      }

      .el-tag {
        margin-left: 10px;
      }

      .el-button {
        align-self: flex-end;
      }
    }

    &.treat > li {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 20px;
      height: 128px;

      &::after {
        position: absolute;
        top: 15px;
        right: -50px;
        width: 50%;
        padding: 6px 0;
        transform: rotate(45deg);
        text-align: center;
        background: $--color-primary;
        color: $--color-white;
        content: attr(data-tag);
      }

      > p {
        &:first-child {
          font-size: 14px;
          color: $--color-info;
        }

        &:last-child {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 18px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
