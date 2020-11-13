import React from 'react';
import {IRoutableProps} from '../contract';
import {ActionData} from './ActionData/ActionData';
import {getPreviousRouteActionData} from '../globals';
import {useDocumentTitle} from '../hooks/useDocumentTitle';

export const NotFound = (props: IRoutableProps) => {
  useDocumentTitle(props)

  const {routeActionData} = props
  const previous = getPreviousRouteActionData(routeActionData)
  const notFoundTxt = previous
    ? <span><code><b>{previous.target.pathname}</b></code> - not found</span>
    : <span>Not found</span>

  return (<>
    <p>{`404. `}{notFoundTxt}</p>
    <ActionData actionData={routeActionData}/>
  </>)
}

