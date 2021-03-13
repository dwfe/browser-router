import {Location} from '@do-while-for-each/browser-router'
import {SubjectWrap} from '@do-while-for-each/rxjs'
import {TRouteActionData} from '../../../router'

export class CanDeactivateService {

  isItBeingCheckedNow = false
  initCheck: any
  tryRelocation: Location | null = null

  canBeDeactivated = new SubjectWrap<boolean>()

  async canDeactivate(tryRelocation: Location, data: TRouteActionData): Promise<boolean> {
    if (this.isItBeingCheckedNow) {
      return false
    } else {
      this.tryRelocation = tryRelocation
      this.initCheck()
      const result = await this.canBeDeactivated.value()
      this.tryRelocation = null
      return result
    }
  }
}
