import React from 'react'
import {Link} from '../routing/components/Link';
import {IRoutableProps} from '../routing/contract';
import {ActionData} from '../routing/components/ActionData/ActionData';
import {useDocumentTitle} from '../routing/globals';

export const MainPage = (props: IRoutableProps) => {
  useDocumentTitle(props)
  return (<div>
    <Link href="/first">First component</Link><br/><br/>
    <Link href="/second" ctx={{title: 'first'}}>Second component</Link><br/><br/>
    <Link href="http://ya.ru">Ya.ru</Link><br/><br/>
    <Link href="/hello" ctx={{title: '404'}}>hello</Link><br/><br/>
    <ActionData actionData={props.currentActionData}/>
  </div>)
}
