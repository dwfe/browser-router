import React from 'react';
import {Link} from '../../routing/components/Link';

export const SecondPage = () => {
  return (<>
    <p>Second works!</p>
    <Link href="/second/pic">Pic component</Link><br/><br/>
    <Link href="/second/hello/world">hello world</Link><br/><br/>
  </>);
}
