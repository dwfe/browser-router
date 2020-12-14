import {chromium} from 'playwright'
import {PageHandler} from './src/PageHandler'
import {QaSel} from './src/qa/qa-selectors';


const registry: ISel[] = [
  {
    selector: QaSel.IndexPage_First, children: [
      {selector: QaSel.FirstPage_DoesntExist}
    ]
  },
  {
    selector: QaSel.IndexPage_Second, children: [
      {selector: QaSel.SecondPage_Pic}
    ]
  },
  {selector: QaSel.IndexPage_DoesntExist},

  //TODO - 2 картинки: залогинен/разлогинен
  {selector: QaSel.IndexPage_AuthorizationRequired},

  {selector: QaSel.IndexPage_CanDeactivate, canDeactivateAnswerSelector: QaSel.CanDeactivatePage_DialogueYes},

  {selector: QaSel.IndexPage_ExternalRFC2616}
];


(async () => {
  const browser = await chromium.launch({headless: false})

  const page = await PageHandler.of(browser)
  page.action.baseUrl = 'http://localhost:3000'
  page.action.screenshotsDir = './ORIG'
  await page.action.goto('/')
  await page.action.screenshot('index-page')

  await pageScreenshotCrawler(registry, page)

  browser.close()
})()


async function pageScreenshotCrawler(selectors: ISel[], page: PageHandler) {
  for (const {selector, children, canDeactivateAnswerSelector} of selectors) {
    await page.clickThenScreenshot(selector)
    if (children) {
      await pageScreenshotCrawler(children, page)
    }
    await page.action.goBack()
    if (canDeactivateAnswerSelector) {
      await page.action.click(canDeactivateAnswerSelector)
    }
  }
}


interface ISel {
  selector: QaSel;
  canDeactivateAnswerSelector?: QaSel;
  children?: ISel[];
}

