import {Browser} from 'playwright'
import {IRegressAutomationOptions, IScriptItem} from '../contract'
import {ScreenshotParams} from './screenshot.params'
import {playwrightInitiator} from './globals'
import {PageHandler} from '../page.handler'

export class ScreenshotCrawler {

  static async of(options: IRegressAutomationOptions): Promise<ScreenshotCrawler> {
    const {browserType, dir, screenshotOptions, browserContextOptions} = options
    const [browser, pageHandler] = await playwrightInitiator(options)
    const screenshotParams = new ScreenshotParams(screenshotOptions, browserType, browserContextOptions.viewport, dir)
    return new ScreenshotCrawler(pageHandler, browser, screenshotParams)
  }

  constructor(public pageHandler: PageHandler,
              public browser: Browser,
              public screenshotParams: ScreenshotParams) {
  }

  async run(script: IScriptItem[]) {
    await this.traverse(script)
    await this.browser.close()
  }

  async traverse(script: IScriptItem[]) {
    for (const {goto, screenshot, click, fill, children, last, canDeactivateClick} of script) {
      if (screenshot)
        await this.pageHandler.screenshot(this.getScreenshotOptions(screenshot.scName))

      if (goto) {
        const {path, scName} = goto
        scName
          ? await this.pageHandler.gotoThenScreenshot(path, this.getScreenshotOptions(scName))
          : await this.pageHandler.goto(path)
      }

      if (click) {
        const {sel, scName} = click
        scName
          ? await this.pageHandler.clickThenScreenshot(sel, this.getScreenshotOptions(scName))
          : await this.pageHandler.click(sel)
      }

      if (fill)
        await this.pageHandler.fill(fill.sel, fill.value)

      if (children)
        await this.traverse(children)

      if (last) {
        switch (last) {
          case 'goBack':
            await this.pageHandler.goBack()
            break;
          case 'goForward':
            await this.pageHandler.goForward()
            break;
          default:
            await this.pageHandler.goto(last)
        }
      }

      if (canDeactivateClick)
        await this.pageHandler.click(canDeactivateClick)
    }
  }

  getScreenshotOptions(name: string) {
    return this.screenshotParams.getScreenshotOptions(name)
  }

}
