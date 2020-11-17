import React from 'react';
import {ActionData, IRoutableProps, Link} from '../routing'

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
      <Link href="/first/world?qwerty=123#asd">world</Link><br/><br/>
      <Link href="/first/to-pic">to pic</Link><br/><br/>
      <ActionData actionData={this.props.routeActionData}/>
    </>)
  }
}
