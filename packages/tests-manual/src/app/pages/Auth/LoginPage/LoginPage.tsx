import React, {useCallback, useState} from 'react'
import Modal from 'react-modal'
import {useDIInstance} from '../../../../hooks/use-di-instance'
import {ActionData, IRoutableProps} from '../../../../router'
import {defaultModalStyles} from '../../modal.settings'
import {AuthService} from '../auth.service'
import {QaSel} from '../../../qa-selector'
import './LoginPage.css'

Modal.setAppElement('#root')

export const LoginPage = (props: IRoutableProps) => {
  const [auth] = useDIInstance(AuthService)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showModal, setShowModal] = useState(false)
  const closeModal = useCallback(() => setShowModal(false), [setShowModal])

  const logIn = () => {
    if (isNonEmptyString(username) && isNonEmptyString(password))
      auth.logIn(username, password)
    else {
      setShowModal(true)
      setTimeout(() => {
        const btn = document.querySelector(`[data-ok=ok]`) as HTMLButtonElement
        btn?.focus()
      }, 50)
    }
  }

  return (
    <div>
      <div className="login-block">
        <h3>Please log in</h3>
        <div className="login-block_req">
          <label htmlFor="username">username:</label>
          <input required type="text" id="username"
                 value={username}
                 onChange={(event) => setUsername(event.target.value)}
                 data-qa={QaSel.LoginPage_Username}/>
        </div>
        <div className="login-block_req">
          <label htmlFor="password">password:</label>
          <input required type="password" id="password"
                 value={password}
                 onChange={(event) => setPassword(event.target.value)}
                 data-qa={QaSel.LoginPage_Password}/>
        </div>
        <button onClick={logIn} data-qa={QaSel.LoginPage_LogIn}>Ok</button>
      </div>
      <br/><br/>

      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        style={defaultModalStyles}
      >
        <p>Fill fields <b>username</b> and <b>password</b> with something</p>
        <button onClick={closeModal} data-ok="ok">Ok</button>
      </Modal>

      <ActionData actionData={props.routeActionData}/>
    </div>
  )
}

const isNonEmptyString = (str: any) => typeof str === 'string' && str
