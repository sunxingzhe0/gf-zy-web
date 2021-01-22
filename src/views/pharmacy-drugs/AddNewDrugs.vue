<template>
  <section class="view__card">
    <div class="flex-start-start">
      <!-- 左侧菜单 -->
      <div class="leftMenu">
        <el-tabs :tab-position="tabPosition" @tab-click="handleLeftList">
          <el-tab-pane
            :label="item.title"
            v-for="(item, index) in leftList"
            :key="index"
            :name="item.key"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <!-- 右侧表单 -->
      <div class="rightForm" v-loading="loading">
        <el-form
          ref="formee"
          :rules="rules"
          :model="form"
          label-width="100px"
          label-position="left"
        >
          <el-row :gutter="60">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="药品名称" prop="name">
                <el-input
                  ref="name"
                  placeholder="请输入"
                  v-model="form.name"
                  :disabled="form.orgDrug"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="药品ID">
                <el-input ref="id" v-model="form.id" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="药品通用名" prop="commonName">
                <el-input
                  ref="commonName"
                  v-model="form.commonName"
                  :disabled="id ? true : false"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="药品化学名" prop="chemicalName">
                <el-input
                  ref="chemicalName"
                  v-model="form.chemicalName"
                  :disabled="id ? true : false"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="产地" prop="origin">
                <el-select
                  ref="origin"
                  v-model="form.origin"
                  placeholder="请选择"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in newPacl"
                    :key="item.id"
                    :label="item.originName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="报销标志" prop="reimbursement">
                <el-select
                  ref="reimbursement"
                  v-model="form.reimbursement"
                  :disabled="id ? true : false"
                  placeholder="请选择"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in attriButeA"
                    :key="item.id"
                    :label="item.attrName"
                    :value="item.attrId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="药品剂型" prop="pharmaceuticalDosage">
                <el-select
                  ref="pharmaceuticalDosage"
                  v-model="form.pharmaceuticalDosage"
                  placeholder="请选择"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in dosage"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="基本剂量" prop="basicDose">
                <el-input
                  ref="basicDose"
                  v-model="form.basicDose"
                  :disabled="id ? true : false"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="剂量单位" prop="dosageUnit">
                <el-select
                  ref="dosageUnit"
                  :disabled="id ? true : false"
                  @change="Packagingunit($event, 'DOSAGE_UNIT')"
                  v-model="form.dosageUnit"
                  placeholder="请选择"
                  style="width: 100%;"
                  :multiple-limit="0"
                  filterable
                  allow-create
                  default-first-option
                >
                  <el-option
                    v-for="item in optionB"
                    :key="item.id"
                    :label="item.unitName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="药品类别" prop="drugType">
                <el-select
                  ref="drugType"
                  v-model="form.drugType"
                  :disabled="id ? true : false"
                  placeholder="请选择"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in category"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="批发价" prop="wholesalePrice">
                <el-input
                  v-model="form.wholesalePrice"
                  ref="wholesalePrice"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="零售价" prop="retailPrice">
                <el-input
                  ref="retailPrice"
                  v-model="form.retailPrice"
                  :disabled="id ? true : false"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="可用库存" prop="availableInventory">
                <el-input
                  v-model="form.availableInventory"
                  ref="availableInventory"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="基本包装单位" prop="basicUnit">
                <el-select
                  ref="basicUnit"
                  @change="Packagingunit($event, 'BASIC_PACKAGING_UNIT')"
                  :disabled="id ? true : false"
                  v-model="form.basicUnit"
                  placeholder="请选择"
                  style="width: 100%;"
                  :multiple-limit="0"
                  filterable
                  allow-create
                  default-first-option
                >
                  <el-option
                    v-for="item in optionA"
                    :key="item.id"
                    :label="item.unitName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="常规包装量" prop="regularPackVolume">
                <el-input
                  ref="regularPackVolume"
                  v-model="form.regularPackVolume"
                  :disabled="id ? true : false"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="常规包装单位" prop="regularUnit">
                <el-select
                  ref="regularUnit"
                  @change="Packagingunit($event, 'CONVENTIONAL_PACKAGING_UNIT')"
                  :disabled="id ? true : false"
                  v-model="form.regularUnit"
                  placeholder="请选择"
                  style="width: 100%;"
                  :multiple-limit="0"
                  filterable
                  allow-create
                  default-first-option
                >
                  <el-option
                    v-for="item in optionU"
                    :key="item.id"
                    :label="item.unitName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="规格" prop="drugSpec">
                <el-input
                  ref="drugSpec"
                  v-model="form.drugSpec"
                  :disabled="id ? true : false"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="默认用量" prop="defaultUsage">
                <el-input
                  v-model="form.defaultUsage"
                  ref="defaultUsage"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="默认频次" prop="frequency">
                <el-select
                  ref="frequency"
                  v-model="form.frequency"
                  placeholder="请选择"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in frequency"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="默认途径" prop="ways">
                <el-select
                  ref="ways"
                  v-model="form.ways"
                  placeholder="请选择"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in channel"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item
                label="默认包装单位"
                data-text="默认单位"
                prop="unit"
              >
                <el-select
                  ref="unit"
                  v-model="form.unit"
                  placeholder="请选择"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in optionC"
                    :key="item.id"
                    :label="item.unitName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="招标类型" prop="tenderType">
                <el-select
                  ref="tenderType"
                  v-model="form.tenderType"
                  placeholder="请选择"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in bidding"
                    :key="item.id"
                    :label="item.attrName"
                    :value="item.attrId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="招标文号" prop="tenderDocument">
                <el-input
                  v-model="form.tenderDocument"
                  ref="tenderDocument"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="批准文号" prop="approval">
                <el-select
                  ref="approval"
                  v-model="form.approval"
                  placeholder="请选择"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in approval"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="注册商标" prop="trademark">
                <el-input v-model="form.trademark" ref="trademark"></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="药品条码" prop="drugBarcode">
                <el-input
                  v-model="form.drugBarcode"
                  ref="drugBarcode"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="精麻毒药" prop="refinedAnesthetic">
                <el-select
                  ref="refinedAnesthetic"
                  v-model="form.refinedAnesthetic"
                  placeholder="请选择"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in boolNode"
                    :key="item.id"
                    :label="item.name"
                    :value="item.dispa"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="药品属性" prop="drugAttr">
                <el-input v-model="form.drugAttr" ref="drugAttr"></el-input>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="用药须知" prop="drugInstructions">
                <el-select
                  ref="drugInstructions"
                  v-model="form.drugInstructions"
                  placeholder="请选择"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in notice"
                    :key="item.id"
                    :label="item.attrName"
                    :value="item.attrId"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="可否分次" prop="divided">
                <el-select
                  ref="divided"
                  v-model="form.divided"
                  :disabled="id ? true : false"
                  placeholder="请选择"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="item in Graded"
                    :key="item.id"
                    :label="item.name"
                    :value="item.dispa"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 是否拆零 -->
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="是否拆零" prop="split">
                <el-select
                  ref="split"
                  style="width: 100%;"
                  v-model="form.split"
                  :disabled="id ? true : false"
                  filterable
                  placeholder="请选择"
                >
                  <el-option label="是" :value="true"> </el-option>
                  <el-option label="否" :value="false"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :md="24" :lg="20" :xl="20">
              <el-form-item label="输入码" prop="enterCode1">
                <el-input
                  ref="enterCode1"
                  v-model="form.enterCode1"
                  style="width: 20%;"
                ></el-input>
                <el-input
                  ref="enterCode2"
                  v-model="form.enterCode2"
                  style="width: 20%;"
                  class="box"
                ></el-input>
                <el-input
                  ref="enterCode3"
                  v-model="form.enterCode3"
                  style="width: 20%;"
                  class="box"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :md="24" :lg="20" :xl="20">
              <el-form-item label="备注" prop="remark">
                <el-input
                  type="textarea"
                  v-model="form.remark"
                  :autosize="{ minRows: 4, maxRows: 8 }"
                  ref="remark"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :md="24" :lg="12" :xl="12">
              <el-form-item label="基本包装照片" prop="basicPic">
                <el-upload
                  ref="basicPic"
                  class="upload-demo"
                  action
                  :http-request="httpRequest"
                  :before-upload="beforeImageUpload"
                  accept="image/png, image/jpeg, image/gif, image/webp"
                  :on-success="handleAvatarSuccess"
                  :show-file-list="false"
                >
                  <img
                    v-if="form.basicPic"
                    :src="FILE_URL(form.basicPic)"
                    class="avatar"
                  />
                  <div v-else>
                    <i class="el-icon-plus"></i>
                    <p>添加图片</p>
                  </div>
                </el-upload>
                <span class="blosEsb"
                  >备注 : 建议图片尺寸为 1:1 图片大小不能超过2M</span
                >
              </el-form-item>
            </el-col>

            <el-col :md="24" :lg="12" :xl="12">
              <el-form-item label="常规包装照片" prop="regularPic">
                <el-upload
                  ref="basicPic"
                  class="upload-demo"
                  action
                  :http-request="httpRequests"
                  :before-upload="beforeImageUpload"
                  accept="image/png, image/jpeg, image/gif, image/webp"
                  :on-success="handleSaves"
                  :show-file-list="false"
                >
                  <img
                    v-if="form.regularPic"
                    :src="FILE_URL(form.regularPic)"
                    class="avatar"
                  />
                  <div v-else>
                    <i class="el-icon-plus"></i>
                    <p>添加图片</p>
                  </div>
                </el-upload>
                <span class="blosEsb"
                  >备注 : 建议图片尺寸为 1:1 图片大小不能超过2M</span
                >
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="状态" prop="status" ref="status">
                <!-- <el-radio-group v-model="form.status"> -->
                <el-radio v-model="form.status" :label="false">启用</el-radio>
                <el-radio v-model="form.status" :label="true">禁用</el-radio>
                <!-- </el-radio-group> -->
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="属性" prop="attr" ref="attr">
                <el-radio-group v-model="form.attr">
                  <el-radio :label="true">普通</el-radio>
                  <el-radio :label="false">特殊</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="排序" prop="seq">
                <el-input
                  ref="seq"
                  type="input"
                  placeholder="请输入"
                  v-model="form.seq"
                ></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <div class="dialog-footer is-center">
                <el-button size="medium" @click="isAdd">返回</el-button>
                <el-button size="medium" type="primary" @click="handleSave">{{
                  form.id ? '保存' : '提交'
                }}</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </section>
</template>

<script>
import {
  typeLists,
  attriBute,
  preserVation,
  editDrugs,
  modify, //药品修改
  // addOrigin,
  PlaceOrigin,
  addCom,
} from '@/api/drugs'
import { uploadFile, listUnit } from '@/api/index' //包装单位,上传
// import { addUnit } from '@/api/dictionary'
export default {
  data() {
    return {
      typeId: '', //新增包装id
      loading: false,
      disabled: false, //机构端十个字段不可修改
      id: this.$route.query.id,
      tabPosition: 'left',
      //基本包装单位
      unit: '',
      //常规包装单位
      optionU: [],
      //基本包装单位
      optionA: [],
      //剂量单位
      optionB: [],
      //默认单位
      optionC: [],
      //单位列表全部
      typecodeList: [],
      //处方
      prescription: '',
      //药品类别
      category: '',
      //药品剂型
      dosage: [],
      newPacl: [], //产地
      boolNode: [
        //精麻毒药
        {
          name: '是',
          dispa: 'true',
        },
        {
          name: '否',
          dispa: 'false',
        },
      ],
      Graded: [
        //可否分次
        {
          name: '是',
          dispa: true,
        },
        {
          name: '否',
          dispa: false,
        },
      ],
      //用药途径
      channel: '',
      frequency: '', //默认频次
      attriButeA: '', //报销标志
      drugs: '', //药品属性
      bidding: '', //招标类型
      notice: '', //用药需知
      approval: '', //批准文号
      // 左侧菜单列表集合
      form: {
        wholesalePrice: 0, //批发价
        retailPrice: 0, //零售价
        availableInventory: 0, //可用库存
        name: '', //药品名称
        approval: '', //批准文号
        basicDose: '', //基本剂量
        basicPic: '', //基本包装照片
        basicUnit: '', //基本包装单位
        chemicalName: '', //	药品化学名
        commonName: '', //药品通用名
        defaultUsage: '', //默认用量
        divided: '', //	可否分次
        dosageUnit: '', //剂量单位
        drugAttr: '', //药品属性
        drugBarcode: '', //	药品条码
        drugInstructions: '', //	用药须知
        drugSpec: '', //规格
        drugType: '', //药品类别
        enterCode1: '', //输入码1
        enterCode2: '', //输入码2
        enterCode3: '', //输入码3
        frequency: [], //默认频次
        origin: '', //产地
        pharmaceuticalDosage: '', //药品剂型
        refinedAnesthetic: '', //精麻毒药
        regularPackVolume: '', //常规包装量
        regularPic: '', //常规包装照片
        regularUnit: '', //常规包装单位
        reimbursement: '', //报销标志,可用值:A,B,C,ME_FEE
        remark: '', //备注
        tenderDocument: '', //招标文号
        tenderType: '', //招标类型
        trademark: '', //注册商标
        unit: '', //默认单位
        ways: '', //默认途径
        status: false, //状态
        seq: 0, //排序
        // remark: '', //备注
        attr: true, //属性
        split: false, // 是否拆零
        orgDrug: false, //是否机构创建
      },
      rules: {
        name: [{ required: true, message: '请输入药品名称' }],
        approval: [{ required: true, message: '请输入批准文号' }],
        basicDose: [{ required: true, message: '请输入基本剂量' }],
        basicPic: [{ required: true, message: '请输入基本包装照片' }],
        basicUnit: [{ required: true, message: '请输入基本包装单位' }],
        chemicalName: [{ required: true, message: '请输入药品化学名' }],
        commonName: [{ required: true, message: '请输入药品通用名' }],
        divided: [{ required: true, message: '请输入可否分次' }],
        dosageUnit: [{ required: true, message: '请输入剂量单位' }],
        drugAttr: [{ required: true, message: '请输入药品属性' }],
        // drugBarcode: [{ required: true, message: '请输入药品条码' }],
        // drugInstructions: [{ required: true, message: '请输入用药须知' }],
        drugSpec: [{ required: true, message: '请输入规格' }],
        drugType: [{ required: true, message: '请输入药品类别' }],
        enterCode1: [{ required: true, message: '请输入输入码1' }],
        enterCode2: [{ required: true, message: '请输入输入码2' }],
        enterCode3: [{ required: true, message: '请输入输入码3' }],
        // frequency: [{ required: true, message: '请输入默认频次' }],
        origin: [{ required: true, message: '请输入产地' }],
        pharmaceuticalDosage: [{ required: true, message: '请输入药品剂型' }],
        refinedAnesthetic: [{ required: true, message: '请输入精麻毒药' }],
        nameregularPackVolume: [
          { required: true, message: '请输入常规包装量' },
        ],
        regularPic: [{ required: true, message: '请输入常规包装照片' }],
        regularUnit: [{ required: true, message: '请输入常规包装单位' }],
        reimbursement: [{ required: true, message: '请输入报销标志' }],
        unit: [{ required: true, message: '请输入默认单位' }],
        ways: [{ required: true, message: '请输入默认途径' }],
        status: [{ required: true, message: '请输入默认状态' }],
        attr: [{ required: true, message: '请输入默认属性' }],
        regularPackVolume: [{ required: true, message: '请输入常规包装量' }],
        split: [{ required: true, message: '请输入是否拆零' }],
        availableInventory: [{ required: true, message: '请输入可用库存' }],
        wholesalePrice: [{ required: true, message: '请输入批发价' }],
        retailPrice: [{ required: true, message: '请输入零售价' }],
      },
      leftList: [
        {
          title: '药品名称',
          type: 1,
          necessary: true,
          key: 'name',
        },
        {
          title: '药品 ID',
          type: 1,
          necessary: false,
          key: 'id',
        },
        {
          title: '药品通用名',
          type: 1,
          necessary: true,
          key: 'commonName',
        },
        {
          title: '药品化学名',
          type: 1,
          necessary: true,
          key: 'chemicalName',
        },
        {
          title: '产地',
          type: 1,
          necessary: true,
          key: 'origin',
        },
        {
          title: '报销标志',
          type: 2,
          necessary: true,
          key: 'reimbursement',
        },
        {
          title: '药品剂型',
          type: 2,
          necessary: true,
          key: 'pharmaceuticalDosage',
        },
        {
          title: '基本剂量',
          type: 1,
          necessary: true,
          key: 'basicDose',
        },
        {
          title: '剂量单位',
          type: 2,
          necessary: true,
          key: 'dosageUnit',
        },
        {
          title: '药品类别',
          type: 2,
          necessary: true,
          key: 'drugType',
        },
        {
          title: '批发价',
          type: 1,
          necessary: true,
          key: 'wholesalePrice',
        },
        {
          title: '零售价',
          type: 1,
          necessary: true,
          key: 'retailPrice',
        },
        {
          title: '可用库存',
          type: 1,
          necessary: true,
          key: 'availableInventory',
        },
        {
          title: '基本包装单位',
          type: 2,
          necessary: true,
          key: 'basicUnit',
        },
        {
          title: '常规包装量',
          type: 1,
          necessary: true,
          key: 'regularPackVolume',
        },
        {
          title: '常规包装单位',
          type: 2,
          necessary: true,
          key: 'regularUnit',
        },
        {
          title: '规格',
          type: 1,
          necessary: true,
          key: 'drugSpec',
        },
        {
          title: '默认用量',
          type: 1,
          necessary: false,
          key: 'defaultUsage',
        },
        {
          title: '默认频次',
          type: 2,
          necessary: false,
          key: 'frequency',
        },
        {
          title: '默认途径',
          type: 2,
          necessary: true,
          key: 'ways',
        },
        {
          title: '默认包装单位',
          type: 2,
          necessary: true,
          key: 'unit',
        },
        {
          title: '招标类型',
          type: 2,
          necessary: false,
          key: 'tenderType',
        },
        {
          title: '招标文号',
          type: 1,
          necessary: false,
          key: 'tenderDocument',
        },
        {
          title: '批准文号',
          type: 2,
          necessary: true,
          key: 'approval',
        },
        {
          title: '注册商标',
          type: 1,
          necessary: false,
          key: 'trademark',
        },
        {
          title: '药品条码',
          type: 1,
          necessary: false,
          key: 'drugBarcode',
        },
        {
          title: '精麻毒药',
          type: 2,
          necessary: true,
          key: 'refinedAnesthetic',
        },
        {
          title: '药品属性',
          type: 1,
          necessary: true,
          key: 'drugAttr',
        },
        {
          title: '用药须知',
          type: 2,
          necessary: false,
          key: 'drugInstructions',
        },
        {
          title: '可否分次',
          type: 2,
          necessary: true,
          key: 'divided',
        },
        {
          title: '是否拆零',
          type: 2,
          necessary: true,
          key: 'split',
        },
        {
          title: '输入码1',
          type: 1,
          necessary: true,
          key: 'enterCode1',
        },
        {
          title: '输入码2',
          type: 1,
          necessary: true,
          key: 'enterCode2',
        },
        {
          title: '输入码3',
          type: 1,
          necessary: true,
          key: 'enterCode3',
        },
        {
          title: '备注',
          type: 1,
          necessary: true,
          key: 'remark',
        },
        {
          title: '基本包装照片',
          type: 1,
          necessary: true,
          key: 'basicPic',
        },
        {
          title: '常规包装照片',
          type: 1,
          necessary: true,
          key: 'regularPic',
        },
        {
          title: '状态',
          type: 1,
          necessary: true,
          key: 'status',
        },
        {
          title: '属性',
          type: 1,
          necessary: true,
          key: 'attr',
        },
        {
          title: '排序',
          type: 1,
          necessary: true,
          key: 'seq',
        },
      ],
    }
  },

  created() {
    // this.disabled = this.$route.query.id ? true : false //判断有无id
    this.typeTlist()
    this.attriButes()
    this.newPlace()
    this.add()
  },
  methods: {
    handleLeftList(e) {
      console.log(e.name)
      this.$refs[e.name].$el.scrollIntoView({
        // 滚动到指定节点
        block: 'start', // 值有 start,center,end,nearest, 当前显示在视图区域中间
        behavior: 'smooth', // 值有 auto,instant,smooth, 缓动动画 (当前是慢速的)
      })
      this.$refs[e.name].focus()
    },
    //几种包装单位
    async Packagingunit(val, type) {
      this.typeId = ''
      //剂量单位
      let optiTypeB =
        type == 'DOSAGE_UNIT'
          ? this.optionB
          : type == 'CONVENTIONAL_PACKAGING_UNIT'
          ? this.optionU
          : type == 'BASIC_PACKAGING_UNIT'
          ? this.optionA
          : []
      if (optiTypeB.map(item => item.id).indexOf(val) < 0) {
        // this.addCom(val, type)
        const res = await addCom({
          seq: 0,
          status: false,
          typeList: [type],
          unitName: val,
          mechanismId: this.$store.state.user.store.id,
        })
        this.typeId = res
      }
      //常规包装单位 dosageUnit(剂量单位) basicUnit(基本包装单位)
      console.log(val, type)
      console.log(this.typeId)
      if (this.typeId) {
        if (type == 'DOSAGE_UNIT') {
          let optionB = await listUnit({
            mechanismId: this.$store.state.user.store.id,
          })
          this.optionB = optionB.filter(item => {
            return item.typeList.indexOf('DOSAGE_UNIT') > -1
          })
          // this.optionB.push({ unitName: val, id: this.typeId })
          this.$nextTick(() => {
            this.form.dosageUnit = this.typeId
          })
        } else if (type == 'CONVENTIONAL_PACKAGING_UNIT') {
          console.log(222222)
          let optionU = await listUnit({
            mechanismId: this.$store.state.user.store.id,
          })
          this.optionU = optionU.filter(item => {
            return item.typeList.indexOf('CONVENTIONAL_PACKAGING_UNIT') > -1
          })
          console.log(this.optionU)
          this.$nextTick(() => {
            console.log(this.typeId, '33333')
            this.form.regularUnit = this.optionU.filter(item => {
              return item.unitName == val
            })[0].id
          })
          // this.optionU.push({ unitName: val, id: this.typeId })
        } else if (type == 'BASIC_PACKAGING_UNIT') {
          let optionA = await listUnit({
            mechanismId: this.$store.state.user.store.id,
          })
          this.optionA = optionA.filter(item => {
            return item.typeList.indexOf('BASIC_PACKAGING_UNIT') > -1
          })
          // this.optionA.push({ unitName: val, id: this.typeId })
          this.$nextTick(() => {
            this.form.basicUnit = this.typeId
          })
        }
      }
      this.$nextTick(() => {
        this.optionC = [
          ...this.optionU.filter(item => {
            return item.id == this.form.regularUnit
          }),

          ...this.optionB.filter(item => {
            return item.id == this.form.dosageUnit
          }),
          ...this.optionA.filter(item => {
            return item.id == this.form.basicUnit
          }),
        ]
        console.log(this.optionC)
        this.form.unit = ''
      })
    },
    handleAvatarSuccess(res) {
      this.form.basicPic = res
    },
    handleSaves(res) {
      this.form.regularPic = res
    },
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isWEBP = file.type === 'image/webp'

      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG && !isGIF && !isWEBP) {
        this.$message.error('上传头像图片只能是 JPG PNG GIF WEBP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG || isGIF || isWEBP) && isLt2M
    },
    httpRequest({ file, onProgress, onSuccess, onError }) {
      const formData = new FormData()
      formData.append('file', file)
      uploadFile(formData, onProgress).then(onSuccess).catch(onError)
    },
    httpRequests({ file, onProgress, onSuccess, onError }) {
      const formData = new FormData()
      formData.append('file', file)
      uploadFile(formData, onProgress).then(onSuccess).catch(onError)
    },
    isAdd() {
      this.$router.go(-1) //返回到药品管理页面
    },
    //包装单位类型
    async add() {
      let res = await listUnit({
        mechanismId: this.$store.state.user.store.id,
        // pageSize: 999,
      })
      this.optionU = res.filter(val => {
        return val.typeList.indexOf('CONVENTIONAL_PACKAGING_UNIT') > -1
      })
      this.optionA = res.filter(val => {
        return val.typeList.indexOf('BASIC_PACKAGING_UNIT') > -1
      })
      this.optionB = res.filter(val => {
        return val.typeList.indexOf('DOSAGE_UNIT') > -1
      })
      //全部单位保存下来
      this.typecodeList = res
      // this.optionC = res.list
      /*   try {
        let resq = await listUnit({
          mechanismId: this.$store.state.user.store.id,
        })
        console.log(resq, '11111111')
      } catch (error) {
        console.log(error)
      } */
    },
    async typeTlist() {
      let category = await typeLists({
        //药物类型
        type: 3,
      })
      this.category = category.map(item => ({
        ...item,
        id: String(item.id),
      }))
      let dosage = await typeLists({
        //药物剂型
        type: 4,
      })
      this.dosage = dosage.map(item => ({
        ...item,
        id: String(item.id),
      }))
      let frequency = await typeLists({
        //默认频次
        type: 5,
      })
      this.frequency = frequency.map(item => ({
        ...item,
        id: String(item.id),
      }))
      let approval = await typeLists({
        //批准文号
        type: 7,
      })
      this.approval = approval.map(item => ({
        ...item,
        id: String(item.id),
      }))
      let channel = await typeLists({
        //用药途径
        type: 6,
      })
      this.channel = channel.map(item => ({
        ...item,
        id: String(item.id),
      }))
      if (this.id) {
        this.handleEdit()
      }
    },
    //药品属性筛选
    async attriButes() {
      this.attriButeA = await attriBute({
        type: 1,
      })
      this.drugs = await attriBute({
        type: 2,
      })
      this.bidding = await attriBute({
        type: 3,
      })
      this.notice = await attriBute({
        type: 4,
      })
    },
    //产地新增
    async newPlace() {
      let res = await PlaceOrigin({
        mechanismId: this.$store.state.user.store.id,
      })
      this.newPacl = res.list
    },

    // 编辑
    async handleEdit() {
      this.loading = true
      const res = await editDrugs({
        id: this.id,
      })
      this.form = res
      //保存默认单位列表code
      this.codeList = [res.dosageUnit, res.basicUnit, res.regularUnit]
      //默认单位列表全字段匹配
      this.optionC = this.typecodeList.filter(val => {
        return this.codeList.includes(val.id)
      })
      this.loading = false
      this.$nextTick(() => {
        this.$refs.formee.clearValidate()
      })
    },

    // 剂量单位、基本包装单位、常规包装单位快捷添加
    // 先校验是否有此单位
    // async genIfNoUnit() {
    //   const _self = this
    //   const hasUnit = function (key) {
    //     const index = _self.optionC[key].findIndex(
    //       item =>item.value === _self.form[key]
    //     )
    //     return index !== -1
    //   }
    // },

    //添加单位
    async addCom(name, type) {
      // const types = {
      //   dosageUnit: 'DOSAGE_UNIT', //剂量单位
      //   // basicUnit: 'BASIC_PACKAGING_UNIT',  // 基本包装单位
      //   // regularUnit: 'CONVENTIONAL_PACKAGING_UNIT', //常规包装单位
      // }
      const res = await addCom({
        seq: 0,
        status: false,
        typeList: [type],
        unitName: name,
        mechanismId: this.$store.state.user.store.id,
      })
      this.typeId = res
    },
    handleSave() {
      this.$refs.formee.validate(async (valid, invalidFields) => {
        if (valid) {
          if (this.form.id) {
            await modify({
              ...this.form,
              mechanismId: this.$store.state.user.store.id,
            })
            this.$message.success('操作成功!')
            this.$store.dispatch(
              'updateList/changeFlag',
              'updateListAddNewDrugs',
            )
            this.$router.back()
          } else {
            await preserVation({
              ...this.form,
              mechanismId: this.$store.state.user.store.id,
            })
            this.$message.success('操作成功!')
            this.$store.dispatch(
              'updateList/changeFlag',
              'updateListAddNewDrugs',
            )
            this.$router.back()
          }
        } else {
          for (let obj in invalidFields) {
            this.$refs[obj].focus()
            break
          }
          return false
        }

        // if (valid) {
        //   if (this.form.id) {
        //     await modify({
        //       ...this.form,
        //       mechanismId: this.$store.state.user.store.id,
        //     })
        //     this.$message.success('操作成功!')
        //     this.$store.dispatch(
        //       'updateList/changeFlag',
        //       'updateListAddNewDrugs',
        //     )
        //     this.$router.back()
        //   } else {
        //     await preserVation({
        //       ...this.form,
        //       mechanismId: this.$store.state.user.store.id,
        //     })
        //     this.$message.success('操作成功!')
        //     this.$store.dispatch(
        //       'updateList/changeFlag',
        //       'updateListAddNewDrugs',
        //     )
        //     this.$router.back()
        //   }
        // }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '~@/styles/_variables.scss';
.view__card {
  overflow-x: hidden;
}
.leftMenu {
  width: 124px;
  // height: 1200px;
}
.rightForm {
  padding-left: 20px;
}
.el-row {
  margin-bottom: 40px;
}
::v-deep .el-tabs--left .el-tabs__item.is-left {
  text-align: left;
  line-height: 30px;
  height: 30px;
}
::v-deep .el-tabs__item {
  line-height: 24px;
}
.upload-demo {
  width: 140px;
  height: 140px;
  border: 1px dashed #ccc;
}
.el-icon-plus {
  width: 140px;
  height: 50px;
  margin-top: 20px;
  font-size: 60px;
  color: #ccc;
}
::v-deep .el-tab-pane {
  font-size: 14px;
}
::v-deep .el-textarea__inner {
  height: 200px;
}
.box {
  margin: 0 20px;
}
.avatar {
  width: 100%;
  height: 140px;
}
.blosEsb {
  font-size: 12px;
  color: #ccc;
}
</style>
