import React from 'react';
import {ActionData, IRoutableProps, useDocumentTitle} from '../../../../router';
import pic from './pic.png'

export const PicPage = (props: IRoutableProps) => {
  useDocumentTitle(props)
  return (<>
    <img src={pic} alt="Routing" width="100"/><br/><br/>
    <ActionData actionData={props.routeActionData}/>
  </>);
}
