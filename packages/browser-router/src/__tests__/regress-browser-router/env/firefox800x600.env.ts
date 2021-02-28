import {defaultPixelmatchOptions, IAutomationEnvironmentOptions, Storage} from '@dwfe/utils-node';

export const firefox800x600: IAutomationEnvironmentOptions = {
  browserType: 'firefox',
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
