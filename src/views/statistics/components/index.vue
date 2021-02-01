<script>
export default {
  props: {
    type: {
      type: String,
      default: 'normal',
    },
    text: {
      type: String,
      default: 'normal',
    },
  },
  computed: {
    // tag() {
    //   switch (this.type) {
    //     case 'success':
    //       return 1
    //     case 'danger':
    //       return 2
    //     case 'warning':
    //       return 3
    //     default:
    //       1
    //   }
    // },
    render(h) {
      return h('div', {
        class: {
          btn: true,
          'btn-success': this.type === 'success',
          'btn-danger': this.type === 'danger',
          'btn-warning': this.type === 'warning',
        },
        domProps: {
          innerText: this.text,
        },
        on: {
          click: () => {
            this.test()
          },
        },
      })
    },
  },
  methods: {
    hadelClick() {
      console.log(11111111)
    },
  },
  // methods: {
  //   hadelClick() {
  //     console.log(1111111)
  //     const h = this.$createElement
  //     console.log(h,'***');
  //     this.$message({
  //       message: h('div', [
  //         h('i', {
  //           attrs: {
  //             title: '删除',
  //           },
  //           style: {
  //             color: 'blue',
  //             fontSize: '20px',
  //           },
  //           class: {
  //             'el-icon-delete': true,
  //           },

  //           // 事件监听基于 'on'
  //           // 所以不再支持如 'v-on:keyup.enter' 修饰语
  //           // 需要手动匹配 KeyCode
  //           on: {
  //             click: function (event) {
  //               event.preventDefault()
  //               console.log('删除成功！')
  //             },
  //           },
  //         }),h('el-button',{
  //           props:{
  //             type:'primary',
  //           },
  //           domProps:{
  //             innerHTML:'点击提交'
  //           },
  //           nativeOn:{
  //             click:()=>{
  //               console.log('提交');
  //             }
  //           }
  //         })
  //       ]),
  //     })
  //   },
  // },
}
</script>
