<template>
  <div class="view__card">
    <BlockTitle style="margin-bottom: 15px">基本信息</BlockTitle>
    <el-row>
      <el-col :span="24"
        >活动名称：【{{ infoData.activityType }}】{{
          infoData.activityName
        }}</el-col
      >
      <el-col :span="8">活动ID：{{ infoData.id }} </el-col>
      <el-col :span="8">负责人：{{ infoData.activityDirector }} </el-col>
      <el-col :span="8">活动开始时间：{{ infoData.activityBeginTime }} </el-col>
      <el-col :span="8"
        >活动结束时间：{{ infoData.activityEndTime || '-' }}
      </el-col>
      <el-col :span="8"
        >活动结束规则：{{
          infoData.activityRule == 1 ? '截止活动结束时间' : '活动名额满'
        }}</el-col
      >
      <el-col :span="8">活动名额：{{ infoData.activityQuota }} </el-col>
      <template v-for="(item, index) in infoData.itemFeeList">
        <el-col :key="`1_${index}`" :span="8"
          >收费项目{{ item.feeType == 1 ? '一' : '二' }}：{{
            item.itemName || '-'
          }}
        </el-col>
        <el-col :key="`2_${index}`" :span="8"
          >{{
            infoData.itemFeeList.length > 1 && index == 0 ? '咨询' : '报名'
          }}费用：{{
            parseFloat((parseFloat(item.price) * item.nums).toFixed(2))
          }}元/人
        </el-col>
      </template>

      <el-col :span="8">联系电话：{{ infoData.activityTell }} </el-col>
      <el-col :span="8"
        >报名人数：{{ infoData.activityApplicant || '-' }}
      </el-col>
      <el-col :span="8"
        >报名成功人数：{{ infoData.activityApplicantSuccess || '-' }}
      </el-col>
      <el-col :span="8"
        >状态：{{ status[infoData.activityStatus] || '-' }}
      </el-col>
      <el-col :span="8">创建人：{{ infoData.creator }}</el-col>
      <el-col :span="8">创建时间：{{ infoData.creatTime }} </el-col>
      <el-col :span="8">最后一次修改人：{{ infoData.lastUpdateStaff }} </el-col>
      <el-col :span="8"
        >最后一次修改时间：{{ infoData.lastUpdateTime }}
      </el-col>
    </el-row>
    <BlockTitle style="margin-bottom: 15px">活动内容</BlockTitle>
    <div class="content-title">活动地点：</div>
    <el-input disabled type="text" :value="infoData.activityAddr" />
    <div class="content-title">购买须知：</div>
    <el-input
      :rows="4"
      resize="none"
      disabled
      type="textarea"
      :value="infoData.purchaseNote"
    />
    <div class="content-title">退款说明：</div>
    <el-input
      :rows="4"
      resize="none"
      disabled
      type="textarea"
      :value="infoData.refundDesc"
    />
    <div class="content-title">其他说明：</div>
    <el-input
      :rows="4"
      resize="none"
      disabled
      type="textarea"
      :value="infoData.otherDesc"
    />
    <div class="content-title">活动介绍：</div>
    <div
      v-html="infoData.activityInstruction"
      style="color: #999; line-height: 28px"
    ></div>
    <!-- <el-input
      :rows="4"
      resize="none"
      disabled
      type="textarea"
      :value="infoData.activityInstruction"
    /> -->
    <BlockTitle>报名表单设置 </BlockTitle>
    <div class="set-option">
      <div
        class="set-option-item"
        v-for="(val, index) in infoData.signRelList"
        :key="index"
      >
        <div style="margin: 15px 0 8px 0">{{ val.fieldName }}</div>
        <el-input
          v-if="['普通文本框', '多行文本框'].includes(val.fieldType)"
          disabled
          type="text"
          :value="val.fieldValue"
          placeholder="请输入"
        />
        <el-radio-group v-if="val.fieldType === '单选框'" disabled>
          <el-radio
            v-for="(item, i) in val.optionValue"
            :key="i"
            :label="item"
            >{{ item }}</el-radio
          >
        </el-radio-group>
      </div>
    </div>
    <BlockTitle style="margin-bottom: 15px">活动模板</BlockTitle>
    <div class="content-title">{{ infoData.activityTemplate }}</div>
    <div class="temp">
      <div class="img-box">
        <el-image
          fit="cover"
          :src="FILE_URL_IMG_NAME(infoData.activityTemplateId)"
          :preview-src-list="[FILE_URL_IMG_NAME(infoData.activityTemplateId)]"
        >
        </el-image>
      </div>
    </div>
    <BlockTitle style="margin-bottom: 15px">宣传图</BlockTitle>
    <div class="content-title">{{ infoData.activityImg }}</div>
    <div class="temp">
      <div class="img-box">
        <el-image
          fit="cover"
          :src="
            infoData.activityImgId && infoData.activityImgId.indexOf('.') > -1
              ? FILE_URL_IMG_NAME(infoData.activityImgId)
              : FILE_URL(infoData.activityImgId)
          "
          :preview-src-list="[
            infoData.activityImgId && infoData.activityImgId.indexOf('.') > -1
              ? FILE_URL_IMG_NAME(infoData.activityImgId)
              : FILE_URL(infoData.activityImgId),
          ]"
        >
        </el-image>
      </div>
    </div>
    <BlockTitle style="margin-bottom: 15px">二维码</BlockTitle>
    <div class="qr-code">
      <div class="code-img">
        <!-- <img
          style="width: 134px; height: 134px"
          :src="`https://api.qrserver.com/v1/create-qr-code?data=${acticityUrl}`"
        /> -->
        <QRcode
          width="130"
          height="130"
          :content="acticityUrl"
          :load="false"
        ></QRcode>
      </div>
      <div>
        <div>{{ acticityUrl }}</div>
        <div style="margin: 10px 0">
          <el-button
            type="text"
            @click.stop.prevent=""
            v-clipboard:error="copyFailed"
            v-clipboard:success="copySuccess"
            v-clipboard:copy="acticityUrl"
          >
            复制链接
          </el-button>
        </div>
        <!-- <div>
          <a
            :download="`https://api.qrserver.com/v1/create-qr-code?data=${acticityUrl}`"
          >
            <el-button @click="dowloadCode">下载二维码</el-button>
          </a>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { BlockTitle } from '@/components/Base'
import { getActivityDetail } from '@/api/mindConsult/myActivity'
import QRcode from '@/components/createCode/index.vue'
import { getToken } from '@/utils/auth'
export default {
  components: {
    BlockTitle,
    QRcode,
  },
  data() {
    return {
      token: getToken(),
      acticityUrl: '',
      status: ['', '进行中', '已结束', '暂停', '未开始'],
      setOption: [
        { label: '姓名：', value: 'name', type: 'text' },
        { label: '手机号： ', value: 'phone', type: 'text' },
        {
          label: '是否接受消息： ',
          value: 'isMsg',
          type: 'radio',
          optionValue: ['是', '否'],
        },
        { label: '门诊号：  ', value: 'mzNo', type: 'text' },
      ],
      infoData: {},
    }
  },
  created() {
    this.getInfo()
    const key = this.$route.query.activityTemplateId
    const baseUrl =
      process.env.MODE === 'jwpro'
        ? window.config.proActiveUrl
        : window.config.testAcTiveUrl
    //根据活动类型动态拼接路径
    this.acticityUrl = `${baseUrl}${window.config.templates[key]}?activityId=${this.$route.query.id}&token=${this.token}`
  },
  methods: {
    copyFailed() {
      this.$message.error('复制失败！')
    },
    copySuccess() {
      this.$message.success('复制成功！')
    },
    async getInfo() {
      this.infoData = await getActivityDetail({
        activityId: this.$route.query.id,
      })
    },
    //下载二维码
    dowloadCode() {},
  },
}
</script>

<style lang="scss" scoped>
el-input {
  width: 100%;
}
.el-col {
  color: #4d4d4d;
  margin-bottom: 15px;
}
.content-title {
  margin: 15px 0 10px 0;
  color: #4d4d4d;
}
.set-option {
  display: flex;
  flex-wrap: wrap;
  .set-option-item {
    width: 32%;
    margin-right: 15px;
  }
}
.temp {
  display: flex;
  .img-box {
    width: 242px;
    height: 96px;
    background: #f2f2f2;
    overflow: hidden;
  }
}
.qr-code {
  display: flex;
  .code-img {
    width: 134px;
    height: 134px;
    background: #f2f2f2;
    margin-right: 15px;
  }
}
</style>
