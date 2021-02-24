<template>
  <el-tabs v-if="id" v-model="activeName" type="border-card">
    <el-tab-pane label="基本信息" name="basic">
      <el-form
        ref="basicForm"
        :model="model"
        :rules="rules"
        label-width="120px"
      >
        <h3 class="view__title">个人信息</h3>

        <el-form-item label="头像" prop="avatar">
          <el-image
            style="
              width: 100px;
              height: 100px;
              border-radius: 50%;
              vertical-align: bottom;
              overflow: hidden;
              text-align: center;
            "
            fit="cover"
            :src="FILE_URL(model.avatar)"
          >
            <template #error>
              <img src="@/assets/headerImg.png" alt="" />
              <!-- <i
                class="el-icon-user-solid"
                style="font-size: 60px; line-height: 100px;"
              ></i> -->
            </template>
          </el-image>

          <el-upload
            style="display: inline-block;"
            action
            :show-file-list="false"
            :disabled="platformAccount"
            accept="image/png, image/jpeg, image/gif, image/webp"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeImageUpload"
            :http-request="httpRequest"
          >
            <el-button size="small" type="primary" :disabled="platformAccount"
              >选择照片</el-button
            >
            <el-button
              size="small"
              @click.stop="deleteAvatar"
              type="danger"
              :disabled="platformAccount"
              >删除</el-button
            >
          </el-upload>
        </el-form-item>

        <el-form-item label="登录账号" prop="account">
          {{ model.account }}
        </el-form-item>

        <el-row class="view__content" :gutter="20">
          <el-col :md="12">
            <el-form-item label="账号角色" prop="role">
              <div
                style="margin-left: -10px; overflow: hidden;"
                v-show="model.roleId.length"
              >
                <el-tag
                  style="margin: 0 0 10px 10px;"
                  v-for="{ name, id } in roles4Tag"
                  :key="id"
                  closable
                  @close="handleClose(id)"
                >
                  {{ name }}
                </el-tag>
              </div>

              <el-select
                v-show="showSelect"
                v-model="model.roleId"
                :disabled="platformAccount"
                multiple
                filterable
              >
                <el-option
                  v-for="{ name, id } in roles"
                  :key="id"
                  :label="name"
                  :value="id"
                ></el-option>
              </el-select>

              <el-button
                v-show="!showSelect"
                icon="el-icon-plus"
                type="text"
                :disabled="platformAccount"
                @click="showSelect = true"
              >
                添加
              </el-button>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="从业年限" prop="workHistory">
              <el-date-picker
                v-model="model.workHistory"
                type="date"
                style="width: 100%;"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
              <!-- <el-select
                style="width: 100%;"
                v-model="model.workHistory"
                filterable
              ></el-select> -->
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="账号类型" prop="type">
              <el-radio-group v-model="model.type">
                <el-radio
                  v-for="{ label, text } in accountType"
                  :key="label"
                  :label="label"
                >
                  {{ text }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="是否本院" prop="inHospital">
              <el-select
                style="width: 100%;"
                v-model="model.inHospital"
                filterable
              >
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item
              label="任职医院"
              :rules="{ required: true, message: '请输入', trigger: 'blur' }"
            >
              <el-select
                disabled
                style="width: 100%;"
                :value="orgName"
                filterable
              >
                <el-option :label="orgName" :value="orgName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="是否推荐" prop="recommend">
              <el-select
                style="width: 100%;"
                v-model="model.recommend"
                filterable
              >
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="明星专家" prop="star">
              <el-select style="width: 100%;" v-model="model.star" filterable>
                <el-option label="是" :value="true"></el-option>
                <el-option label="否" :value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="工号" prop="workNo">
              <el-input
                v-model="model.workNo"
                :disabled="platformAccount"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="邮箱" prop="mail">
              <el-input v-model="model.mail"></el-input>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="擅长" prop="skilled">
              <el-input
                v-model="model.skilled"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6 }"
                placeholder="请输入擅长内容，最多1000字"
                maxlength="1000"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="个人简介" prop="intro">
              <el-input
                v-model="model.intro"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6 }"
                placeholder="请输入个人经历、学术贡献，最多1000字"
                maxlength="1000"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="执业经历" prop="practiceInfo">
              <el-input
                v-model="model.practiceInfo"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6 }"
                placeholder="请输入"
                maxlength="1000"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="学术经历" prop="academicInfo">
              <el-input
                v-model="model.academicInfo"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6 }"
                placeholder="请输入"
                maxlength="1000"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <h3 class="view__title">业务设置</h3>
        <Business
          ref="business"
          :doctorId="id"
          :defDeptId="model.defDeptId"
          :titleId="model.titleId"
        />

        <EditFooter class="is-center" style="z-index: 10;">
          <el-button
            type="primary"
            size="small"
            :loading="loading"
            @click="submit('basicForm')"
          >
            保存
          </el-button>
        </EditFooter>
      </el-form>
    </el-tab-pane>

    <el-tab-pane label="实名信息" name="auth">
      <el-form
        style="max-width: 500px; position: relative;"
        ref="authForm"
        :model="model"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="model.name"
            v-show="!model.idCard"
            :disabled="platformAccount"
          ></el-input>
          <span v-show="model.idCard">{{ model.name }}</span>
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-select
            style="width: 100%;"
            v-model="model.sex"
            v-show="!model.idCard"
            :disabled="platformAccount"
          >
            <el-option label="女" :value="0"></el-option>
            <el-option label="男" :value="1"></el-option>
          </el-select>
          <span v-show="model.idCard">{{
            model.sex == '1' ? '男' : '女'
          }}</span>
        </el-form-item>

        <el-form-item label="身份证" prop="idCard">
          <el-input
            v-model="model.prestoreIdCard"
            v-show="!model.idCard"
            :disabled="platformAccount"
          ></el-input>
          <span v-show="model.idCard">{{ model.idCard }}</span>
        </el-form-item>
        <el-button
          type="primary"
          size="small"
          @click="clear('idCard')"
          v-show="model.idCard"
          class="reset_btn"
          :disabled="platformAccount"
        >
          重置
        </el-button>
      </el-form>
      <div
        class="line"
        style="
          width: 100%;
          border-top: 1px solid #f1f1f1;
          padding-bottom: 22px;
        "
      ></div>
      <el-form
        style="max-width: 500px; position: relative;"
        ref="authForm"
        :model="model"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-show="!model.phone"
            v-model="model.prestorePhone"
            :disabled="platformAccount"
          ></el-input>
          <span v-show="model.phone">{{ model.phone }}</span>
        </el-form-item>
        <el-button
          type="primary"
          size="small"
          @click="clear('phone')"
          v-show="model.phone"
          class="reset_btn"
          :disabled="platformAccount"
        >
          重置
        </el-button>
      </el-form>
      <EditFooter
        class="is-center"
        style="z-index: 10; width: 500px;"
        v-if="!model.idCard || !model.phone"
      >
        <el-button
          type="primary"
          size="small"
          :loading="loading"
          @click="submit('authForm')"
        >
          保存
        </el-button>
        <!-- <el-button
          v-if="show1"
          type="primary"
          size="small"
          :loading="loading"
          @click="clear"
        >
          重置
        </el-button> -->
      </EditFooter>
    </el-tab-pane>

    <el-tab-pane label="资格证书" name="certificate">
      <el-form
        ref="certificateForm"
        :model="model"
        :rules="rules"
        label-width="120px"
        :disabled="model.examine"
      >
        <el-row class="view__content" :gutter="20">
          <el-col :md="12">
            <el-form-item label="科室" prop="deptId">
              <el-select
                style="width: 100%;"
                v-model="model.deptId"
                filterable
                multiple
                :disabled="platformAccount"
                @change="setDefaultDept"
              >
                <el-option
                  v-for="{ id, name } in pre.dept"
                  :key="id"
                  :label="name"
                  :value="id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="默认科室" prop="defDeptId">
              <el-select
                style="width: 100%;"
                v-model="model.defDeptId"
                filterable
                :disabled="platformAccount"
              >
                <el-option
                  v-for="{ id, name } in dept4default"
                  :key="id"
                  :label="name"
                  :value="id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="职称" prop="titleId">
              <el-select
                style="width: 100%;"
                v-model="model.titleId"
                filterable
                :disabled="platformAccount"
              >
                <el-option
                  v-for="{ id, name } in pre.title"
                  :key="id"
                  :label="name"
                  :value="id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="药房" prop="storeId">
              <el-select
                style="width: 100%;"
                v-model="model.storeId"
                @change="changeStore"
                filterable
                multiple
              >
                <el-option
                  v-for="{ id, name } in pre.store"
                  :key="id"
                  :label="name"
                  :value="id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :md="12">
            <el-form-item label="职务" prop="position">
              <el-select
                style="width: 100%;"
                v-model="model.dutyType"
                filterable
                :disabled="platformAccount"
              >
                <el-option
                  v-for="{ value, label } in post"
                  :key="value"
                  :label="label"
                  :value="value"
                ></el-option
              ></el-select>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="执业范围" prop="practiceArea">
              <el-input
                v-model="model.practiceArea"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6 }"
                placeholder="请输入"
                maxlength="1000"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item prop="certificate">
              <el-checkbox-group
                v-model="certificate"
                @change="resolveCertificateChange"
              >
                <el-checkbox
                  v-for="(value, key) in certificateEnum"
                  :key="key"
                  :label="key"
                >
                  {{ value }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item
          v-for="({ type, fileId }, index) in model.certs"
          :key="type"
          :label="certificateEnum[type]"
        >
          <el-form-item
            v-if="type === 'DOCTOR_QUAL'"
            style="margin-bottom: 20px;"
            :rules="{ required: true, message: '请输入', trigger: 'blur' }"
          >
            <el-input
              style="width: 33%;"
              v-model="model.certs[index].practiceOrg"
              placeholder="主要执业单位"
            ></el-input>
          </el-form-item>

          <el-input
            style="width: 33%;"
            v-model="model.certs[index].certNo"
            :placeholder="`请输入${certificateEnum[type]}编号`"
          ></el-input>

          <div style="margin-top: 10px;" v-for="(id, _) in fileId" :key="id">
            <el-image
              style="
                vertical-align: bottom;
                overflow: hidden;
                width: 220px;
                height: 130px;
              "
              fit="cover"
              :src="FILE_URL(id)"
              :preview-src-list="model.certs[index].fileId.map(FILE_URL)"
            ></el-image>

            <el-upload
              style="display: inline-block; margin-left: 10px;"
              action
              :show-file-list="false"
              accept="image/png, image/jpeg, image/gif, image/webp"
              :on-success="res => handleImageSuccess(res, index, _)"
              :before-upload="beforeImageUpload"
              :http-request="httpRequest"
            >
              <el-button size="small" type="primary">选择照片</el-button>
              <el-button
                size="small"
                type="danger"
                @click.stop="deleteImg(index, _)"
                >删除</el-button
              >
            </el-upload>
          </div>

          <div style="margin-top: 10px;">
            <el-image
              style="
                vertical-align: bottom;
                overflow: hidden;
                width: 220px;
                height: 130px;
              "
              fit="cover"
              :src="certificateExampleImg"
              :preview-src-list="[certificateExampleImg]"
            ></el-image>

            <el-upload
              style="display: inline-block; margin-left: 10px;"
              action
              :show-file-list="false"
              accept="image/png, image/jpeg, image/gif, image/webp"
              :on-success="
                res =>
                  handleImageSuccess(
                    res,
                    index,
                    model.certs[index].fileId.length,
                  )
              "
              :before-upload="beforeImageUpload"
              :http-request="httpRequest"
            >
              <el-button size="small" type="primary">选择照片</el-button>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>

      <EditFooter class="is-center" style="z-index: 10;">
        <template v-if="!model.examine">
          <el-button
            type="primary"
            size="small"
            plain
            :loading="loading"
            @click="submit('certificateForm')"
          >
            保存
          </el-button>
        </template>

        <el-button
          v-else
          type="primary"
          size="small"
          :loading="loading"
          @click="handleReset"
        >
          重置
        </el-button>
      </EditFooter>
    </el-tab-pane>
  </el-tabs>
  <!-- 编辑结束 -->

  <!-- 新增开始 -->
  <el-form
    v-else
    ref="form"
    class="view__card"
    :model="model"
    :rules="rules"
    label-width="120px"
  >
    <el-form-item label="头像" prop="avatar">
      <el-image
        style="
          width: 100px;
          height: 100px;
          border-radius: 50%;
          vertical-align: bottom;
          overflow: hidden;
          text-align: center;
        "
        fit="cover"
        :src="FILE_URL(model.avatar)"
      >
        <template #error>
          <img src="@/assets/headerImg.png" alt="" />
          <!-- <i
            class="el-icon-user-solid"
            style="font-size: 60px; line-height: 100px;"
          ></i> -->
        </template>
      </el-image>

      <el-upload
        style="display: inline-block;"
        action
        :show-file-list="false"
        accept="image/png, image/jpeg, image/gif, image/webp"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeImageUpload"
        :http-request="httpRequest"
      >
        <el-button size="small" type="primary">选择照片</el-button>
        <el-button size="small" @click.stop="deleteAvatar" type="danger"
          >删除</el-button
        >
      </el-upload>
    </el-form-item>

    <el-form-item label="账号类型" prop="type">
      <el-radio-group v-model="model.type">
        <el-radio
          v-for="{ label, text } in accountType"
          :key="label"
          :label="label"
        >
          {{ text }}
        </el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="账号角色" prop="role">
      <div
        style="margin-left: -10px; overflow: hidden;"
        v-show="model.roleId.length"
      >
        <el-tag
          style="margin: 0 0 10px 10px;"
          v-for="{ name, id } in roles4Tag"
          :key="id"
          closable
          @close="handleClose(id)"
        >
          {{ name }}
        </el-tag>
      </div>

      <el-select v-show="showSelect" v-model="model.roleId" filterable multiple>
        <el-option
          v-for="{ name, id } in roles"
          :key="id"
          :label="name"
          :value="id"
        ></el-option>
      </el-select>

      <el-button
        v-show="!showSelect"
        icon="el-icon-plus"
        type="text"
        @click="showSelect = true"
      >
        添加
      </el-button>
    </el-form-item>

    <el-row class="view__content" :gutter="20">
      <el-col :md="12">
        <el-form-item label="登录帐号" prop="account">
          <el-input v-model="model.account"></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="登录密码" prop="password">
          <el-input type="password" v-model="model.password"></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="确认密码" prop="rePassword">
          <el-input type="password" v-model="model.rePassword"></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="性别" prop="sex">
          <el-select style="width: 100%;" v-model="model.sex">
            <el-option label="女" value="0"></el-option>
            <el-option label="男" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="model.phone"></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="身份证" prop="idCard">
          <el-input v-model="model.idCard"></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="工号" prop="workNo">
          <el-input v-model="model.workNo"></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item
          label="任职医院"
          :rules="{ required: true, message: '请输入', trigger: 'blur' }"
        >
          <el-select disabled style="width: 100%;" :value="orgName" filterable>
            <el-option :label="orgName" :value="orgName"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="科室" prop="deptId">
          <el-select
            style="width: 100%;"
            v-model="model.deptId"
            filterable
            multiple
            @change="setDefaultDept"
          >
            <el-option
              v-for="{ id, name } in pre.dept"
              :key="id"
              :label="name"
              :value="id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="默认科室" prop="defDeptId">
          <el-select style="width: 100%;" v-model="model.defDeptId" filterable>
            <el-option
              v-for="{ id, name } in dept4default"
              :key="id"
              :label="name"
              :value="id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="药房" prop="storeId">
          <el-select
            style="width: 100%;"
            v-model="model.storeId"
            @change="changeStore"
            filterable
            multiple
          >
            <el-option
              v-for="{ id, name } in pre.store"
              :key="id"
              :label="name"
              :value="id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="职称" prop="titleId">
          <el-select style="width: 100%;" v-model="model.titleId" filterable>
            <el-option
              v-for="{ id, name } in pre.title"
              :key="id"
              :label="name"
              :value="id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="职务" prop="position">
          <el-select style="width: 100%;" v-model="model.dutyType" filterable>
            <el-option
              v-for="{ value, label } in post"
              :key="value"
              :label="label"
              :value="value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="从业年限" prop="workHistory">
          <el-date-picker
            v-model="model.workHistory"
            type="date"
            style="width: 100%;"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
          <!-- <el-select
            style="width: 100%;"
            v-model="model.workHistory"
            filterable
          ></el-select> -->
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="是否本院" prop="inHospital">
          <el-select style="width: 100%;" v-model="model.inHospital" filterable>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="是否推荐" prop="recommend">
          <el-select style="width: 100%;" v-model="model.recommend" filterable>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="12">
        <el-form-item label="明星专家" prop="star">
          <el-select style="width: 100%;" v-model="model.star" filterable>
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="12">
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="model.mail"></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="擅长" prop="skilled">
          <el-input
            v-model="model.skilled"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            placeholder="请输入擅长内容，最多1000字"
            maxlength="1000"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="个人简介" prop="intro">
          <el-input
            v-model="model.intro"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            placeholder="请输入个人经历、学术贡献，最多1000字"
            maxlength="1000"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="执业经历" prop="practiceInfo">
          <el-input
            v-model="model.practiceInfo"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            placeholder="请输入"
            maxlength="1000"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="学术经历" prop="academicInfo">
          <el-input
            v-model="model.academicInfo"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            placeholder="请输入"
            maxlength="1000"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :md="12">
        <el-form-item label="执业范围" prop="practiceArea">
          <el-input
            v-model="model.practiceArea"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            placeholder="请输入"
            maxlength="1000"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col>
        <el-form-item label="资格证书" prop="certificate">
          <el-checkbox-group
            v-model="certificate"
            @change="resolveCertificateChange"
          >
            <el-checkbox
              v-for="(value, key) in certificateEnum"
              :key="key"
              :label="key"
            >
              {{ value }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item
      v-for="({ type, fileId }, index) in model.certs"
      :key="type"
      :label="certificateEnum[type]"
    >
      <el-form-item
        v-if="type === 'DOCTOR_QUAL'"
        style="margin-bottom: 20px;"
        :rules="{ required: true, message: '请输入', trigger: 'blur' }"
      >
        <el-input
          style="width: 33%;"
          v-model="model.certs[index].practiceOrg"
          placeholder="主要执业单位"
        ></el-input>
      </el-form-item>

      <el-input
        style="width: 33%;"
        v-model="model.certs[index].certNo"
        :placeholder="`请输入${certificateEnum[type]}编号`"
      ></el-input>

      <div style="margin-top: 10px;" v-for="(id, _) in fileId" :key="id">
        <el-image
          style="
            vertical-align: bottom;
            overflow: hidden;
            width: 220px;
            height: 130px;
          "
          fit="cover"
          :src="FILE_URL(id)"
          :preview-src-list="model.certs[index].fileId.map(FILE_URL)"
        ></el-image>

        <el-upload
          style="display: inline-block; margin-left: 10px;"
          action
          :show-file-list="false"
          accept="image/png, image/jpeg, image/gif, image/webp"
          :on-success="res => handleImageSuccess(res, index, _)"
          :before-upload="beforeImageUpload"
          :http-request="httpRequest"
        >
          <el-button size="small" type="primary">选择照片</el-button>
          <el-button
            size="small"
            type="danger"
            @click.stop="deleteImg(index, _)"
            >删除</el-button
          >
        </el-upload>
      </div>

      <div style="margin-top: 10px;">
        <el-image
          style="
            vertical-align: bottom;
            overflow: hidden;
            width: 220px;
            height: 130px;
          "
          fit="cover"
          :src="certificateExampleImg"
          :preview-src-list="[certificateExampleImg]"
        ></el-image>

        <el-upload
          style="display: inline-block; margin-left: 10px;"
          action
          :show-file-list="false"
          accept="image/png, image/jpeg, image/gif, image/webp"
          :on-success="
            res =>
              handleImageSuccess(res, index, model.certs[index].fileId.length)
          "
          :before-upload="beforeImageUpload"
          :http-request="httpRequest"
        >
          <el-button size="small" type="primary">选择照片</el-button>
        </el-upload>
      </div>
    </el-form-item>

    <EditFooter class="is-center">
      <el-button
        type="primary"
        size="small"
        :loading="loading"
        @click="submit('form')"
      >
        提交
      </el-button>
    </EditFooter>
  </el-form>
</template>

<script>
import { mapState } from 'vuex'
import { EditFooter } from '@/components'
import { Business } from './components'
import { invalidFieldSetFocus } from '@/utils'
import {
  validEmail,
  isAccount,
  isPassword,
  isPhoneNumber,
  isIDNumber,
} from '@/utils/validate'

import {
  accountGet,
  accountInsert,
  accountEdit,
  accountResetExamine,
  accountResetAuth,
  accountResetPhoneBind,
} from '@/api/authority'
import {
  uploadFile,
  roleChooseList,
  deptChooseList,
  drugStoreChooseList,
  titleChooseList,
} from '@/api'

const pre = {
  info: {},
  roles: [],
  dept: [],
  store: [],
  post: [],
}

export default {
  name: 'AccountEdit',
  props: {
    id: String,
  },
  components: {
    EditFooter,
    Business,
  },
  data() {
    // beforeRouteEnter fetch data
    this.pre = pre
    this.post = [
      { label: '护理', value: 'NURSE' },
      { label: '药学', value: 'MEDICINE' },
      { label: '中药学', value: 'CHINESE_MEDICINE' },
      { label: '检验', value: 'CHECKOUT' },
      { label: '放射', value: 'RADIATE' },
      { label: '医师', value: 'PHYSICIAN' },
      { label: '康复技师', value: 'REHABILITATION_TECHNICIAN' },
    ]
    this.accountType = [
      { label: 'DOCTOR', text: '医生' },
      { label: 'DRUGER', text: '药师' },
      { label: 'NURSE', text: '护士' },
      { label: 'OTHER', text: '其他' },
    ]

    const validateAccount = (rule, value, callback) => {
      if (!this.model.id && !isAccount(value)) {
        callback(new Error('帐号格式有误'))
      } else {
        callback()
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (!isPassword(value)) {
        callback(new Error('密码格式有误'))
      } else {
        callback()
      }
    }

    const validateRePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.model.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }

    const validatePhone = (rule, value, callback) => {
      if (value !== '' && !isPhoneNumber(value)) {
        callback(new Error('手机号格式有误'))
      } else {
        callback()
      }
    }

    const validateID = (rule, value, callback) => {
      if (value !== '' && !isIDNumber(value)) {
        callback(new Error('身份证格式有误'))
      } else {
        callback()
      }
    }

    const validateEmail = (rule, value, callback) => {
      if (value !== '' && !validEmail(value)) {
        callback(new Error('邮箱格式有误'))
      } else {
        callback()
      }
    }

    this.rules = {
      type: [{ required: true, message: '请选择', trigger: 'blur' }],
      deptId: [{ required: true, message: '请选择', trigger: 'blur' }],
      // defDeptId: [{ required: true, message: '请选择', trigger: 'blur' }],
      account: [
        { required: true, message: '请输入', trigger: 'blur' },
        { validator: validateAccount, trigger: 'blur' },
      ],
      password: [
        { required: true, message: '请输入', trigger: 'blur' },
        { validator: validatePassword, trigger: 'blur' },
      ],
      rePassword: [
        { required: true, validator: validateRePass, trigger: 'blur' },
      ],
      sex: [{ required: true, trigger: 'blur' }],
      // defDeptId: [
      //   { required: true, trigger: 'blur', message: '请选择默认科室' },
      // ],
      name: [{ required: true, message: '请输入', trigger: 'blur' }],
      phone: [{ validator: validatePhone, trigger: 'blur' }],
      idCard: [{ validator: validateID, trigger: 'blur' }],
      workNo: [{ required: true, message: '请输入', trigger: 'blur' }],
      storeId: [{ required: true, message: '请输入', trigger: 'blur' }],
      titleId: [{ required: true, message: '请输入', trigger: 'blur' }],
      inHospital: [{ required: true, message: '请输入', trigger: 'blur' }],
      recommend: [{ required: true, message: '请输入', trigger: 'blur' }],
      star: [{ required: true, message: '请输入', trigger: 'blur' }],
      mail: [{ validator: validateEmail, trigger: 'blur' }],
      skilled: [{ required: true, message: '请输入', trigger: 'blur' }],
      intro: [{ required: true, message: '请输入', trigger: 'blur' }],
      practiceInfo: [{ required: true, message: '请输入', trigger: 'blur' }],
      academicInfo: [{ required: true, message: '请输入', trigger: 'blur' }],
      practiceArea: [{ required: true, message: '请输入', trigger: 'blur' }],
    }
    this.certificateEnum = {
      DRUG: '药师资格证',
      PHYS_QUAL: '医师资格证',
      DOCTOR_QUAL: '医师执业证',
      NURSE: '护士执业证',
      TECH: '专业技术资格证',
    }
    this.certificateExampleImg = require('@/assets/certificate-example.png')

    return {
      activeName: 'basic',
      show: false,
      show1: false,
      showSelect: false,
      roles: pre.roles,

      loading: false,
      model: {
        avatar: '',
        type: 'DOCTOR',
        roleId: [],
        account: '',
        password: '',
        rePassword: '',
        name: '',
        sex: '1',
        phone: '',
        idCard: '',
        workNo: '',
        deptId: [],
        defDeptId: '',
        storeId: [],
        titleId: '',
        inHospital: true,
        recommend: true,
        star: false,
        mail: '',
        intro: '',
        practiceInfo: '',
        academicInfo: '',
        practiceArea: '',
        certs: [],
        dutyType: null,
        ...pre.info,
      },
      beforeDeptId: [],
      beforeStoreId: [],
      certificate: pre.info.certs?.map(({ type }) => type) ?? [],
      // 从业年限日期限制
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() > Date.now()
        },
      },
    }
  },
  computed: {
    ...mapState('user', ['orgName']),
    isEdit() {
      return !!this.id
    },
    roles4Tag() {
      return this.roles.filter(({ id }) => this.model.roleId.includes(id))
    },
    dept4default() {
      return pre.dept.filter(({ id }) => this.model.deptId.includes(id))
    },
    platformAccount() {
      return this.model.source === 'MH'
    },
  },
  async beforeRouteEnter(to, from, next) {
    const { id } = to.params

    ;[pre.info, pre.roles, pre.dept, pre.store, pre.title] = await Promise.all([
      id ? accountGet({ id }) : {},
      roleChooseList({ showUser: false }),
      deptChooseList({ tree: false }).then(data => [
        { id: '0', name: '暂无' },
        ...data,
      ]),
      drugStoreChooseList({ filter: false }).then(data => [
        { id: '0', name: '暂无' },
        ...data,
      ]),
      titleChooseList(),
    ])
    if (id) {
      if (pre.info.deptId.length == 0) {
        pre.info.deptId = ['0']
        pre.info.defDeptId = '0'
      }
      if (pre.info.storeId.length == 0) {
        pre.info.storeId = ['0']
      }
    }
    next()
  },
  created() {
    if (this.model.idCard) {
      this.show = true
      this.show1 = true
    }
  },
  methods: {
    clear(type) {
      ;(type == 'phone' ? accountResetPhoneBind : accountResetAuth)({
        id: this.id,
      })
        .then(async () => {
          this.$message({
            type: 'success',
            message: '重置成功!',
          })
          console.log(this.$route)
          let getInfo = await accountGet({ id: this.$route.params.id })
          if (type == 'phone') {
            this.model.phone = ''
            this.model.prestorePhone = getInfo.prestorePhone
          } else {
            this.model.idCard = ''
            this.model.prestoreIdCard = getInfo.prestoreIdCard
          }
        })
        .catch(err => {
          this.$message({
            type: 'err',
            message: err.message,
          })
        })
    },
    deleteAvatar() {
      //确认删除当前选择的头像
      this.$confirm('是否删除已上传头像?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.model.avatar = ''
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(err => {
          console.log(err)
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        })
    },
    changeStore() {
      console.log(this.model.storeId)
      if (
        !this.beforeStoreId.some(item => item == '0') &&
        this.model.storeId.some(item => item == '0')
      ) {
        this.model.storeId = ['0']
      } else if (
        this.beforeStoreId.some(item => item == '0') &&
        this.model.storeId.length > 1
      ) {
        this.model.storeId = this.model.storeId.filter(item => item != '0')
      }
      this.beforeStoreId = this.model.storeId
    },
    setDefaultDept() {
      if (
        !this.beforeDeptId.some(item => item == '0') &&
        this.model.deptId.some(item => item == '0')
      ) {
        this.model.deptId = ['0']
      } else if (
        this.beforeDeptId.some(item => item == '0') &&
        this.model.deptId.length > 1
      ) {
        this.model.deptId = this.model.deptId.filter(item => item != '0')
      }
      this.beforeDeptId = this.model.deptId
      if (!this.dept4default.some(({ id }) => id === this.model.defDeptId))
        this.model.defDeptId = this.dept4default[0]?.id ?? ''
    },
    resolveCertificateChange(val) {
      const map = {}
      this.model.certs.forEach(item => (map[item.type] = item))

      this.model.certs = val.map(
        key =>
          map[key] ?? {
            fileId: [],
            type: key,
            certNo: '',
            practiceOrg: '',
          },
      )
    },
    handleAvatarSuccess(res) {
      this.model.avatar = res
    },
    handleImageSuccess(res, index, fileIndex) {
      this.model.certs[index].fileId.splice(fileIndex, 1, res)
    },
    deleteImg(index, fileIndex) {
      this.model.certs[index].fileId.splice(fileIndex, 1)
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

    handleClose(id) {
      const _ = this.model.roleId.indexOf(id)

      if (_ > -1) this.model.roleId.splice(_, 1)
    },

    submit(formName) {
      this.$refs[formName].validate(async (valid, invalidFields) => {
        if (valid) {
          let data = {}
          if (this.id) {
            data = await this.$refs.business.submit()
          }

          this.loading = true

          await (this.id ? accountEdit : accountInsert)({
            ...this.model,
            // 科室 药房可选 暂无，排除掉
            deptId: this.model.deptId.filter(_ => _ && _ != 0),
            storeId: this.model.storeId.filter(_ => _ && _ != 0),
            defDeptId: this.model.defDeptId == '0' ? '' : this.model.defDeptId,
            phone:
              formName == 'authForm'
                ? this.model.prestorePhone
                : this.model.phone,
            idCard:
              formName == 'authForm'
                ? this.model.prestoreIdCard
                : this.model.idCard,
            ...data,
          }).finally(() => setTimeout(() => (this.loading = false), 200))

          this.$message({
            type: 'success',
            message: '完成',
            showClose: true,
          })
          // if (this.id && this.$store.state.user.userId == this.id) {
          //   this.$message.info('您的信息发生变更，请重新登录')
          //   await this.$store.dispatch('user/logout')
          //   this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          // }
          // console.log(this.$store.state.user)
          this.$router.push({
            path: '/jurisdiction/account/list',
            query: { flag: 1 },
          })
        } else {
          invalidFieldSetFocus(this.$refs[formName], invalidFields)
        }
      })
    },

    async handleReset() {
      this.loading = true
      await accountResetExamine({ id: this.id }).finally(() =>
        setTimeout(() => (this.loading = false), 200),
      )
      this.model.examine = false
    },
  },
}
</script>

<style lang="scss" scoped>
@use '@/styles/_modules-detail.scss';
.reset_btn {
  position: absolute;
  right: 0;
  top: 50%;
  margin-top: -16px;
}
</style>
