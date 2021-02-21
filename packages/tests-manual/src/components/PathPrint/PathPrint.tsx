import {Path} from '@do-while-for-each/browser-router'
import React from 'react'
import './PathPrint.css'

export function PathPrint() {

  return (
    <div className="PathPrint">
      {/*<p className="PathPrint_text">path:</p>*/}
      <p className="PathPrint_code">{new Path(window.location).toString()}</p>
    </div>
  );
}
