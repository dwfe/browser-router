import {useLayoutEffect, useRef} from 'react'
import autosize from 'autosize'
import './RouteActionData.css'

export const RouteActionData = ({actionData}: any) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    if (!!textareaRef.current)
      autosize(textareaRef.current)
  }, [textareaRef])

  return (
    <div>
      <div className="RouteActionData">
        <p className="RouteActionData_text">route action data (injected):</p>
        <textarea className="RouteActionData_listing"
                  value={JSON.stringify(actionData || 'empty', null, 2)}
                  readOnly={true}
                  ref={textareaRef}/>
      </div>
    </div>
  )
}
