import React from 'react';
import {Link} from '../routing/components/Link'

export const FirstPage = () => {
  return (<>
    <p>First works!</p>
    <Link href="/first/world?qwerty=123#asd">world</Link><br/>
  </>);
}
