import {ScreenshotCrawler} from '@dwfe/regress-automation'
import * as casePrepareReference from './qa/case-prepare-reference'

ScreenshotCrawler
  .of(casePrepareReference.options)
  .then(crawler => crawler.run(casePrepareReference.script))
