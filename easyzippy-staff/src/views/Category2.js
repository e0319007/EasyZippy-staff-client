import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import UseTable from "../components/UseTable";
import ConfirmModal from "../components/ConfirmModal";
import Noti from "../components/Noti";

import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    CardText, Label, Input, Button, Table, InputGroup, InputGroupText, InputGroupAddon, CardHeader, FormGroup
} from "reactstrap";

import { Form } from "components/UseForm";



const headCells = [
    {id:'id', label:'ID'},
    {id:'name', label:'Name'},
    {id:'description', label:'Description'},
    {id:'actions', label:'Actions', disableSorting:true}
]

function Category2(props) {

    const[categoryList, setCategoryList] = useState([])
    const [filterFunction, setFilterFunction] = useState({fn: items => { return items; }})
    const [openPopup, setOpenPopup] = useState(false)
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [confirmModal, setConfirmModal] = useState({isOpen:false, title:''})
    const [notify, setNotify] = useState({isOpen: false, message:'', type:''})

    const [data, setData] = useState({
        name:"",
        description: ""
    })

    useEffect(() => {
        axios
        .get("http://localhost:5000/categories")
        .then(res => {
            console.log(res.data)
            setCategoryList(res.data)
        })
        .catch (err => console.error(err))
    })

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = UseTable(data, headCells, filterFunction);

    
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

    const handleSubmit = e => {
        e.preventDefault()
        axios
        .post("http://localhost:5000/category", data)
        .then(res => {
            console.log(res.data)
            const myData=[...categoryList, res.data]
            setCategoryList(myData)
            setNotify({
                isOpen:true,
                message: 'Submitted Successfully',
                type: 'success'
            })
        })
    }

    const handleDelete = id => {
        console.log(id)
        axios
        .delete(`http://localhost:5000/category/${id}`)
        .then(res => {
            console.log(res.data)
            setConfirmModal ({
                ...confirmModal,
                isOpen:false
            })
            const myAllData = categoryList.filter(item => item.id !== id)
            setCategoryList(myAllData)
            setNotify({
                isOpen:true,
                message: 'Deleted Successfully',
                type: 'error'
            })
            
        })
        .catch(err => console.error(err))
    }

    const handleEdit = id => {
        console.log(id)
        //props.history.push("/updateCategory/"+id)
        axios
        .put(`http://localhost:5000/category/${id}`) 
        .then(res => {
            setData(res.data)
        },[])      
    }


    const handleInputChange = e => {
        const newData = {...data}
        newData[e.target.id] = e.target.value
        setData(newData)
    }

    const displayCategoryList = categoryList.map(item => (
        <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.description}</td>
            <td>
                <Button size="sm" color="info" 
                 //onClick={() => {openInPopup(item)}}
                 onClick={() => handleEdit(item.id)}
                >
                <AiOutlineEdit />
                </Button>
                

                <Button size="sm" color="danger" onClick={() => {
                    setConfirmModal({
                        isOpen: true,
                        title: "Are you sure you want to delete?",
                        onConfirm: () => handleDelete(item.id)
                    })
                }}>
                    <AiOutlineDelete/>
                </Button>
            </td>
        </tr>
        ))

    return(
        <>
        <div className="content">
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md = "12">
                        <Card>
                            <CardHeader>
                                <div className="form-row">
                                    <CardTitle className="col-md-4" tag="h4">Category2 List</CardTitle>        
                                </div>
                            </CardHeader>
                            <CardBody>
                                <CardTitle tag="h5">Create A New Category</CardTitle>
                                <form>
                                    <div className="form-row">
                                        <FormGroup className="col-md-12">
                                            <Label for="name">Name</Label>
                                            <Input 
                                                type="text" 
                                                name="name" 
                                                id="name" 
                                                placeholder="Name" 
                                                value={data.name}
                                                onChange={handleInputChange} 
                                                required
                                            />
                                        </FormGroup>
                                    </div>
                                    <div className="form-row">
                                        <FormGroup className="col-md-12">
                                            <Label for="description">Description</Label>
                                            <Input 
                                                type="text" 
                                                name="description" 
                                                id="description" 
                                                placeholder="Description" 
                                                value={data.description}
                                                onChange={handleInputChange} 
                                                required
                                            />
                                        </FormGroup>
                                    </div>
                                    <Row>
                                        <div className="update ml-auto mr-auto">
                                            <Button color="success">Submit</Button>
                                        </div>
                                    </Row>       
                                </form>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText><i className="nc-icon nc-zoom-split"></i></InputGroupText>
                                    </InputGroupAddon>
                                    <Input type="text" placeholder="Search Category" 
                                    onChange={handleSearch}></Input>
                                </InputGroup>
                                {/* <TblContainer> */}
                                <Table responsive hover>
                                    <TblHead />
                                    <tbody>
                                        {displayCategoryList}
                                    </tbody>
                                {/* </TblContainer> */}
                                </Table>
                            </CardBody>
                            <Noti 
                            notify={notify}
                            setNotify={setNotify}/>
                            <ConfirmModal 
                            confirmModal={confirmModal}
                            setConfirmModal={setConfirmModal}/>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </div>
        </>
    );
}

export default Category2;