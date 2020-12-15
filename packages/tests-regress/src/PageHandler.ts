import {Page} from 'playwright'
import {IPoint} from './contract';

export class PageHandler {

  engine = ''
  baseUrl = ''
  referenceDir = ''

  constructor(public page: Page) {
  }

  getSel(sel: string): string {
    return `[data-qa=${sel}]`
  }

//region Actions

  async click(selector: string) { // https://github.com/microsoft/playwright/blob/master/docs/selectors.md
    await this.page.click(this.getSel(selector))
    await this.removeNeedlessElements()
  }

  async fill(selector: string, value: string) {
    await this.page.fill(this.getSel(selector), value)
  }

//endregion

//region Navigation

  async goto(path: string) {
    await this.page.goto(this.baseUrl + path)
    await this.removeNeedlessElements()
  }

  async goBack() {
    await this.page.goBack()
    await this.removeNeedlessElements()
  }

//endregion

//region Screenshot

  async screenshot(name) {
    const options = this.referenceDir ? {
        path: `${this.referenceDir}/${this.engine}_${name}.png`
      }
      : undefined
    await this.page.screenshot(options)
  }

  async clickThenScreenshot(selector: string, screenshotName?: string) {
    await this.click(selector)
    await this.screenshot(screenshotName || selector)
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

  private async removeNeedlessElements() {
    await this.page.evaluate(() => {
      const elem = document.getElementsByClassName('ActionData')[0]
      elem?.parentNode?.removeChild(elem)
    })
  }

}
