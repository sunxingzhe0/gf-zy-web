<template>
  <div class="child__view detail-border">
    <div class="detail">
      <div class="table">
        <div class="head-title">
          <div class="left"></div>
          <div>个人信息</div>
        </div>
        <el-form ref="form" :model="form" label-width="70px" class="el-form">
          <el-form-item label="姓名" class="form-item">
            <el-input v-model="form.name" readonly></el-input>
          </el-form-item>
          <el-form-item label="身份证" class="form-item">
            <el-input v-model="form.idCard" readonly></el-input>
          </el-form-item>
          <el-form-item label="联系方式" class="form-item">
            <el-input v-model="form.phone" readonly></el-input>
          </el-form-item>
          <el-form-item label="地址" class="form-item">
            <el-input v-model="form.address" readonly></el-input>
          </el-form-item>
          <el-form-item label="详细地址" class="form-item">
            <el-input v-model="form.addDetail" readonly></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div
        class="subject"
        v-for="(item, subject) in form.basinsList"
        :key="subject"
      >
        <div class="head-title">
          <div class="left"></div>
          <div>{{ item.title }}</div>
        </div>
        <div class="choose">
          <div
            class="item-box"
            v-for="(check, choose) in item.quesList"
            :key="subject + '_' + choose"
            :style="check.quesName == '检查目的' && 'width:100%;'"
          >
            <div class="title">{{ check.quesName }}</div>
            <div v-if="check.selectList">
              <el-radio-group v-model="check.select" disabled>
                <el-radio
                  :label="radio.sortCode.toString()"
                  v-for="(radio, id) in check.selectList"
                  :key="subject + '_' + choose + '_' + id"
                >
                  {{ radio.selectName }}
                </el-radio>
              </el-radio-group>
            </div>
            <div v-else style="color: #333333">{{ check.select }}</div>
          </div>
          <!-- 填充空白题目 -->
          <template v-for="(p, index) in 3 - (item.quesList.length % 3)">
            <div
              v-if="item.quesList.length > 1"
              class="item-box"
              :key="index"
            ></div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import list from './index'
import { userRegDetail, basinsDetail } from '@/api/business'
export default {
  name: 'nucleicList',
  data() {
    return {
      // list,
      form: {
        name: '',
        idCard: '',
        encryPhone: '',
        address: '',
        addDetail: '',
        basinsList: [],
      },
    }
  },
  mounted() {
    this.userDetail()
  },
  methods: {
    async userDetail() {
      let res = await basinsDetail({
        id: this.$route.query.userId,
      })
      this.form = res
      this.form.addDetail = res.address + res.addDetail
      // list.forEach(l => {
      //   l.child.forEach(c => {
      //     res.chooseList.forEach(v => {
      //       c.id == v.chooseNum &&
      //         (c.option
      //           ? (c.value = [parseInt(v.answer)])
      //           : (c.value = v.answer))
      //     })
      //   })
      // })
    },
  },
}
</script>

<style lang="scss" scoped>
.detail-border {
  padding: 20px;
  ::v-deep .el-checkbox__inner {
    border-radius: 50%;
  }
  ::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #a3a3a3;
    border-color: #a3a3a3;
  }
  ::v-deep
    .el-checkbox__input.is-disabled.is-checked
    .el-checkbox__inner::after {
    border-color: #fff;
  }
  .detail {
    height: calc(100vh - 85px);
    background: #fff;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    padding: 30px;
    overflow-y: auto;
    .table {
      .el-form {
        display: flex;
        flex-wrap: wrap;
        .form-item {
          width: 33.3%;
          padding-right: 6.3%;
        }
      }
    }
    .subject {
      margin-bottom: 30px;
      .choose {
        display: flex;
        flex-wrap: wrap;
        border: 0 solid #cccccc;
        border-width: 1px 0 0 1px;
        .item-box {
          width: 33.3%;
          padding: 20px;
          border: 0 solid #cccccc;
          border-width: 0 1px 1px 0;
          .title {
            margin-bottom: 20px;
            color: #1a1a1a;
          }
        }
      }
    }
  }
  .head-title {
    display: flex;
    margin-bottom: 20px;
    font-size: 16px;
    line-height: 16px;
    .left {
      width: 2px;
      height: 16px;
      background: #0ab2c1;
      margin-right: 10px;
    }
  }
}
::v-deep .el-form-item__label {
  text-align: left;
}

::v-deep .el-radio__input.is-disabled.is-checked .el-radio__inner {
  background: #ccc;
}
::v-deep .el-radio__input.is-disabled.is-checked .el-radio__inner::after {
  background-color: #999;
}
</style>
