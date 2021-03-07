import 'reflect-metadata'
import {RouteResultHandler} from './router'
import {DI} from './di'
import './index.css'

DI.init()

const routeResultsHandler = new RouteResultHandler(document.getElementById('root'))
routeResultsHandler.start()

