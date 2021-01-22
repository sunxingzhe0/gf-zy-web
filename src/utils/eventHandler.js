class EventHandlerClass {
  constructor() {
    this.functionMap = {}
  }

  addEventListener(event, func) {
    this.functionMap[event] = func
    document.addEventListener(event.split('.')[0], this.functionMap[event])
  }

  removeEventListener(event) {
    document.removeEventListener(event.split('.')[0], this.functionMap[event])
    delete this.functionMap[event]
  }
}
export const EventHandler = new EventHandlerClass()
