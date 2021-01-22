import './ConversationList.scss'

// import variables from '@/styles/_variables.scss'
// import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { Empty } from '@/components'
import Item from './Item.vue'

const enumLabels = {
  WAIT_TREAT: '待接诊',
  IN_TREAT: '接诊中',
  FINISH: '已结束',
}
var activeNames = ['WAIT_TREAT', 'IN_TREAT']
// function scrollToItemscroller, index) {
//   this.$refs[scroller]?.scrollToItem(index)
// }

export default ({ props, parent, listeners }) => {
  // const { activeItemIndex, data, activeSessionId } = props
  const { data, activeSessionId } = props
  let arr = []
  for (const key in data) {
    if (data[key].length > 0) {
      arr.push(key)
    }
  }
  activeNames = arr

  return (
    <el-scrollbar class="c__conversation-list">
      <el-collapse value={activeNames}>
        {Object.entries(data).map(([key, items]) => {
          // const scrollerRefName = `scroller_${key}`
          return (
            <el-collapse-item title={enumLabels[key]} name={key}>
              <template slot="title">
                {enumLabels[key]}

                <div class="el-collapse-item__total">
                  <span>{items.length ?? 0}</span> 人
                </div>
              </template>

              {items.length ? (
                items.reduce(
                  (_, item) =>
                    _.concat(
                      <Item
                        {...{
                          attrs: item,
                          class: {
                            hover: item.sessionId === activeSessionId,
                          },
                        }}
                        vOn:click={listeners.handleClick?.bind(parent, item)}
                      />,
                    ),
                  [],
                )
              ) : (
                // <RecycleScroller
                //   ref={scrollerRefName}
                //   class="scroller"
                //   items={items}
                //   item-size={60}
                //   key-field={'sessionId'}
                //   buffer={120}
                //   pageMode={true}
                //   scopedSlots={{
                //     default: ({ item }) => (
                //       <Item
                //         {...{
                //           attrs: item,
                //           class: {
                //             hover: item.sessionId === activeSessionId,
                //           },
                //         }}
                //         vOn:click={listeners.handleClick?.bind(parent, item)}
                //       />
                //     ),
                //   }}
                //   vOn:visible={scrollToItem.bind(
                //     parent,
                //     scrollerRefName,
                //     activeItemIndex,
                //   )}
                // />
                <Empty style="padding-top: 25px" />
              )}
            </el-collapse-item>
          )
        })}
      </el-collapse>
    </el-scrollbar>
  )
}
