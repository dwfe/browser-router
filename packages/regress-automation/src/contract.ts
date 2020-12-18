import {BrowserContextOptions, LaunchOptions, Page} from 'playwright'
import {PixelmatchOptions} from 'pixelmatch'

export type BrowserType = 'chromium' | 'webkit' | 'firefox'
export type ScreenshotOptions = NonNullable<Parameters<Page['screenshot']>[0]>

export interface IRegressAutomationOptions {
  browserType: BrowserType;
  baseUrl: string;
  dir: string;
  closeBrowserAfterAll: boolean;
  screenshotOptions: ScreenshotOptions;
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

export interface IScriptItem {
  waitForTimeout?: number;
  goto?: { path: string; scName?: string; waitBeforeScreenshot?: number };
  screenshot?: { scName: string };
  click?: { sel: string, scName?: string; waitBeforeScreenshot?: number };
  fill?: { sel: string, value: string };
  children?: IScriptItem[];
  last?: 'goBack' | 'goForward' | string;
  canDeactivateClick?: string;
}

export interface IPoint {
  x: number;
  y: number;
}
