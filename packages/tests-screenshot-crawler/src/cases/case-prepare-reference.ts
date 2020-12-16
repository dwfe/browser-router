import {IScreenshotCrawlerOptions, IScriptItem} from '../core/contract'
import {QaScName} from '../qa/qa-screenshot-name'
import {QaSel} from '../qa/qa-selector'

export const script: IScriptItem[] = [
  {goto: {path: '/', scName: QaScName.IndexPage}},
  {click: {sel: QaSel.IndexPage_DoesntExist, scName: QaScName.IndexPage_DoesntExistPage}, last: 'goBack'},
  {
    click: {sel: QaSel.IndexPage_AuthorizationRequired, scName: QaScName.LoginPage}, last: 'goBack', children: [
      {fill: {sel: QaSel.LoginPage_Username, value: '1'}},
      {fill: {sel: QaSel.LoginPage_Password, value: '2'}},
      {click: {sel: QaSel.LoginPage_LogIn, scName: QaScName.ProtectedByAuthorizationPage}}
    ]
  },
  {click: {sel: QaSel.IndexPage_CanDeactivate, scName: QaScName.CanDeactivatePage}, last: 'goBack', canDeactivateClick: QaSel.CanDeactivatePage_DialogueYes},
  {
    click: {sel: QaSel.IndexPage_First, scName: QaScName.FirstPage}, last: 'goBack', children: [
      {click: {sel: QaSel.FirstPage_DoesntExist, scName: QaScName.FirstPage_DoesntExistPage}, last: 'goBack'}
    ]
  },
  {
    click: {sel: QaSel.IndexPage_Second, scName: QaScName.SecondPage}, last: 'goBack', children: [
      {click: {sel: QaSel.SecondPage_Pic, scName: QaScName.SecondPage_PicPage}, last: 'goBack'}
    ]
  },
  {click: {sel: QaSel.IndexPage_ExternalRFC2616, scName: QaScName.IndexPage_ExternalRFC2616Page}, last: 'goBack'}
];


export const options: IScreenshotCrawlerOptions = {
  engine: 'chromium',
  baseUrl: 'http://localhost:3000',
  screenshotOptions: {
    path: './REFERENCE',
    type: 'png',
    // quality: 50,
  },
  browserOptions: {
    headless: true,
    // devtools: true,
  },
  browserContextOptions: {
    viewport: {
      width: 800,
      height: 600
    },
    timezoneId: 'Europe/Moscow',
    locale: 'ru_RU',
    colorScheme: 'light',
    // recordVideo: {
    //   dir: './REFERENCE'
    // }
  }
}
