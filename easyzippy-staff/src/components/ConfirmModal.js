import { makeStyles } from '@material-ui/core';
import React from 'react'
import { Button, Modal, ModalFooter, ModalHeader } from 'reactstrap'

const useStyles = makeStyles(theme => ({
    modalHeader: {
        justifyContent: 'center'
    },
    modalFooter: {
        justifyContent: 'center'
    }
}))

export default function ConfirmModal(props) {

    const {confirmModal, setConfirmModal} = props; 
    const classes = useStyles()

    return (
        <Modal isOpen={confirmModal.isOpen}>
            <ModalHeader className={classes.modalHeader}>
                {confirmModal.title}
            </ModalHeader>
            <ModalFooter className={classes.modalFooter}>
                <Button 
                color="info"
                onClick={() => setConfirmModal({...confirmModal, isOpen:false})}
                >No</Button>
                <Button 
                color="danger"
                onClick = {confirmModal.onConfirm}
                >Yes</Button>

            </ModalFooter>
        </Modal>
    )
}
