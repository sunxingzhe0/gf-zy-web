<template>
  <div class="view__card">
    <el-form ref="form" :model="formData" label-width="120px" :rules="rules">
      <BlockTitle style="margin-bottom: 15px">基本信息</BlockTitle>
      <el-row>
        <el-col :span="8">
          <el-form-item label="请选择" prop="userName">
            <el-select
              style="width: 100%"
              placeholder="请输入患者ID/就诊卡号/名称/身份证号/联系电话"
              filterable
              remote
              clearable
              :remote-method="remoteMethod"
              v-model="formData.memberId"
              :loading="optionLoading"
              @change="patientChange"
            >
              <el-option
                v-for="item in patientList"
                :key="item.memberId"
                :value="item.memberId"
                :label="item.patientName"
                >{{ item.patientName }} {{ item.phone }}</el-option
              >
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- <el-col :span="8">
          <el-form-item label="患者id" prop="activityBeginTime">
            {{ formData.patientId }}
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="就诊卡" prop="activityBeginTime">
            {{ formData.cardNo }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="患者姓名" prop="name">
            <el-input
              :disabled="formData.memberId ? true : false"
              v-model="formData.name"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="身份证号" prop="idCard">
            <el-input
              v-model="formData.idCard"
              :disabled="formData.memberId ? true : false"
              @change="idCardChange"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别" prop="sex">
            <el-select
              style="width: 100%"
              placeholder="请选择"
              disabled
              v-model="formData.sex"
            >
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="年龄" prop="age">
            <el-input
              v-model="formData.age"
              disabled
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker
              style="width: 100%"
              value-format="yyyy-MM-dd"
              format=""
              v-model="formData.birthday"
              disabled
              type="date"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="formData.phone" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
          <el-form-item label="现住址" prop="addressNow">
            <el-input
              v-model="formData.addressNow"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="类型">
            <el-radio-group v-model="formData.type" @change="typeChange">
              <el-radio label="1">补录</el-radio>
              <el-radio label="2">加号</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <BlockTitle style="margin-bottom: 15px">项目信息</BlockTitle>
      <el-row>
        <el-col :span="8">
          <el-form-item label="项目名称" prop="itemId">
            <el-select
              style="width: 100%"
              placeholder="请选择"
              filterable
              v-model="formData.itemId"
              @change="itemChange"
            >
              <el-option
                v-for="item in itemList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="formData.type == 2 ? '预约日期' : '接诊日期'"
            prop="visitDate"
          >
            <el-date-picker
              value-format="yyyy-MM-dd"
              style="width: 100%"
              v-model="formData.visitDate"
              type="date"
              :picker-options="{
                disabledDate: e => pickerDataDisable(e),
              }"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="formData.type == 2 ? '预约开始时间' : '接诊时间'"
            prop="acceptTime"
          >
            <el-time-picker
              style="width: 100%"
              v-model="formData.acceptTime"
              format="HH:mm"
              value-format="HH:mm"
              @change="pickerChange"
              placeholder="请选择"
            >
            </el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            :label="formData.type == 2 ? '预约结束时间' : '结束时间'"
            prop="endTime"
          >
            <el-time-picker
              style="width: 100%"
              v-model="formData.endTime"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="请选择"
            >
            </el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="接诊医生" prop="docId">
            <el-cascader
              :disabled="!this.$route.query.all"
              placeholder="请选择"
              :options="docList"
              filterable
              clearable
              :show-all-levels="false"
              v-model="formData.docId"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="咨询室" prop="roomId">
            <!-- <el-input v-model="formData.roomId" placeholder="请输入">
            </el-input> -->
            <el-select
              style="width: 100%"
              v-model="formData.roomId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in roomList"
                :value="item.id"
                :label="item.name"
                :disabled="!item.status"
                :key="item.id"
                >{{ item.name }}</el-option
              >
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="价格"> {{ formData.price }} 元 </el-form-item>
        </el-col>
      </el-row>
      <BlockTitle v-if="formData.type == 1" style="margin-bottom: 15px"
        >录入内容
        <el-button style="margin-left: 20px" type="text" @click="addContent"
          >+添加</el-button
        >
      </BlockTitle>
      <div class="codeWrap" v-if="formData.type == 1">
        <el-timeline class="timeLine">
          <el-timeline-item
            v-for="(item, index) in formData.inputList"
            :key="index"
            timestamp=""
            placement="top"
          >
            <div class="content-wrap">
              <div class="creatInfo" v-if="index > 0">
                <div>
                  <i
                    class="el-icon-delete"
                    @click="delCode(index)"
                    style="color: #f74a4a"
                  ></i>
                </div>
              </div>
              <el-form-item
                label-width="0"
                :key="'1' + '_' + index"
                :rules="{
                  required: true,
                  message: '请填写内容',
                  trigger: 'blur',
                }"
                :prop="'inputList[' + index + '].content'"
              >
                <el-input type="textarea" v-model="item.content"></el-input>
              </el-form-item>
              <el-form-item
                label-width="0"
                :key="'2' + '_' + index"
                :prop="'inputList[' + index + '].imgIds'"
                :rules="{
                  required: false,
                }"
              >
                <div class="imgList">
                  <div class="imgItem" v-for="t in item.imgIds" :key="t">
                    <el-image
                      style="width: 100px; height: 100px"
                      :src="FILE_URL(t)"
                    >
                    </el-image>
                    <i class="el-icon-error" @click="imgDel(index, t)"></i>
                  </div>

                  <el-upload
                    action=""
                    v-if="item.imgIds.length < 6"
                    :show-file-list="false"
                    :on-success="res => imgSuccess(res, index)"
                    :before-upload="beforeUpdate"
                    :http-request="httpRequest"
                    accept="image/png, image/jpeg, image/gif, image/webp"
                  >
                    <div class="uploader">
                      <i class="el-icon-plus"></i>
                      <div>添加</div>
                    </div>
                  </el-upload>
                </div>
              </el-form-item>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
      <div class="btns">
        <el-button @click="backPage">返回</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { BlockTitle } from '@/components/Base'
import { uploadFile } from '@/api'
import apiXzPatient from '@/api/mindConsult/appointmentPatient'
import apiProjectSet from '@/api/mindConsult/projectSet'
import { analyzeIDCard, isIDNumber } from '@/utils/validate'
import { consulRoomList } from '@/api/mindConsult/consultRoom'
import dayjs from 'dayjs'

export default {
  components: { BlockTitle },
  data() {
    let isCord = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('身份证号不能为空！'))
      } else if (!isIDNumber(value)) {
        return callback(new Error('身份证格式有误！'))
      } else {
        callback()
      }
    }
    return {
      patientList: [],
      docList: [],
      optionLoading: false,
      itemList: [],
      roomList: [],
      formData: {
        name: '',
        patientId: '',
        memberId: '',
        carNo: '',
        sex: '',
        age: '',
        phone: '',
        idCard: '',
        birthday: '',
        type: this.$route.query.type,
        itemId: '',
        itemName: '',
        acceptTime: '',
        endTime: '',
        docId: '',
        roomId: '',
        visitDate: '',
        price: '',
        inputList: [
          {
            content: '',
            imgIds: [],
            dept: '',
            createUser: '',
          },
        ],
      },
      rules: {
        name: [{ required: true, message: '请输入患者姓名', trigger: 'blur' }],
        idCard: [
          {
            required: true,
            message: '请输入身份证号',
            trigger: 'blur',
            validator: isCord,
          },
        ],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        age: [{ required: true, message: '请输入年龄', trigger: 'change' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],

        birthday: [
          { required: true, message: '请选择出生日期', trigger: 'blur' },
        ],
        itemId: [{ required: true, message: '请选择项目', trigger: 'blur' }],
        visitDate: [
          { required: true, message: '请选择接诊日期', trigger: 'blur' },
        ],
        acceptTime: [
          { required: true, message: '请选择接诊时间', trigger: 'blur' },
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'change' },
        ],
        docId: [{ required: true, message: '请选择接诊医生', trigger: 'blur' }],
        roomId: [{ required: true, message: '请选择咨询室', trigger: 'blur' }],
      },
      itemPrice: '',
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user
    },
  },
  created() {
    console.log(this.userInfo)
    if (!this.$route.query.all) {
      this.formData.docId = [this.userInfo.dept.id, this.userInfo.userId]
      this.formData.deptId = this.userInfo.dept.id
      this.formData.deptName = this.userInfo.dept.name
    }
    this.getDoctor()
    this.getItem()
    this.getconsulRoomList()
  },
  methods: {
    idCardChange(e) {
      console.log(e)
      let info = analyzeIDCard(e)
      this.formData.birthday = info.birthday || ''
      this.formData.sex = info.sex || ''
      this.formData.age = (info.age || '') + '岁'
    },
    pickerDataDisable(time) {
      return this.formData.type == 1
        ? !dayjs(time).isBefore(dayjs(), 'day')
        : false
    },
    pickerChange(e) {
      console.log(this.formData.visitDate + ' ' + e + ':00')
      if (this.formData.itemId) {
        this.formData.endTime = dayjs(this.formData.visitDate + ' ' + e + ':00')
          .add(
            this.itemList.find(item => item.id == this.formData.itemId)
              .duration,
            'minute',
          )
          .format('HH:mm')
      }
    },
    typeChange() {
      this.formData.visitDate = null
    },
    async getDoctor() {
      let res = await apiXzPatient.getSelectDocList()
      console.log(res)
      this.docList = res
        .filter(item => item.userVOList.length > 0)
        .map(item => {
          return {
            label: item.deptName,
            value: item.deptId,
            children: item.userVOList.map(s => {
              return {
                ...s,
                label: s.name + ' | ' + (s.title || ''),
                value: s.id,
              }
            }),
          }
        })
    },
    patientChange(e) {
      console.log(e)
      let info = this.patientList.find(item => item.memberId == e)
      this.formData.name = info?.patientName || ''
      this.formData.sex = info?.gender || ''
      this.formData.age = info?.age || ''
      this.formData.phone = info?.phone || ''
      this.formData.idCard = info?.idCard || ''
      this.formData.birthday = info?.birthday || ''
      this.formData.patientId = info?.patientId || ''
      this.formData.memberId = info?.memberId || ''
      this.formData.cardNo = info?.cardNo || ''
    },
    itemChange(e) {
      this.formData.price = this.itemList.find(item => item.id == e).price
      if (this.formData.acceptTime) {
        this.formData.endTime = dayjs(
          this.formData.visitDate + ' ' + this.formData.acceptTime + ':00',
        )
          .add(this.itemList.find(item => item.id == e).duration, 'minute')
          .format('HH:mm')
      }
    },
    async remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        try {
          let res = await apiXzPatient.getPatientByKeyword({ keyWord: query })
          this.patientList = res
          this.optionLoading = false
        } catch (error) {
          this.patientList = []
          this.optionLoading = false
        }
      } else {
        this.patientList = []
      }
    },
    //获取项目
    async getItem() {
      let res = await apiProjectSet.itemList({ pageSize: 99999, currentNum: 1 })
      this.itemList = res.list
    },
    //咨询室
    async getconsulRoomList() {
      let res = await consulRoomList({
        currentNum: 1,
        pageSize: 9999999,
        type: '预约',
      })
      this.roomList = res.list
    },
    //上传成功
    imgSuccess(res, index) {
      this.formData.inputList[index].imgIds = [
        ...this.formData.inputList[index].imgIds,
        res,
      ]
      console.log(this.formData.inputList[index].imgIds)
    },

    //上传验证
    beforeUpdate(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isBMP = file.type === 'image/bmp'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG && !isGIF && !isBMP) {
        this.$message.error('上传图片只能是 JPG PNG GIF BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG || isGIF || isBMP) && isLt2M
    },
    // 上传图片
    httpRequest({ file, onProgress, onSuccess, onError }) {
      const formData = new FormData()
      formData.append('file', file)
      uploadFile(formData, onProgress).then(onSuccess).catch(onError)
    },
    addContent() {
      this.formData.inputList = [
        { content: '', imgIds: [] },
        ...this.formData.inputList,
      ]
    },
    imgDel(index, id) {
      let list = this.formData.inputList[index].imgIds
      if (list.indexOf(id) > -1) {
        list.splice(list.indexOf(id), 1)
      }
    },
    delCode(index) {
      this.formData.inputList.splice(index, 1)
    },
    backPage() {
      this.$router.back()
    },
    //提交
    async submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        console.log(this.formData)
        let data = { ...this.formData }
        data.inputList = this.formData.inputList.map(item => {
          return {
            content: item.content,
            createUser: this.userInfo.name,
            dept: this.userInfo.dept.name,
            picIds: item.imgIds.join(','),
          }
        })
        data.deptId = this.formData.docId[0]
        // if(this.$route.query.all){

        // }
        data.deptName = this.docList.find(
          item => item.value == this.formData.docId[0],
        ).label
        data.docName = this.docList
          .find(item => item.value == this.formData.docId[0])
          .children.find(item => item.value == this.formData.docId[1]).name
        data.docId = this.formData.docId[1]
        data.itemName = this.itemList.find(item => item.id == data.itemId).name
        await apiXzPatient.collectionInfo(data)
        this.$message.success('提交成功！')
        this.$router.back()
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.imgList {
  display: flex;
  > div {
    margin-right: 15px;
  }
  .imgItem {
    width: 100px;
    height: 100px;
    position: relative;
    > i {
      color: red;
      position: absolute;
      right: -10px;
      top: -10px;
      font-size: 20px;
    }
  }
}
.uploader {
  width: 100px;
  height: 100px;
  border: 1px dashed #ccc;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #666;
  i {
    font-size: 28px;
    margin-bottom: 10px;
  }
}
.codeWrap {
  padding-left: 60px;
  .timeLine {
    margin-top: 20px;
  }
}
.btns {
  display: flex;
  justify-content: center;
}
.codeWrap {
  padding-left: 10px;
  .timeLine {
    margin-top: 20px;
    padding-left: 100px;
    .content-wrap {
      min-height: 90px;
      position: relative;
      .creatInfo {
        /* position: absolute; */
        /* width: 140px; */
        /* text-align: right; */
        top: 0;
        left: -180px;
        color: #666;
        margin-bottom: 15px;
        > div {
          margin-bottom: 10px;
        }
        i {
          font-size: 18px;
          /* margin-left: 10px; */
        }
      }
    }
  }
}
</style>
