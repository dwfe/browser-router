import * as fs from 'fs'
import {PNG, PNGWithMetadata} from 'pngjs'
import * as pixelmatch from 'pixelmatch'
import {PixelmatchOptions} from 'pixelmatch'

export class Png {

  read(path: string): PNGWithMetadata {
    return PNG.sync.read(fs.readFileSync(path));
  }

  write(path: string, png: PNG): void {
    fs.writeFileSync(path, PNG.sync.write(png, {filterType: 4}));
  }

  diff(imgOrig: PNG, imgToCompare: PNG, options: PixelmatchOptions = defaultOptions) {
    const {width, height} = imgOrig
    const imgDiff = new PNG({width, height})
    const diffPixelsCount = pixelmatch(imgOrig.data, imgToCompare.data, imgDiff.data, width, height, options)
    return {imgDiff, diffPixelsCount}
  }
}

// https://www.npmjs.com/package/pixelmatch#pixelmatchimg1-img2-output-width-height-options
const defaultOptions: PixelmatchOptions = {
  threshold: 0.1,
  includeAA: true, // if 'true', disables detecting and ignoring anti-aliased pixels
  alpha: 0.1,
  aaColor: [0, 165, 0], // green
  diffColor: [0, 0, 255], // blue
  diffColorAlt: [255, 0, 0], // red
  diffMask: false,
}
