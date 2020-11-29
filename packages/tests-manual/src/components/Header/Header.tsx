import React from 'react'
import {BrowserRouter} from '@do-while-for-each/browser-router'
import './style.css'
import {useDIInstance} from '../../di/useDIInstance'
import {Link} from '../../routing'


export const Header = () => {
  const [router] = useDIInstance<BrowserRouter>(BrowserRouter)

  const backFn = () => router.goBack()
  const forwardFn = () => router.goForward()

  return (
    <header className="page-header">
      <nav className="page-header_nav">
        <button className="page-header_btn  page-header_btn--back" title="Back" onClick={backFn}>
          <svg>
            <path d={arrowPath}/>
          </svg>
        </button>
        <Link href="/">Index</Link>
        <button className="page-header_btn  page-header_btn--forward" title="Forward" onClick={forwardFn}>
          <svg>
            <path d={arrowPath}/>
          </svg>
        </button>
      </nav>
    </header>
  )
}

const arrowPath = 'M19.9688 2.00049L2.99825 18.5843L19.9688 35.168'
