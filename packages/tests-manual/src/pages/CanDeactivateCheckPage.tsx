import React from 'react'
import {QaSel} from '@dwfe/tests-core'
import {ActionData, IRoutableProps, Link, useDocumentTitle} from '../routing'

export const CanDeactivateCheckPage = (props: IRoutableProps) => {
  useDocumentTitle(props)

  return (<div>
    <p>Try to leave the page</p>
    <Link href="/first" data-qa={QaSel.CanDeactivatePage_First}>first</Link><br/><br/>
    <Link href="/second" data-qa={QaSel.CanDeactivatePage_Second}>second</Link><br/><br/>
    <ActionData actionData={props.routeActionData}/>
  </div>)
}
