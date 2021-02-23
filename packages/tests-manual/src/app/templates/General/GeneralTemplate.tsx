import React from 'react'
import {PathPrint} from '../../components/PathPrint/PathPrint'
import {Header} from '../../components/Header/Header'
import {Footer} from '../../components/Footer/Footer'
import {Main} from '../../components/Main'
import './GeneralTemplate.css'

export const GeneralTemplate = (props: any) => {

  return (
    <div className="general-tmpl">
      <Header/>
      <PathPrint/>
      <Main>
        {props.children}
      </Main>
      <Footer/>
    </div>
  )
}
