import Vue from 'vue'

import Empty from '@/components/IM/components/Empty.vue'
import { queryAnyUserTag } from '@/api/manager/label'

import variables from '@/styles/_variables.scss'

const types = {
  0: { txt: 'USER', color: [variables.primary, variables.primaryLighter] }, // 用户
  1: { txt: 'HEALTH_MG', type: 'info' }, // 健康管理师
  2: { txt: 'HEALTH_PG', color: [variables.purple, variables.purpleLighter] }, // 健康总评估师
  3: { txt: 'HEALTH', color: [variables.blue, variables.blueLighter] }, // 医院
  4: { txt: 'PLATFORM', type: 'success' }, // 平台
}

export default Vue.extend({
  name: 'Tag',
  data() {
    return {
      visible: false,
      data: [],
      pending: false,
    }
  },
  created() {
    this.hiddenPopover = () => {
      this.visible = false
    }
    document.addEventListener('click', this.hiddenPopover)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.hiddenPopover)
  },
  methods: {
    async handleShow(id, num) {
      if (num == 0) {
        this.$message({
          type: 'warning',
          message: '用户标签数为 0',
          showClose: true,
        })
        return
      }
      if (this.data.length) {
        this.visible = true
        return
      }

      this.pending = true

      this.data = await queryAnyUserTag({ userId: id })
      this.pending = false
      this.visible = true
    },
    voidFn() {},
  },
  render() {
    const { options = {} } = this.$attrs
    const { id = 'userId', num = 'tabNum' } = options

    return (
      <el-popover
        trigger="manual"
        placement="top"
        vModel={this.visible}
        vOn:click_stop={this.voidFn}
      >
        <div
          style="margin: -10px 0 0 -10px; overflow: hidden; min-height: 50px; max-width: 200px;"
          vLoading_lock={this.pending}
        >
          {this.data.map(({ tagName, identityType }) =>
            types[identityType].type ? (
              <el-tag
                style="margin: 10px 0 0 10px;"
                type={types[identityType].type}
              >
                {tagName}
              </el-tag>
            ) : (
              <el-tag
                style={`
                  margin: 10px 0 0 10px;
                  color: ${types[identityType].color[0]};
                  background-color: ${types[identityType].color[1]};
                  border-color: ${types[identityType].color[1]};
                `}
              >
                {tagName}
              </el-tag>
            ),
          )}
          {this.data.length < 1 && <Empty style="margin-top: 10px" />}
        </div>
        <el-button
          slot="reference"
          style={`color: ${variables.primary};`}
          type="text"
          loading={this.pending}
          vOn:click_stop={this.handleShow.bind(
            this,
            this.$attrs[id],
            this.$attrs[num],
          )}
        >
          {this.$attrs[num]}
        </el-button>
      </el-popover>
    )
  },
})
