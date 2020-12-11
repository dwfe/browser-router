import React from 'react'
import {ActionData, IRoutableProps, Link, useDocumentTitle} from '../routing'

export const IndexPage = (props: IRoutableProps) => {
  useDocumentTitle(props)

  return (
    <div>
      <Link href="/first" data-qa="first-page">First component</Link><br/><br/>
      <Link href="/second" ctx={{title: 'first'}} data-qa="second-page">Second component</Link><br/><br/>
      <Link href="/hello" ctx={{title: `page that doesn't exist`}} data-qa="index-doesnt-exist">page that doesn't exist</Link><br/><br/>
      <Link href="/protected-by-authorization" data-qa="authorization-required">authorization required</Link><br/><br/>
      <Link href="/can-deactivate-check" data-qa="can-deactivate">can deactivate check</Link><br/><br/>
      <Link href="https://google.com" data-qa="">google.com</Link><br/><br/>
      <ActionData actionData={props.routeActionData}/>
    </div>
  )
}
