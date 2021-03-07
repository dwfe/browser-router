import {Link} from '@do-while-for-each/browser-router-react-tools'
import React from 'react'
import './Footer.css'

export const Footer = () => {

  return (
    <div className="page-footer">
      <Link href="https://github.com/dwfe/browser-router/issues" target="_blank">
        For questions and suggestions
      </Link>
    </div>
  )
}
