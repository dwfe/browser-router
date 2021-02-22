export class EventListeners<TCall> {

  private handlers: Function[] = []

  push(fn: Function): () => void {
    this.handlers.push(fn)
    return () => this.handlers = this.handlers.filter(handler => handler !== fn)
  }

  call(arg: TCall) {
    this.handlers.forEach(fn => fn && fn(arg))
  }

  length() {
    return this.handlers.length
  }
}
