<script>
function emitBack(listeners) {
  listeners.back ? listeners.back() : this.$router.back()
  this.$store.dispatch('updateList/changeFlag', 'updateListEditFooter')
}

export default {
  functional: true,
  render(h, { props, children, data, parent, listeners }) {
    return (
      <div class="c__edit-footer" {...data}>
        {props.empty ?? (
          <el-button
            type="primary"
            plain
            vOn:click={emitBack.bind(parent, listeners)}
          >
            返回
          </el-button>
        )}

        {children}
      </div>
    )
  },
}
</script>

<style lang="scss">
.c__edit-footer {
  position: sticky;
  bottom: 0;
  padding: 10px 0;
  background-color: #fff;
  z-index: 2;

  > * + * {
    margin-left: 10px;
  }
}
</style>
