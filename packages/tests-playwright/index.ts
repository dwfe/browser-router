import {QaSel} from '@dwfe/tests-core'
import {chromium} from 'playwright'
import {PageHandler} from './src/PageHandler'


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

  //TODO - сделать подтверждение с использованием https://www.npmjs.com/package/react-modal
  {selector: QaSel.IndexPage_CanDeactivate},

  {selector: QaSel.IndexPage_ExternalRFC2616}
];


(async () => {
  const browser = await chromium.launch({headless: false})

  const page = await PageHandler.of(browser)
  page.action.baseUrl = 'http://localhost:3000'
  page.action.screenshotsDir = './ORIG'
  await page.action.goto('/')
  await page.action.screenshot('index-page')


  await crawler(registry, page)

  browser.close()
})()


async function crawler(selectors: ISel[], page: PageHandler) {
  for (const {selector, children} of selectors) {
    await page.clickThenScreenshot(selector)
    if (children) {
      await crawler(children, page)
    }
    await page.action.goBack()
  }
}


interface ISel {
  selector: string;
  children?: ISel[];
}

