import React from 'react';
import './styles.css'

export const ActionData = ({actionData}: any) => ((<div className="ActionData">
  <p className="ActionData_text">route action data:</p>
  <textarea className="ActionData_listing"
            value={JSON.stringify(actionData || 'empty', null, 2)}
            readOnly={true}/>
</div>))
