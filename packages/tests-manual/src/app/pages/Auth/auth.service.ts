import {BrowserRouter, To} from '@do-while-for-each/browser-router'
import {IActionResult} from '@do-while-for-each/path-resolver'
import {TRouteActionData} from '../../../router'

export const LOGGED_KEY = 'logged-key'

export class AuthService {

  redirectTo: To = {pathname: ''}

  constructor(private router: BrowserRouter) {
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(LOGGED_KEY)
  }

  logIn(username: string, password: string) {
    if (username && password) {
      localStorage.setItem(LOGGED_KEY, username + password)
      if (this.redirectTo)
        this.router.redirect(this.redirectTo)
    }
  }

  logOut() {
    localStorage.removeItem(LOGGED_KEY)
    this.router.goto('/')
  }

  async passIfLoggedIn(data: TRouteActionData): Promise<IActionResult> {
    if (this.isLoggedIn())
      return {skip: true}
    else {
      this.redirectTo = data.target // the user will be redirected here after successful login
      return {redirectTo: 'login'}
    }
  }
}

