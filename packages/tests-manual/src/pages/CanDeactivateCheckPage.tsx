import {ActionData, IRoutableProps, Link, useDocumentTitle} from '../routing'
import React from 'react'

export const CanDeactivateCheckPage = (props: IRoutableProps) => {
  useDocumentTitle(props)

  return (<div>
    <p>Try to leave the page</p>
    <Link href="/first">first</Link><br/><br/>
    <Link href="/second">second</Link><br/><br/>
    <ActionData actionData={props.routeActionData}/>
  </div>)
}
