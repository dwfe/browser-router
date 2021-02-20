import {BrowserRouter, Path} from '@do-while-for-each/browser-router';
import React, {HTMLProps, SyntheticEvent} from 'react'
import {useDIInstance} from '../../di/useDIInstance'

export const Link = (props: IProps) => {
  const {href, onClick, children, ctx} = props
  const [router] = useDIInstance<BrowserRouter>(BrowserRouter)

  const handleClick = (event: SyntheticEvent) => {
    event.preventDefault()
    onClick && onClick(event as any)
    // @ts-ignore
    const path = Path.of(event.currentTarget as HTMLAnchorElement)
    router.goto(path, ctx)
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
  ctx?: any;
}
