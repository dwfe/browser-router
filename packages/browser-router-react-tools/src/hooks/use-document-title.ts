import {useEffect} from 'react'
import {IRoutableProps} from '../contract'

export const useDocumentTitle = (props: IRoutableProps) => {
  useEffect(() => {
    const title = props?.routeActionData?.note?.title
    if (title)
      document.title = title
  }, [])
}
