import React from 'react'
import {ActionData, IRoutableProps, Link} from '../../router'
import {QaSel} from '../qa-selector'

export class FirstPage extends React.Component<IRoutableProps, any> {

  constructor(props: IRoutableProps) {
    super(props)
    const title = props?.routeActionData?.note?.title
    if (title) {
      document.title = title
    }
  }

  render() {
    return (
      <>
        <p>First works!</p>
        <Link href="/first/world?qwerty=123#asd" data-qa={QaSel.FirstPage_DoesntExist}>page that doesn't exist</Link><br/><br/>
        <Link href="/first/to-pic" data-qa={QaSel.FirstPage_ToSecondPic}>to second picture</Link><br/><br/>
        <ActionData actionData={this.props.routeActionData}/>
      </>
    )
  }
}
