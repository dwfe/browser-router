import {BrowserContextOptions, LaunchOptions} from 'playwright'

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

export type EngineType = 'chromium' | 'webkit' | 'firefox'

export interface IScreenshotCrawlerOptions {
  engine: EngineType;
  baseUrl: string;
  screenshotOptions: IScreenshotOptions;
  browserOptions: LaunchOptions;
  browserContextOptions: BrowserContextOptions;
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
