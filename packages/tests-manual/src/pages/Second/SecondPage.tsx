import React from 'react';
import {ActionData, IRoutableProps, Link, useDocumentTitle} from '../../routing';

export const SecondPage = (props: IRoutableProps) => {
  useDocumentTitle(props)
  return (<>
    <p>Second works!</p>
    <Link href="/second/pic/pic">Pic component</Link><br/><br/>
    <Link href="/second/hello/world">long time getting of action result</Link><br/><br/>
    <Link href="/first#warning">first</Link><br/><br/>
    <ActionData actionData={props.routeActionData}/>
  </>);
}
