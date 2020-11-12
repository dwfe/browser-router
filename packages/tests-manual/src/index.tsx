import 'reflect-metadata'
import './index.css'
import {startRouter} from './routing/start-router';
import {routes} from './routes';

startRouter(routes, document.getElementById('root'))
