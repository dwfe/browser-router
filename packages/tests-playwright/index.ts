import {chromium} from 'playwright'
import {PageHandler} from './src/PageHandler'

// const registry = {}

(async () => {
  const browser = await chromium.launch({headless: false})

  const page = await PageHandler.of(browser)
  await page.action.goto('/')
  await page.clickThenScreenshot('[data-qa=first-page]', 'first-page')
  await page.action.goBack()
  await page.clickThenScreenshot('[data-qa=second-page]', 'second-page')

  browser.close()
})()
