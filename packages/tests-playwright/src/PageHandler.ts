import {Browser, Page} from 'playwright'
import {PageAction} from './PageAction'

export class PageHandler {

  static async of(browser: Browser): Promise<PageHandler> {
    const page = await browser.newPage()
    const pageChanger = PageAction.of(page)
    return new PageHandler(page, pageChanger)
  }

  constructor(public page: Page,
              public action: PageAction,
  ) {
  }


  async close() {
    await this.page.close()
  }

  async clickThenScreenshot(selector: string, screenshotName: string) {
    await this.action.click(selector)
    await this.action.screenshot(screenshotName)
  }


}
