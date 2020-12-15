import {BrowserContextOptions, LaunchOptions} from 'playwright'
import {QaSel} from './qa/qa-selector'

export interface IPoint {
  x: number;
  y: number;
}

export interface IScriptItem {
  goto?: string;
  screenshot?: string;
  click?: { sel: QaSel, scName?: string };
  fill?: { sel: QaSel, value: string };
  children?: IScriptItem[];
  goBack?: boolean;
  canDeactivateClick?: QaSel;
}

export interface IScreenshotCrawlerOptions {
  engine: 'chromium' | 'webkit' | 'firefox';
  baseUrl: string;
  referenceDir: string;
  browserOptions: LaunchOptions;
  ctxOptions: BrowserContextOptions;
}
