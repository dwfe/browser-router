import React from 'react'
import {BrowserRouter} from '@do-while-for-each/browser-router'
import './style.css'
import {useDIInstance} from '../../di/useDIInstance'
import {GitGetCode} from '../GitGetCode/GitGetCode'
import {BtnNavigate} from '../BtnNavigate/BtnNavigate'
import {Link} from '../../routing'


export const Header = () => {
  const [router] = useDIInstance<BrowserRouter>(BrowserRouter)

  const backFn = () => router.goBack()
  const forwardFn = () => router.goForward()

  return (
    <header className="page-header">
      <nav className="page-header_nav">
        <BtnNavigate isBack={true} onClick={backFn}/>
        <Link href="/">Index</Link>
        <BtnNavigate isBack={false} onClick={forwardFn}/>
      </nav>
      <div className="page-header_see-console">
        <p>Trace output you can see in console</p>
      </div>
      <div className="page-header_code">
        <GitGetCode href="https://gitlab.com/wizards-lab/routing/-/tree/master/packages/tests-manual"
                    text='get source of this demo'/>
      </div>
    </header>
  )
}

