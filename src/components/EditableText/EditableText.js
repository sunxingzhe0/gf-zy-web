import Vue from 'vue'

import './EditableText.scss'

export default Vue.extend({
  name: 'EditableText',
  props: {
    value: {
      default: '',
    },
    text: {
      type: String,
      default: '编辑',
    },
    doubleclick: {
      type: Boolean,
      default: true,
    },
    showPopConfirm: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      idEdit: false,
      inputValue: '',
    }
  },
  methods: {
    dblclick() {
      this.transform()

      // 清空选中
      window.getSelection
        ? window.getSelection().removeAllRanges()
        : document.selection.empty()
    },
    transform() {
      this.cacheValue = this.value
      this.idEdit = true
      this.inputValue = this.value
    },
    cancelHandler() {
      this.$emit('cancel', this.cacheValue)
      this.idEdit = false
    },
    confirmHandler() {
      this.$emit(
        'confirm',
        this.$scopedSlots.input ? this.value : this.inputValue,
        this.cacheValue,
      )
      this.idEdit = false
    },
  },
  render(h) {
    const editComponents = [
      this.$scopedSlots.input?.() || (
        <el-input vModel={this.inputValue} size="mini"></el-input>
      ),
      <el-button size="mini" type="text" vOn:click={this.cancelHandler}>
        取消
      </el-button>,
      this.showPopConfirm ? (
        <el-popconfirm
          title={this.showPopConfirm}
          onConfirm={this.confirmHandler}
        >
          <el-button slot="reference" size="mini" type="text">
            保存
          </el-button>
        </el-popconfirm>
      ) : (
        <el-button size="mini" type="text" vOn:click={this.confirmHandler}>
          保存
        </el-button>
      ),
    ]

    return h(
      'div',
      {
        staticClass: 'c__editable-text',
        class: {
          'is-edit': this.idEdit,
        },
      },
      this.idEdit
        ? editComponents
        : [
            <span vOn:dblclick={this.dblclick}>{this.value || 0}</span>,
            <el-button
              icon={this.icon}
              size="mini"
              type="text"
              vOn:click={this.transform}
            >
              {this.icon === '' ? this.text : ''}
            </el-button>,
          ],
    )
  },
})
