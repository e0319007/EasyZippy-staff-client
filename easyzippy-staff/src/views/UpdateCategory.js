import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, CardBody, CardHeader, CardTitle, Col, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Label, Row, Table } from "reactstrap";
import { AiOutlineEdit } from "react-icons/ai";
import { Card, Input } from "@material-ui/core";
import Noti from "components/Noti";
import ConfirmModal from "components/ConfirmModal";
import { Form } from "components/UseForm";
import UseTable from "components/UseTable";
import { AiOutlineDelete } from 'react-icons/ai';


export default function UpdateCategory(props) {
    
    const [notify, setNotify] = useState({isOpen: false, message:'', type:''})


    const [data, setData] = useState({
        name:"",
        description: ""
    })

    useEffect(() => {
        const id = props.match.params.id
        axios
        .get(`http://localhost:5000/category/${id}`)
        .then(res => {
            console.log(res.data)
            setData(res.data)
        }) 
        .catch (err => console.error(err))
    },[])



    const handleSubmit = e => {
        e.preventDefault()
        const id = props.match.params.id
        axios
        .put(`http://localhost:5000/category/${id}`, data)
        .then(res => {
            console.log(res.data)
            props.history.push("/admin/category2")
            setNotify({
                isOpen:true,
                message: 'Submitted Successfully',
                type: 'success'
            })
        }).catch(err => console.error(err))
    }  

    const handleInputChange = e => {
        const newData = {...data}
        newData[e.target.id] = e.target.value
        setData(newData)
    }
   
    
    return (
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
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </div>
        </>
    )
}
