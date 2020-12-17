import {afterAll, beforeAll, describe, expect, test} from '@jest/globals'
import {PngComparator} from '@dwfe/regress-automation'
import * as casePrepareReference from '../../qa/case-prepare-reference'

let pngComparator: PngComparator

beforeAll(async () => {
  pngComparator = await PngComparator.of(casePrepareReference.options)
})

describe(`pixelmatch`, () => {

  test(`compare with local`, () => {
    const {diffImg, diffPixelsCount} = pngComparator.compareWithLocal('./REFERENCE/chromium-800x600_index-page.png', './REFERENCE/chromium-800x600_index-page.png')
    pngComparator.write('diff_local.png', diffImg)
    expect(diffPixelsCount).toEqual(0)
  })

  test(`compare with screenshot`, async () => {
    const {diffImg, diffPixelsCount} = await pngComparator.compareWithScreenshot('./REFERENCE/chromium-800x600_index-page.png', '/second')
    pngComparator.write('diff_remote.png', diffImg)
    expect(diffPixelsCount).toEqual(0)
  })

})

afterAll(() => {
  pngComparator.stop()
})
