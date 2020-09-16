import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import React from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

export default function Popup(props) {

    const {title, children, openPopup, setOpenPopup} = props; 

    return (
        // <Modal open={openPopup}>
        //     <ModalHeader>
        //         <div>title goes here</div>

        //     </ModalHeader>
        //     <ModalBody>
        //         <div>content goes here</div>
        //     </ModalBody>
        // </Modal>
        <Dialog>
            <DialogTitle>
                <div>title</div>
            </DialogTitle>
            <DialogContent>
                <div>content</div>
            </DialogContent>
        </Dialog>
    )
}
