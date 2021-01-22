<template>
  <div class="view__card">
    <div class="itemBox">
      <div class="itemTitle">收获信息</div>
      <el-row>
        <el-col :span="8">
          <div class="itemLeft">收货人</div>
          <div class="itemEight">刘德福</div>
        </el-col>
        <el-col :span="8">
          <div class="itemLeft">收货电话</div>
          <div class="itemEight">15121548963</div>
        </el-col>
        <el-col :span="8"> </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="itemLeft">收货地址</div>
          <div class="itemEight">重庆市渝北区光电园水星2A座2F</div>
        </el-col>
      </el-row>
    </div>
    <div class="itemBox">
      <div class="itemTitle">基本信息</div>
      <el-row>
        <el-col :span="8">
          <div class="itemLeft">配送方式</div>
          <div class="itemEight">邮寄</div>
        </el-col>
        <el-col :span="8">
          <div class="itemLeft">发货方</div>
          <div class="itemEight">重庆大药房光电园店</div>
        </el-col>
        <el-col :span="8">
          <div class="itemLeft">发货方电话</div>
          <div class="itemEight">15121548963</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="itemLeft">物流公司</div>
          <div class="itemEight">顺丰速运</div>
        </el-col>
        <el-col :span="8">
          <div class="itemLeft">物流单号</div>
          <div class="itemEight">SF58965444</div>
        </el-col>
        <el-col :span="8"> </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="itemLeft">物流详情</div>
          <div class="hide" @click="handleHide" ref="hide">{{ isShow }}</div>
        </el-col>
      </el-row>
      <!-- 物流信息 -->
      <div :class="isHide ? 'hideLogistics' : 'logistics'" ref="logistics">
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.timestamp"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isHide: false,
      reverse: false,
      height: '',
      // 绑定查看文字
      isShow: '收起',
      activities: [
        {
          content: '【广东市】快件离开广东市中转部已发往重庆',
          timestamp: '2018-04-17',
        },
        {
          content: '【广东市】快件已到达广东市中转部',
          timestamp: '2018-04-16',
        },
        {
          content: '已出库',
          timestamp: '2018-04-15',
        },
        {
          content: '已发货',
          timestamp: '2018-04-13',
        },
        {
          content: '已下单',
          timestamp: '2018-04-11',
        },
      ],
    }
  },
  mounted() {
    this.$nextTick(() => {
      let curHeight = this.$refs.logistics.offsetHeight
      console.log(curHeight)
    })
  },
  methods: {
    handleHide() {
      // const clientHeight = this.$refs.logistics.offsetHeight
      // // console.log(clientHeight)

      // // this.height = clientHeight + 'px'
      // // console.log(this.height)
      // if (this.height == 0) {
      //   console.log(2)
      //   this.height = clientHeight
      //   console.log(this.height)

      //   this.isHide = false
      // } else {
      //   console.log(1)

      //   this.height = 0
      //   console.log(this.height)

      //   this.isHide = true
      // }
      if (this.isHide) {
        this.isShow = '收起'
      } else {
        this.isShow = '查看'
      }
      this.isHide = !this.isHide
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/styles/_variables.scss';

.itemBox {
  .itemTitle {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    text-align: center;
    border-left: 2px solid $--color-primary;
    width: 100px;
    margin-bottom: 30px;
  }
  ::v-deep .el-col {
    display: flex;
    padding-left: 100px;
    margin-bottom: 30px;
    .itemLeft {
      margin-right: 20px;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(102, 102, 102, 1);
      min-width: 100px;
      text-align: right;
    }
    .itemRight {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }
  }
}

::v-deep .el-timeline-item__wrapper {
  top: 0;
}

.logistics {
  padding: 0px 220px;
}

.hideLogistics {
  padding: 0px 220px;
  display: none;
}

.hide {
  color: $--color-primary;
  cursor: pointer;
}
</style>
