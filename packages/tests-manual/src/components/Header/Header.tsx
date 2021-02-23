import React from 'react'
import {BrowserRouter} from '@do-while-for-each/browser-router'
import './style.css'
import {useDIInstance} from '../../di/useDIInstance'
import {GitGetCode} from '../GitGetCode/GitGetCode'
import {BtnNavigate} from '../BtnNavigate/BtnNavigate'
import {Link} from '../../routing'
import {QaSel} from '../../qa/qa-selector';


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
            <Link href="https://gitlab.com/wizards-lab/routing/-/blob/master/packages/tests-manual/src/routes.tsx#L9" target="_blank">here</Link>
          </li>
          <li>Log output you can see in console</li>
        </ol>
      </div>
      <div className="page-header_get-code">
        <GitGetCode href="https://gitlab.com/wizards-lab/routing/-/tree/master/packages/tests-manual"
                    text='get source of this demo'/>
      </div>
    </header>
  )
}

