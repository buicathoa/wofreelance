import React from 'react'
import { ModalConfirmInterface } from '../../interface'
import { Button, Modal } from 'antd'
import './style.scss'

export const ModalConfirm = ({title, icon = null, content = null, description = null, visible, setVisible, onConfirm}: ModalConfirmInterface) => {

    const onConfirmOk = () => {
        onConfirm()
    }

    const onConfirmCancel = () => {
        setVisible(false)
    }

  return (
    <>
            <Modal
                className="modal-confirm-container"
                title={title}
                visible={visible}
                onOk={() => onConfirmOk()}
                onCancel={() => onConfirmCancel()}
                footer={[
                    <Button key="Cancel" onClick={() => onConfirmCancel()}>
                        Cancel
                    </Button>,
                    <Button className="modal-confirm-delete-btn" key="Delete" onClick={() => onConfirmOk()}>
                        Delete
                    </Button>
                ]}
            >
                <div className="modal-confirm-content-container">
                    <img src={icon} alt="icon delete confirm"></img>
                    <h4>{content ? content : 'Are you sure to delete this item?'}</h4>
                    <h5>{description ? description : 'Once a record is deleted, the data cannot be undone'}</h5>
                </div>
            </Modal>
        </>
  )
}
