<template>
  <el-dialog title="核销" :visible.sync="dialogVisible" width="80%">
    <div class="writeOffContent">
      <!-- 基本信息 -->
      <el-row>
        <el-col :span="8">
          <div class="itemTitle">订单号</div>
          <div class="itemContent">{{ toWaitOff.orderId }}</div>
        </el-col>
        <el-col :span="8">
          <div class="itemTitle">下单人</div>

          <el-image
            :src="FILE_URL(toWaitOff.userAvatar)"
            class="avatar_round"
            style="width: 40px; height: 40px; margin-right: 15px;"
          >
            <img slot="error" class="image-slot" src="@/assets/headerImg.png" />
          </el-image>
          <!-- <el-avatar
              style="vertical-align: middle; margin-right: 15px;"
              :src="FILE_URL(toWaitOff.userAvatar)"
            ></el-avatar> -->
          <div class="itemContent">
            {{ toWaitOff.userName }} {{ toWaitOff.userPhone }}
          </div>
        </el-col>
        <el-col :span="8">
          <div class="itemTitle">下单时间</div>
          <div class="itemContent">{{ toWaitOff.createTime }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="itemTitle">就诊人</div>
          <div class="itemContent">{{ toWaitOff.memberName }}</div>
        </el-col>
        <el-col :span="8">
          <div class="itemTitle">预留手机</div>
          <div class="itemContent">{{ toWaitOff.memberPhone }}</div>
        </el-col>
        <el-col :span="8">
          <div class="itemTitle">预约时间</div>
          <div class="itemContent">
            {{ toWaitOff.date }} {{ toWaitOff.startTime }}-{{
              toWaitOff.endTime
            }}
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="itemTitle">药品数量</div>
          <div class="itemContent">{{ toWaitOff.drugNumber }}</div>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="contentList"
        border
        style="width: 100%;"
        class="tableList"
        v-if="contentList"
      >
        <el-table-column prop="index" label="序号" width="70" type="index">
        </el-table-column>
        <el-table-column label="类型" width="80">
          <template slot-scope="scoped"
            >{{ drugTypes.filter(item => item.id == scoped.row.type)[0].name }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="药品名称"> </el-table-column>
        <el-table-column prop="spec" label="规格"> </el-table-column>
        <el-table-column prop="useWaysText" label="用药途径"> </el-table-column>
        <el-table-column prop="singleDose" label="单次剂量">
          <template slot-scope="scoped">
            {{ scoped.row.singleDose }} {{ scoped.row.singleDoseUnitText }}
          </template>
        </el-table-column>
        <el-table-column prop="useFrequencyText" label="用药频次">
        </el-table-column>
        <el-table-column prop="total" label="总量">
          <template slot-scope="scoped">
            {{ scoped.row.total }} {{ scoped.row.totalUnitText }}
          </template>
        </el-table-column>
        <el-table-column label="医保">
          <template slot-scope="scoped"
            >{{
              scoped.row.medicare == 'A'
                ? '甲'
                : scoped.row.medicare == 'B'
                ? '乙'
                : scoped.row.medicare == 'C'
                ? '丙'
                : '自费'
            }}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价">
          <template slot-scope="scoped">￥{{ scoped.row.price }} </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="总价">
          <template slot-scope="scoped"
            >￥{{ scoped.row.totalPrice }}
          </template></el-table-column
        >
        <el-table-column prop="pharmacyName" label="接收方"> </el-table-column>
        <el-table-column prop="remark" label="备注"> </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { toWaitOff, hxOrder } from '@/api/order'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      dialogVisible: false,
      toWaitOff: {},
      contentList: [],
      orderId: '',
    }
  },
  computed: {
    ...mapState({
      drugTypes: state => state.drug.drugTypes,
    }),
  },
  methods: {
    // 点击查看更多
    async showMore(id) {
      this.orderId = id
      this.dialogVisible = true
      const res = await toWaitOff({
        orderId: id,
        pharmacyId: this.$store.state.user.store.id,
      })
      this.contentList = res.contentList
      this.toWaitOff = res
    },
    // 核销
    async handleSave() {
      await hxOrder({
        orderId: this.orderId,
        pharmacyId: this.$store.state.user.store.id,
      })
      this.$message.success('核销成功！')
      this.orderId = ''
      this.dialogVisible = false
      this.$emit('hxOrderSuccess')
    },
  },
}
</script>
