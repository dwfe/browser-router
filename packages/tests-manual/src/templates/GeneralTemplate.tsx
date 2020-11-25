import React from 'react'
import {Header} from '../components/Header'
import {Main} from '../components/Main'


export const GeneralTemplate = (props: any) => {

  return (<>
    <Header/>
    <Main>
      {props.children}
    </Main>
  </>)
}
