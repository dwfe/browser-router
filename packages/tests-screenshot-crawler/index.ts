import {ScreenshotCrawler} from './src/core/ScreenshotCrawler';
import * as casePrepareReference from './src/cases/case-prepare-reference';

ScreenshotCrawler
  .of(casePrepareReference.options)
  .then(crawler => crawler.run(casePrepareReference.script))

