import { Socket } from './Socket'

const getSingleton = function (Constructor) {
  let instance
  return function () {
    return instance || (instance = new Constructor(...arguments))
  }
}

const createSocket = getSingleton(Socket)

export { createSocket }
export default createSocket
