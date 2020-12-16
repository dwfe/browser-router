import {ViewportSize} from 'playwright'
import {EngineType, IScreenshotOptions} from './contract'

export class ScreenshotParams {
  constructor(public options: IScreenshotOptions,
              private engine: EngineType,
              private viewport: ViewportSize | any) {
  }

  getScreenshotOptions(name: string) {
    return {
      ...this.options,
      path: this.getPathToScreenshot(name)
    }
  }

  getPathToScreenshot(name: string): string {
    const dir = this.options.path
    const linearSizes = this.viewport ? `-${this.viewport.width}x${this.viewport.height}` : ''
    const ext = this.options.type
    return `${dir}/${this.engine}${linearSizes}_${name}.${ext}`
  }

}


