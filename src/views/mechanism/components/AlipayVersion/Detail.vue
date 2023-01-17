<template>
  <div class="applet-detail" v-loading="loading">
    <div class="head-title mb-20">
      <div class="line"></div>
      <div class="title">版本详情</div>
    </div>
    <div class="form-item">
      <div class="title require">版本号</div>
      <el-input
        v-model="appVersion"
        class="input"
        placeholder="请输入版本号查询详情"
        @change="versionChange"
        clearable
      ></el-input>
      <el-button type="primary" plain @click="getVersionDetail">查询</el-button>
    </div>
    <div class="detail mb-10">
      <div class="left">
        <div class="logo-box mb-20">
          <div class="label">版本Logo</div>
          <div class="logo" v-if="detailInfo.appLogo">
            <img :src="detailInfo.appLogo" alt="" />
          </div>
          <div class="error-img" v-else>
            <i class="el-icon-picture-outline"></i>
          </div>
        </div>
        <div class="item mb-20 pd-left-0">
          <div class="label version-state">版本状态</div>
          <div class="value">
            <el-tag
              v-if="detailInfo.status"
              :type="statusTag[detailInfo.status]"
              size="medium"
              >{{ appStates[detailInfo.status] }}</el-tag
            >
            <template v-else>-</template>
          </div>
        </div>
        <div class="item mb-20 pd-left-0">
          <div class="label">安全扫描</div>
          <div class="value">
            <el-tag
              v-if="detailInfo.scanResult"
              :type="scanTag[detailInfo.scanResult]"
              size="medium"
              >{{ scanState[detailInfo.scanResult] }}</el-tag
            >
            <template v-else>-</template>
          </div>
        </div>
        <div class="detail-img">
          <div class="label">版本截图</div>
          <div class="img" v-if="imgUrl">
            <el-image
              class="photo"
              :src="imgUrl"
              :preview-src-list="imgList"
              fit="cover"
            >
            </el-image>
          </div>
          <div class="error-img" v-else>
            <i class="el-icon-picture-outline"></i>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="detail-item">
          <template v-for="(item, detail) in rightDetail">
            <div class="item width33" :key="detail">
              <div class="label">{{ item.label }}</div>
              <div class="value">
                <el-tooltip :disabled="isTip" :content="detailInfo[item.key]">
                  <div
                    class="text"
                    ref="detailFa"
                    @mouseover="showTip('detailFa', 'detailSon', detail)"
                  >
                    <span ref="detailSon">
                      {{ getDetailVal(detailInfo[item.key]) }}
                    </span>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="head-title mb-20">
      <div class="line"></div>
      <div class="title">版本列表</div>
    </div>
    <el-table :data="tableData" height="130px" class="version-table">
      <el-table-column type="index" label="序号"> </el-table-column>
      <template v-for="(item, index) in tableHeader">
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
          :key="index"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span>{{ row[item.prop] || '-' }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column label="版本状态" type="versionStatus">
        <template slot-scope="{ row }">
          <span>{{ appStates[row.versionStatus] || '-' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="version-list">
      <div class="label">已有版本号</div>
      <div class="value">{{ versionList || '-' }}</div>
    </div>
  </div>
</template>

<script>
import { miniDetailQuery, miniVersionList } from '@/api/mechanismList'
export default {
  data() {
    return {
      appVersion: '',
      detailInfo: {}, //版本详情
      versionList: '', //版本列表
      isTip: true, //版本详情tooltip状态
      rightDetail: [
        { label: '版本号', key: 'appVersion' },
        { label: '客服电话', key: 'servicePhone' },
        { label: '创建时间', key: 'gmtCreate' },
        { label: '中文名称', key: 'appName' },
        { label: '客服邮箱', key: 'serviceEmail' },
        { label: '提交审核', key: 'gmtApplyAudit' },
        { label: '英文名称', key: 'appEnglishName' },
        { label: '服务区域', key: 'serviceRegionType' },
        { label: '审核结束', key: 'gmtAuditEnd' },
        { label: '驳回原因', key: 'rejectReason' },
        { label: '应用简介', key: 'appSlogan' },
        { label: '上架时间', key: 'gmtOnline' },
        { label: '版本描述', key: 'versionDesc' },
        { label: '备注', key: 'memo' },
        { label: '下架时间', key: 'gmtOffline' },
      ],
      appStates: {
        //版本状态类型
        INIT: '开发中',
        AUDITING: '审核中',
        WAIT_RELEASE: '审核通过',
        AUDIT_REJECT: '审核驳回',
        RELEASE: '已上架',
        GRAY: '灰度中',
        OFFLINE: '已下架',
      },
      statusTag: {
        INIT: 'warning',
        AUDITING: '',
        WAIT_RELEASE: 'success',
        AUDIT_REJECT: 'danger',
        RELEASE: 'success',
        GRAY: 'info',
        OFFLINE: 'danger',
      },
      scanState: {
        //安全扫描类型
        True: '安全扫描通过',
        False: '安全扫描不通过',
        NAN: '扫描中',
      },
      scanTag: {
        True: 'success',
        False: 'danger',
        NAN: 'info',
      },
      imgUrl: '', //截图
      imgList: [], //截图列表
      tableHeader: [
        { prop: 'appVersion', label: '版本号', width: '', minWidth: '' },
        { prop: 'versionDescription', label: '版本描述', width: '' },
        { prop: 'createTime', label: '创建时间', width: '', minWidth: '' },
      ],
      tableData: [],
      loading: false,
    }
  },
  methods: {
    //版本详情查询
    async getVersionDetail() {
      if (!this.appVersion) return
      this.loading = true
      let res = await miniDetailQuery({
        version: this.appVersion,
      })
      this.detailInfo = res
      this.imgUrl = res.screenShotList ? res.screenShotList[0] : ''
      this.imgList = res.screenShotList ? res.screenShotList : []
      this.loading = false
    },
    //版本列表查询
    async queryVersionList() {
      let res = await miniVersionList()
      this.tableData = res.appVersionInfos
      this.versionList = res.appVersions.join(' , ')
    },
    //版本号清空置空详情
    versionChange(val) {
      if (!val) {
        this.detailInfo = {}
        this.imgList = []
        this.imgUrl = ''
      }
    },
    //版本详情超出文本tip显示
    showTip(parent, child, index) {
      let parentWidth = this.$refs[parent][index].offsetWidth
      let childWidth = this.$refs[child][index].offsetWidth
      this.isTip = childWidth > parentWidth ? false : true
    },
    //版本详情显示
    getDetailVal(val) {
      if (!val) return '-'
      if (val == 'CHINA') {
        return '中国'
      } else {
        return val
      }
    },
  },
  created() {
    this.queryVersionList()
  },
}
</script>

<style lang="scss" scoped>
.applet-detail {
  width: 100%;
  padding: 10px 0 0 10px;
  font-size: 14px;
  .head-title {
    display: flex;
    width: 100%;
    height: 30px;
    align-items: center;
    .line {
      width: 3px;
      height: 20px;
      background: #0ab2c1;
      margin-right: 5px;
    }
    .title {
      font-size: 16px;
      color: #333;
    }
  }
  .form-item {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    .title {
      width: 65px;
      color: #888;
      flex-shrink: 0;
    }
    .require {
      &::before {
        content: '*';
        color: #f74a4a;
        margin-right: 4px;
      }
    }
    .input {
      width: 245px;
      margin-right: 15px;
    }
  }
  .item {
    display: flex;
    height: 30px;
    align-items: center;
    padding: 0 10px;
    .label {
      width: 70px;
      color: #888;
      flex-shrink: 0;
    }
    .value {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #333;
    }
  }
  .detail {
    display: flex;
    width: 100%;
    .left {
      width: 25%;
      .logo-box {
        display: flex;
        width: 100%;
        .label {
          width: 70px;
          flex-shrink: 0;
          color: #888;
        }
        .logo {
          flex: 1;
          img {
            width: 80px;
            height: 80px;
          }
        }
      }
    }
    .right {
      width: 75%;
    }
  }
  .detail-item {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    .item {
      margin-bottom: 20px;
      .value {
        .text {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
  .detail-img {
    display: flex;
    width: 100%;
    padding-top: 10px;
    .label {
      width: 70px;
      color: #888;
      flex-shrink: 0;
    }
    .img {
      display: flex;
      flex: 1;
      align-items: center;
      .photo {
        width: 80px;
        height: 80px;
      }
    }
  }
  .version-list {
    display: flex;
    width: 100%;
    height: 30px;
    align-items: center;
    .label {
      width: 70px;
      flex-shrink: 0;
      margin-right: 10px;
      color: #888;
    }
    .value {
      flex: 1;
      color: #333;
    }
  }
  .version-table {
    width: 100%;
    border: 1px solid #e6e6e6;
    margin-bottom: 10px;
  }
  .error-img {
    display: flex;
    width: 80px;
    height: 80px;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
    color: #909399;
    font-size: 28px;
  }
  .width20 {
    width: 20%;
  }
  .width25 {
    width: 25%;
  }
  .width33 {
    width: 33.3%;
  }
  .width50 {
    width: 50%;
  }
  .width100 {
    width: 100%;
  }
  .mb-10 {
    margin-bottom: 10px;
  }
  .mb-20 {
    margin-bottom: 20px;
  }
  .pd-left-0 {
    padding-left: 0;
  }
  .version-state {
    font-weight: 500;
    color: #0ab2c1 !important;
  }
}
</style>
