import {BrowserRouter, To} from '@do-while-for-each/browser-router'
import {container} from 'tsyringe'

export const LOGGED_KEY = 'logged-key'

export class AuthService {

  redirectTo: To = {pathname: ''}

  private router: BrowserRouter

  constructor() {
    this.router = container.resolve(BrowserRouter)
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
}

