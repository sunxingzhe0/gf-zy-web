<script>
import variables from '@/styles/_variables.scss'

export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []
    // console.log(icon, '图标')
    if (icon) {
      vnodes.push(
        // <el-image></el-image>,
        <svg-icon style={{ color: variables.primary }} icon-class={icon} />,
      )
    }

    if (title) {
      vnodes.push(<span slot="title">{title}</span>)
    }
    return vnodes
  },
}
</script>
