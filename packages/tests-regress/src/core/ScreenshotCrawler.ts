import {IScreenshotCrawlerOptions, IScriptItem} from './contract'
import * as playwright from 'playwright'
import {Browser} from 'playwright'
import {PageHandler} from './PageHandler'
import {ScreenshotParams} from './ScreenshotParams';

export class ScreenshotCrawler {

  static async of(options: IScreenshotCrawlerOptions): Promise<ScreenshotCrawler> {
    const {engine, baseUrl, screenshotOptions, browserOptions, browserContextOptions} = options

    const browser = await playwright[engine].launch(browserOptions)
    const browserContext = await browser.newContext(browserContextOptions)
    const page = await browserContext.newPage()

    const pageHandler = new PageHandler(page)
    pageHandler.baseUrl = baseUrl

    const screenshotParams = new ScreenshotParams(screenshotOptions, engine, browserContextOptions.viewport)

    return new ScreenshotCrawler(pageHandler, screenshotParams, browser, options)
  }

  constructor(private h: PageHandler,
              private screenshotParams: ScreenshotParams,
              private browser: Browser,
              private options: IScreenshotCrawlerOptions) {
  }

  async run(script: IScriptItem[]) {
    await this.traverse(script)
    await this.browser.close()
  }

  async traverse(script: IScriptItem[]) {
    for (const {goto, screenshot, click, fill, children, last, canDeactivateClick} of script) {
      if (screenshot)
        await this.h.screenshot(this.getScreenshotOptions(screenshot.scName))

      if (goto) {
        const {path, scName} = goto
        scName
          ? await this.h.gotoThenScreenshot(path, this.getScreenshotOptions(scName))
          : await this.h.goto(path)
      }

      if (click) {
        const {sel, scName} = click
        scName
          ? await this.h.clickThenScreenshot(sel, this.getScreenshotOptions(scName))
          : await this.h.click(sel)
      }

      if (fill)
        await this.h.fill(fill.sel, fill.value)

      if (children)
        await this.traverse(children)

      if (last) {
        switch (last) {
          case 'goBack':
            await this.h.goBack()
            break;
          case 'goForward':
            await this.h.goForward()
            break;
          default:
            await this.h.goto(last)
        }
      }

      if (canDeactivateClick)
        await this.h.click(canDeactivateClick)
    }
  }

  getScreenshotOptions(name: string) {
    return this.screenshotParams.getScreenshotOptions(name)
  }

}
