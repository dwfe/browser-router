import React, {MutableRefObject, useRef} from 'react'
import classNames from 'classnames'
import './style.css'
import {QaSel} from '../../qa/qa-selector';


export const BtnNavigate = ({isBack, onClick}: IProps) => {
  const buttonRef: MutableRefObject<HTMLButtonElement | null> = useRef(null)

  const props = () => {
    const className = classNames(
      'btn-navigate',
      isBack ? 'btn-navigate--back' : 'btn-navigate--forward'
    )
    return {
      className,
      title: isBack ? 'Back' : 'Forward',
      onClick: handleClick,
    }
  }

  const handleClick = () => {
    onClick && onClick()
    buttonRef?.current?.focus()
  }


  return (
    <button
      ref={buttonRef}
      {...props()}
      data-qa={isBack ? QaSel.Header_GoBack : QaSel.Header_GoForward}
    >
      <svg>
        <path d={arrowPath}/>
      </svg>
    </button>
  )
}

const arrowPath = 'M19.9688 2.00049L2.99825 18.5843L19.9688 35.168'

interface IProps {
  isBack?: boolean;
  onClick: any;
}
