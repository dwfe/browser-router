import React from 'react';
import {Link} from '../../routing/components/Link';
import {IRoutableProps} from '../../routing/contract';
import {ActionData} from '../../routing/components/ActionData/ActionData';
import {useDocumentTitle} from '../../routing/globals';

export const SecondPage = (props: IRoutableProps) => {
  useDocumentTitle(props)
  return (<>
    <p>Second works!</p>
    <Link href="/second/pic">Pic component</Link><br/><br/>
    <Link href="/second/hello/world">hello world</Link><br/><br/>
    <ActionData actionData={props.currentActionData}/>
  </>);
}
