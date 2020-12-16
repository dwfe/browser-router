import {describe, expect, test} from '@jest/globals'
import * as pixelmatch from 'pixelmatch'
import {Png} from '../../core/png';

describe(`pixelmatch`, () => {
  const png = new Png()

  test(`run`, () => {

    const imgOrig = png.read('../tests-screenshot-crawler/REFERENCE/chromium-800x600_index-page.png');
    const imgToCompare = png.read('../tests-screenshot-crawler/REFERENCE/chromium-800x600_login-page.png');
    const {imgDiff, diffPixelsCount} = png.diff(imgOrig, imgToCompare)
    png.write('diff.png', imgDiff)
    expect(diffPixelsCount).toEqual(0)

  })

})

