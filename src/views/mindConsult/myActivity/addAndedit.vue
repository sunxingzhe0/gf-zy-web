<template>
  <div class="view__card">
    <el-form ref="form" :model="formData" label-width="140px" :rules="rules">
      <BlockTitle style="margin-bottom: 15px">基本信息</BlockTitle>
      <el-row>
        <el-col :span="24">
          <el-form-item label="活动名称：" prop="activityName">
            <el-input
              placeholder="例如：李医生的团体咨询  最少5个字，最多30个字"
              class="input-with-select"
              v-model="formData.activityName"
              maxlength="30"
            >
              <el-select
                style="width: 100%"
                slot="prepend"
                placeholder="请选择"
                v-model="formData.activityType"
                @change="activityTypeChange"
              >
                <el-option label="团体活动" value="团体活动"></el-option>
                <el-option label="团体督导" value="团体督导"></el-option>
                <el-option label="团体治疗" value="团体治疗"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="活动开始时间：" prop="activityBeginTime">
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="formData.activityBeginTime"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="活动结束规则：" prop="activityRule">
            <el-radio-group v-model="formData.activityRule">
              <el-radio label="2">活动名额满 </el-radio>
              <el-radio label="1">截止活动结束时间 </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="formData.activityRule == 1">
          <el-form-item prop="activityEndTime" label="活动结束时间：">
            <el-date-picker
              value-format="yyyy-MM-dd hh:mm:ss"
              v-model="formData.activityEndTime"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-else>
          <el-form-item label="活动名额：" prop="activityQuota">
            <el-input v-model="formData.activityQuota" placeholder="请输入">
              <template slot="append">人</template>
            </el-input>
          </el-form-item>
        </el-col>
        <template v-for="(s, index) in formData.itemFeeList">
          <el-col :span="8" :key="'1' + index">
            <el-form-item
              :label="
                index == 0
                  ? formData.activityType == '团体治疗'
                    ? '收费项目一'
                    : '收费项目'
                  : '收费项目二'
              "
              :prop="'itemFeeList[' + index + '].itemId'"
              :rules="{
                required: true,
                message: '请选择收费项目',
                trigger: 'blur',
              }"
            >
              <el-input
                v-model="s.nums"
                style="width: 100%"
                class="input-with-select"
                placeholder="请输入数量"
                :min="1"
                type="number"
                @change="e => numChange(e, index)"
              >
                <el-select
                  style="width: 100%"
                  slot="prepend"
                  placeholder="请选择"
                  v-model="s.itemId"
                  @change="e => hisDiagChange(e, index)"
                >
                  <el-option
                    v-for="item in hisOption"
                    :key="index + '_' + item.id"
                    :label="item.itemName"
                    :value="item.id"
                    >{{ item.itemName }}</el-option
                  >
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :key="'2' + index">
            <el-form-item
              :key="index"
              :label="index == 0 ? '咨询费用：' : '报名费用：'"
              :prop="'itemFeeList[' + index + '].price'"
            >
              <el-input
                v-model="s.allPrice"
                type="number"
                disabled
                placeholder="请输入"
              >
                <template slot="append">元/人</template>
              </el-input>
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="8">
          <el-form-item label="联系电话：" prop="activityTell">
            <el-input v-model="formData.activityTell" placeholder="请输入">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关联咨询室：" prop="activityDept">
            <!-- <el-input v-model="formData.activityDept" placeholder="请输入">
            </el-input> -->
            <el-select
              style="width: 100%"
              v-model="formData.activityDept"
              placeholder="请选择"
            >
              <el-option
                v-for="item in roomList"
                :value="item.name"
                :label="item.name"
                :disabled="!item.status"
                :key="item.id"
                >{{ item.name }}</el-option
              >
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="活动负责人" prop="directorCode">
            <el-select
              @change="changeDirector"
              style="width: 100%"
              filterable
              :disabled="$route.path == '/mindConsult/myActivity/creat'"
              v-model="formData.directorCode"
              placeholder="请选择"
            >
              <el-option
                v-for="(direItem, indexDir) in managerLists"
                :key="indexDir"
                :label="direItem.name"
                :value="direItem.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <BlockTitle style="margin-bottom: 15px">活动内容</BlockTitle>
      <el-form-item label="活动地点：" prop="activityAddr">
        <el-input v-model="formData.activityAddr" placeholder="请输入">
        </el-input>
      </el-form-item>
      <el-form-item label="购买须知：" prop="purchaseNote">
        <el-input
          v-model="formData.purchaseNote"
          placeholder="请输入"
          type="textarea"
          resize="none"
          :autosize="{ minRows: 4, maxRows: 8 }"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="退款说明：" prop="refundDesc">
        <el-input
          v-model="formData.refundDesc"
          placeholder="请输入"
          type="textarea"
          resize="none"
          :autosize="{ minRows: 4, maxRows: 8 }"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="其他说明：" prop="otherDesc">
        <el-input
          v-model="formData.otherDesc"
          placeholder="请输入"
          type="textarea"
          resize="none"
          :autosize="{ minRows: 4, maxRows: 8 }"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="活动介绍：" prop="activityInstruction">
        <div id="editor"></div>
      </el-form-item>
      <BlockTitle style="margin-bottom: 15px">报名表单设置 </BlockTitle>
      <div class="form-set">
        <div class="check-list">
          <div
            class="check-list-item"
            v-for="(item, index) in formData.signRelList"
            :key="index"
          >
            <span
              class="op-class"
              :class="
                ['姓名', '手机'].includes(item.fieldName) ? 'require-class' : ''
              "
              >{{ item.fieldName }}</span
            >
            <el-input
              v-if="item.fieldType === '普通文本框'"
              v-model="item.fieldValue"
              placeholder="请输入"
            >
            </el-input>
            <el-radio-group
              v-model="item.fieldValue"
              v-if="item.fieldType === '单选框'"
            >
              <el-radio
                v-for="val in item.optionValue"
                :key="val"
                :label="val"
                >{{ val }}</el-radio
              >
            </el-radio-group>
            <el-checkbox
              style="margin-left: 15px"
              :disabled="item.disabled"
              v-model="item.required"
              >必填</el-checkbox
            >
          </div>
          <div
            style="color: #0ab2c1; margin-left: 120px"
            class="addSelect"
            @click="addSelect"
          >
            +添加收集项
          </div>
        </div>
        <div class="checks">
          <div style="color: #333">常用项：</div>
          <el-checkbox-group @change="changeSelect" v-model="checks">
            <el-checkbox
              :disabled="val.disabled"
              v-for="(val, index) in checkList"
              :key="index"
              :label="index"
              >{{ val.fieldName }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
      </div>
      <BlockTitle>活动模板 </BlockTitle>
      <div class="temp-list">
        <div
          class="temp-list-item"
          v-for="(item, index) in tempList"
          :key="index"
        >
          <div class="title">
            <el-radio
              v-model="formData.activityTemplateId"
              :label="item"
              @change="templateChange"
            ></el-radio>
            <!-- <span
              style="color: #0ab2c1; cursor: pointer"
              @click="openTemplate(item)"
              >预览</span
            > -->
          </div>
          <div class="img-box">
            <el-image
              fit="cover"
              :src="FILE_URL_IMG_NAME(item)"
              :preview-src-list="[FILE_URL_IMG_NAME(item)]"
            >
            </el-image>
            <!-- <el-image fit="cover" :src="FILE_URL_IMG_NAME(item)"></el-image> -->
          </div>
        </div>
      </div>
      <BlockTitle>宣传图 </BlockTitle>
      <div class="temp-list">
        <div
          class="temp-list-item"
          v-for="(item, index) in imgList"
          :key="index"
        >
          <span v-if="item !== 999">
            <div class="title">
              <el-radio v-model="activeImg" :label="item"></el-radio>
            </div>
            <div class="img-box">
              <el-image
                fit="cover"
                :src="FILE_URL_IMG_NAME(item)"
                :preview-src-list="[FILE_URL_IMG_NAME(item)]"
              >
              </el-image>
            </div>
          </span>
          <span v-else>
            <div class="title">
              <el-radio v-model="activeImg" :label="999"> 自定义 </el-radio>
            </div>
            <el-upload
              action=""
              :show-file-list="false"
              :on-success="imgSuccess"
              :before-upload="beforeUpdate"
              :http-request="httpRequest"
              accept="image/png, image/jpeg, image/gif, image/webp"
            >
              <el-image
                style="width: 280px; height: 120px"
                v-if="upLoadImgId"
                :src="FILE_URL(upLoadImgId)"
              >
              </el-image>

              <div class="uploader" v-else>
                <i class="el-icon-plus"></i>
                <div>添加</div>
              </div>
              <!-- <el-button
              class="changeImg"
              v-if="formData.activityImgId"
              type="primary"
              >更改</el-button -->
            </el-upload>
          </span>
        </div>
        <!-- <div class="temp-list-item">

        </div>  -->
      </div>
      <div class="btns">
        <el-button @click="backPage">返回</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </div>
    </el-form>
    <!-- 添加弹窗 -->
    <el-dialog
      :title="editCollectTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="editCollect" :model="collectData" label-width="100px">
        <el-form-item label="字段名称">
          <el-input
            v-model="collectData.fieldName"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="输入框类型" class="inp-type">
          <el-select
            v-model="collectData.fieldType"
            placeholder="请选择"
            @change="changeInpType"
          >
            <el-option
              v-for="(val, ind) in inpTypeOptions"
              :key="ind"
              :label="val"
              :value="val"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="选项"
          v-if="
            ['单选框', '复选框', '下拉选项'].includes(collectData.fieldType)
          "
        >
          <div
            @click="addOption"
            style="color: #0ab2c1; cursor: pointer"
            v-if="!isAddOption"
          >
            +添加
          </div>
          <el-input v-else placeholder="请输入内容" v-model="inpSelectVal">
            <el-button slot="append" @click="handleEditOption(0)"
              >取消</el-button
            >
            <el-button slot="append" @click="handleEditOption(1)"
              >确认</el-button
            >
          </el-input>
          <div v-for="(val, index) in collectData.optionValue" :key="index">
            {{ val }}
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addItem">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 预览模板 -->
    <el-dialog
      title="预览模板"
      :visible.sync="isOpenTemp"
      width="30%"
      :before-close="handleCloseTemp"
    >
      <span>{{ rowTempInfo }}</span>
    </el-dialog>
  </div>
</template>

<script>
import { BlockTitle } from '@/components/Base'
import apiProjectSet from '@/api/mindConsult/projectSet'
import MyUploadAdapter from '@/utils/MyUploadAdapter'
import {
  addActivity,
  editActivity,
  getActivityDetail,
  getmanagerList,
} from '@/api/mindConsult/myActivity'
import { uploadFile } from '@/api'
import { consulRoomList } from '@/api/mindConsult/consultRoom'
import E from 'wangeditor'
export default {
  name: 'add_edit',
  components: {
    BlockTitle,
  },
  data() {
    var checkactivityName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('活动名称不能为空'))
      } else {
        if (value.length < 5) {
          return callback(new Error('活动名称不能少于5个字'))
        } else {
          callback()
        }
      }
    }
    return {
      hisOption: [],
      activeImg: 'header_02.png',
      roomList: [],
      //表单数据
      formData: {
        activityRule: '2', //1截止活动结束时间2活动名额满
        activityType: '团体活动',
        activityName: '',
        itemFeeList: [
          {
            feeType: 1, //1-报名费/2-治疗费
            itemId: '',
            itemName: '',
            nums: 1,
            price: '',
            allPrice: '',
          },
        ],
        signRelList: [], //报名表单设置
        activityTemplateId: 'template_01.jpg', //活动模板图片id
        activityImgId: 'header_02.png', //宣传图id
        directorCode: '',
      },
      upLoadImgId: '',
      editor: '', //富文本
      managerLists: [], //负责人列表
      isAddOption: false, //是否为添加状态
      editCollectTitle: '新增-收集项',
      dialogVisible: false,

      //dialog-collectData收集项
      inpSelectVal: '', //输入框内容
      inpTypeOptions: [
        '普通文本框',
        '多行文本框',
        '单选框',
        '复选框',
        '下拉选框',
        '附件',
        '数值',
        '时间',
      ],
      //选项配置
      collectData: {
        disabled: false,
        fieldName: '', //字段名称
        fieldValue: '', //字段值
        fieldType: '', //字段类型（存中文）
        optionValue: [], //单选项','复选项','下拉选框 选项值
        required: false,
      },
      //常用选项
      checks: [0, 1], //常用项选中下标
      checkList: [
        {
          fieldName: '姓名',
          disabled: true,
          fieldValue: '',
          fieldType: '普通文本框',
          required: true,
        },
        {
          fieldName: '手机',
          disabled: true,
          fieldValue: '',
          fieldType: '普通文本框',
          required: true,
        },
        {
          fieldName: '性别',
          fieldValue: '',
          fieldType: '普通文本框',
          required: false,
        },
        {
          fieldName: '身份证号',
          fieldValue: '',
          fieldType: '普通文本框',
          required: false,
        },
        {
          fieldName: '地址',
          fieldValue: '',
          fieldType: '普通文本框',
          required: false,
        },
        {
          fieldName: '就诊卡号',
          fieldValue: '',
          fieldType: '普通文本框',
          required: false,
        },
        {
          fieldName: '邮箱',
          fieldValue: '',
          fieldType: '普通文本框',
          required: false,
        },
        {
          fieldName: '所属行业',
          fieldValue: '',
          fieldType: '普通文本框',
          required: false,
        },
        {
          fieldName: '公司机构',
          fieldValue: '',
          fieldType: '普通文本框',
          required: false,
        },
        // {
        //   label: '是否接收消息',
        //   value: 8,

        //   optionValue: [
        //     { label: '是', value: 0 },
        //     { label: '否', value: 1 },
        //   ],
        //   type: 'radio',
        //   required: false,
        // },
      ],
      // //模板(后台内置图)
      tempList: [
        'template_01.jpg',
        'template_02.jpg',
        'template_03.jpg',
        'template_04.jpg',
        'template_05.jpg',
      ],
      // //宣传图(后台内置图)
      imgList: ['header_01.png', 'header_02.png', 'header_03.png', 999],

      isOpenTemp: false,
      rowTempInfo: {},
      rules: {
        activityName: [
          {
            required: true,
            trigger: 'blur',
            validator: checkactivityName,
          },
        ],
        activityBeginTime: [
          { required: true, message: '请选择活动开始时间', trigger: 'change' },
        ],
        activityRule: [
          { required: true, message: '请选择', trigger: 'change' },
        ],
        activityQuota: [{ required: true, message: '请输入', trigger: 'blur' }],
        activityEndTime: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
        // diagDictId: [{ required: true, message: '请选择', trigger: 'blur' }],
        // activityCost: [{ required: true, message: '请输入', trigger: 'blur' }],
        activityTell: [{ required: true, message: '请输入', trigger: 'blur' }],
        activityDept: [{ required: true, message: '请输入', trigger: 'blur' }],
        directorCode: [
          { required: true, message: '请选择', trigger: 'change' },
        ],
        activityAddr: [{ required: true, message: '请输入', trigger: 'blur' }],
        purchaseNote: [{ required: true, message: '请输入', trigger: 'blur' }],
        refundDesc: [{ required: true, message: '请输入', trigger: 'blur' }],
        otherDesc: [{ required: true, message: '请输入', trigger: 'blur' }],
        activityInstruction: [
          { required: true, message: '请输入', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    if (
      this.$route.path == '/mindConsult/myActivity/creat' &&
      !this.$route.query.id
    ) {
      const addItem = {
        directorDept: this.$store.state.user.deptName,
        directorTitle: this.$store.state.user.titleName,
        activityDirector: this.$store.state.user.name,
        directorCode: this.$store.state.user.userId,
      }
      //赋值负责人数据
      Object.assign(this.formData, addItem)
    }
    if (this.$route.query.id) {
      this.getInfoData()
    } else {
      this.formData.signRelList = this.checkList.slice(0, 2) //新增默认取前两项
    }
    this.getmanagerList()
    this.getHisoption()
    this.getconsulRoomList()
  },
  mounted() {
    this.editor = new E('#editor')
    this.editor.create()
    this.editor.txt.html('') //设置内容
  },
  methods: {
    async getHisoption() {
      let list = await apiProjectSet.chooseHisDiagDict()
      this.hisOption = list
    },
    //咨询室
    async getconsulRoomList() {
      let res = await consulRoomList({
        currentNum: 1,
        pageSize: 9999999,
        type: '团体',
      })
      this.roomList = res.list
    },
    hisDiagChange(e, index) {
      let rowItem = this.hisOption.find(item => item.id === e)
      this.formData.itemFeeList[index].price = rowItem.price
      this.formData.itemFeeList[index].itemName = rowItem.itemName
      this.formData.itemFeeList[index].allPrice =
        parseFloat(rowItem.price) * this.formData.itemFeeList[index].nums
    },
    numChange(e, index) {
      if (e < 1) {
        this.formData.itemFeeList[index].nums = 1
        this.$message.warning('数量不能小于1')
      } else if (this.formData.itemFeeList[index].itemId) {
        let rowItem = this.hisOption.find(
          item => item.id === this.formData.itemFeeList[index].itemId,
        )
        this.formData.itemFeeList[index].allPrice =
          parseFloat(rowItem.price) * this.formData.itemFeeList[index].nums
      }
    },
    activityTypeChange(e) {
      if (e === '团体治疗') {
        this.formData.itemFeeList.push({
          feeType: 2,
          itemId: '',
          itemName: '',
          nums: 1,
          price: '',
          allPrice: '',
        })
      } else {
        this.formData.itemFeeList = [
          {
            feeType: 1, //1-报名费/2-治疗费
            itemId: '',
            itemName: '',
            nums: 1,
            price: '',
            allPrice: '',
          },
        ]
      }
    },
    //上传宣传图成功
    imgSuccess(res) {
      console.log(res, '宣传图id----')
      this.upLoadImgId = res
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
    //获取负责人列表
    async getmanagerList() {
      this.managerLists = await getmanagerList()
    },
    //选择活动负责人
    changeDirector(e) {
      const item = this.managerLists.filter(i => i.id === e)[0]
      const addItem = {
        directorDept: item.department,
        directorTitle: item.title,
        activityDirector: item.name,
      }
      //赋值负责人数据
      Object.assign(this.formData, addItem)
    },
    //预览模板
    openTemplate(item) {
      console.log('预览模板')
      this.isOpenTemp = true
      this.rowTempInfo = item
    },
    //编辑时拉取详情数据
    async getInfoData() {
      this.formData = await getActivityDetail({
        activityId: this.$route.query.id,
      })
      this.formData.itemFeeList = this.formData.itemFeeList.map(item => {
        return {
          ...item,
          allPrice: parseFloat(item.price) * item.nums,
        }
      })
      if (this.formData.activityImgId.indexOf('.') > -1) {
        this.activeImg = this.formData.activityImgId
      } else {
        this.activeImg = 999
        this.upLoadImgId = this.formData.activityImgId
      }
      this.editor.txt.html(this.formData.activityInstruction) //设置活动介绍内容
    },
    // 是否添加选项答案
    handleEditOption(e) {
      this.isAddOption = false
      if (!e) return
      if (!this.collectData.fieldName)
        return this.$message.warning('请输入字段名！')
      if (!this.inpSelectVal) return this.$message.warning('请输入选项内容！')
      this.collectData.optionValue.push(
        JSON.parse(JSON.stringify(this.inpSelectVal)),
      )
    },
    // /changefieldType
    changeInpType(e) {
      console.log(e, this.collectData.fieldType)
    },
    //添加选项
    addOption() {
      this.isAddOption = true
    },
    //关闭新增编辑收集项弹窗
    handleClose() {
      //清除选项值
      this.collectData = {
        disabled: false,
        fieldName: '', //字段名称
        fieldValue: '', //字段值
        fieldType: '', //字段类型（存中文）
        optionValue: [], //单选项','复选项','下拉选框 选项值
        required: false,
      }
      this.dialogVisible = false
    },
    // 自定义图片上传
    onReady(editor) {
      // Insert the toolbar before the editable area.
      editor.ui
        .getEditableElement()
        .parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement(),
        )
      // 自定义上传图片插件
      editor.plugins.get('FileRepository').createUploadAdapter = loader => {
        return new MyUploadAdapter(loader)
      }
    },
    //选择配置
    changeSelect() {
      this.formData.signRelList = this.checkList.filter((v, i) => {
        return this.checks.includes(i)
      })
    },
    addSelect() {
      console.log('添加')
      this.dialogVisible = true
    },
    templateChange(e) {
      console.log(e)
      switch (e) {
        case 'template_01.jpg':
          this.activeImg = 'header_02.png'
          break
        case 'template_02.jpg':
          this.activeImg = 'header_01.png'
          break
        case 'template_03.jpg':
          this.activeImg = 'header_01.png'
          break
        case 'template_04.jpg':
          this.activeImg = 'header_01.png'
          break
        case 'template_05.jpg':
          this.activeImg = 'header_03.png'
          break
        default:
          this.activeImg = 'header_01.png'
          break
      }
    },
    //backPage
    backPage() {
      this.$router.back()
    },
    //提交新增/编辑
    async submit() {
      this.formData.activityImgId =
        this.activeImg === 999 ? this.upLoadImgId : this.activeImg
      this.formData.activityInstruction = this.editor.txt.html() //活动介绍赋值
      this.formData.orgId = this.$store.state.user.orgId //机构id
      //validate
      this.$refs.form.validate(async valid => {
        if (!valid) return
        // optionValue转json字符串
        this.formData.signRelList.forEach(
          i => i.optionValue && (i.optionValue = JSON.stringify(i.optionValue)),
        )
        console.log(this.formData)
        this.$route.query.id
          ? await editActivity(this.formData)
          : await addActivity(this.formData)
        this.$message.success('提交成功！')
        this.$router.back()
      })
    },
    //确认添加收集项
    addItem() {
      this.dialogVisible = false
      console.log(this.collectData)
      this.formData.signRelList.push(
        JSON.parse(JSON.stringify(this.collectData)),
      )
      this.collectData = {
        disabled: false,
        fieldName: '', //字段名称
        fieldValue: '', //字段值
        fieldType: '', //字段类型（存中文）
        optionValue: [], //单选项','复选项','下拉选框 选项值
        required: false,
      }
    },
    handleCloseTemp() {
      this.isOpenTemp = false
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-select .el-input {
  width: 130px;
}
::v-deep .input-with-select .el-input-group__prepend {
  background-color: #fff;
}
::v-deep .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
.form-set {
  border: 1px solid #ccc;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  .check-list {
    padding-right: 100px;
    flex: 7;
    .check-list-item {
      display: flex;
      width: 100%;
      align-items: center;
      margin-bottom: 10px;
      .op-class {
        width: 120px;
        margin-right: 30px;
        color: #666;
        font-size: 14px;
        text-align: right;
        color: #666666;
        line-height: 40px;
        padding: 0 12px 0 0;
      }
      .require-class {
        &::before {
          content: '*';
          color: red;
          margin-right: 4px;
        }
      }
      .el-form-item {
        min-width: 450px;
      }
    }
  }
  .checks {
    flex: 3;
    background: #f2f2f2;
    padding: 15px;
    .el-checkbox {
      width: 33%;
      margin-top: 10px;
    }
    ::v-deep .is-checked {
      color: #666;
    }
  }
  .addSelect {
    cursor: pointer;
  }
}
.temp-list {
  padding: 15px;
  display: flex;
  /* justify-content: space-between; */
  flex-wrap: wrap;
  .temp-list-item {
    margin-top: 15px;
    width: 31%;
    margin-right: 20px;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .img-box {
      width: 100%;
      height: 180px;
      background: #ccc;
      overflow: hidden;
    }
  }
}
.btns {
  display: flex;
  justify-content: center;
}
::v-deep .el-form-item__content {
  z-index: 0;
}
.inp-type {
  ::v-deep .el-select {
    width: 100%;
    .el-input {
      width: 100%;
    }
  }
}
.uploader {
  width: 280px;
  height: 120px;
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
.el-select {
  ::v-deep .el-input {
    min-width: 130px;
    width: 100%;
  }
}
</style>
