<template>
  <el-dialog
    :title="data ? '编辑模板' : '新增模板'"
    :visible.sync="innerVisible"
    :close-on-click-modal="false"
    width="960px"
    @close="close()"
  >
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="90px">
      <div class="msg-top" v-if="data">
        温馨提示：午别时分变更会导致已有的排班内容丢失。
      </div>
      <el-form-item label="模板名称" prop="name">
        <el-input
          type="text"
          placeholder="请输入"
          v-model="form.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="午别" prop="periodList">
        <el-table
          class="type-table"
          :data="form.periodList"
          border
          style="width: 100%"
        >
          <el-table-column prop="name" label="午别名称" width="180">
            <template slot-scope="{ row }">
              <el-input v-model="row.name" placeholder="请输入"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="开始时间">
            <template slot-scope="{ row }">
              <el-time-picker
                style="width: 100%"
                v-model="row.startTime"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="请选择"
              >
              </el-time-picker>
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="结束时间">
            <template slot-scope="{ row }">
              <el-time-picker
                style="width: 100%"
                v-model="row.endTime"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="请选择"
              >
              </el-time-picker>
            </template>
          </el-table-column>
          <el-table-column prop="amount1" label="操作" width="60">
            <template slot-scope="{ $index }">
              <el-button
                type="text"
                style="color: #f74a4a"
                @click="delTime($index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="addBtn">
          <el-button type="text" @click="addTime">添加</el-button>
        </div>
      </el-form-item>
      <el-form-item label="排班对象" prop="deptUserList">
        <el-input
          type="text"
          placeholder="关键字查找科室"
          v-model="keywords"
          @input="getDeptList"
        ></el-input>
        <div class="project-main">
          <div class="main-left">
            <div class="title">待选科室</div>
            <el-scrollbar>
              <div>
                <el-checkbox
                  v-model="allDept"
                  title="全选"
                  @change="$event => changeAll($event, 'x')"
                >
                  <span>全选</span>
                </el-checkbox>
              </div>
              <div v-for="item in deptList" :key="item.key">
                <el-checkbox
                  v-model="item.checked"
                  :title="item.showName"
                  :disabled="item.disabled"
                >
                  <span>{{ item.showName }}</span>
                </el-checkbox>
              </div>
            </el-scrollbar>
          </div>
          <div class="main-center">
            <el-button
              :disabled="disAddbtn"
              type="default"
              class="addbtn"
              plain
              @click="addData"
              >添加 <i class="el-icon-arrow-right"></i
            ></el-button>
            <el-button
              :disabled="disRemovebtn"
              type="default"
              class="delbtn"
              plain
              @click="delData"
            >
              <i class="el-icon-arrow-left"></i>
              删除
            </el-button>
          </div>
          <div class="main-right">
            <div class="title">已选科室</div>
            <el-scrollbar>
              <div>
                <el-checkbox
                  v-model="allchecked"
                  title="全选"
                  @change="$event => changeAll($event, 'y')"
                >
                  <span>全选</span>
                </el-checkbox>
              </div>
              <div
                v-for="item in showCheckDept"
                :class="{ infochecked: activeDept === item.key }"
                :key="item.key"
                @click="changeDept(item)"
              >
                <el-checkbox
                  v-model="item.checked"
                  :title="item.showName"
                  :disabled="item.disabled"
                >
                  <span>{{ item.showName }}</span>
                </el-checkbox>
              </div>
            </el-scrollbar>
          </div>
          <div class="main-right doctor-list">
            <div class="title">科室医生</div>
            <el-scrollbar>
              <div class="list-item" v-for="item in docList" :key="item.key">
                <el-checkbox
                  v-model="item.checked"
                  :title="item.name"
                  :disabled="item.disabled"
                  @change="docChange($event, item)"
                >
                  <span>{{ item.name }}</span>
                </el-checkbox>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer is-center">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { deptXzChooseList } from '@/api/index'
import apiScheduleTemplate from '@/api/mindConsult/scheduleTemplate'
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    data: {
      type: String,
    },
  },
  data() {
    let validateDept = (rule, value, callback) => {
      let list = this.showCheckDept.filter(item => item.userList.length > 0)
      console.log(list)
      if (this.showCheckDept.length === 0 || list.length === 0) {
        callback(new Error('科室/医生不能为空!'))
      } else {
        callback()
      }
    }
    return {
      oldPeriodList: [], //原午别数据
      keywords: '',
      activeDept: '',
      deptList: [],
      showCheckDept: [],
      docList: [],
      allchecked: false, //已选科室全选
      allDept: false, //待选科室全选
      disAddbtn: false,
      disRemovebtn: false,
      form: {
        id: '',
        name: '',
        periodList: [
          {
            name: '',
            startTime: '',
            endTime: '',
          },
        ],
        deptUserList: [],
      },
      rules: {
        name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        periodList: [
          { required: true, message: '请设置午别', trigger: 'blur' },
        ],
        deptUserList: [
          {
            required: true,
            validator: validateDept,
            message: '请选择科室医生',
            trigger: 'blur',
          },
        ],
      },
      selectableRange: [],
    }
  },
  computed: {
    innerVisible: {
      get: function () {
        return this.show
      },
      set: function (val) {
        console.log(val)
        this.$emit('onClose')
      },
    },
    deptIndex() {
      let index = 0
      this.showCheckDept.forEach((item, t) => {
        if (item.key === this.activeDept) {
          index = t
        }
      })
      return index
    },
  },
  watch: {
    deptList: {
      handler(newVal) {
        if (newVal.length > 0) {
          newVal.filter(item => {
            if (item.checked) {
              this.disAddbtn = false
            }
          })
        }
      },
      deep: true,
    },
    showCheckDept: {
      handler(newVal) {
        newVal.filter(item => {
          if (item.checked) {
            this.disRemovebtn = false
          }
        })
      },
      deep: true,
    },
    tableData() {
      this.getNewTypes()
    },
    async show() {
      if (this.show) {
        this.keywords = ''
        this.activeDept = ''
        this.deptList = []
        this.showCheckDept = []
        this.docList = []
        await this.getDeptList()
        if (this.data) {
          this.getTemplate()
        }
      }
    },
  },
  created() {},
  methods: {
    getTimeRepeat(dateAr) {
      for (let k in dateAr) {
        if (!this.isTimeRepeat(k, dateAr)) {
          return false
        }
      }
      return true
    },
    isTimeRepeat(idx, dateAr) {
      for (let k in dateAr) {
        if (idx !== k) {
          if (
            dateAr[k].startTime <= dateAr[idx].startTime &&
            dateAr[k].endTime > dateAr[idx].startTime
          ) {
            return false
          }
          if (
            dateAr[k].startTime < dateAr[idx].endTime &&
            dateAr[k].endTime >= dateAr[idx].endTime
          ) {
            return false
          }
        }
      }
      return true
    },
    timeRepeat(index, name) {
      console.log(index)
      if (!this.getTimeRepeat(this.form.periodList)) {
        this.$message.error('时间有重叠，请重新选择')
        this.form.periodList[index][name] = ''
      }
    },
    timeChange(e, row, type) {
      console.log(e)
      this.$set(row, type === 'start' ? 'startTime' : 'endTime', e)
    },
    addTime() {
      this.form.periodList = [
        ...this.form.periodList,
        {
          name: '',
          startTime: '',
          endTime: '',
        },
      ]
    },
    delTime(index) {
      console.log(index)
      this.form.periodList.splice(index, 1)
    },
    async addData() {
      this.disAddbtn = true
      let list = []
      this.deptList.forEach(async e => {
        if (e.checked) {
          let res = await apiScheduleTemplate.accountChooseList({
            deptId: e.key,
          })
          let list = res.map(item => {
            return {
              ...item,
              key: item.id,
              checked: true,
            }
          })
          this.showCheckDept.push({ ...e, userList: list })
          if (!this.activeDept && this.showCheckDept.length > 0) {
            this.activeDept = this.showCheckDept[0].key
            await this.getDocList(this.showCheckDept[0].key)
          }
        } else {
          list.push(e)
        }
      })
      this.deptList = list
      this.allDept = false
    },
    delData() {
      this.disRemovebtn = true
      this.showCheckDept = this.showCheckDept.filter(item => {
        if (item.checked) {
          item.checked = false
          item.disabled = false
          if (item.key === this.activeDept) {
            this.docList = []
            this.activeDept = ''
          }
          this.deptList.unshift(item)
        } else {
          return item
        }
      })
      this.allchecked = false
    },
    changeAll(e, type) {
      console.log(e)
      if (type === 'y') {
        this.showCheckDept = this.showCheckDept.map(item => {
          return {
            ...item,
            checked: e,
          }
        })
      } else {
        this.deptList = this.deptList.map(item => {
          return {
            ...item,
            checked: e,
          }
        })
      }
    },
    docChange(e, row) {
      this.showCheckDept.forEach(item => {
        if (this.activeDept == item.key) {
          item.userList.forEach(s => {
            if (s.key == row.key) {
              s.checked = e
            }
          })
        }
      })
    },
    async changeDept(item) {
      this.activeDept = item.key
      await this.getDocList(
        item.key,
        item.userList.filter(s => s.checked).map(s => s.key),
      )
      this.$set(item, 'userList', this.docList)
    },
    close(data) {
      this.selectableRange = []
      this.allchecked = false
      this.allDept = false
      this.$refs.ruleForm.resetFields()
      this.$emit('onClose', data)
    },
    async getDeptList() {
      let res = await deptXzChooseList()
      let list = res
        .map(item => {
          return {
            ...item,
            key: item.id,
            checked: false,
            userList: [],
          }
        })
        .filter(t => this.showCheckDept.map(s => s.key).indexOf(t.key) === -1)
      this.deptList = this.fuzzyQuery(list)
    },
    async getDocList(deptId, checkedList) {
      let res = await apiScheduleTemplate.accountChooseList({ deptId })
      let list = res.map(item => {
        return {
          ...item,
          key: item.id,
          checked:
            checkedList && checkedList.length > 0
              ? checkedList.indexOf(item.id) > -1
                ? true
                : false
              : true,
        }
      })
      this.docList = list
    },
    async getTemplate() {
      let res = await apiScheduleTemplate.getTemplate(this.data)
      this.oldPeriodList = JSON.parse(JSON.stringify(res.periodList)) //编辑状态下原午别数据
      this.form.id = res.id
      this.form.name = res.name
      this.form.periodList = res.periodList
      this.deptList = this.deptList.filter(item => {
        if (res.deptUserList.map(t => t.deptId).indexOf(item.key) > -1) {
          item.checked = false
          item.userList = res.deptUserList
            .find(s => s.deptId === item.key)
            .userList.map(x => {
              return {
                key: x.userId,
                name: x.userName,
                titleName: x.titleName,
                checked: true,
              }
            })
          this.showCheckDept.push(item)
        } else {
          return item
        }
      })
      this.activeDept = this.showCheckDept[0].key
      await this.getDocList(
        this.showCheckDept[0].key,
        this.showCheckDept[0].userList.map(s => s.key),
      )
      this.$set(this.showCheckDept[0], 'userList', this.docList)
    },
    fuzzyQuery(list) {
      if (this.keywords != '') {
        var reg = new RegExp(this.keywords)
        var arr = []
        for (var i = 0; i < list.length; i++) {
          if (reg.test(list[i].showName)) {
            arr.push(list[i])
          }
        }
        return arr
      } else {
        return list
      }
    },
    //清除所有午别id ，并还原未编辑过时段的午别id
    clearAndAddId() {
      let listData = this.form.periodList.map(v => {
        return {
          name: v.name,
          startTime: v.startTime,
          endTime: v.endTime,
        }
      })

      listData.forEach(v => {
        for (let it of this.oldPeriodList) {
          //新午别与原午别时段相同，还原原午别id
          if (v.startTime + v.endTime === it.startTime + it.endTime) {
            v.id = it.id
            v.scheduleId = it.scheduleId
            v.sort = it.sort
          }
        }
      })
      return listData
    },
    //获取午别id数量
    getTotalIdNum(list) {
      return list.reduce((pre, next) => {
        if (next.id) {
          pre += 1
        }
        return pre
      }, 0)
    },
    submit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          if (!this.getTimeRepeat(this.form.periodList)) {
            this.$message.error('午别时间有重叠，请重新调整')
            return false
          }
          if (!this.data) {
            await apiScheduleTemplate.addTemplate({
              ...this.form,
              deptUserList: this.showCheckDept.map(item => {
                return {
                  deptId: item.key,
                  userList: item.userList
                    .filter(s => s.checked)
                    .map(t => t.key),
                }
              }),
            })
          } else {
            //清除所有午别id ，并还原未编辑过时段的午别id
            const newPeriodList = this.clearAndAddId()
            const params = {
              ...this.form,
              deptUserList: this.showCheckDept.map(item => {
                return {
                  deptId: item.key,
                  userList: item.userList
                    .filter(s => s.checked)
                    .map(t => t.key),
                }
              }),
              periodList: newPeriodList,
            }
            console.log(params, '参数')
            //判断是否更改过已有午别（原午别id数量===现午别id数量）
            const newIdNum = this.getTotalIdNum(newPeriodList)
            if (newIdNum != this.oldPeriodList.length) {
              const confirm = await this.$confirm(
                '午别时分出现变更，将会导致对应午别的排版内容丢失，是否确认保存？',
                '提示',
                {
                  type: 'warning',
                },
              )
              if (confirm !== 'confirm') return
              await apiScheduleTemplate.editTemplate(params)
            } else {
              await apiScheduleTemplate.editTemplate(params)
            }
          }
          this.close(true)
          this.$message.success('操作成功!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~@/styles/_variables.scss';
.type-table {
  line-height: initial;
}
.addBtn {
  border: 1px solid #dfe6ec;
  text-align: center;
  border-top: 0;
}
.project-main {
  display: flex;
  justify-content: center;
  margin-top: 10px;

  .main-left,
  .main-right {
    width: 28%;
    /* height: 200px; */
    background: #f7f7f7;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    .el-scrollbar {
      width: 100%;
      height: 200px;
      ::v-deep .el-scrollbar__wrap {
        overflow-x: hidden !important;
      }
      ::v-deep .el-scrollbar__view {
        width: 100%;
      }
    }
    div {
      width: 100%;
      height: 36px;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 36px;
      cursor: pointer;
      span:nth-of-type(1) {
        /* margin-left: 10px; */
        margin-right: 14px;
      }
      .isshow {
        color: #fff;
      }
    }
    .title {
      font-size: 14px;
      font-weight: bold;
      border-bottom: 1px solid #ccc;
      margin: 0 10px;
      width: auto;
    }
    .infochecked {
      background: rgba(10, 178, 193, 0.2);
      color: $--color-primary;
    }
    .removecheck {
      background: rgba(247, 74, 74, 0.2);
      ::v-deep .el-checkbox__label {
        color: #f74a4a;
      }
    }
    ::v-deep .el-checkbox__label {
      font-size: 16px;
    }
    .dis {
      color: #a2a2a2;
    }
  }
  .main-center {
    width: 115px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;
    .el-button {
      padding: 8px 0px;
      text-align: center;
      border-radius: 2px;
    }
    .addbtn {
      margin-bottom: 20px;
      border-color: $--color-primary;
      color: $--color-primary;
    }
    .delbtn {
      margin-left: 0px;
      border: 1px solid#CCCCCC;
      color: red;
    }
  }
  .doctor-list {
    background: #ededed;
    width: 48%;
    .list-item {
      width: 33.333%;
      float: left;
    }
  }
  .el-checkbox {
    width: 100%;
    display: flex;
    align-items: center;
    height: 100%;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
  }
  .el-form-item__label {
    font-size: 16px;
  }
  ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #fff;
    border-color: #0ab2c1;
    &::after {
      border-color: #0ab2c1;
      left: 5px;
      top: 2px;
    }
  }
  ::v-deep .el-checkbox__input {
    margin-left: 10px;
    .el-checkbox__inner {
      width: 16px;
      height: 16px;
    }
  }
  ::v-deep .el-checkbox__label {
    width: calc(100% - 32px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .removecheck {
    ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #fff;
      border-color: #f74a4a;
      &::after {
        border-color: #f74a4a;
        left: 5px;
        top: 2px;
      }
    }
  }
  /* .main-right {
    ::v-deep .el-checkbox__inner:hover {
      border-color: #f74a4a;
    }
  } */
}
.msg-top {
  color: #f74a4a;
  text-align: center;
  margin-bottom: 15px;
}
</style>
