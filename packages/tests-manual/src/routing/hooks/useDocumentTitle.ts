import {IRoutableProps} from '../contract';
import {useEffect} from 'react';

export const useDocumentTitle = ({currentActionData}: IRoutableProps) => {
  useEffect(() => {
    const title = currentActionData?.note?.title
    if (title)
      document.title = title
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
