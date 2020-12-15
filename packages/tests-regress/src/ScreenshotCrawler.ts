import {IScreenshotCrawlerOptions, IScriptItem} from './contract'
import * as playwright from 'playwright'
import {Browser} from 'playwright'
import {QaSel} from './qa/qa-selector'
import {PageHandler} from './PageHandler'
import {QaScName} from './qa/qa-screenshot-name';


export class ScreenshotCrawler {

  static async of({engine, baseUrl, referenceDir, browserOptions, ctxOptions}: IScreenshotCrawlerOptions): Promise<ScreenshotCrawler> {
    const browser = await playwright[engine].launch(browserOptions)
    const ctx = await browser.newContext(ctxOptions)

    const h = new PageHandler(await ctx.newPage())
    h.engine = engine
    h.baseUrl = baseUrl
    h.referenceDir = referenceDir

    return new ScreenshotCrawler(h, browser)
  }

  constructor(private h: PageHandler,
              private browser: Browser) {
  }

  async run() {
    await this.traverse(script)
    await this.browser.close()
  }

  async traverse(script: IScriptItem[]) {
    for (const {goto, screenshot, click, fill, children, canDeactivateClick, goBack} of script) {
      if (goto)
        await this.h.goto('/')

      if (screenshot)
        await this.h.screenshot(screenshot)

      if (click) {
        const {sel, scName} = click
        if (scName)
          await this.h.clickThenScreenshot(sel, scName)
        else
          await this.h.click(sel)
      }

      if (fill)
        await this.h.fill(fill.sel, fill.value)

      if (children)
        await this.traverse(children)

      if (goBack)
        await this.h.goBack()

      if (canDeactivateClick)
        await this.h.click(canDeactivateClick)
    }
  }

}

const script: IScriptItem[] = [
  {goto: '/'},
  {screenshot: QaScName.IndexPage},
  {
    click: {sel: QaSel.IndexPage_First, scName: QaScName.FirstPage}, goBack: true, children: [
      {click: {sel: QaSel.FirstPage_DoesntExist, scName: QaScName.FirstPage_DoesntExistPage}, goBack: true}
    ]
  },
  {
    click: {sel: QaSel.IndexPage_Second, scName: QaScName.SecondPage}, goBack: true, children: [
      {click: {sel: QaSel.SecondPage_Pic, scName: QaScName.SecondPage_PicPage}, goBack: true}
    ]
  },
  {click: {sel: QaSel.IndexPage_DoesntExist, scName: QaScName.IndexPage_DoesntExistPage}, goBack: true},

  {
    click: {sel: QaSel.IndexPage_AuthorizationRequired, scName: QaScName.LoginPage}, goBack: true, children: [
      {fill: {sel: QaSel.LoginPage_Username, value: '1'}},
      {fill: {sel: QaSel.LoginPage_Password, value: '2'}},
      {click: {sel: QaSel.LoginPage_LogIn, scName: QaScName.ProtectedByAuthorizationPage}}
    ]
  },

  {click: {sel: QaSel.IndexPage_CanDeactivate, scName: QaScName.CanDeactivatePage}, goBack: true, canDeactivateClick: QaSel.CanDeactivatePage_DialogueYes},

  {click: {sel: QaSel.IndexPage_ExternalRFC2616, scName: QaScName.IndexPage_ExternalRFC2616Page}, goBack: true}
];
