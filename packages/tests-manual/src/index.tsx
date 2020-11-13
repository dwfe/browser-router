import 'reflect-metadata'
import './index.css'
import {startRouter} from './routing';
import {routes} from './routes';

startRouter(routes, document.getElementById('root'))
