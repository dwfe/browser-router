import {Page} from 'playwright'
import {EngineType, IPoint} from './contract'

export class PageHandler {

  engine: EngineType = 'chromium'
  baseUrl = 'http://localhost'
  dir = '.'

  constructor(public page: Page) {
  }

  getSel(sel: string): string {
    return `[data-qa=${sel}]`
  }

  getUrl(path: string): string {
    return path.includes('http://') || path.includes('https://')
      ? path
      : this.baseUrl + path
  }

//region Actions

  async click(selector: string) { // https://github.com/microsoft/playwright/blob/master/docs/selectors.md
    await this.page.click(this.getSel(selector))
    await this.constatntAdditionalActionsOnDOM()
  }

  async fill(selector: string, value: string) {
    await this.page.fill(this.getSel(selector), value)
  }

//endregion

//region Navigation

  async goto(path: string) {
    await this.page.goto(this.getUrl(path))
    await this.constatntAdditionalActionsOnDOM()
  }

  async goBack() {
    await this.page.goBack()
    await this.constatntAdditionalActionsOnDOM()
  }

  async goForward() {
    await this.page.goForward()
    await this.constatntAdditionalActionsOnDOM()
  }

//endregion

//region Screenshot

  async screenshot(name) {
    const options = this.dir ? {
        path: `${this.dir}/${this.engine}_${name}.png`
      }
      : undefined
    await this.page.screenshot(options)
  }

  async gotoThenScreenshot(path: string, screenshotName: string) {
    await this.goto(path)
    await this.screenshot(screenshotName)
  }

  async clickThenScreenshot(selector: string, screenshotName: string) {
    await this.click(selector)
    await this.screenshot(screenshotName)
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

  private async constatntAdditionalActionsOnDOM() {
    await this.removeNeedlessElements()
  }

  private async removeNeedlessElements() {
    await this.page.evaluate(() => {
      const elem = document.getElementsByClassName('ActionData')[0]
      elem?.parentNode?.removeChild(elem)
    })
  }

}
