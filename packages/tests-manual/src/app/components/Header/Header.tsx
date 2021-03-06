import {Link, useDIInstance} from '@do-while-for-each/browser-router-react-tools'
import {BrowserRouter} from '@do-while-for-each/browser-router'
import React from 'react'
import {BtnNavigate} from '../BtnNavigate/BtnNavigate'
import {GitGetCode} from '../GitGetCode/GitGetCode'
import {QaSel} from '../../qa-selector'
import './Header.css'

export const Header = () => {
  const [router] = useDIInstance(BrowserRouter)

  const backFn = () => router.goBack()
  const forwardFn = () => router.goForward()

  return (
    <header className="page-header">
      <nav className="page-header_nav">
        <BtnNavigate isBack={true} onClick={backFn}/>
        <Link href="/" data-qa={QaSel.Header_Index}>Index</Link>
        <BtnNavigate isBack={false} onClick={forwardFn}/>
      </nav>
      <div className="page-header_info">
        <ol>
          <li>The routes used can be seen&nbsp;
            <Link href="https://github.com/dwfe/browser-router/blob/master/packages/tests-manual/src/router/routes.tsx#L10" target="_blank">here</Link>
          </li>
          <li>Trace output you can see in console</li>
        </ol>
      </div>
      <div className="page-header_get-code">
        <GitGetCode href="https://github.com/dwfe/browser-router/tree/master/packages/tests-manual"
                    text='get source of this demo'/>
      </div>
    </header>
  )
}

