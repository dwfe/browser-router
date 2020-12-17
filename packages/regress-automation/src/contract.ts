import {BrowserContextOptions, LaunchOptions} from 'playwright'
import {PixelmatchOptions} from 'pixelmatch';

export interface IPoint {
  x: number;
  y: number;
}

export interface IScriptItem {
  goto?: { path: string, scName?: string };
  screenshot?: { scName: string };
  click?: { sel: string, scName?: string };
  fill?: { sel: string, value: string };
  children?: IScriptItem[];
  last?: 'goBack' | 'goForward' | string;
  canDeactivateClick?: string;
}

export type BrowserType = 'chromium' | 'webkit' | 'firefox'

export interface IRegressAutomationOptions {
  browserType: BrowserType;
  baseUrl: string;
  dir: string;
  screenshotOptions: IScreenshotOptions;
  browserOptions: LaunchOptions;
  browserContextOptions: BrowserContextOptions;
  pixelmatchOptions?: PixelmatchOptions;
}

// https://www.npmjs.com/package/pixelmatch#pixelmatchimg1-img2-output-width-height-options
export const defaultPixelmatchOptions: PixelmatchOptions = {
  threshold: 0.1,
  includeAA: true, // if 'true', disables detecting and ignoring anti-aliased pixels
  alpha: 0.1,
  aaColor: [0, 165, 0], // green
  diffColor: [0, 0, 255], // blue
  diffColorAlt: [255, 0, 0], // red
  diffMask: false,
}

export interface IScreenshotOptions {
  /**
   * The file path to save the image to. The screenshot type will be inferred from file extension. If `path` is a relative path, then it is resolved relative to current working directory. If no path is provided, the image won't be saved to the disk.
   */
  path?: string;

  /**
   * Specify screenshot type, defaults to `png`.
   */
  type?: 'jpeg' | 'png';

  /**
   * The quality of the image, between 0-100. Not applicable to `png` images.
   */
  quality?: number;

  /**
   * When true, takes a screenshot of the full scrollable page, instead of the currently visible viewport. Defaults to `false`.
   */
  fullPage?: boolean;

  /**
   * An object which specifies clipping of the resulting image. Should have the following fields:
   */
  clip?: {
    /**
     * x-coordinate of top-left corner of clip area
     */
    x: number;

    /**
     * y-coordinate of top-left corner of clip area
     */
    y: number;

    /**
     * width of clipping area
     */
    width: number;

    /**
     * height of clipping area
     */
    height: number;
  };

  /**
   * Hides default white background and allows capturing screenshots with transparency. Not applicable to `jpeg` images. Defaults to `false`.
   */
  omitBackground?: boolean;

  /**
   * Maximum time in milliseconds, defaults to 30 seconds, pass `0` to disable timeout. The default value can be changed by using the browserContext.setDefaultTimeout(timeout) or page.setDefaultTimeout(timeout) methods.
   */
  timeout?: number;
}
