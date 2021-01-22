<script>
export default {
  functional: true,
  render(h, { props, children, data }) {
    return (
      <div class="c__empty" {...data}>
        {children || [
          <svg-icon icon-class="empty" />,
          <p>{props.tips || '暂无数据'}</p>,
        ]}
      </div>
    )
  },
}
</script>

<style lang="scss">
.c__empty {
  text-align: center;
  color: #8c8c8c;

  .svg-icon {
    font-size: 60px;
  }
}
</style>
