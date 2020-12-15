import React from 'react'
import {ActionData, IRoutableProps, Link, useDocumentTitle} from '../routing'
import {QaSel} from '../qa/qa-selector';

export const IndexPage = (props: IRoutableProps) => {
  useDocumentTitle(props)

  return (
    <div>
      <Link href="/first" data-qa={QaSel.IndexPage_First}>First component</Link><br/><br/>
      <Link href="/second" ctx={{title: 'first'}} data-qa={QaSel.IndexPage_Second}>Second component</Link><br/><br/>
      <Link href="/hello" ctx={{title: `page that doesn't exist`}} data-qa={QaSel.IndexPage_DoesntExist}>page that doesn't exist</Link><br/><br/>
      <Link href="/protected-by-authorization" data-qa={QaSel.IndexPage_AuthorizationRequired}>authorization required</Link><br/><br/>
      <Link href="/can-deactivate-check" data-qa={QaSel.IndexPage_CanDeactivate}>can deactivate check</Link><br/><br/>
      <Link href="https://tools.ietf.org/html/rfc2616" data-qa={QaSel.IndexPage_ExternalRFC2616}>external - Hypertext Transfer Protocol, RFC</Link><br/><br/>
      <ActionData actionData={props.routeActionData}/>
    </div>
  )
}
