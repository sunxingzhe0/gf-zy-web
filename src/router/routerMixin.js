import store from '@/store'

export default {
  beforeRouteEnter(to, from, next) {
    if (to.meta.keepAlive) {
      const name = to.name
      store.dispatch('user/addKeepLive', name)
      console.log(store.state.user.keepLiveList)
    }
    next()
  },
  beforeRouteLeave(to, from, next) {
    console.log(store.state.user.keepLiveList.includes(from.name))
    if (store.state.user.keepLiveList.includes(from.name)) {
      // console.log(to.name?.indexOf(from.name))
      if (to.name?.indexOf(from.name) === -1) {
        store.dispatch('user/removeKeepLive', from.name)
        console.log(store.state.user.keepLiveList)
      }
    }
    next()
  },
}
