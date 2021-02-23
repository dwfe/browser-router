import 'reflect-metadata'
import {initServices} from './router/di-container'
import {startRouter} from './router'
import {routes} from './routes'
import './index.css'

initServices()
startRouter(routes, document.getElementById('root'))

