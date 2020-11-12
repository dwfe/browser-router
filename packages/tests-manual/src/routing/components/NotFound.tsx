import React from 'react';
import {IRoutableProps} from '../contract';
import {ActionData} from './ActionData/ActionData';
import {getPreviousActionData} from '../globals';
import {useDocumentTitle} from '../hooks/useDocumentTitle';

export const NotFound = (props: IRoutableProps) => {
  useDocumentTitle(props)

  const {currentActionData} = props
  const previous = getPreviousActionData(currentActionData)
  const notFoundTxt = previous
    ? <span><code><b>{previous.target.pathname}</b></code> - not found</span>
    : <span>Not found</span>

  return (<>
    <p>{`404. `}{notFoundTxt}</p>
    <ActionData actionData={currentActionData}/>
  </>)
}

