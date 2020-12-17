import * as playwright from 'playwright'
import {Browser} from 'playwright'
import {IRegressAutomationOptions} from '../contract'
import {PageHandler} from '../page.handler'

export const playwrightInitiator = async (options: IRegressAutomationOptions): Promise<[Browser, PageHandler]> => {
  const {browserType, browserOptions, browserContextOptions, baseUrl} = options

  const browser = await playwright[browserType].launch(browserOptions)
  const browserContext = await browser.newContext(browserContextOptions)

  const page = await browserContext.newPage()
  const pageHandler = new PageHandler(page)
  pageHandler.baseUrl = baseUrl

  return [browser, pageHandler]
}
