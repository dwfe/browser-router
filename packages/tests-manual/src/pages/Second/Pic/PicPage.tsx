import React from 'react';
import routingPic from './routing.png'
import {IRoutableProps} from '../../../routing/contract';
import {ActionData} from '../../../routing/components/ActionData/ActionData';
import {useDocumentTitle} from '../../../routing/globals';

export const PicPage = (props: IRoutableProps) => {
  useDocumentTitle(props)
  return (<>
    <p>Pic works!</p>
    <img src={routingPic} alt="Routing" width="200"/>
    <ActionData actionData={props.currentActionData}/>
  </>);
}
