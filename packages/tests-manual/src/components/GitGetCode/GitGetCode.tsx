import React from 'react'
import githubImage from './github.png'
import './style.css'
import {Link} from '../../routing'


export const GitGetCode = ({text, href}: IProps) => {

  return (
    <div className="git-get-code">
      <img className="git-get-code_pic" src={githubImage} alt="get code"/>
      <Link className="git-get-code_text" href={href}>{text}</Link>
    </div>
  )
}

interface IProps {
  text: string;
  href: string
}
