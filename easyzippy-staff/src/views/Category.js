import React, { useState } from "react";

import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    Input,
    Button,
    CardHeader, InputGroup, InputGroupText, InputGroupAddon
} from "reactstrap";
import CreateCategoryForm from "./CreateCategoryForm";
import UseTable from "../components/UseTable";
import * as CategoryService from "../services/categoryService";
import Popup from "../components/Popup"
import { AiOutlineEdit } from 'react-icons/ai';
import { AiOutlineClose } from 'react-icons/ai';
import Noti from "../components/Noti";
import ConfirmModal from "../components/ConfirmModal";

const headCells = [
    {id:'id', label:'ID'},
    {id:'name', label:'Name'},
    {id:'description', label:'Description'},
    {id:'actions', label:'Actions', disableSorting:true}
]

function Category() {

    const [recordForEdit, setRecordForEdit] = useState(null)
    const [records, setRecords] = useState(CategoryService.getAllCategory())
    const [filterFunction, setFilterFunction] = useState({fn: items => { return items; }})
    const [openPopup, setOpenPopup] = useState(false)
    const [notify, setNotify] = useState({isOpen: false, message:'', type:''})
    const [confirmModal, setConfirmModal] = useState({isOpen:false, title:''})

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = UseTable(records, headCells, filterFunction);

    const handleSearch = e => {
        let target = e.target;
        setFilterFunction({
            fn: items => {
                if (target.value === "")
                    return items;
                else 
                    return items.filter(x => x.name.toLowerCase().includes(target.value))
            }
        })
    }

    const addOrEdit = (category, resetForm) => {
          if (category.id == 0) 
            CategoryService.insertCategory(category)
          else 
            CategoryService.updateCategory(category)
        resetForm()
        setRecordForEdit(null)
        setOpenPopup(false)
        setRecords(CategoryService.getAllCategory())
        setNotify({
            isOpen:true,
            message: 'Submitted Successfully',
            type: 'success'
        })
    }

    const openInPopup = item => {
        setRecordForEdit(item)
        setOpenPopup(true)
    }

    const onDelete = id => {
        setConfirmModal ({
            ...confirmModal,
            isOpen:false
        })
        CategoryService.deleteCategory(id);
        setRecords(CategoryService.getAllCategory())
        setNotify({
            isOpen:true,
            message: 'Deleted Successfully',
            type: 'error'
        })
        
    }

    return(
        <>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <CardHeader>
                                <div className="form-row">
                                <CardTitle className="col-md-4" tag="h4">Category List</CardTitle>    
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText><i className="nc-icon nc-zoom-split"></i></InputGroupText>
                                        </InputGroupAddon>
                                        <Input type="text" placeholder="Search Category" 
                                        onChange={handleSearch}></Input>
                                    </InputGroup>
                                    <Button 
                                        color="success"
                                        onClick={() => { setOpenPopup(true); setRecordForEdit(null); }}>Create New Category</Button>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <TblContainer>
                                    <TblHead />
                                    <tbody>
                                        {
                                            recordsAfterPagingAndSorting().map(item => (
                                                <tr key={item.id}>
                                                    <td>{item.id}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.description}</td>                                            
                                                    <td>
                                                        <Button size="sm" color="info" 
                                                            onClick={() => {openInPopup(item)}}>
                                                            <AiOutlineEdit />
                                                        </Button>
                                                        <Button size="sm" color="danger" 
                                                            onClick={() => {
                                                                setConfirmModal({
                                                                    isOpen:true,
                                                                    title:'Are you sure?',
                                                                    onConfirm:() => {onDelete(item.id)}
                                                                })
                                                            }}>
                                                            <AiOutlineClose />
                                                        </Button>                                               
                                                    </td>
                                                </tr>
                                            ))
                                        }

                                    </tbody>
                                </TblContainer>
                                <TblPagination />
                            </CardBody>
                            <Popup 
                            title="Create New Category Form"
                            openPopup = {openPopup}
                            setOpenPopup = {setOpenPopup}>
                                <CreateCategoryForm 
                                recordForEdit={recordForEdit}
                                addOrEdit={addOrEdit} />

                            </Popup>
                            <Noti 
                            notify={notify}
                            setNotify={setNotify}/>
                            <ConfirmModal 
                            confirmModal={confirmModal}
                            setConfirmModal={setConfirmModal}/>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Category;