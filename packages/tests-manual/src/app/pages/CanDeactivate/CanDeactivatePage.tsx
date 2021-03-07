import {IRoutableProps, Link, RouteActionData, useDIInstance, useDocumentTitle} from '@do-while-for-each/browser-router-react-tools'
import React, {useState} from 'react'
import Modal from 'react-modal'
import {CanDeactivateService} from './can-deactivate.service'
import {defaultModalStyles} from '../modal.settings'
import {QaSel} from '../../qa-selector'

Modal.setAppElement('#root')

export const CanDeactivatePage = (props: IRoutableProps) => {
  useDocumentTitle(props)

  const [showModal, setShowModal] = useState(false)
  const [deactSrv] = useDIInstance(CanDeactivateService)
  deactSrv.isItBeingCheckedNow = showModal
  deactSrv.initCheck = () => setShowModal(true)
  const canBeDeactivated = (can: boolean) => {
    setShowModal(false)
    deactSrv.canBeDeactivatedResultSubj.next(can)
  }
  const afterOpenModal = () => {
    const btn = document.querySelector(`[data-qa=${QaSel.CanDeactivatePage_DialogueYes}]`) as HTMLButtonElement
    btn?.focus()
  }

  return (
    <div>
      <p>Try to leave the page</p>
      <Link href="/first" data-qa={QaSel.CanDeactivatePage_First}>first</Link><br/><br/>
      <Link href="/second" data-qa={QaSel.CanDeactivatePage_Second}>second</Link><br/><br/>

      <Modal
        isOpen={showModal}
        onRequestClose={() => canBeDeactivated(false)}
        onAfterOpen={afterOpenModal}
        style={defaultModalStyles}
      >
        <p>Are you sure you want to go to <code><b>{deactSrv.tryRelocation?.pathname}</b></code> page?</p>
        <div>
          <button onClick={() => canBeDeactivated(true)} data-qa={QaSel.CanDeactivatePage_DialogueYes}>Yes</button>
          &nbsp;&nbsp;&nbsp;
          <button onClick={() => canBeDeactivated(false)} data-qa={QaSel.CanDeactivatePage_DialogueCancel}>Cancel</button>
        </div>
      </Modal>

      <RouteActionData actionData={props.routeActionData}/>
    </div>
  )
}
