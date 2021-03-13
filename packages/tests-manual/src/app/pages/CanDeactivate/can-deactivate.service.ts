import {Location} from '@do-while-for-each/browser-router'
import {first, SubjectWrap} from '@do-while-for-each/rxjs'
import {TRouteActionData} from '../../../router'

export class CanDeactivateService {

  isItBeingCheckedNow = false
  initCheck: any
  tryRelocation: Location | null = null

  canBeDeactivatedResultWrap = new SubjectWrap<boolean>()

  async canDeactivate(tryRelocation: Location, data: TRouteActionData): Promise<boolean> {
    if (this.isItBeingCheckedNow) {
      return false
    } else {
      this.tryRelocation = tryRelocation
      this.initCheck()
      const result = await this.canBeDeactivatedResultWrap.value$.pipe(first()).toPromise()
      this.tryRelocation = null
      return result
    }
  }
}
