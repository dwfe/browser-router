import React, {HTMLProps, SyntheticEvent} from 'react'
import {useRouter} from '../useRouter'
import {IRouteContext} from '../routes';

export const Link = (props: IProps) => {
  const {href, onClick, children, ctx} = props
  const [router] = useRouter()

  const handleClick = (event: SyntheticEvent) => {
    event.preventDefault()
    onClick && onClick(event as any)
    router.go(event.currentTarget as HTMLAnchorElement, ctx)
  }
  return (
    <a {...props}
       href={href}
       onClick={handleClick}>
      {children}
    </a>
  )
}

interface IProps extends HTMLProps<HTMLAnchorElement> {
  ctx?: IRouteContext;
}
