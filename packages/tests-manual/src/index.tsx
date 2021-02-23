import 'reflect-metadata'
import {RouteResultsHandler} from './router'
import {DI} from './di'
import './index.css'

DI.init()

const routeResultsHandler = new RouteResultsHandler(document.getElementById('root'))
routeResultsHandler.start()

