<template>
  <el-scrollbar
    v-drag-size:left="{ onDragUp }"
    :style="{ width: initWidth, minWidth: '50px', maxWidth: '800px' }"
    class="c__right-panel"
    :class="{ disable: !activation, min: !show }"
    view-class="infinite-wrapper"
  >
    <div class="minus">
      <el-button
        @click="toggle"
        size="mini"
        type="text"
        :icon="show ? 'el-icon-minus' : 'el-icon-plus'"
      ></el-button>
    </div>
    <div class="min-title" v-show="!show">患者信息</div>
    <dl v-show="show" class="patient-info">
      <dt class="avatar">
        <el-image
          :src="FILE_URL(patient.avatar)"
          class="avatar_round"
          style="width: 60px; height: 60px;"
        >
          <img slot="error" class="image-slot" src="@/assets/headerImg.png" />
        </el-image>
        <!-- <el-avatar :size="60" :src="patient.avatar"></el-avatar> -->
      </dt>
      <dt :style="{ marginLeft: '12px' }">
        <h4>{{ patient.memberName }}</h4>
        {{ patient.idCard }}
      </dt>

      <el-row>
        <el-col :span="10">血型：{{ patient.bloodType || '-' }}</el-col>
        <el-col :span="14">电话：{{ patient.phone || '-' }}</el-col>
        <el-col :span="10"
          >年龄：{{ patient.age ? patient.age + '岁' : '-' }}</el-col
        >
        <el-col :span="14">出生日期：{{ patient.birthday || '-' }}</el-col>
        <el-col :span="10"
          >性别：
          <template v-if="Number(patient.sex) === 1">男</template>
          <template v-else-if="Number(patient.sex) === 0">女</template>
          <template v-else>-</template>
        </el-col>
        <el-col :span="14">就诊卡：{{ patient.cardNo || '-' }}</el-col>
      </el-row>

      <dt class="section" style="color: red;">过敏史</dt>
      <dd class="section" style="color: red;">{{ patient.allergies }}</dd>

      <dt class="section">预问诊</dt>
      <dd class="section">
        {{ patient.illnessDesc }}
        <div class="image-wrap" v-if="isArray(patient.pic)">
          <el-image
            v-for="_ in patient.pic"
            :key="_"
            style="width: 80px; height: 80px;"
            :src="FILE_URL(_)"
            fit="cover"
            :preview-src-list="patient.pic.map(FILE_URL)"
          ></el-image>
        </div>
      </dd>
    </dl>

    <div v-show="show" class="see-doctor">
      <div class="filter">
        <div class="is-center">
          总就诊次：
          <span :style="{ color: variables.danger }">
            {{ seeDoctor.total }}
          </span>
          次
        </div>

        <el-row :gutter="10" style="font-size: 12px;">
          <el-col :span="4">医院</el-col>
          <el-col :span="20">
            <el-select style="width: 100%;" v-model="seeDoctor.query.hospital">
              <el-option
                v-for="{ name, id } in hospitalList"
                :label="name"
                :key="id"
                :value="id"
              ></el-option>
            </el-select>
          </el-col>

          <el-col :span="4">类型</el-col>
          <el-col :span="20">
            <el-select
              style="width: 100%;"
              v-model="seeDoctor.query.medicalType"
            >
              <el-option
                v-for="{ label, value } in [
                  { label: '全部', value: '' },
                  { label: '门诊', value: 'MZ' },
                  { label: '住院', value: 'ZY' },
                  { label: '体检', value: 'TJ' },
                ]"
                :key="value"
                :label="label"
                :value="value"
              ></el-option>
            </el-select>
          </el-col>

          <!-- <el-col :span="7" class="hiddenline1">开始时间</el-col>
          <el-col :span="17">
            <el-date-picker
              v-model="seeDoctor.query.startDate"
              style="width: 100%;"
              type="date"
              placeholder="开始日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-col>
          <el-col :span="7" class="hiddenline1">开始时间</el-col>
          <el-col :span="17">
            <el-date-picker
              v-model="seeDoctor.query.endDate"
              style="width: 100%;"
              type="date"
              placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-col> -->
          <el-col :span="4">时间</el-col>
          <el-col :span="20">
            <el-date-picker
              v-model="seeDoctor.date"
              style="width: 100%;"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="
                ;[seeDoctor.query.startDate, seeDoctor.query.endDate] =
                  $event || []
              "
            ></el-date-picker>
          </el-col>
        </el-row>
      </div>
      <div
        v-for="(item, index) in seeDoctor.list"
        :key="item.id + index"
        class="hospital"
      >
        <p>
          <span
            class="medical_type"
            :style="{
              color:
                item.medicalType === 'MZ'
                  ? variables.success
                  : item.medicalType === 'ZY'
                  ? variables.primary
                  : item.medicalType === 'TJ'
                  ? variables.warning
                  : variables.danger,
            }"
          >
            {{
              item.medicalType === 'MZ'
                ? '门诊'
                : item.medicalType === 'ZY'
                ? '住院'
                : item.medicalType === 'TJ'
                ? '体检'
                : ''
            }}
            <!-- <span class="internet">e</span> -->
            <span class="internet" v-if="item.type == 'outer'">{{
              item.type == 'outer' ? 'e' : ''
            }}</span>
          </span>

          <!-- <span
            :style="{
              color:
                item.type === 'outer' ? variables.success : variables.primary,
            }"
            >{{ item.type == 'outer' ? '互联网' : '院内' }}</span
          > -->
        </p>
        <p class="hospital-date">就诊时间：{{ item.visitDate }}</p>

        <p>{{ item.orgName }}</p>

        <p>{{ item.deptName }} {{ item.doctorName }}</p>

        <p class="hospital-diagnosis" v-if="typeof item.diagnose === 'string'">
          诊断：{{ item.diagnose.substring(0, 20) + '...' }}
        </p>
        <p
          :style="{
            textAlign: 'right',
            marginRight: '10px',
          }"
        >
          <el-button @click="openHistory(item)" size="mini" type="primary" plain
            >{{ item.open ? '查看' : '请求查看' }}
          </el-button>
        </p>
      </div>
      <infinite-loading
        v-if="this.memberId"
        :distance="distance"
        :identifier="identifier"
        @infinite="infiniteHandler"
      >
        <template #no-results>
          <Empty v-if="!seeDoctor.total" tips="暂无数据" />
          <span v-else></span>
        </template>

        <span slot="no-more"></span>
      </infinite-loading>
    </div>
  </el-scrollbar>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'

import { Empty } from '@/components'
import { isArray, eventbus } from '@/utils'
import variables from '@/styles/_variables.scss'
import DragSize from '@/directive/drag-size/index'
import { patientInfo, webarchiveList, applyAuth } from '@/api/business'

export default {
  name: 'RightPanel',
  props: {
    orderId: String,
    memberId: String,
    type: String,
    roomId: String,
  },
  components: {
    InfiniteLoading,
    Empty,
  },
  directives: { DragSize },

  data() {
    return {
      patient: {},
      initWidth: (localStorage.getItem('r_panel_width') || '200') + 'px',
      distance: Infinity,
      identifier: +new Date(),

      seeDoctor: {
        query: {
          startDate: '',
          endDate: '',
          hospital: '',
          medicalType: '',
        },
        date: null,
        currentNum: 1,
        pageSize: 10,
        list: [],
        total: '',
      },

      show: localStorage.getItem('r_panel_show') === 'false' ? false : true,
      hospitalList: [
        {
          name: '全部',
          id: '',
        },
        {
          name: this.$store.state.user.orgName,
          id: this.$store.state.user.orgId,
        },
      ],
    }
  },
  computed: {
    variables() {
      return variables
    },
    activation() {
      return this.orderId && this.memberId
    },
  },
  mounted() {
    const _self = this
    eventbus.$on('UPDATE_MEDICAL_AUTH', medicalId =>
      _self.updateListStatus(medicalId),
    )
  },
  beforeDestory() {
    eventbus.$off('UPDATE_MEDICAL_AUTH')
  },
  watch: {
    activation: function (val) {
      val ? this.fetchData() : this.clean()
    },
    'seeDoctor.query': {
      handler: function () {
        this.cleanInfiniteLoad()
        this.distance = 100
        this.identifier++
      },
      deep: true,
    },
    type: function () {
      this.cleanSearch()
      this.cleanInfiniteLoad()
      this.distance = 100
      this.identifier++
    },
    orderId: function () {
      this.cleanSearch()
      this.cleanInfiniteLoad()
      this.distance = 100
      this.identifier++
    },
  },
  methods: {
    isArray,
    async fetchData() {
      this.distance = 100
      this.identifier++
      this.patient = await patientInfo({ orderId: this.orderId })
    },
    updateListStatus(medicalId) {
      const index = this.seeDoctor.list.findIndex(item => item.id === medicalId)
      if (index !== -1) this.$set(this.seeDoctor.list[index], 'open', true)
    },
    async infiniteHandler($state) {
      const res = await webarchiveList({
        currentNum: this.seeDoctor.currentNum++,
        pageSize: this.seeDoctor.pageSize,
        memberIds: this.memberId,
        status: true,
        ...this.seeDoctor.query,
      })
      this.seeDoctor.total = res.total
      this.seeDoctor.list.push(...res.data)
      if (res.data && res.data.length === this.seeDoctor.pageSize) {
        $state.loaded()
      } else {
        $state.complete()
      }
    },

    clean() {
      this.patient = {}

      this.cleanInfiniteLoad()
    },
    cleanSearch() {
      this.seeDoctor.date = ''
      this.seeDoctor.query = {
        startDate: '',
        endDate: '',
        hospital: '',
        medicalType: '',
      }
    },
    cleanInfiniteLoad() {
      this.distance = Infinity
      this.seeDoctor.currentNum = 1
      this.seeDoctor.list = []
    },
    toggle() {
      this.show = !this.show
      localStorage.setItem('r_panel_show', this.show)
    },
    onDragUp(data) {
      localStorage.setItem('r_panel_width', data.width)
    },
    async openHistory(item) {
      if (item.open) {
        this.$emit('clinic', item)
      } else {
        const params = {
          medicalId: item.id,
          memberId: item.memberId,
          roomId: this.roomId,
          typeName: item.medicalType,
        }
        await applyAuth(params)
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/_variables.scss';
.hiddenline1 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.c__right-panel {
  // max-width: 350px;
  width: 232px;
  position: relative;
  flex: none !important;

  .minus {
    position: absolute;
    top: 0px;
    right: 18px;
  }

  &.min {
    flex: none !important;
    width: 50px !important;
    min-width: 50px;
    .min-title {
      margin-top: 30px;
      text-align: center;
    }
  }

  .el-range-editor--medium .el-range-input {
    font-size: 12px;
  }

  &.disable {
    position: relative;
    pointer-events: none;

    &::after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: $--color-white;
      opacity: 0.8;
      content: '';
      z-index: 1000;
    }
  }

  & > .el-scrollbar__wrap {
    overflow-x: auto;
  }

  .el-scrollbar__view {
    padding: 10px;
  }

  .patient-info {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0;
    color: #666;
    font-size: 12px;

    .avatar + dd {
      h4 {
        margin: 0 0 5px 0;
        color: $--color-text-primary;
      }
    }

    .el-col {
      line-height: 30px;
      white-space: nowrap;

      > dd {
        margin-top: -30px;
      }
    }

    dt.section {
      margin-top: 20px;
      padding-left: 0.5em;
      border-left: 2px solid $--color-primary;
    }

    dd.section {
      margin: 10px 0 0 0;
      line-height: 26px;
      width: 100%;
      min-height: 26px;
    }
  }

  .see-doctor {
    margin: 20px -10px 0;
    padding: 0 20px;
    border-top: 1px solid $--color-info-light;

    .filter {
      position: sticky;
      top: 0;
      margin: 0 -20px;
      padding: 20px;
      background: $--color-white;
      font-size: 14px;
      z-index: 2;

      .el-col {
        margin-top: 20px;
        line-height: 36px;
      }
    }

    .hospital {
      margin: 0 -20px;
      padding: 10px;
      background: $--color-info-lighter;
      font-size: 12px;

      & + .hospital {
        margin-top: 10px;
      }

      .hospital-date {
        display: flex;
        justify-content: space-between;
        margin-top: 0;
      }

      .hospital-diagnosis {
        margin-bottom: 0;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }
    }
  }
}
.medical_type {
  display: inline-block;
  position: relative;
  z-index: 0;
  .internet {
    position: absolute;
    right: -14px;
    top: -8px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #0ab2c1;
    color: #fff;
    padding-bottom: 3px;
  }
}
</style>
