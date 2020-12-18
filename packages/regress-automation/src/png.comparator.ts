import * as fs from 'fs'
import {Browser} from 'playwright'
import {PNG, PNGWithMetadata} from 'pngjs'
import * as pixelmatch from 'pixelmatch'
import {defaultPixelmatchOptions, IRegressAutomationOptions} from './contract'
import {playwrightInitiator} from './screenshot/globals'
import {PageHandler} from './page.handler'


export class PngComparator {

  static async of(options: IRegressAutomationOptions): Promise<PngComparator> {
    const [browser, pageHandler] = await playwrightInitiator(options)
    return new PngComparator(pageHandler, browser, options)
  }

  constructor(public pageHandler: PageHandler,
              public browser: Browser,
              public options: IRegressAutomationOptions) {
  }

  close() {
    this.browser.close()
  }

  read(path: string): PNGWithMetadata {
    return PNG.sync.read(fs.readFileSync(path));
  }

  write(path: string, png: PNG): void {
    fs.writeFileSync(path, PNG.sync.write(png, {filterType: 4}));
  }

  compare(origImg: PNG, imgToCompare: PNG): IPngCompareResult {
    const {width, height} = origImg
    const diffImg = new PNG({width, height})
    const options = this.options.pixelmatchOptions || defaultPixelmatchOptions
    const diffPixelsCount = pixelmatch(origImg.data, imgToCompare.data, diffImg.data, width, height, options)
    return {diffImg, diffPixelsCount}
  }

  compareWithLocal(origPath: string, toComparePath: string): IPngCompareResult {
    const origImg = this.read(origPath)
    const imgToCompare = this.read(toComparePath)
    return this.compare(origImg, imgToCompare)
  }

  async compareWithScreenshot(origPath: string, toComparePath: string): Promise<IPngCompareResult> {
    const origImg = this.read(origPath)
    const imgToCompare = await this.pageHandler
      .gotoThenScreenshot(toComparePath, this.options.screenshotOptions)
      .then(PNG.sync.read)
    return this.compare(origImg, imgToCompare)
  }

}

interface IPngCompareResult {
  diffImg: PNG;
  diffPixelsCount: number;
}
