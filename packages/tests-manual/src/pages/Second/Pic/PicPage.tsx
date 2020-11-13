import React from 'react';
import {ActionData, IRoutableProps, useDocumentTitle} from '../../../routing';
import pic from './pic.png'

export const PicPage = (props: IRoutableProps) => {
  useDocumentTitle(props)
  return (<>
    <p>Pic works!</p>
    <img src={pic} alt="Routing" width="200"/><br/><br/>
    <ActionData actionData={props.routeActionData}/>
  </>);
}
