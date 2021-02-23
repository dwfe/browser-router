import 'reflect-metadata'
import {RouteResultHandler} from './router'
import {DI} from './di'
import './index.css'

DI.init()

const routeResultHandler = new RouteResultHandler(document.getElementById('root'))
routeResultHandler.start()

