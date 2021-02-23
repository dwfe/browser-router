import React from 'react'
import {Link} from '../../../router'
import './Footer.css'

export const Footer = () => {

  return (
    <div className="page-footer">
      <Link href="https://gitlab.com/wizards-lab/routing/-/issues" target="_blank">
        For questions and suggestions
      </Link>
    </div>
  )
}
