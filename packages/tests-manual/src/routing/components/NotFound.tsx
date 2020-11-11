import React, {HTMLProps} from 'react';
import {RouteActionData} from '../routes';

export const NotFound = (props: IProps) => {
  let {routeActionData} = props
  return (<>
    <h2>{routeActionData?.ctx?.title || 'Error'}</h2>
    <p>404. Not found</p>
    <textarea readOnly={true} style={{width: '500px', height: '200px'}}>
      {JSON.stringify(routeActionData?.targetGoTo, null, 2)}
    </textarea>
  </>)
}

interface IProps extends HTMLProps<any> {
  routeActionData?: RouteActionData;
}
