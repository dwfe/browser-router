import {Routes} from '@do-while-for-each/path-resolver'

export const routesCheck: Routes = [
  {path: '/', children: [
      {path: '/', component: ''},
      {path: '/books', component: '', children: [
          {path: '/books/:year/:genre', component: ''},
          {path: '/books/(.*)', redirectTo: '/auto', component: ''}
        ]}
    ]},
  {path: '/team/:id', component: '', children: [
      {path: '/team/:id/group/:gr_id', component: ''},
      {path: '/team/:id/users', component: ''},
      {path: '/team/:id/user/:name', component: ''},
      {path: '/team/:id/hr', redirectTo: '', component: ''},
      {path: '/team/:id/(.*)', redirectTo: 'users', component: ''}
    ]},
  {path: '/auto', children: [
      {path: '/auto', component: ''},
      {path: '/auto/:color', component: ''},
      {path: '/auto/check/redirect', redirectTo: 'aqua', component: ''}
    ]},
]
