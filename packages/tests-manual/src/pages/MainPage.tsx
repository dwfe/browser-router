import React from 'react'
import {Link} from '../routing/components/Link';

export const MainPage = () => {
  return (<div>
    <Link href="/first">First component</Link><br/><br/>
    <Link href="/second">Second component</Link><br/><br/>
    <Link href="http://ya.ru">Ya.ru</Link><br/><br/>
    <Link href="/hello" ctx={{title: 'custom header: "hello world"'}}>hello</Link><br/><br/>
  </div>)
}
