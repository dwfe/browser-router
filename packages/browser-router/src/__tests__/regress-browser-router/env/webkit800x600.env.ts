import {defaultPixelmatchOptions, IAutomationEnvironmentOptions, Storage} from '@do-while-for-each/node-utils';

export const webkit800x600: IAutomationEnvironmentOptions = {
  browserType: 'webkit',
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
  },
  screenshot: {
    type: 'png',
  },
  pixelmatch: defaultPixelmatchOptions,
  storage: {
    variant: Storage,
    dir: './src/__tests__/__snapshots__',
  },
  baseUrl: 'http://localhost:3000',
  isDebug: true,
}
