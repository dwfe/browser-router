import {Routes} from '@do-while-for-each/path-resolver'

export const routes: Routes = [
  {path: '', children: [
      {path: '', component: ''},
      {path: 'books', component: '', children: [
          {path: ':year/:genre', component: ''},
          {path: '(.*)', redirectTo: '/auto', component: ''}
      ]}
  ]},
  {path: 'team/:id', component: '', children: [
      {path: 'group/:gr_id', component: ''},
      {path: 'users', component: ''},
      {path: 'user/:name', component: ''},
      {path: 'hr', redirectTo: '', component: ''},
      {path: '(.*)', redirectTo: 'users', component: ''}
  ]},
  {path: 'auto', children: [
      {path: '', component: ''},
      {path: ':color', component: ''},
      {path: 'check/redirect', redirectTo: 'aqua', component: ''}
  ]},
]
