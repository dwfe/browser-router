import React, {HTMLProps} from 'react';
import {RouteActionData} from '../contract';

export const NotFound = ({routeActionData}: IProps) => {

  let notFoundTxt = <span>Not found</span>
  if (routeActionData) {
    const {data} = routeActionData
    if (data.ctx) {
      const {previous} = data.ctx
      if (previous) {
        notFoundTxt = <span><code><b>{previous.targetGoTo.pathname}</b></code> - not found</span>
      }
    }
  }
  return (<>
    <p>{`404. `}{notFoundTxt}</p>
    <textarea readOnly={true}
              style={{width: '50vw', height: '50vh'}}
              value={JSON.stringify(routeActionData, null, 2)}/>
  </>)
}

interface IProps extends HTMLProps<any> {
  routeActionData?: RouteActionData;
}
