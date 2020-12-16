import {IScreenshotCrawlerOptions, IScriptItem} from './contract'
import * as playwright from 'playwright'
import {Browser} from 'playwright'
import {PageHandler} from './PageHandler'

export class ScreenshotCrawler {

  static async of(options: IScreenshotCrawlerOptions): Promise<ScreenshotCrawler> {
    const {engine, baseUrl, dir, browserOptions, browserContextOptions} = options

    const browser = await playwright[engine].launch(browserOptions)
    const browserContext = await browser.newContext(browserContextOptions)
    const page = await browserContext.newPage()

    const pageHandler = new PageHandler(page)
    pageHandler.engine = engine
    pageHandler.baseUrl = baseUrl
    pageHandler.dir = dir

    return new ScreenshotCrawler(pageHandler, browser)
  }

  constructor(private h: PageHandler,
              private browser: Browser) {
  }

  async run(script: IScriptItem[]) {
    await this.traverse(script)
    await this.browser.close()
  }

  async traverse(script: IScriptItem[]) {
    for (const {goto, screenshot, click, fill, children, last, canDeactivateClick} of script) {
      if (screenshot)
        await this.h.screenshot(screenshot)

      if (goto) {
        const {path, scName} = goto
        scName
          ? await this.h.gotoThenScreenshot(path, scName)
          : await this.h.goto(path)
      }

      if (click) {
        const {sel, scName} = click
        scName
          ? await this.h.clickThenScreenshot(sel, scName)
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

}
