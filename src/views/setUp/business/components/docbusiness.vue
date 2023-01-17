<template>
  <div>
    <div
      v-if="list.length == 0"
      style="margin: 240px 0; color: #999"
      class="is-center"
    >
      暂无数据
    </div>
    <div class="busBox" v-for="(item, index) in list" :key="index">
      <div class="busTitle">
        <div class="titleName">
          {{
            item.bizType == 'CONSULT'
              ? '在线咨询'
              : item.bizType == 'REPEAT_CLINIC'
              ? '在线复诊'
              : item.bizType == 'REPORT_READ'
              ? '报告解读'
              : '慢病续方'
          }}
        </div>
        <el-switch
          v-model="item.totalState"
          @change="totalChange($event, item)"
          :active-value="1"
          :inactive-value="0"
        ></el-switch>
      </div>
      <el-row
        class="itemType flex"
        v-for="(i, index) in item.bizWayList"
        :key="index"
      >
        <el-col :span="4"
          >{{
            i.bizWay == 'GRAPHIC'
              ? '图文'
              : i.bizWay == 'VIDEO'
              ? '视频'
              : '电话'
          }}：￥{{ i.bizPrice }}/次</el-col
        >
        <el-col :span="20" class="flex">
          <div class="number">每日接诊最大容纳人数</div>
          <el-input
            v-model="i.peopleNum"
            placeholder="请输入"
            size="mini"
            :disabled="i.bizWay == 'VIDEO' ? true : false"
          ></el-input>
          <el-switch
            v-model="i.state"
            :active-value="1"
            :inactive-value="0"
            :disabled="!item.totalState"
            v-if="i.bizWay != 'VIDEO'"
          ></el-switch>
        </el-col>
      </el-row>
    </div>
    <el-button
      v-if="list.length != 0"
      type="primary"
      class="save"
      @click="handleSave"
      >保存</el-button
    >
  </div>
</template>
<script>
import { getDocSet, editDocBus } from '@/api/setup'
export default {
  name: 'DocBus',
  data() {
    return {
      list: [],
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    // 获取列表
    async getInfo() {
      let res = await getDocSet({
        doctorId: this.$store.state.user.userId,
      })
      let afterData = []
      res.forEach(item => {
        let flag = afterData.find(item1 => item1.bizType === item.bizType)

        if (!flag) {
          afterData.push({
            bizType: item.bizType,
            bizWayList: [item],
            totalState: item.totalState,
          })
        } else {
          flag.bizWayList.push(item)
        }
      })
      this.list = afterData
    },
    totalChange(e, item) {
      console.log(e, item)
      item.bizWayList.forEach(i => {
        if (e != 1 && i.bizWay != 'VIDEO') {
          i.state = 0
        }
      })
    },
    // 保存提交
    async handleSave() {
      const data = this.list.reduce((result, item) => {
        result.push(
          ...item.bizWayList.map(ite => ({
            ...ite,
            totalState: item.totalState,
          })),
        )
        return result
      }, [])
      console.log(data)
      await editDocBus(data)
      this.$message.success('保存成功！')
      this.getInfo()
    },
  },
}
</script>

<style scoped lang="scss">
@import '~@/styles/_variables.scss';
.busBox {
  padding: 30px 50px;
  .busTitle {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    .titleName {
      margin-right: 20px;
    }
  }
  .itemType {
    padding: 0 85px;
    margin-bottom: 10px;
  }
}

.flex {
  display: flex;
  align-items: center;
}
::v-deep .el-input {
  width: 100px;
  margin: 0 20px;
}

.save {
  margin-left: 50px;
  margin-top: 20px;
}
.is-center {
  height: 100%;
}
</style>
