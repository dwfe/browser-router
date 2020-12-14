import {Page} from 'playwright'

export class PageAction {

  baseUrl = ''
  screenshotsDir: string | undefined


  static of(page: Page): PageAction {
    return new PageAction(page)
  }

  constructor(private page: Page) {
  }

  getSel(sel: string): string {
    return `[data-qa=${sel}]`
  }

  /**
   * https://github.com/microsoft/playwright/blob/master/docs/selectors.md
   */
  async click(selector: string) {
    await this.page.click(this.getSel(selector))
    await this.removeActionDataElem()
  }

  async goto(path: string) {
    await this.page.goto(this.baseUrl + path)
    await this.removeActionDataElem()
  }

  async goBack() {
    await this.page.goBack()
    await this.removeActionDataElem()
  }

  async goForward() {
    await this.page.goForward()
    await this.removeActionDataElem()
  }

  async screenshot(name) {
    const options = this.screenshotsDir ? {
        path: `${this.screenshotsDir}/screenshot-${name}.png`
      }
      : undefined
    await this.page.screenshot(options)
  }

  private async removeActionDataElem() {
    await this.page.evaluate(() => {
      const elem = document.getElementsByClassName('ActionData')[0]
      elem?.parentNode?.removeChild(elem)
    })
  }

}
