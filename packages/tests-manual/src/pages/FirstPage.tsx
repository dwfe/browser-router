import React from 'react'
import {ActionData, IRoutableProps, Link} from '../routing'
import {QaSel} from '../qa/qa-selectors';

export class FirstPage extends React.Component<IRoutableProps, any> {

  constructor(props: IRoutableProps) {
    super(props)
    const title = props?.routeActionData?.note?.title
    if (title) {
      document.title = title
    }
  }

  render() {
    return (<>
      <p>First works!</p>
      <Link href="/first/to-pic" data-qa={QaSel.FirstPage_ToSecondPic}>to second pic</Link><br/><br/>
      <Link href="/first/world?qwerty=123#asd" data-qa={QaSel.FirstPage_DoesntExist}>page that doesn't exist</Link><br/><br/>
      <ActionData actionData={this.props.routeActionData}/>
    </>)
  }
}
