import React from 'react'
import {ActionData, IRoutableProps, Link, useDocumentTitle} from '../../routing'
import {QaSel} from '../../qa/qa-selectors';

export const SecondPage = (props: IRoutableProps) => {
  useDocumentTitle(props)
  return (<>
    <p>Second works!</p>
    <Link href="/second/pic/pic" data-qa={QaSel.SecondPage_Pic}>Pic component</Link><br/><br/>
    <Link href="/second/hello/world" data-qa={QaSel.SecondPage_LongTimeGettingOfActionResult}>long time getting of action result</Link><br/><br/>
    <Link href="/first#warning" data-qa={QaSel.SecondPage_First}>first</Link><br/><br/>
    <ActionData actionData={props.routeActionData}/>
  </>);
}
