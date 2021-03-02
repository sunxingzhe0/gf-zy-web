<template>
  <div class="schedule-wrapper">
    <div class="view__card mb10">
      <div class="flex-start-start">
        <div>
          <div class="is-center" style="padding-right: 15px">
            <!-- <el-avatar :size="60" :src="FILE_URL(form.picId)"></el-avatar> -->
            <el-image :src="FILE_URL(form.picId)" :size="60">
              <img
                slot="error"
                class="image-slot"
                src="@/assets/headerImg.png"
              />
            </el-image>
          </div>
        </div>
        <div class="flex_1">
          <el-row>
            <el-col :lg="6" :md="12" :sm="12">
              <div>
                <div class="info"><span>姓名</span>{{ form.docName }}</div>
                <div class="info"><span>性别</span>{{ form.gender }}</div>
                <div class="info"><span>手机号</span>{{ form.phone }}</div>
              </div>
            </el-col>
            <el-col :lg="6" :md="12" :sm="12">
              <div>
                <div class="info"><span>任职医院</span>{{ form.orgName }}</div>
                <div class="info"><span>工号</span>{{ form.workNum }}</div>
                <div class="info"><span>科室</span>{{ form.deptName }}</div>
              </div>
            </el-col>
            <el-col :lg="6" :md="12" :sm="12">
              <div>
                <div class="info"><span>职称</span>{{ form.titleName }}</div>
                <div class="info">
                  <span>从业年限</span>{{ form.workYear }}年
                </div>
                <div class="info">
                  <span>是否本院</span>{{ form.inHospital }}
                </div>
              </div>
            </el-col>
            <el-col :lg="6" :md="12" :sm="12">
              <div class="flex-start-start info">
                <span>在线复诊</span>
                <span>视频 ￥ {{ form.onlinePrice }} /次</span>

                <!-- <el-checkbox-group v-model="checkList">
                  <div>
                    <el-checkbox
                      :label="`视频 ￥${form.onlinePrice}/次`"
                    ></el-checkbox>
                  </div>
                </el-checkbox-group> -->
              </div>
              <div class="flex-start-start info">
                <span>慢病续方</span>
                <span>视频 ￥ {{ form.onlinePrice }} /次</span>
                <!-- <el-checkbox-group v-model="checkList">
                  <div>
                    <el-checkbox
                      :label="`视频 ￥${form.slowPrice}/次`"
                    ></el-checkbox>
                  </div>
                </el-checkbox-group> -->
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="view__card main-view">
      <shift :docInfo="docInfo" idType="2"></shift>
    </div>
  </div>
</template>
<script>
import shift from '../components/shift'
import { getSingleDocInfo } from '@/api/scheduling'
export default {
  components: { shift },
  data() {
    return {
      checkList: [],
      docInfo: [this.$route.query.id, this.$route.query.dept],
      form: {},
    }
  },
  mounted() {},
  created() {
    this.getDocInfo()
  },
  methods: {
    async getDocInfo() {
      let res = await getSingleDocInfo({
        doctorId: this.$route.query.id,
      })
      this.form = res
    },
  },
}
</script>
<style lang="scss" scoped>
.schedule-wrapper {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  height: calc(100vh - 52px);
  .mb10 {
    height: auto;
  }
  .main-view {
    flex: 1;
    overflow: hidden;
  }
}
.view__card {
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  background: #ffffff;
  padding: 20px;
}
.mb10 {
  margin-bottom: 10px;
}
.info {
  font-size: 14px;
  line-height: 36px;
  span {
    color: #666;
    margin-right: 15px;
  }
}
// ::v-deep {
//   .el-avatar > img {
//     width: 100%;
//   }
// }
.el-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
