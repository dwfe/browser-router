import React from 'react';
import {Link} from '../routing/components/Link'
import {IRoutableProps} from '../routing/contract';
import {ActionData} from '../routing/components/ActionData/ActionData';
import {useDocumentTitle} from '../routing/globals';

export const FirstPage = (props: IRoutableProps) => {
  useDocumentTitle(props)
  return (<>
    <p>First works!</p>
    <Link href="/first/world?qwerty=123#asd">world</Link><br/>
    <ActionData actionData={props.currentActionData}/>
  </>);
}
