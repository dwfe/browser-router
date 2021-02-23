import React from 'react'
import {ActionData, IRoutableProps, Link, useDocumentTitle} from '../../router'
import {QaSel} from '../qa-selector'

export const IndexPage = (props: IRoutableProps) => {
  useDocumentTitle(props)

  return (
    <div>
      <Link href="/hello" data-qa={QaSel.IndexPage_DoesntExist}>page that doesn't exist</Link><br/><br/>
      <Link href="/protected-by-authorization" data-qa={QaSel.IndexPage_AuthorizationRequired}>authorization required</Link><br/><br/>
      <Link href="/can-deactivate-check" data-qa={QaSel.IndexPage_CanDeactivate}>can deactivate</Link><br/><br/>
      <Link href="https://tools.ietf.org/html/rfc2616" data-qa={QaSel.IndexPage_External}>external - Hypertext Transfer Protocol, RFC</Link><br/><br/>
      <Link href="/first" data-qa={QaSel.IndexPage_First}>First component</Link><br/><br/>
      <Link href="/second" data-qa={QaSel.IndexPage_Second}>Second component</Link><br/><br/>
      <ActionData actionData={props.routeActionData}/>
    </div>
  )
}
