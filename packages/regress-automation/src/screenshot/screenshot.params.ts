import {ViewportSize} from 'playwright'
import {BrowserType, ScreenshotOptions} from '../contract'

export class ScreenshotParams {
  constructor(public options: ScreenshotOptions,
              public browserType: BrowserType,
              public viewport: ViewportSize | any,
              public dir: string) {
  }

  getScreenshotOptions(name: string): ScreenshotOptions {
    return {
      ...this.options,
      path: this.getPathToScreenshot(name)
    }
  }

  getPathToScreenshot(name: string): string {
    const linearSizes = this.viewport ? `-${this.viewport.width}x${this.viewport.height}` : ''
    const ext = this.options.type
    return `${this.dir}/${this.browserType}${linearSizes}_${name}.${ext}`
  }

}


