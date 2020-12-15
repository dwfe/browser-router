import React, {useState} from 'react'
import Modal from 'react-modal'
import {ActionData, IRoutableProps} from '../../../routing'
import {useDIInstance} from '../../../di/useDIInstance'
import {AuthService} from '../auth.service'
import {defaultModalStyles} from '../../modal.settings';
import {QaSel} from '../../../qa/qa-selector';
import './style.css'

Modal.setAppElement('#root')

export const LoginPage = (props: IRoutableProps) => {
  const [auth] = useDIInstance(AuthService)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showModal, setShowModal] = useState(false)
  const closeModal = () => setShowModal(false)

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
