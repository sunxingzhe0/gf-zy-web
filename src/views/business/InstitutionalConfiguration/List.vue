<template>
  <div class="accountWrap view__card">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        label="业务配置"
        name="setting"
        lazy
        v-loading.lock="setting.loading"
      >
        <div class="account_main">
          <List
            v-model="setting.query"
            :filter="filter"
            :columns="setting.columns"
            :tableData="setting.tableData"
            tableClass="setting-table"
          >
            <template v-slot:slot_doctorNum="{ row }">
              <router-link
                class="el-button el-button--text"
                :to="{
                  path: '/jurisdiction/account/list',
                  query: {
                    deptId: row.deptIds,
                    titleId: row.titleIds,
                    examineState: 'SUCCESS',
                  },
                }"
              >
                {{ row.doctorNum }}
              </router-link>
            </template>
            <template v-slot:slot_bizPrice="{ row }">
              <span>{{ pricechange(row) }}</span>
            </template>
            <template v-slot:slot_state="{ row, $index }">
              <el-switch
                :active-value="1"
                :inactive-value="0"
                v-model="row.state"
                @change="handleChange($event, row, $index)"
                active-text="启用"
                inactive-text="禁用"
                :width="50"
                class="textSwitch"
              ></el-switch>
            </template>

            <template v-slot:fixed="{ row }">
              <el-button type="text" @click="add(row)"> 修改 </el-button>

              <el-button type="text" @click="opanLog(row)"> 日志 </el-button>
              <!-- <router-link
                class="el-button el-button--text el-button--mini"
                :to="{
                  path: $route.path,
                  query: {
                    activeName: 'log',
                    businessRel: row.configId,
                  },
                }"
              >
                日志
              </router-link> -->
            </template>

            <template v-slot:footertool>
              <el-button type="primary" @click="add()"> 新增业务 </el-button>
            </template>
          </List>
        </div>
      </el-tab-pane>
      <!-- 在线咨询 -->
      <template v-if="'CONSULT' === type">
        <el-tab-pane label="视频规则配置" name="VIDEO" lazy>
          <el-form
            :model="rulesForm"
            :rules="rules"
            ref="formset"
            label-width="140px"
            label-position="left"
          >
            <el-form-item label="服务有效期限" prop="servicePeriod">
              <el-input
                class="input"
                v-model="rulesForm.servicePeriod"
              ></el-input>
              <el-select
                v-model="rulesForm.servicePeriodUnit"
                placeholder="请选择"
                style="width: 80px"
              >
                <el-option value="H" label="时"></el-option>
                <el-option value="M" label="分"></el-option>
                <el-option value="D" label="日"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="咨询条数设置" prop="consultNum">
              <el-input
                class="input"
                v-model="rulesForm.consultNum"
                placeholder="请输入"
              >
              </el-input>
              条
            </el-form-item>

            <el-form-item label="业务介绍" prop="introduction">
              <el-input
                class="input"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6 }"
                maxlength="500"
                v-model="rulesForm.introduction"
                show-word-limit
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button @click="activeName = 'setting'">返回</el-button>
              <el-button
                type="primary"
                :loading="pedding"
                @click="submitRules('formset')"
              >
                保存
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="图文规则配置" name="GRAPHIC" lazy>
          <el-form
            :model="rulesForm"
            :rules="rules"
            ref="formset"
            label-width="140px"
            label-position="left"
          >
            <el-form-item label="服务有效期限" prop="servicePeriod">
              <el-input
                class="input"
                v-model="rulesForm.servicePeriod"
              ></el-input>
              <el-select
                v-model="rulesForm.servicePeriodUnit"
                placeholder="请选择"
                style="width: 80px"
              >
                <el-option value="H" label="时"></el-option>
                <el-option value="M" label="分"></el-option>
                <el-option value="D" label="日"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="咨询条数设置" prop="consultNum">
              <el-input
                class="input"
                v-model="rulesForm.consultNum"
                placeholder="请输入"
              >
              </el-input>
              条
            </el-form-item>

            <el-form-item label="业务介绍" prop="introduction">
              <el-input
                class="input"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6 }"
                maxlength="500"
                v-model="rulesForm.introduction"
                show-word-limit
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button @click="activeName = 'setting'">返回</el-button>
              <el-button
                type="primary"
                :loading="pedding"
                @click="submitRules('formset')"
              >
                保存
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </template>

      <!-- 在线复诊 -->
      <template v-if="'REPEAT_CLINIC' === type">
        <el-tab-pane label="视频规则配置" name="VIDEO" lazy>
          <el-form
            :model="rulesForm"
            :rules="rules"
            ref="VIDEO_form"
            label-width="200px"
            label-position="left"
          >
            <el-form-item label="开处方操作截至诊室关闭后" prop="closeClinic">
              <el-input
                class="input"
                v-model="rulesForm.closeClinic"
              ></el-input>
              <el-select
                v-model="rulesForm.closeClinicUnit"
                placeholder="请选择"
                style="width: 80px"
              >
                <el-option value="H" label="时"></el-option>
                <el-option value="M" label="分"></el-option>
                <el-option value="D" label="日"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="第一次接通视频后计时" prop="firstVideo">
              <el-input class="input" v-model="rulesForm.firstVideo"></el-input>
              <el-select
                v-model="rulesForm.firstVideoUnit"
                placeholder="请选择"
                style="width: 80px"
              >
                <el-option value="H" label="时"></el-option>
                <el-option value="M" label="分"></el-option>
                <el-option value="D" label="日"></el-option>
              </el-select>
              <span style="margin-left: 10px; color: #444">自动结束服务</span>
            </el-form-item>

            <el-form-item label="预约时间到期后" prop="orderTime">
              <el-input class="input" v-model="rulesForm.orderTime"></el-input>
              <el-select
                v-model="rulesForm.orderTimeUnit"
                placeholder="请选择"
                style="width: 80px"
              >
                <el-option value="H" label="时"></el-option>
                <el-option value="M" label="分"></el-option>
                <el-option value="D" label="日"></el-option>
              </el-select>
              <span style="margin-left: 10px; color: #444"
                >未接通过视频， 则自动结束服务并退款</span
              >
            </el-form-item>

            <el-form-item label="业务介绍" prop="introduction">
              <el-input
                class="input"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6 }"
                maxlength="500"
                v-model="rulesForm.introduction"
                show-word-limit
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button @click="activeName = 'setting'">返回</el-button>
              <el-button
                type="primary"
                :loading="pedding"
                @click="submitRules('VIDEO_form')"
              >
                保存
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="图文规则配置" name="GRAPHIC" lazy>
          <el-form
            :model="rulesForm"
            :rules="rules"
            ref="GRAPHIC_form"
            label-width="200px"
            label-position="left"
          >
            <el-form-item label="开处方操作截至诊室关闭后" prop="closeClinic">
              <el-input
                class="input"
                v-model="rulesForm.closeClinic"
              ></el-input>
              <el-select
                v-model="rulesForm.closeClinicUnit"
                placeholder="请选择"
                style="width: 80px"
              >
                <el-option value="H" label="时"></el-option>
                <el-option value="M" label="分"></el-option>
                <el-option value="D" label="日"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="服务有效期限" prop="servicePeriod">
              <el-input
                class="input"
                v-model="rulesForm.servicePeriod"
              ></el-input>
              <el-select
                v-model="rulesForm.servicePeriodUnit"
                placeholder="请选择"
                style="width: 80px"
              >
                <el-option value="H" label="时"></el-option>
                <el-option value="M" label="分"></el-option>
                <el-option value="D" label="日"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="业务介绍" prop="introduction">
              <el-input
                class="input"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6 }"
                maxlength="500"
                v-model="rulesForm.introduction"
                show-word-limit
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button @click="activeName = 'setting'">返回</el-button>
              <el-button
                type="primary"
                :loading="pedding"
                @click="submitRules('GRAPHIC_form')"
              >
                保存
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </template>

      <el-tab-pane
        v-if="'CARRYON_PRESC' === type"
        label="规则配置"
        name="rule"
        lazy
      >
        <el-form
          :model="rulesForm"
          :rules="rules"
          ref="formset"
          label-width="200px"
          label-position="left"
        >
          <el-form-item label="服务有效期限" prop="servicePeriod">
            <el-input
              class="input"
              v-model="rulesForm.servicePeriod"
            ></el-input>
            <el-select
              v-model="rulesForm.servicePeriodUnit"
              placeholder="请选择"
              style="width: 80px"
            >
              <el-option value="H" label="时"></el-option>
              <el-option value="M" label="分"></el-option>
              <el-option value="D" label="日"></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="接诊后截至" prop="endService">
            <el-input class="input" v-model="rulesForm.endService"></el-input>
            <el-select
              v-model="rulesForm.endServiceUnit"
              placeholder="请选择"
              style="width: 80px;"
            >
              <el-option value="H" label="时"></el-option>
              <el-option value="M" label="分"></el-option>
              <el-option value="D" label="日"></el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item label="开处方操作截至诊室关闭后" prop="closeClinic">
            <el-input class="input" v-model="rulesForm.closeClinic"></el-input>
            <el-select
              v-model="rulesForm.closeClinicUnit"
              placeholder="请选择"
              style="width: 80px"
            >
              <el-option value="H" label="时"></el-option>
              <el-option value="M" label="分"></el-option>
              <el-option value="D" label="日"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="业务介绍" prop="introduction">
            <el-input
              class="input"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6 }"
              maxlength="500"
              v-model="rulesForm.introduction"
              show-word-limit
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="activeName = 'setting'">返回</el-button>
            <el-button
              type="primary"
              :loading="pedding"
              @click="submitRules('formset')"
            >
              保存
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        v-if="'REPORT_READ' === type"
        label="规则配置"
        name="rule"
        lazy
      >
        <el-form
          :model="rulesForm"
          :rules="rules"
          ref="formset"
          label-width="200px"
          label-position="left"
        >
          <el-form-item label="服务有效期限" prop="servicePeriod">
            <el-input
              class="input"
              v-model="rulesForm.servicePeriod"
            ></el-input>
            <el-select
              v-model="rulesForm.servicePeriodUnit"
              placeholder="请选择"
              style="width: 80px"
            >
              <el-option value="H" label="时"></el-option>
              <el-option value="M" label="分"></el-option>
              <el-option value="D" label="日"></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="接诊后截至" prop="endService">
            <el-input class="input" v-model="rulesForm.endService"></el-input>
            <el-select
              v-model="rulesForm.endServiceUnit"
              placeholder="请选择"
              style="width: 80px;"
            >
              <el-option value="H" label="时"></el-option>
              <el-option value="M" label="分"></el-option>
              <el-option value="D" label="日"></el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item label="报告解读操作截至诊室关闭后" prop="readClose">
            <el-input class="input" v-model="rulesForm.readClose"></el-input>
            <el-select
              v-model="rulesForm.readCloseUnit"
              placeholder="请选择"
              style="width: 80px"
            >
              <el-option value="H" label="时"></el-option>
              <el-option value="M" label="分"></el-option>
              <el-option value="D" label="日"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="业务介绍" prop="introduction">
            <el-input
              class="input"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6 }"
              maxlength="500"
              v-model="rulesForm.introduction"
              show-word-limit
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="activeName = 'setting'">返回</el-button>
            <el-button
              type="primary"
              :loading="pedding"
              @click="submitRules('formset')"
            >
              保存
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane
        label="操作日志"
        name="log"
        lazy
        v-loading.lock="log.loading"
      >
        <div class="account_main">
          <List
            v-model="log.query"
            :columns="log.columns"
            :tableData="log.tableData"
            tableClass="account-table"
          >
          </List>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      v-loading="dialogLoading"
      :title="`${form.configId ? '编辑业务' : '新增业务'} - ${
        type === 'CONSULT'
          ? '在线咨询'
          : type === 'REPEAT_CLINIC'
          ? '在线复诊'
          : type === 'REPORT_READ'
          ? '报告解读'
          : '慢病续方'
      }`"
      :visible.sync="isAdd"
      :close-on-click-modal="false"
      custom-class="component__dialog"
      append-to-body
      @open="handleDialogOpen"
      @closed="handleDialogClosed('form', true)"
    >
      <el-scrollbar>
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="100px"
          label-position="left"
        >
          <el-form-item label="形式" prop="bizWays" ref="bizWays">
            <el-checkbox-group v-model="form.bizWays" @change="changeBizWays">
              <el-checkbox
                v-for="{ key, title, disabled } in bizWayEnums"
                :key="key"
                :label="key"
                :disabled="disabled"
              >
                {{ title }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="名称" prop="name" ref="name">
            <el-input
              placeholder="请输入"
              v-model="form.name"
              maxlength="20"
              show-word-limit
            ></el-input>
          </el-form-item>

          <el-form-item label="适用职称" prop="titleIds" ref="titleIds">
            <el-select
              v-model="form.titleIds"
              filterable
              multiple
              style="width: 100%"
              placeholder="请选择"
              @change="initPriceDto"
            >
              <el-option
                v-for="{ id, name } in pre.title"
                :key="id"
                :label="name"
                :value="id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="适用科室" prop="deptLables" ref="deptIds">
            <el-select
              v-model="deptLables"
              filterable
              multiple
              :filter-method="handleFilter"
              @remove-tag="removeTag"
              style="width: 100%"
              placeholder="请选择"
            >
              <el-option :value="form.deptIds" style="height: auto; padding: 0">
                <el-tree
                  :data="dept"
                  :props="defaultProps"
                  show-checkbox
                  ref="tree"
                  node-key="id"
                  default-expand-all
                  @node-click="handleNodeClick"
                  highlight-current
                  current-node-key="node"
                  :default-checked-keys="form.deptIds"
                  :filter-node-method="filterNode"
                  @check="handleChcek"
                >
                  <!--  <span slot-scope="{ node, data }" class="custom-tree-node">
                    <span>{{ data.name }}</span>
                    <span>{{ data.resourceNum }}</span>
                  </span> -->
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 价格配置更改 -->
          <el-form-item label="价格配置">
            <el-row>
              <el-col :span="8" v-for="(v, vi) in form.newPriceDtos" :key="vi">
                <el-form-item
                  :label="v.label"
                  label-width="50px"
                  style="margin-right: 40px"
                  :prop="`newPriceDtos.${vi}.itemIds`"
                  :rules="newpriceDtoRules"
                >
                  <el-select
                    @change="changeVal"
                    v-model="v.itemIds"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(it, iti) in feeOptions"
                      :key="iti"
                      :label="`${it.itemName} ¥ ${it.price}`"
                      :value="it.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <!--  -->
          <!-- <el-form-item label="价格配置" prop="priceDto" ref="priceDto">
            <el-row
              style="margin-bottom: 22px"
              v-for="({ titleId, title }, index) in form.priceDto"
              :key="titleId"
            >
              <el-col :span="3" class="text-overflow">{{ title }}</el-col>
              <el-col v-for="(value, key) in bizWayEnum" :key="key" :span="7">
                <el-form-item
                  v-if="form.bizWays.includes(key)"
                  :prop="`priceDto.${index}.price.${key}`"
                  :label="value"
                  :rules="priceDtoRules"
                  label-width="50px"
                  style="margin-right: 40px"
                >
                  <el-input
                    class="custom-input"
                    size="mini"
                    v-model="form.priceDto[index].price[key]"
                  >
                    <template slot="prepend">¥</template>
                    <template slot="suffix">/ 次</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item> -->

          <el-form-item label="状态">
            <el-radio-group v-model="form.state">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="创建时间" v-show="form.configId">
            <div>{{ form.createDate }}</div>
          </el-form-item>
          <el-form-item label="创建人" v-show="form.configId">
            <div>{{ form.createUser }}</div>
          </el-form-item>
        </el-form>
      </el-scrollbar>

      <div slot="footer" class="is-center">
        <el-button @click="isAdd = false">取 消</el-button>
        <el-button type="primary" :loading="pedding" @click="submit('form')">
          确 定
        </el-button>
      </div>
    </el-dialog>

    <dialogBillDataf ref="dialogBillData"></dialogBillDataf>
  </div>
</template>

<script>
import { List, mixin } from '@/components'
import { invalidFieldSetFocus } from '@/utils'

import {
  orgConfigList,
  updateOrgBizState,
  addBizConfig,
  updateBizConfig,
  backBizConfigInfo,
  findBizRulesInfo,
  updateBizRules,
  getFeeItem,
} from '@/api/business'
import { loggerBillData } from '@/api/log'
import { titleChooseList, deptOuterChooseList } from '@/api'
import dialogBillDataf from './components/dialogBillData'
const pre = {
  title: [],
}

export default {
  name: 'business_consult',
  props: {
    type: {
      type: String,
      default: 'CONSULT',
    },
  },
  components: {
    List,
    dialogBillDataf,
  },
  mixins: [
    mixin([
      { fetchListFunction: orgConfigList, prop: 'setting' },
      { fetchListFunction: loggerBillData, prop: 'log' },
    ]),
  ],
  data() {
    this.pre = pre

    this.bizWayEnum = {
      GRAPHIC: '图文',
      PHONE: '电话',
      VIDEO: '视频',
    }

    this.filter = {
      date: {
        props: {
          options: [{ label: '创建日期', value: 0 }],
        },
        keys: ['timeType', 'startTime', 'endTime'],
      },
      search: {
        props: {
          options: [{ label: '名称', value: 0 }],
        },
        keys: ['searchType', 'searchKeywords'],
      },
      popover: [
        {
          props: {
            label: '业务形式',
            options: [
              { label: '不限', value: '' },
              { label: '图文', value: 'GRAPHIC' },
              { label: '视频', value: 'VIDEO' },
              { label: '电话', value: 'PHONE' },
            ],
          },
          keys: 'bizWay',
        },
        // {
        //   props: {
        //     label: '业务最低价',
        //     is: 'InputRange',
        //   },
        //   keys: ['lowBeginPrice', 'lowEndPrice'],
        // },
        // {
        //   props: {
        //     label: '业务最高价',
        //     is: 'InputRange',
        //   },
        //   keys: ['highBeginPrice', 'highEndPrice'],
        // },
        {
          props: {
            label: '适用职称',
            options: [
              { label: '不限', value: '' },
              ...pre.title.map(_ => ({ label: _.name, value: _.id })),
            ],
          },
          keys: 'titleId',
        },
        {
          props: {
            label: '医生数量',
            is: 'InputRange',
          },
          keys: ['beginNum', 'endNum'],
        },
        {
          props: {
            label: '状态',
            options: [
              { label: '不限', value: '' },
              { label: '启用', value: 1 },
              { label: '禁用', value: 0 },
            ],
          },
          keys: 'state',
        },
      ],
    }

    this.rules = {
      bizWays: [
        {
          type: 'array',
          required: true,
          message: '请选择业务形式',
          trigger: 'blur',
        },
      ],
      name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      titleIds: [
        {
          type: 'array',
          required: true,
          message: '请选择适用职称',
          trigger: 'blur',
        },
      ],
      deptIds: [
        {
          type: 'array',
          required: true,
          message: '请选择适用科室',
          trigger: 'blur',
        },
      ],
      priceDto: [
        {
          type: 'array',
          required: true,
          message: '请输入价格配置',
          trigger: 'blur',
        },
      ],

      servicePeriod: [
        { required: true, message: '请输入服务有效期限', trigger: 'blur' },
      ],
      endService: [{ required: true, message: '请输入', trigger: 'blur' }],
      closeClinic: [{ required: true, message: '请输入', trigger: 'blur' }],
      readClose: [{ required: true, message: '请输入', trigger: 'blur' }],
      consultNum: [
        { required: true, message: '请设置咨询条数', trigger: 'blur' },
      ],
      introduction: [
        { required: true, message: '请输入业务介绍', trigger: 'blur' },
      ],
      firstVideo: [{ required: true, message: '请输入', trigger: 'blur' }],
      orderTime: [{ required: true, message: '请输入', trigger: 'blur' }],
    }

    this.priceDtoRules = {
      validator: (rule, value, callback) => {
        if (Number.isNaN(-value)) {
          callback(new Error('请输入数字'))
        } else if (value > 1e8) {
          callback(new Error('最大价格1亿'))
        } else if (!/^\d{1,8}(.\d{0,2})?$/.test(value)) {
          callback(new Error('最多两位小数'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    }
    this.newpriceDtoRules = {
      validator: (rule, value, callback) => {
        console.log(value, '值')
        if (!value) {
          callback(new Error('请选择价格'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    }
    return {
      dialogLoading: false,
      //默认
      defaultProps: {
        children: 'next',
        label: 'name',
      },
      add_: '',
      activeName: this.$route.query.activeName ?? 'setting',
      isAdd: false,
      setting: {
        query: {
          pageSize: 10,
          currentNum: 1,
          timeType: 0,
          searchType: 0,
          bizType: this.type,
        },
        columns: {
          index: {
            hidden: true,
          },

          doctorNum: {
            label: '医生数量',
            prop: 'slot_doctorNum',
          },
          state: {
            label: '状态',
            prop: 'slot_state',
          },
          bizPrice: {
            label: '业务价格',
            prop: 'slot_bizPrice',
          },
          createDate: {
            minWidth: 160,
          },
          fixed: {
            minWidth: 140,
          },
        },
      },
      log: {
        query: {
          pageSize: 10,
          currentNum: 1,
          businessRel:
            this.type == 'CONSULT'
              ? this.$store.state.user.orgId + 'ZX'
              : this.type == 'REPEAT_CLINIC'
              ? this.$store.state.user.orgId + 'FZ'
              : this.type == 'CARRYON_PRESC'
              ? this.$store.state.user.orgId + 'XF'
              : this.type == 'REPORT_READ'
              ? this.$store.state.user.orgId + 'JD'
              : '',
          bizType: this.type,
        },
        columns: {
          index: {
            hidden: true,
          },
          storeName: {
            hidden: true,
          },
        },
      },
      dept: [],
      deptLables: [],
      feeOptions: [],
      form: {
        bizType: this.type,
        bizWays: [],
        name: '',
        titleIds: [],
        deptIds: [],
        priceDto: [],
        state: 1,
        newPriceDtos: [],
      },
      pedding: false,
      rulesForm: {
        servicePeriod: '',
        consultNum: '',
        introduction: '',
        unit: 'H',
      },
      formTypes: {
        GRAPHIC: '图文',
        VIDEO: '视频',
        PHONE: '电话',
      },
    }
  },
  computed: {
    bizWayEnums() {
      const enums = [
        {
          key: 'GRAPHIC',
          title: '图文',
          disabled: false,
        },
        {
          key: 'VIDEO',
          title: '视频',
          disabled: false,
        },
        {
          key: 'PHONE',
          title: '电话',
          disabled: true,
        },
      ]

      return this.type === 'CONSULT'
        ? enums.map(item => {
            item.key === 'VIDEO' && (item.disabled = false)
            return item
          })
        : this.type === 'REPEAT_CLINIC'
        ? [enums[0], enums[1]]
        : [enums[0], Object.assign(enums[1], { disabled: true })]
    },
  },
  watch: {
    $route: function (val) {
      this.getDeptList()
      const { activeName, businessRel } = val.query
      this.activeName = activeName || 'setting'
      this.setting.query.bizType = this.type
      this.setting.query.currentNum = 1
      this.form.bizType = this.type
      this.add_ = businessRel
      // if (activeName === 'log') this.log.query.businessRel = businessRel
      this.setting.query = {
        pageSize: 10,
        currentNum: 1,
        timeType: 0,
        searchType: 0,
        bizType: this.type,
      }
      // this.$_fetchTableData(orgConfigList)
    },
  },
  async beforeRouteEnter(to, from, next) {
    pre.title = pre.title.length ? pre.title : await titleChooseList()

    next(vm => {
      if (['rule', 'VIDEO', 'GRAPHIC'].includes(to.query.activeName))
        vm.handleClick({ name: to.query.activeName })
    })
  },
  created() {
    this.getDeptList()
    this.getFeeItem()
  },
  methods: {
    //获取收费项目
    async getFeeItem() {
      this.feeOptions = await getFeeItem()
    },
    changeVal(e) {
      console.log(e, 'itemid')
      const price = this.feeOptions.filter(v => v.id == e)[0].price
      console.log(price)
      this.form.newPriceDtos.forEach(i => {
        if (i.itemIds === e) {
          i.price = price
        }
      })
    },
    changeBizWays(e) {
      const list = e.map(i => {
        return {
          ways: i,
          label: this.formTypes[i],
          itemIds: '',
        }
      })
      this.$set(this.form, 'newPriceDtos', list)
      console.log(this.form.newPriceDtos)
    },
    //触发筛选函数
    handleFilter(data) {
      this.$refs.tree.filter(data)
    },
    //筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    //移除tag
    removeTag(data) {
      let res = this.$refs.tree.getCheckedNodes(true, true)
      //删除tag移除项
      res.forEach((item, index) => {
        item.name === data && res.splice(index, 1)
      })
      this.form.deptIds = res.map(item => item.id)
      //重新设置选中
      this.$refs.tree.setCheckedNodes(this.form.deptIds)
    },
    //点击树节点
    handleNodeClick() {},
    //树节点选中时
    handleChcek() {
      //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
      const res = this.$refs.tree.getCheckedNodes(true, true)
      this.form.deptIds = res.map(item => item.id)
      this.deptLables = res.map(item => item.name)
    },

    //打开日志弹窗
    opanLog(row) {
      this.$refs.dialogBillData.open(row)
    },
    // 价格返回值转换
    pricechange(row) {
      if (!row.bizPrice) {
        return '-'
      }
      let num = row.bizPrice.substring(1)
      const price = '¥' + (Number(num) / 100).toFixed(2)
      return price
    },
    handleClick({ name, $slots }) {
      // this.$router.push({
      //   path: this.$route.path,
      //   query: {
      //     activeName: name,
      //   },
      // })
      if (name == 'log') {
        this.log.query = {
          pageSize: 10,
          currentNum: 1,
          businessRel:
            this.type == 'CONSULT'
              ? this.$store.state.user.orgId + 'ZX'
              : this.type == 'REPEAT_CLINIC'
              ? this.$store.state.user.orgId + 'FZ'
              : this.type == 'CARRYON_PRESC'
              ? this.$store.state.user.orgId + 'XF'
              : this.type == 'REPORT_READ'
              ? this.$store.state.user.orgId + 'BG'
              : '',
          bizType: this.type,
        }
      }

      if (['rule', 'VIDEO', 'GRAPHIC'].includes(name)) {
        this.tagName = name
        this.fetchRule({
          bizType: this.type,
          ...(name !== 'rule' ? { bizWay: name } : {}),
        })
      }

      if (this[name]?.tableData.list.length > 0) {
        this.$nextTick(() => {
          $slots.default?.[0].componentInstance?.doLayout?.()
        })
      }

      this.$_fetchTableData(name)
    },

    async handleChange(state, { configId }, index) {
      await updateOrgBizState({ configId, state }).catch(err => {
        this.setting.tableData.list[index].state = !state
        throw Error(err)
      })
      this.setting.tableData.list[index].state = state

      this.$message({
        type: 'success',
        message: state ? '配置启用成功' : '配置禁用成功',
        showClose: true,
      })
    },
    depList(arr) {
      let list = [...arr]
      list.forEach(item => {
        if (item.deptInner && item.deptInner.length > 0) {
          item.next = item.deptInner
        } else {
          if (item.next && item.next.length > 0) {
            this.depList(item.next)
          }
        }
      })
      return list
    },
    //获取科室列表树形数据
    async getDeptList() {
      const list = await deptOuterChooseList({ tree: true })
      list.forEach(item => {
        item.next && (item.disabled = true)
      })
      this.dept = list
    },
    handleDialogOpen() {
      // const deptIds = this.form.deptIds
      // if (deptIds.length) {
      //   this.form.deptIds = deptIds.map(deptId =>
      //     list.map(({ id }) => id).includes(deptId)
      //       ? [deptId]
      //       : list
      //           .map(({ id, next }) => {
      //             console.log(next?.map(child => child.id).includes(deptId))
      //             let arr = next?.map(child => child.id).includes(deptId)
      //               ? [id, deptId]
      //               : [deptId]
      //             console.log(arr)
      //             return arr
      //             // next?.map(child => child.id).includes(deptId) && [
      //             //   id,
      //             //   deptId,
      //             // ],
      //           })
      //           .filter(item => item)[0],
      //   )
      // }
    },
    /**
     *
     * @param formName 需要清空的表单名
     * @param onlyChild 是否单独使用form-item的resetField，（部分表单在清空后，prop引用的深层对象会被删除，导致验证找不到prop的路径）
     */
    handleDialogClosed(formName, onlyChild) {
      this.deptLables = []
      //清空选项
      this.$refs.tree.setCheckedNodes([])
      if (onlyChild) {
        Object.keys(this[formName]).forEach(param => {
          this.$refs[param]?.resetField()
        })
        return
      }
      this.$refs[formName].resetFields()
    },
    initPriceDto(val) {
      const map = {}
      this.form.priceDto.forEach(item => (map[item.titleId] = item))

      this.form.priceDto = val.map(
        titleId =>
          map[titleId] ?? {
            title: pre.title.find(({ id }) => id === titleId).name,
            titleId,
            price: {},
          },
      )
    },
    //新增编辑业务
    async add(row) {
      this.isAdd = true
      if (!row) {
        this.form = {
          bizType: this.type,
          bizWays: [],
          name: '',
          titleIds: [],
          deptIds: [],
          priceDto: [],
          state: 1,
        }
        return
      }
      this.dialogLoading = true
      const data = await backBizConfigInfo({ configId: row.configId })
      this.form = {
        ...this.form,
        configId: data.configId,
        bizWays: data.ways.split(','),
        name: data.name,
        titleIds: data.titleIds,
        deptIds: data.deptIds,
        createDate: data.createDate,
        createUser: data.createUser,
        newPriceDtos: data.priceDto.reduce((_, item) => {
          _.push({
            ways: item.ways,
            label: this.formTypes[item.ways],
            itemIds: item.itemIds,
            title: item.titleName,
            titleId: item.titleId,
            price: item.price,
          })
          return _
        }, []),
        // priceDto: data.priceDto.reduce((_, item) => {
        //   const _t = _.findIndex(({ titleId }) => titleId === item.titleId)

        //   if (_t < 0) {
        //     _.push({
        //       title: item.titleName,
        //       titleId: item.titleId,
        //       price: {
        //         [item.ways]: item.price,
        //       },
        //     })
        //   } else {
        //     _[_t].price[item.ways] = item.price
        //   }

        //   return _
        // }, []),
        state: data.state,
      }
      //选中项赋值
      this.$nextTick(() => {
        const res = this.$refs.tree.getCheckedNodes(true, true)
        console.log(res, '选中项')
        this.deptLables = res.map(item => item.name)
        console.log(this.deptLables)
      })
      this.dialogLoading = false
    },
    submit(formName) {
      this.$refs[formName].validate(async (valid, invalidFields) => {
        if (!valid) {
          invalidFieldSetFocus(this.$refs[formName], invalidFields)
          return
        }

        this.pedding = true
        // console.log(this.form.deptIds)
        // if (!this.form.deptIds || this.form.deptIds.length == 0) {
        //   this.$message.info('请选择适用科室')
        //   return
        // }
        // const form = Object.assign({}, this.form, {
        //   deptIds: this.form.deptIds.map(ids => ids[ids.length - 1]),
        // })
        // const form = Object.assign({}, this.form, {
        //   deptIds: this.form.deptIds.map(ids => ids[ids.length - 1]),
        // })
        const form = this.form
        const params = {
          ...form,
          priceDto: this.form.priceDto.reduce((_, { titleId, price }) => {
            _.push(
              ...this.form.bizWays.map(ways => ({
                titleId,
                ways,
                price: price[ways],
              })),
            )

            return _
          }, []),
        }
        // if (this.type === 'REPEAT_CLINIC' || this.type === 'CARRYON_PRESC') {
        params.priceDto = params.newPriceDtos
        // }
        console.log(params, 'params')
        await (this.form.configId ? updateBizConfig : addBizConfig)(
          params,
        ).finally(() => setTimeout(() => (this.pedding = false), 200))

        this.$message({
          type: 'success',
          message: '完成',
          showClose: true,
        })

        this.isAdd = false
        this.$_fetchTableData()
      })
    },

    async fetchRule(params) {
      const data = await findBizRulesInfo(params)
      this.rulesForm = {
        ...data,
        servicePeriodUnit: '',
        endServiceUnit: '',
        closeClinicUnit: '',
        firstVideoUnit: '',
        orderTimeUnit: '',
        readCloseUnit: '',
      }
      ;[
        'servicePeriod',
        'endService',
        'closeClinic',
        'firstVideo',
        'orderTime',
        'readClose',
      ].forEach(key => {
        if (data[key]) {
          ;[this.rulesForm[key], this.rulesForm[key + 'Unit']] = data[
            key
          ].split(',')
        }
      })
    },

    submitRules(formName) {
    
      this.$refs[formName].validate(async (valid, invalidFields) => {
        if (valid) {
          this.pedding = true
          await updateBizRules({
            ...this.rulesForm,
            bizType: this.type,
            bizWay: this.tagName,
            servicePeriod: [
              this.rulesForm.servicePeriod,
              this.rulesForm.servicePeriodUnit,
            ].join(','),

            endService: [
              this.rulesForm.endService,
              this.rulesForm.endServiceUnit,
            ].join(','),
            closeClinic: [
              this.rulesForm.closeClinic,
              this.rulesForm.closeClinicUnit,
            ].join(','),
            readClose: [
              this.rulesForm.readClose,
              this.rulesForm.readCloseUnit,
            ].join(','),
            firstVideo: [
              this.rulesForm.firstVideo,
              this.rulesForm.firstVideoUnit,
            ].join(','),
            orderTime: [
              this.rulesForm.orderTime,
              this.rulesForm.orderTimeUnit,
            ].join(','),
          }).finally(() => setTimeout(() => (this.pedding = false), 200))

          this.$message({
            type: 'success',
            message: '完成',
            showClose: true,
          })
        } else {
          invalidFieldSetFocus(this.$refs[formName], invalidFields)
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.input {
  width: 400px;
  margin-right: 10px;
}
.accountWrap {
  padding: 0 !important;
  .setting-table {
    height: calc(100vh - 135px);
  }
  .account_main {
    padding: 10px;
    .account-table {
      height: calc(100vh - 135px);
    }
  }
  .el-tabs--border-card {
    border: 0;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0);
  }
  ::v-deep.el-tabs--border-card > .el-tabs__header {
    border: 0;
    background-color: #f2f2f2;
  }
  ::v-deep.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
    border: 1px solid transparent;
  }
}

.el-dialog__wrapper > ::v-deep .component__dialog {
  min-width: 800px;

  .custom-input {
    .el-input-group__prepend {
      padding: 0 10px;
    }

    .el-input__suffix-inner {
      line-height: 28px;
    }
  }
}
::v-deep .el-tree-node__content {
  height: 36px !important;
  font-size: 14px;
}
</style>
