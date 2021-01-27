import React from 'react'
import {ActionData, IRoutableProps, Link, useDocumentTitle} from '../../routing'
import {QaSel} from '../../qa/qa-selector';

export const SecondPage = (props: IRoutableProps) => {
  useDocumentTitle(props)
  return (<>
    <p>Second works!</p>
    <Link href="/second/lala/picture" data-qa={QaSel.SecondPage_Picture}>Picture component</Link><br/><br/>
    <Link href="/second/hello/world" data-qa={QaSel.SecondPage_LongTimeGettingOfActionResult}>long time getting of action result</Link><br/><br/>
    <Link href="/first#warning" data-qa={QaSel.SecondPage_First}>to first component</Link><br/><br/>
    <ActionData actionData={props.routeActionData}/>
  </>);
}
