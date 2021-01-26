<template>
  <div>
    <div class="view__card mb10 toppad">
      <div class="flex-between">
        <!-- 表头 -->
        <div class="tab flex-start-center">
          <div
            :class="['btn', active == 0 ? 'on' : '']"
            @click="handleScheduling"
          >
            排班设置
          </div>
          <div :class="['btn', active == 1 ? 'on' : '']" @click="depMember">
            科室员工
          </div>
        </div>
        <div class="departmentTitle is-center">
          <div>{{ deptName }}</div>
          <span>{{ hospName }}，共{{ memberNumber }}名员工</span>
        </div>
        <div style="width: 208px; text-align: right;">
          <el-switch
            v-model="state"
            :active-value="1"
            :inactive-value="0"
            @change="setState"
          >
          </el-switch>
        </div>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col v-if="active == 1" :lg="8" :md="8" :sm="4">
          <el-scrollbar class="height100 box-shadow">
            <div class="min-height staff">
              <el-input
                placeholder="请输入内容"
                v-model="keywords"
                class="input-with-select"
                clearable
                @clear="docSearch"
              >
                <el-select v-model="select" slot="prepend" placeholder="请选择">
                  <el-option label="姓名" value="1"></el-option>
                </el-select>
                <el-button
                  slot="append"
                  @click="docSearch"
                  icon="el-icon-search"
                ></el-button>
              </el-input>
              <div
                class="infinite-list"
                style="padding-bottom: 20px;"
                v-infinite-scroll="load"
              >
                <el-row :gutter="15">
                  <el-col
                    :span="12"
                    v-for="(item, index) in docList"
                    :key="index"
                  >
                    <div
                      :class="['staffInfo', staff == item.doctorId ? 'on' : '']"
                      @click="getDocSechedual(item.doctorId, item)"
                    >
                      <el-image
                        :src="FILE_URL(item.picId)"
                        class="avatar_round"
                        style="width: 60px; height: 60px;"
                      >
                        <img
                          slot="error"
                          class="image-slot"
                          src="@/assets/headerImg.png"
                        />
                      </el-image>
                      <!-- <el-avatar
                        :size="60"
                        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                      ></el-avatar> -->
                      <div class="name">{{ item.name }}</div>
                      <div class="des">
                        {{ item.titleName }} {{ item.hospName }}
                      </div>
                      <div class="des">{{ item.deptName }}</div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-scrollbar>
        </el-col>
        <el-col :lg="8" :md="4" :sm="6">
          <el-scrollbar class="height100 box-shadow">
            <div class="min-height staff">
              <div class="staffName" v-show="active == 0">
                <div>{{ deptName || '科室名称' }}</div>
              </div>
              <div class="staffName" v-show="active == 1">
                <div>{{ selectDoctor.name || '员工姓名' }}</div>
                <span
                  >{{ selectDoctor.titleName || '' }}
                  {{ selectDoctor.hospName || '' }}
                  {{ selectDoctor.deptName || '' }}</span
                >
              </div>
              <div class="planTime">
                <div class="title">工作日</div>
                <el-checkbox-group v-model="checkList" class="flex-between">
                  <el-checkbox
                    v-for="(item, index) in weekList"
                    :label="item.value"
                    :key="index"
                    >{{ item.lable }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
              <div class="planTime" style="padding-bottom: 2px;">
                <div class="title" style="margin-bottom: 20px;">工作时段</div>
                <el-form
                  :model="form"
                  :rules="rules"
                  size="mini"
                  ref="form"
                  style="min-width: 165px;"
                >
                  <el-form-item prop="beginHour">
                    <el-input
                      placeholder="请输入开始时间"
                      v-model="form.beginHour"
                      size="mini"
                      class="input"
                    >
                      <el-button slot="prepend">开始时间</el-button>
                      <span slot="append">时</span>
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="endHour">
                    <el-input
                      placeholder="请输入结束时间"
                      v-model="form.endHour"
                      size="mini"
                      class="input"
                    >
                      <el-button slot="prepend">结束时间</el-button>
                      <span slot="append">时</span>
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="intervalMin">
                    <el-input
                      placeholder="请输入间隔时间"
                      v-model="form.intervalMin"
                      size="mini"
                      class="input"
                    >
                      <el-button slot="prepend">间隔时间</el-button>
                      <span slot="append">分</span>
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="sourceNum"
                    ><el-input
                      placeholder="请输入时段号源"
                      v-model="form.sourceNum"
                      size="mini"
                      class="input"
                    >
                      <el-button slot="prepend">每个时段号源</el-button>
                      <span slot="append">个</span>
                    </el-input></el-form-item
                  >
                </el-form>
              </div>
              <div
                class="planTime"
                v-if="active == 0"
                style="padding-bottom: 20px;"
              >
                <div class="title" style="margin-bottom: 16px;">
                  医生排班规则
                </div>
                <el-radio-group v-model="radio">
                  <el-radio :label="0">科室优先</el-radio>
                  <el-radio :label="1">自定义优先</el-radio>
                </el-radio-group>
              </div>
              <div style="margin-top: 30px;">
                <el-button type="primary" size="small" @click="handleSave"
                  >保存</el-button
                >
                <el-button size="small" v-if="active" @click="handleResetClick"
                  >重置</el-button
                >
              </div>
            </div>
          </el-scrollbar>
        </el-col>
        <el-col
          :lg="active == 0 ? 16 : 8"
          :md="active == 0 ? 8 : 12"
          :sm="active == 0 ? 12 : 12"
        >
          <el-scrollbar class="height100 box-shadow">
            <div class="min-height staff">
              <el-row :gutter="20">
                <!-- 休息时段 -->
                <template v-for="(item, index) in restTimeList">
                  <el-col :span="active == 0 ? 6 : 8" :key="index">
                    <div class="timeset rest flex-between">
                      <div class="time">
                        {{ item.timeRange }}
                      </div>
                      <span>休息</span>
                    </div>
                  </el-col>
                </template>
              </el-row>
              <el-row :gutter="20">
                <!-- 工作时段 -->
                <template v-for="(item, index) in workTimeList">
                  <el-col :span="active == 0 ? 6 : 8" :key="index">
                    <div class="timeset flex-between">
                      <div class="time">
                        {{ item.timeRange }}
                      </div>
                      <el-switch
                        v-model="item.state"
                        :active-value="1"
                        :inactive-value="0"
                        @change="handleChange(item.state, item.timeConfId)"
                      >
                      </el-switch>
                    </div>
                  </el-col>
                </template>
              </el-row>
            </div>
          </el-scrollbar>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import {
  showInfo,
  setStateSchedual,
  setTimeState,
  getDocList,
  getDocDetail,
  deptSave,
  resetDoc,
} from '@/api/scheduling'
export default {
  components: {},
  data() {
    return {
      //选择医生
      selectDoctor: {},
      // 状态
      state: '',
      // 科室名称
      deptName: this.$route.query.name,
      // 科室排班 id
      deptConfigId: '',
      // 科室id
      deptId: '',
      // 所属医院
      hospName: '',
      // 医生排班id
      docConfigId: '',
      // 加载当前页码
      currentNum: 0,
      // 医生数据的总页数
      pages: 1,
      docList: [],
      active: 0,
      value: false,
      select: '1',
      keywords: '',
      staff: '',
      // 工作日集合
      checkList: [],
      weekList: [
        { lable: '星期一', value: 0 },
        { lable: '星期二', value: 1 },
        { lable: '星期三', value: 2 },
        { lable: '星期四', value: 3 },
        { lable: '星期五', value: 4 },
        { lable: '星期六', value: 5 },
        { lable: '星期日', value: 6 },
      ],
      radio: 0,
      // 科室员工数量
      memberNumber: 0,
      form: {
        beginHour: '',
        endHour: '',
        intervalMin: '',
        sourceNum: '',
      },
      rules: {
        beginHour: [
          { required: true, message: '请输入开始时间', trigger: 'blur' },
        ],
        endHour: [
          { required: true, message: '请输入截至时间', trigger: 'blur' },
        ],
        intervalMin: [
          { required: true, message: '请输入间隔时间', trigger: 'blur' },
        ],
        sourceNum: [
          { required: true, message: '请输入号源数量', trigger: 'blur' },
        ],
      },
      // 休息世间列表
      restTimeList: [],
      workTimeList: [],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.state = parseInt(this.$route.query.state)
      this.deptConfigId = this.$route.query.id
      this.deptId = this.$route.query.deptId
      this.deptName = this.$route.query.name
      this.hospName = this.$route.query.hospName
    })
  },
  created() {
    this.showInfoList()
  },
  methods: {
    // 查询科室排班详情
    async showInfoList() {
      let deptConfigId = this.$route.query.id
      let res = await showInfo({
        deptConfigId: deptConfigId,
      })
      this.form.beginHour = res.beginHour
      this.form.endHour = res.endHour
      this.form.intervalMin = res.intervalMin
      this.form.sourceNum = res.sourceNum
      this.radio = res.level
      this.memberNumber = res.docNumber
      this.checkList = res.workDays
      this.restTimeList = res.restTime
      this.workTimeList = res.workTime
    },
    //设置状态
    async setState(e) {
      await setStateSchedual({
        state: e,
        deptConfigId: this.deptConfigId,
      })
      this.showInfoList()
      this.$message.success(e ? '开启成功!' : '关闭成功')

      this.$store.dispatch('updateList/changeFlag', 'updateListFlagVisit')
    },
    // 开启/关闭时间段
    async handleChange(itemState, timeId) {
      let id = this.$route.query.id
      await setTimeState({
        state: itemState,
        deptConfigId: id,
        timeConfigId: timeId,
        type: parseInt(this.active),
      })
    },
    // 排班设置
    handleScheduling() {
      this.active = 0
      this.currentNum = 0
      this.docList = []
      this.showInfoList()
      this.staff = ''
    },
    // 科室员工
    depMember() {
      this.active = 1
      this.$refs.form.resetFields()
      this.checkList = []
      this.restTimeList = []
      this.workTimeList = []
      this.currentNum = 0
      this.docList = []
    },
    async getdocList() {
      // 获取医生列表
      let res = await getDocList({
        deptConfigId: this.deptConfigId,
        currentNum: this.currentNum,
        pageSize: 10,
        searchKeywords: this.keywords,
      })
      this.docList = this.docList.concat(res.list)
      this.pages = res.pages
    },
    docSearch() {
      this.currentNum = 1
      this.docList = []
      this.pages = 1
      this.getdocList()
    },
    // 滚动加载
    load() {
      console.log(this.currentNum)
      if (this.pages > this.currentNum) {
        this.currentNum += 1
        this.getdocList()
      }
    },
    // 查询单个医生排班详情
    async getDocSechedual(docId, item) {
      this.staff = docId
      let res = await getDocDetail({
        doctorId: docId,
        deptConfigId: this.deptConfigId,
      })
      this.selectDoctor = item
      this.form.beginHour = res.beginHour
      this.form.endHour = res.endHour
      this.form.intervalMin = res.intervalMin
      this.form.sourceNum = res.sourceNum
      this.radio = res.level
      // this.memberNumber = res.docNumber
      this.checkList = res.workDays
      this.restTimeList = res.restTime
      this.workTimeList = res.workTime
      this.docConfigId = res.configId
    },
    // 保存
    async handleSave() {
      let arr = []
      //外层循环：控制比较轮数 从0开始，次数小于长度-1
      for (var i = 1; i < this.checkList.length; i++) {
        //内层循环：控制每轮比较次数  数组长度-i
        for (var j = 0; j < this.checkList.length - i; j++) {
          //如果当前的元素(j)大于下一个元素(j+1)，则交换位置
          if (this.checkList[j] > this.checkList[j + 1]) {
            var t = this.checkList[j]
            this.checkList[j] = this.checkList[j + 1]
            this.checkList[j + 1] = t
          }
        }
      }
      arr = this.checkList
      let work = arr.join(',')
      console.log(this.active, '****')
      if (this.active == 0) {
        await deptSave({
          ...this.form,
          deptConfigId: this.deptConfigId,
          deptId: this.deptId,
          workDays: work,
          level: this.radio,
          schedualType: 0,
        })
        this.getDocSechedual()
        this.$message.success('保存成功')
      } else {
        console.log(this.staff, '***2*')
        if (this.staff) {
          await deptSave({
            ...this.form,
            deptConfigId: this.deptConfigId,
            docConfigId: this.docConfigId,
            deptId: this.deptId,
            doctorId: this.staff,
            workDays: work,
            schedualType: 1,
          })
          this.getDocSechedual(this.staff, this.selectDoctor)
          this.$message.success('保存成功')
        } else {
          this.$message.warning('请先选择一个医生')
        }
      }
    },
    //重置弹窗
    handleResetClick() {
      this.$confirm('此操作将重置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.handleReset()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重置',
          })
        })
    },
    // 重置医生排班
    async handleReset() {
      if (this.staff) {
        await resetDoc({
          deptConfigId: this.deptConfigId,
          docConfigId: this.docConfigId,
          deptId: this.deptId,
          doctorId: this.staff,
        })
        this.$message.success('重置成功')
        this.getDocSechedual(this.staff, this.selectDoctor)
      } else {
        this.$message.warning('请选择一个要重置的排班医生')
      }

      // if (this.staff) {
      //   await resetDoc({
      //     deptConfigId: this.deptConfigId,
      //     docConfigId: this.docConfigId,
      //     deptId: this.deptId,
      //     doctorId: this.staff,
      //   })
      //   this.getDocSechedual(this.staff)
      //   // this.$message.success('重置成功')
      // } else {
      //   this.$message.warning('请选择一个要重置的排班医生')
      // }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/styles/_variables.scss';
.view__card {
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  background: #ffffff;
  padding: 20px;
}
.box-shadow {
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  background: #ffffff;
  ::v-deep.el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
.toppad {
  padding: 10px 30px 10px 10px;
}
.mb10 {
  margin-bottom: 10px;
}
.height100 {
  height: calc(100vh - 191px);
}
.min-height {
  height: calc(100vh - 192px);
  padding: 30px;
  padding-bottom: 0;
}
.tab {
  .btn {
    width: 104px;
    height: 60px;
    background: #f2f2f2;
    border-radius: 2px;
    color: #666;
    line-height: 60px;
    text-align: center;
    cursor: pointer;
    &.on {
      background: $--color-primary;
      color: #fff;
    }
  }
}
.departmentTitle {
  line-height: 30px;
  > div {
    font-size: 20px;
    font-weight: bold;
  }
  span {
    font-size: 14px;
    color: #666;
  }
}
.staff {
  ::v-deep.el-select .el-input {
    width: 100px;
  }
  .staffInfo {
    margin-top: 20px;
    padding: 20px 10px;
    color: #666;
    background: #f2f2f2;
    text-align: center;
    line-height: 20px;
    border-radius: 2px;
    font-size: 14px;
    cursor: pointer;
    .name {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      line-height: 28px;
    }
    &.on {
      background: $--color-primary;
      color: #fff;
      .name {
        color: #fff;
      }
    }
  }
  .staffName {
    > div {
      margin-bottom: 5px;
      font-size: 18px;
    }
    span {
      font-size: 14px;
      color: #666;
    }
  }
  .planTime {
    background: #f2f2f2;
    padding: 10px 20px;
    padding-top: 20px;
    margin-top: 15px;
    > .title {
      font-size: 14px;
      margin-bottom: 10px;
    }
    ::v-deep.el-checkbox-group {
      flex-flow: wrap;
      &::after {
        content: '';
        width: 66px;
      }
    }
    ::v-deep.el-checkbox {
      margin: 8px 24px 8px 0;
    }
    ::v-deep.el-input-group__prepend {
      padding: 0;
      .el-button {
        padding: 0;
        width: 130px;
        height: 28px;
        display: block;
        line-height: 28px;
      }
    }
    ::v-deep.el-input-group__append {
      padding: 0 8px;
    }
  }
  .timeset {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    padding: 40px 20px;
    margin-bottom: 30px;
    .time {
      font-size: 14px;
      color: #666;
      > div {
        font-size: 20px;
        color: #333;
        font-weight: bold;
        margin-bottom: 10px;
      }
    }
    &.rest {
      .time,
      div {
        color: #ccc;
      }
    }
    > span {
      color: #ccc;
      font-size: 14px;
    }
  }
  // ::v-deep .el-form-item .el-input {
  //   width: 237px;
  // }
}
</style>
