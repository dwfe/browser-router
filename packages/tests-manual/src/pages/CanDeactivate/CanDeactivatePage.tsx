import React, {useState} from 'react'
import Modal from 'react-modal'
import {ActionData, IRoutableProps, Link, useDocumentTitle} from '../../routing'
import {useDIInstance} from '../../di/useDIInstance';
import {CanDeactivateService} from './can-deactivate.service'
import {QaSel} from '../../qa/qa-selectors';

Modal.setAppElement('#root')
const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    height: '200px'
  }
};

export const CanDeactivatePage = (props: IRoutableProps) => {
  useDocumentTitle(props)

  const [showModal, setShowModal] = useState(false)
  const [canDeactivateService] = useDIInstance(CanDeactivateService)
  canDeactivateService.isItBeingCheckedNow = showModal
  canDeactivateService.initCheck = () => setShowModal(true)
  const canBeDeactivated = (can: boolean) => {
    setShowModal(false)
    canDeactivateService.canBeDeactivatedResultSubj.next(can)
  }

  return (<div>
    <p>Try to leave the page</p>
    <Link href="/first" data-qa={QaSel.CanDeactivatePage_First}>first</Link><br/><br/>
    <Link href="/second" data-qa={QaSel.CanDeactivatePage_Second}>second</Link><br/><br/>

    <Modal isOpen={showModal} style={modalStyles}>
      <p>Are you sure you want to go to <code><b>{canDeactivateService.tryRelocation?.pathname}</b></code> ?</p>
      <div>
        <button onClick={() => canBeDeactivated(true)} data-qa={QaSel.CanDeactivatePage_DialogueYes}>Yes</button>
        &nbsp;&nbsp;&nbsp;
        <button onClick={() => canBeDeactivated(false)} data-qa={QaSel.CanDeactivatePage_DialogueCancel}>Cancel</button>
      </div>
    </Modal>

    <ActionData actionData={props.routeActionData}/>
  </div>)
}
