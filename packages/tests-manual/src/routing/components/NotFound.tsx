import React, {HTMLProps} from 'react';
import {RouteActionData} from '../contract';

export const NotFound = ({routeActionData}: IProps) => (
  <div>
    <h2>{routeActionData?.data.ctx?.title || `instead 'ctx.title'`}</h2>
    <h2>{routeActionData?.data.note?.title || `instead 'note.title'`}</h2>
    <p>404. Not found</p>
    <textarea readOnly={true}
              style={{width: '50vw', height: '50vh'}}
              value={JSON.stringify(routeActionData, null, 2)}/>
  </div>
)

interface IProps extends HTMLProps<any> {
  routeActionData?: RouteActionData;
}
