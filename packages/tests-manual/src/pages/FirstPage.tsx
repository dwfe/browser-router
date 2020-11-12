import React from 'react';
import {ActionData, IRoutableProps, Link, useDocumentTitle} from '../routing'

export const FirstPage = (props: IRoutableProps) => {
  useDocumentTitle(props)
  return (<>
    <p>First works!</p>
    <Link href="/first/world?qwerty=123#asd">world</Link><br/><br/>
    <Link href="/first/to-pic">to pic</Link><br/><br/>
    <ActionData actionData={props.currentActionData}/>
  </>);
}
