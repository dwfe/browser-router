import {Page, Response} from 'playwright'
import {IPoint} from './contract'

export class PageHandler {

  baseUrl = 'http://localhost'

  constructor(public page: Page) {
  }

  getSel(sel: string): string {
    return `[data-qa=${sel}]`
  }

  getUrl(path: string): string {
    return path.includes('http://') || path.includes('https://')
      ? path
      : this.baseUrl + (path[0] === '/' ? path : `/${path}`)
  }

//region Actions

  async click(selector: string) { // https://github.com/microsoft/playwright/blob/master/docs/selectors.md
    await this.page.click(this.getSel(selector))
    await this.additionalActions()
  }

  async fill(selector: string, value: string) {
    await this.page.fill(this.getSel(selector), value)
  }

//endregion

//region Navigation

  async goto(path: string): Promise<null | Response> {
    const result = await this.page.goto(this.getUrl(path))
    await this.additionalActions()
    return result
  }

  async goBack(): Promise<null | Response> {
    const result = await this.page.goBack()
    await this.additionalActions()
    return result
  }

  async goForward(): Promise<null | Response> {
    const result = await this.page.goForward()
    await this.additionalActions()
    return result
  }

//endregion

//region Screenshot

  async screenshot(options?: any): Promise<Buffer> {
    return await this.page.screenshot(options)
  }

  async gotoThenScreenshot(path: string, screenshotOptions, waitBeforeScreenshot = 0): Promise<Buffer> {
    return await this.goto(path)
      .then(() => this.page.waitForTimeout(waitBeforeScreenshot))
      .then(() => this.screenshot(screenshotOptions))
  }

  async clickThenScreenshot(selector: string, screenshotOptions, waitBeforeScreenshot = 0): Promise<Buffer> {
    return await this.click(selector)
      .then(() => this.page.waitForTimeout(waitBeforeScreenshot))
      .then(() => this.screenshot(screenshotOptions))
  }

//endregion

//region Mouse

  async moveElem(from: IPoint, to: IPoint, steps = 100) {
    await this.page.mouse.move(from.x, from.y)
    await this.page.mouse.down()
    await this.page.mouse.move(to.x, to.y, {steps})
    await this.page.mouse.up()
  }

//endregion

  private async additionalActions() {
    await this.removeNeedlessElements()
  }

  private async removeNeedlessElements() {
    await this.page.evaluate(() => {
      const elem = document.getElementsByClassName('ActionData')[0]
      elem?.parentNode?.removeChild(elem)
    })
  }

}
