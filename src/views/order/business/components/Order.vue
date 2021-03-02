<template>
  <section>
    <h3 class="view__title">基本信息</h3>
    <el-row class="view__content">
      <el-col :span="8">
        <span>购买人：</span>

        <el-image
          :src="FILE_URL(orderList.userAvatar)"
          class="avatar_round"
          style="width: 40px; height: 40px; vertical-align: middle"
        >
          <img slot="error" class="image-slot" src="@/assets/headerImg.png" />
        </el-image>
        <!-- <el-avatar
          style="vertical-align: middle;"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        ></el-avatar> -->
        {{ orderList.userName }}
      </el-col>

      <el-col :span="8">
        <span>下单时间：</span> {{ orderList.createTime }}
      </el-col>

      <el-col :span="8">
        <span>支付方式：</span>
        <span v-if="orderList.payType == 'OFFLINE_PAY'">线下支付</span>
        <span v-if="orderList.payType == 'WECHAT_PAY'">微信支付</span>
        <span v-if="orderList.payType == 'ALI_PAY'">支付宝</span>
        <span v-if="orderList.payType == 'BANK_CARD'">银行卡支付</span>
      </el-col>

      <el-col :span="8">
        <span>订单金额：</span> {{ orderList.payFee }}
      </el-col>

      <el-col :span="8">
        <span>支付时间：</span> {{ orderList.paymentTime }}
      </el-col>

      <el-col :span="8">
        <span>订单类型：</span>
        {{
          orderList.orderType == 'CONSULT'
            ? '在线咨询'
            : orderList.orderType == 'REPEAT_CLINIC'
            ? '在线复诊'
            : '慢病续方'
        }}，
        {{
          orderList.wayType == 'GRAPHIC'
            ? '图文'
            : orderList.wayType == 'VIDEO'
            ? '视频'
            : '电话'
        }}
      </el-col>

      <el-col :span="8">
        <span>评价</span>
        <el-rate
          v-if="$attrs.evaluate && $attrs.evaluate.rating"
          :value="$attrs.evaluate && $attrs.evaluate.rating"
          disabled
          show-text
          :texts="['不满意', '一般', '满意', '较满意', '非常满意']"
          style="display: inline-block"
        ></el-rate>
        <div
          style="padding-left: 50px"
          v-if="$attrs.evaluate && $attrs.evaluate.content"
        >
          {{
            $attrs.evaluate && $attrs.evaluate.content
              ? $attrs.evaluate.content
              : '-'
          }}
        </div>
        <template v-else>-</template>
      </el-col>

      <el-col :span="8">
        <span>评价时间：</span>
        {{ $attrs.commentTime ? $attrs.commentTime : '-' }}
      </el-col>
    </el-row>

    <h3 class="view__title">患者信息</h3>
    <el-row class="view__content" v-if="orderList.patient">
      <el-col :span="8">
        <span>就诊人：</span>
        {{ orderList.patient.memberName }}
      </el-col>

      <el-col :span="8">
        <span>性别：</span>
        {{ orderList.patient.sex }}
      </el-col>

      <el-col :span="8">
        <span>年龄：</span>
        <span v-if="orderList.patient.age"> {{ orderList.patient.age }}</span>
      </el-col>

      <el-col :span="8">
        <span>联系电话：</span>
        11111
      </el-col>

      <el-col :span="8">
        <span>业务类型：</span>
        <span v-if="orderList.bizType == 'CONSULT'">在线咨询</span>
        <span v-if="orderList.bizType == 'REPEAT_CLINIC'">在线复诊</span>
        <span v-if="orderList.bizType == 'CARRYON_PRESC'">慢病续方</span>
      </el-col>

      <el-col :span="8">
        <span>业务形式：</span>
        <span v-if="orderList.wayType == 'GRAPHIC'">图文</span>
        <span v-if="orderList.wayType == 'VIDEO'">视频</span>
        <span v-if="orderList.wayType == 'PHONE'">电话</span>
      </el-col>

      <el-col :span="24">
        <span>病情自诉：</span>
        {{ orderList.patient.illnessDesc }}

        <div class="image-wrap" :style="{ margin: '10px 0' }">
          <el-image
            v-for="_ in orderList.patient.pic"
            :key="_"
            style="width: 120px; height: 120px"
            :src="FILE_URL(_)"
            fit="cover"
            :preview-src-list="[]"
          ></el-image>
        </div>
      </el-col>

      <el-col :span="24">
        <span>诊断：</span>
        {{ orderList.patient.diagnose || '-' }}
      </el-col>
    </el-row>

    <h3 class="view__title">服务信息</h3>
    <div>
      <dl>
        <dt>
          <el-image
            :src="FILE_URL(orderList.avatar)"
            class="avatar_round"
            style="width: 40px; height: 40px; vertical-align: middle"
          >
            <img slot="error" class="image-slot" src="@/assets/headerImg.png" />
          </el-image>
          <!-- <el-avatar
            :size="52"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          ></el-avatar> -->
        </dt>
        <dd
          style="margin: -60px 0 0 60px; color: #666; font-size: 14px"
          v-if="orderList.biz"
        >
          <p>
            <b style="font-size: 18px; color: #333; margin-right: 12px">
              {{ orderList.biz.doctorName }}
            </b>

            {{ orderList.biz.sex == '0' ? '女' : '男' }}
          </p>
          <p>
            {{ orderList.biz.deptName }}
            {{ orderList.biz.titleName }}
            {{ orderList.biz.orgName }}
          </p>
          <p>擅长：{{ orderList.biz.skilled }}</p>
          <p>
            评分：<span class="warning">{{ orderList.biz.avgScore }}</span>
            {{ orderList.biz.treatNumber }}次诊疗
            <!-- <router-link
              style="margin-left: 40px; cursor: pointer;"
              class="el-button el-button--text el-button--mini"
              :to="{
                path: '/jurisdiction/account/detail/' + orderList.doctorId,
              }"
            >
              查看详情
            </router-link> -->
            <button
              v-if="show"
              style="margin-left: 40px; cursor: pointer"
              class="el-button el-button--text el-button--mini"
              @click="goMore(orderList.doctorId)"
            >
              查看详情
            </button>
          </p>
        </dd>
      </dl>
      <el-row v-if="rpList.length > 0">
        <el-col :span="24" class="flex-start-start">
          <span style="margin-right: 30px">关联处方:</span>
          <div>
            <div v-for="item in rpList" :key="item.id">
              <span>{{ item.id }}</span>
              <router-link
                style="margin-left: 40px"
                class="el-button el-button--text el-button--mini primary"
                :to="{
                  path: '/order/prescription/detail/' + item.id,
                }"
              >
                查看详情
              </router-link>
              <!-- <el-button
              style="margin-left: 30px;"
              type="text"
              v-clipboard:copy="parent.id"
              v-clipboard:success="
                parent.$message.bind(parent, {
                  type: 'success',
                  message: '完成',
                  showClose: true,
                })
              "
              v-clipboard:error="
                parent.$message.bind(parent, {
                  type: 'error',
                  message: '失败',
                  showClose: true,
                })
              "
            >
              复制
            </el-button> -->
            </div>
            <!-- <div>
            <span class="primary">{{ parent.id }}</span>
            <el-button
              style="margin-left: 30px;"
              type="text"
              v-clipboard:copy="parent.id"
              v-clipboard:success="
                parent.$message.bind(parent, {
                  type: 'success',
                  message: '完成',
                  showClose: true,
                })
              "
              v-clipboard:error="
                parent.$message.bind(parent, {
                  type: 'error',
                  message: '失败',
                  showClose: true,
                })
              "
            >
              复制
            </el-button>
          </div> -->
          </div>
        </el-col>
      </el-row>
    </div>
  </section>
</template>
<script>
import { curPre } from '@/api/prescription'
export default {
  name: 'Info',
  props: {
    orderList: {
      type: Object,
    },
  },
  created() {
    let path_ = this.$route.path
    if (path_.search('/home/writeoff') != -1) {
      this.show = false
    }
    this.getcurPre()
  },
  data() {
    return {
      show: true,
      rpList: [],
    }
  },
  methods: {
    async getcurPre() {
      let list = await curPre({ orderId: this.orderList.orderId })
      this.rpList = list || []
    },
    goMore(doctorId) {
      let path_ = this.$route.path
      if (path_.search('/home/writeoff') == -1) {
        this.$router.push({
          path: `/jurisdiction/account/detail/${doctorId}`,
        })
      } else {
        this.$router.push({
          path: `/home/writeoff/checkAccount/${doctorId}`,
        })
      }
    },
  },
}
</script>
