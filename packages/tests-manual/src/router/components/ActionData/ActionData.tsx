import React, {useLayoutEffect, useRef} from 'react'
import autosize from 'autosize'
import './ActionData.css'

export const ActionData = ({actionData}: any) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    if (!!textareaRef.current)
      autosize(textareaRef.current)
  }, [textareaRef])

  return (
    <div>
      <div className="ActionData">
        <p className="ActionData_text">route action data (injected):</p>
        <textarea className="ActionData_listing"
                  value={JSON.stringify(actionData || 'empty', null, 2)}
                  readOnly={true}
                  ref={textareaRef}/>
      </div>
    </div>
  )
}
