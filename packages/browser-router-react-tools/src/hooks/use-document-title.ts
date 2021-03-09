import {useEffect} from 'react'
import {IRoutableProps} from '../contract'

export const useDocumentTitle = (props: IRoutableProps) => {
  const title = props?.routeActionData?.note?.title
  useEffect(() => {
    if (title) document.title = title
  }, [title])
}
