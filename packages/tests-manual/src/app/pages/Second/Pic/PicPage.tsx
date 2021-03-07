import {IRoutableProps, RouteActionData, useDocumentTitle} from '@do-while-for-each/browser-router-react-tools'
import React from 'react';
import pic from './pic.png'

export const PicPage = (props: IRoutableProps) => {
  useDocumentTitle(props)

  return (
    <>
      <img src={pic} alt="Routing" width="100"/><br/><br/>
      <RouteActionData actionData={props.routeActionData}/>
    </>
  );
}
