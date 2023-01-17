<template>
  <div class="view__card" style="padding: 15px">
    <List
      v-model="query"
      :filter="filter"
      :columns="columns"
      :tableData="tableData"
    >
      <template v-slot:slot_gh="{ row }">
        <el-switch
          v-model="row.gh"
          @change="stateChange(row, $event, 'GH')"
          active-text="启用"
          active-value="GH"
          :inactive-value="false"
          inactive-text="禁用"
          :width="50"
          class="textSwitch"
        ></el-switch>
      </template>
      <template v-slot:slot_lydh="{ row }">
        <el-switch
          v-model="row.lydh"
          @change="stateChange(row, $event, 'LYDH')"
          active-text="启用"
          inactive-text="禁用"
          active-value="LYDH"
          :inactive-value="false"
          :width="50"
          class="textSwitch"
        ></el-switch>
      </template>
      <template v-slot:slot_ldb="{ row }">
        <el-switch
          v-model="row.ldb"
          @change="stateChange(row, $event, 'LDB')"
          active-text="启用"
          inactive-text="禁用"
          :inactive-value="false"
          active-value="LDB"
          nactive-value="0"
          :width="50"
          class="textSwitch"
        ></el-switch>
      </template>
      <template v-slot:fixed="{ row }">
        <el-button type="text" @click="editHosp(row)">编辑</el-button>
      </template>
      <template v-slot:footertool>
        <el-button plain type="primary" @click="produceCode"
          >生成流调表二维码</el-button
        >
      </template>
    </List>
    <!-- 123 -->
    <el-dialog
      :visible="dialogData.visible"
      :title="dialogData.title"
      append-to-body
      custom-class="component__dialog"
      :before-close="
        () => ((this.dialogData.visible = false), (this.dialogData.title = ''))
      "
    >
      <!-- form -->
      <el-form
        v-if="!dialogData.title"
        :model="dialogData.formData"
        :rules="dialogData.rules"
        label-width="100px"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            placeholder="请输入"
            v-model="dialogData.formData.hospName"
          ></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="province">
          <el-cascader
            :options="options"
            class="input"
            style="margin-right: 10px"
            v-model="selectedOptions"
            @change="addressChange"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="addrDetail">
          <el-input
            placeholder="请输入"
            v-model="dialogData.formData.addrDetail"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input
            placeholder="请输入"
            v-model="dialogData.formData.telNo"
          ></el-input>
        </el-form-item>
        <el-form-item label="定位" prop="latitude">
          <div style="display: flex">
            <el-input
              placeholder="请输入经度"
              v-model="dialogData.formData.longitude"
            ></el-input>
            <span>，</span>
            <el-input
              placeholder="请输入维度"
              v-model="dialogData.formData.latitude"
            ></el-input>
          </div>
          <div style="color:red;font-size12px">*示例：100.126893,98.354125</div>
        </el-form-item>
        <el-form-item label="管理手机号" prop="sendPhone">
          <div>
            <el-input
              placeholder="请输入"
              v-model="dialogData.formData.sendPhone"
            ></el-input>
          </div>
          <div style="color:red;font-size12px">
            *用于该院区流调表异常时通知短信的发送对象，可添加多个
          </div>
        </el-form-item>
        <!--  -->
        <div style="display: flex">
          <el-form-item
            :label="val.lable"
            v-for="(val, i) in switchStatus"
            :key="i"
          >
            <el-switch
              v-model="val.state"
              :active-value="true"
              :inactive-value="false"
            ></el-switch>
          </el-form-item>
        </div>
      </el-form>
      <!-- list -->
      <div v-else>
        <el-table :data="imgsData" style="width: 100%">
          <el-table-column prop="size" label="二维码边长(cm)" width="180">
          </el-table-column>
          <el-table-column prop="distance" label="建议扫描距离(米)" width="180">
          </el-table-column>
          <el-table-column prop="dUrl" label="下载链接" width="180">
            <template slot-scope="scope">
              <a
                :href="
                  scope.row.dUrl == 0
                    ? FILE_URL_IMG_NAME('mini_qr_280px.jpg')
                    : scope.row.dUrl == 1
                    ? FILE_URL_IMG_NAME('mini_qr_560px.jpg')
                    : scope.row.dUrl == 2
                    ? FILE_URL_IMG_NAME('mini_qr_840px.jpg')
                    : scope.row.dUrl == 3
                    ? FILE_URL_IMG_NAME('mini_qr_1120px.jpg')
                    : ''
                "
              >
                <img
                  style="width: 26px; height: 26px"
                  :src="require('@/assets/down-icon.png')"
                  alt=""
                />
              </a>
            </template>
          </el-table-column>
        </el-table>
        <div style="color: #ccc; margin-top: 10px">
          二维码尺寸请按照43像素的整数倍缩放，以保持最佳效果
        </div>
      </div>

      <template v-slot:footer v-if="!dialogData.title">
        <div class="is-center">
          <el-button @click="dialogData.visible = false">取消</el-button>
          <el-button type="primary" @click="handleSumit">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import { getHospList, editHospInfo, editHospType } from '@/api/hospList'
import { List, mixin } from '@/components'
export default {
  components: {
    List,
  },
  mixins: [mixin([{ fetchListFunction: getHospList }])],
  data() {
    return {
      imgsData: [
        {
          size: '2.5cm',
          distance: '0.4m',
          dUrl: 0,
        },
        {
          size: '5cm',
          distance: '0.8m',
          dUrl: 1,
        },
        {
          size: '7.5cm',
          distance: '1m',
          dUrl: 2,
        },
        {
          size: '10cm',
          distance: '1.2m',
          dUrl: 3,
        },
      ],
      options: regionData,
      switchStatus: [
        {
          state: true,
          text: 'gh',
          value: 'GH',
          lable: '预约挂号',
        },
        {
          state: true,
          text: 'ldb',
          value: 'LDB',
          lable: '流调表',
        },
        {
          state: true,
          text: 'lydh',
          value: 'LYDH',
          lable: '来院导航',
        },
      ],
      selectedOptions: [],
      dialogData: {
        visible: false,
        title: '',
        formData: {},
        rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          province: [
            { required: true, message: '请选择地址', trigger: 'change' },
          ],
          addrDetail: [
            { required: true, message: '请输入详细地址', trigger: 'blur' },
          ],
          // telNo: [{ required: true, message: '请输入电话', trigger: 'blur' }],
          latitude: [
            { required: true, message: '请输入定位', trigger: 'blur' },
          ],
          sendPhone: [
            { required: true, message: '请输入管理手机号', trigger: 'blur' },
          ],
        },
      },
      query: {
        pageSize: 10,
        currentNum: 1,
      },
      filter: {},
      columns: {
        index: {
          hidden: true,
        },
        drugStoreState: {
          label: '状态',
          prop: 'slot_drugStoreState',
          minWidth: 100,
        },
        gh: {
          prop: 'slot_gh',
        },
        lydh: {
          prop: 'slot_lydh',
        },
        ldb: {
          prop: 'slot_ldb',
        },
      },
    }
  },
  methods: {
    dowmLoadImg(row) {
      console.log(row)
    },
    //编辑保存
    async handleSumit() {
      const hospType = this.switchStatus
        .filter(item => item.state)
        .map(v => v.value)
        .join(',')
      if (!this.dialogData.formData.telNo) delete this.dialogData.formData.telNo
      this.dialogData.formData.hospType = hospType
      console.log(this.dialogData.formData, '提交参数--')
      await editHospInfo(this.dialogData.formData)
      this.$message.success('编辑成功！')
      this.$_fetchTableData()
      this.dialogData.visible = false
    },
    //编辑
    editHosp(row) {
      this.dialogData.visible = true
      this.dialogData.formData = row
      console.log(row, '当前行===')
      //状态赋值
      this.switchStatus.forEach(item => {
        item.state = row[item.text] ? true : false
      })
      //地址赋值
      let arr = []
      if (row.province) {
        arr.push(TextToCode[row.province]?.code)
        arr.push(TextToCode[row.province][row?.city]?.code)
        arr.push(TextToCode[row.province][row?.city][row?.area]?.code)
      }
      this.selectedOptions = arr
    },
    produceCode() {
      this.dialogData.visible = true
      this.dialogData.title = '流调表二维码'
    },
    //状态变更
    async stateChange({ id }, e, hospType) {
      console.log(e)
      await editHospType({
        id,
        add: !e ? false : true,
        hospType,
      })
      this.$message.success('操作成功！')
      this.$_fetchTableData()
    },
    //
    addressChange(e) {
      console.log(e)
      let province = CodeToText[e[0]]
      let city = CodeToText[e[1]]
      let area = CodeToText[e[2]]
      if (province !== undefined) {
        this.visible.formData.province = province
      }
      if (city !== undefined) {
        this.visible.formData.city = city
      }
      if (area !== undefined) {
        this.visible.formData.area = area
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.c__list > .el-table {
  margin-top: 0;
}
.el-form-item__content {
  flex: 1;
}
::v-deep .el-input--medium .el-input__inner {
  max-width: 300px;
}
::v-deep .el-cascader .el-input .el-input__inner {
  width: 300px;
}
.c__list .table-header .cell {
  line-height: 23px !important;
}
</style>
