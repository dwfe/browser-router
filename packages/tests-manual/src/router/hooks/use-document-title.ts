import {IRoutableProps} from '../contract';
import {useEffect} from 'react';

export const useDocumentTitle = ({routeActionData}: IRoutableProps) => {
  useEffect(() => {
    const title = routeActionData?.note?.title
    if (title)
      document.title = title
  }, []) // eslint-disable-line
}
