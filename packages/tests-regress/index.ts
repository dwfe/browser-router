import {ScreenshotCrawler} from './src/ScreenshotCrawler';

ScreenshotCrawler
  .of({
    engine: 'chromium',
    baseUrl: 'http://localhost:3000',
    referenceDir: './REFERENCE',
    browserOptions: {
      headless: false,
    },
    ctxOptions: {
      viewport: {
        width: 800,
        height: 600
      },
      timezoneId: 'Europe/Moscow',
      locale: 'ru_RU',
      colorScheme: 'light',
      // recordVideo: {
      //   dir: referenceDir
      // }
    }
  })
  .then(crawler => crawler.run())

