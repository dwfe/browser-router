import {defaultPixelmatchOptions, IAutomationEnvironmentOptions, Storage} from '@dwfe/utils-node';

export const chromium800x600: IAutomationEnvironmentOptions = {
  browserType: 'chromium',
  browser: {
    headless: true,
    // devtools: true,
  },
  browserContext: {
    viewport: {
      width: 800,
      height: 600
    },
    locale: 'en_US',
    timezoneId: 'Europe/Moscow',
    colorScheme: 'light',
    // recordVideo: {
    //   dir: './reference',
    //   size: { width: 800, height: 600 }
    // }
  },
  screenshot: {
    type: 'png',
    // quality: 50,
    // fullPage: true,
  },
  pixelmatch: defaultPixelmatchOptions,
  storage: {
    variant: Storage,
    dir: './src/__tests__/__snapshots__',
  },
  baseUrl: 'http://localhost:3000',
  isDebug: true,
}
