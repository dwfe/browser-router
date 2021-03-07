import {BrowserRouter} from '@do-while-for-each/browser-router';
import React, {HTMLProps, SyntheticEvent} from 'react'
import {useDIInstance} from '../../hooks'

export const Link = (props: IProps) => {
  const {href, onClick, ctx, children} = props as any
  const [router] = useDIInstance(BrowserRouter)

  const handleClick = (event: SyntheticEvent) => {
    event.preventDefault()
    onClick?.(event as any);
    const target = event.currentTarget as HTMLAnchorElement;
    target.origin === window.location.origin
      ? router.goto(target, ctx)
      : router.goAway(target.href, target.target)
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
