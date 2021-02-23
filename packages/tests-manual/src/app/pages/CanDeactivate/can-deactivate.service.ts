import {Location} from '@do-while-for-each/browser-router';
import {first} from 'rxjs/operators'
import {Subject} from 'rxjs'
import {TRouteActionData} from '../../../router'

export class CanDeactivateService {

  isItBeingCheckedNow = false
  initCheck: any
  tryRelocation: Location | null = null

  canBeDeactivatedResultSubj = new Subject<boolean>()

  async canDeactivate(tryRelocation: Location, data: TRouteActionData): Promise<boolean> {
    if (this.isItBeingCheckedNow) {
      return false
    } else {
      this.tryRelocation = tryRelocation
      this.initCheck()
      const result = await this.canBeDeactivatedResultSubj.asObservable().pipe(first()).toPromise()
      this.tryRelocation = null
      return result
    }
  }
}
