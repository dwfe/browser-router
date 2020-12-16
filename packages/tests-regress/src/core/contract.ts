import {BrowserContextOptions, LaunchOptions} from 'playwright'

export interface IPoint {
  x: number;
  y: number;
}

export interface IScriptItem {
  goto?: { path: string, scName?: string };
  screenshot?: string;
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
  dir: string;
  browserOptions: LaunchOptions;
  browserContextOptions: BrowserContextOptions;
}
