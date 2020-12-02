import React from 'react'
import {Header} from '../../components/Header/Header'
import {Main} from '../../components/Main'
import './style.css'
import {Footer} from '../../components/Footer/Footer'

export const GeneralTemplate = (props: any) => {

  return (
    <div className="general-tmpl">
      <Header/>
      <Main>
        {props.children}
      </Main>
      <Footer/>
    </div>
  )
}
