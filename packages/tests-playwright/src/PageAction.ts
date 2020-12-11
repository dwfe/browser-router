import {Page} from 'playwright'

export class PageAction {

  base = 'http://localhost:3000'

  static of(page: Page): PageAction {
    return new PageAction(page)
  }

  constructor(private page: Page) {
  }

  /**
   * https://github.com/microsoft/playwright/blob/master/docs/selectors.md
   */
  async click(selector: string) {
    await this.page.click(selector)
    await this.removeActionDataElem()
  }

  async goto(path: string) {
    await this.page.goto(this.base + path)
    await this.removeActionDataElem()
  }

  async goBack() {
    await this.click('[data-qa=go-back]')
    await this.removeActionDataElem()
  }

  async goForward() {
    await this.click('[data-qa=go-forward]')
    await this.removeActionDataElem()
  }

  async screenshot(name) {
    await this.page.screenshot({
      path: `screenshot-${name}.png`
    })
  }

  private async removeActionDataElem() {
    await this.page.evaluate(() => {
      const elem = document.getElementsByClassName('ActionData')[0]
      elem?.parentNode?.removeChild(elem)
    })
  }

}
