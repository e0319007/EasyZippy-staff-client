import React from 'react'
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';

export default function Popup(props) {

    const {title, children, openPopup, setOpenPopup} = props; 

    return (
        <Modal isOpen={openPopup}>
                <ModalHeader style={{display:"inline-block", textAlign:"right"}}>
                        {title} 
                        <Button color="danger" size="sm" 
                            onClick={() => {setOpenPopup(false)}}
                        >x</Button>
                </ModalHeader>
            <ModalBody>
               {children}
            </ModalBody>
        </Modal>
      
    )
}
