import React from 'react'
import {ActionData, IRoutableProps, Link, useDocumentTitle} from '../routing'

export const IndexPage = (props: IRoutableProps) => {
  useDocumentTitle(props)

  return (<div>
    <Link href="/first">First component</Link><br/><br/>
    <Link href="/second" ctx={{title: 'first'}}>Second component</Link><br/><br/>
    <Link href="http://ya.ru">Ya.ru</Link><br/><br/>
    <Link href="/hello" ctx={{title: `page that doesn't exist`}}>hello</Link><br/><br/>
    <Link href="/protected-by-authorization">authorization required</Link><br/><br/>
    <Link href="/can-deactivate-check">can deactivate check</Link><br/><br/>
    <ActionData actionData={props.routeActionData}/>
  </div>)
}
