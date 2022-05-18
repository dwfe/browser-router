import {IResultListenersArg} from './core/contract';

export class ResultListeners {

  private handlers: Function[] = []

  /**
   * Sets up a listener that will be called whenever the route result will arrive
   *
   * @param fn        - A function that will be called when the route result will arrive
   * @return unlisten - A function that may be used to stop listening
   */
  push(fn: Function): () => void {
    this.handlers.push(fn)
    return () => this.handlers = this.handlers.filter(handler => handler !== fn)
  }

  call(arg: IResultListenersArg) {
    this.handlers.forEach(fn => fn && fn(arg))
  }

  length() {
    return this.handlers.length
  }
}
