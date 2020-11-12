import {IRoutableProps, RouteActionData} from './contract';
import {useEffect} from 'react';

export const getPreviousActionData = (currentActionData?: RouteActionData): RouteActionData | undefined => {
  if (currentActionData) {
    return currentActionData.previous
  }
}


export const useDocumentTitle = ({currentActionData}: IRoutableProps) => {
  useEffect(() => {
    const title = currentActionData?.note?.title
    if (title)
      document.title = title
  }, [])
}
