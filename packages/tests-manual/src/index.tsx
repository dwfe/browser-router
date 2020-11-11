import 'reflect-metadata'
import {container} from 'tsyringe'
import React, {ReactElement} from 'react'
import ReactDOM from 'react-dom'
import {Routes} from '@do-while-for-each/path-resolver'
import {BrowserRouter} from '@do-while-for-each/browser-router'
import {tap} from 'rxjs/operators'
import './index.css'
import {routes} from './routing/routes';

const root = document.getElementById('root')

container.register(BrowserRouter, {useValue: new BrowserRouter(routes as Routes)})
const router = container.resolve<BrowserRouter<ReactElement>>(BrowserRouter)

router.component$.pipe(
  tap(component => {
    ReactDOM.render(
      component,
      root
    )
  }),
).subscribe()

router.start()
