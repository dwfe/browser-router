import React from 'react'
import {Header} from '../../components/Header/Header'
import {Main} from '../../components/Main'
import './style.css'

export const GeneralTemplate = (props: any) => {

  return (
    <div className="general-tmpl">
      <Header/>
      <Main>
        {props.children}
      </Main>
    </div>
  )
}
