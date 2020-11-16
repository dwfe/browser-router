import 'reflect-metadata'
import {initServices} from './di-container'
import {startRouter} from './routing'
import {routes} from './routes'
import './index.css'

initServices()
startRouter(routes, document.getElementById('root'))

