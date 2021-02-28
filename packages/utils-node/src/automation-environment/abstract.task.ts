import {BehaviorSubject} from 'rxjs';
import {filter, first} from 'rxjs/operators';
import {Page} from 'playwright';
import {IImgCompareResult, ITask, TCommand} from './contract';

export abstract class AbstractTask implements ITask {

  private allDataReceivedSubj = new BehaviorSubject<any>(null);
  private screenshotSubj = new BehaviorSubject<Buffer>(null);
  private compareScreenshotSubj = new BehaviorSubject<IImgCompareResult>(null);

  constructor(public readonly id: string) {
  }

  abstract getScript(): TCommand[];

  page?: Page;

  setAllDataReceived() {
    this.allDataReceivedSubj.next(true);
  }

  async allDataReceived(): Promise<any> {
    return result(this.allDataReceivedSubj);
  }

  setScreenshot(buf: Buffer) {
    this.screenshotSubj.next(buf);
  }

  async screenshot(): Promise<Buffer> {
    return result(this.screenshotSubj);
  }

  setCompareScreenshotResult(result: IImgCompareResult) {
    this.compareScreenshotSubj.next(result);
  }

  async compareScreenshotResult(): Promise<IImgCompareResult> {
    return result(this.compareScreenshotSubj);
  }

}

const result = async <T>(subj: BehaviorSubject<T>): Promise<T> =>
  subj.getValue()
  || subj.asObservable().pipe(
  filter(data => !!data),
  first()
  ).toPromise()
;
