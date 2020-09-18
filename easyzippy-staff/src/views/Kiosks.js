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
import Popup from "components/Popup";
import Cookies from 'js-cookie';

const headCells = [
    {id:'id', label:'ID'},
    // {id:'long', label:'Long'},
    // {id:'lat', label:'Lat'},
    {id:'description', label:'Description'},
    {id:'actions', label:'Actions', disableSorting:true}
]

function Kiosks(props) {

    const[kioskList, setKioskList] = useState([])
    const [filterFunction, setFilterFunction] = useState({fn: items => { return items; }})
    const [openPopup, setOpenPopup] = useState(false)
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [confirmModal, setConfirmModal] = useState({isOpen:false, title:''})
    const [notify, setNotify] = useState({isOpen: false, message:'', type:''})

    const authToken = JSON.parse(Cookies.get('authToken'))
    console.log(typeof authToken + " " + authToken)


    const [data, setData] = useState({
        long:2,
        lat:2,
        description: ""
    })

    useEffect(() => {
        console.log("axios")
        axios
        .get("http://localhost:5000/kiosks", 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            // console.log(res.data)
            setKioskList(res.data)
        })
        .catch (err => console.error(err))
    },[authToken])

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = UseTable(data, headCells, filterFunction);

    const handleSubmit = e => {
        e.preventDefault()
        axios
        .post("http://localhost:5000/kiosk", data, {
            headers: {
                AuthToken: authToken
            }
        })
        .then(res => {
            // console.log(res.data)
            const myData=[...kioskList, res.data]
            setKioskList(myData)
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
        .delete(`http://localhost:5000/kiosk/${id}`, {
            headers: {
                AuthToken: authToken
            }
        })
        .then(res => {
            // console.log(res.data)
            setConfirmModal ({
                ...confirmModal,
                isOpen:false
            })
            const myAllData = kioskList.filter(item => item.id !== id)
            setKioskList(myAllData)
            setNotify({
                isOpen:true,
                message: 'Deleted Successfully',
                type: 'error'
            })         
        })
        .catch(err => console.error(err))
    }

   

    const handleUpdateSubmit = () => {};

    // const openInPopup = item => {
    //     setRecordForEdit(item)
    //     setOpenPopup(true)
    // }


    // const handleEdit = id => {
    //     console.log(id)
    //     //props.history.push("/updateCategory/"+id)
    //     axios
    //     .put(`http://localhost:5000/category/${id}`) 
    //     .then(res => {
    //         setData(res.data)
    //     },[])      
    // }

    // const handleUpdate = id => {
    //     props.history.push("/UpdateCategory/"+id)
    // }

    // function handleUpdate(id) {
    //     props.history.push("/UpdateCategory/"+id)
    // }
   
    // const updateCategory = id => {

    //     axios.put(`http://localhost:5000/category/${id}`, {
    //         name: name,
    //         description: description,
    //     }).then((response) => {
    //         setData(response.data)
    //         // setName(response.data.name)
    //         // setDescription(response.data.description)
    
    //         // category_toupdate.name = response.data.name
    //         // category_toupdate.description = response.data.description
         
    //         //localStorage['currentCategory'] = JSON.stringify(category_toupdate)
            
    //         isInModal(false)
    //         isError(false)
    //         isSuccessful(true)
    //         setMsg("category updated successfully!")
    //     }).catch(function (error) {
    //         console.log(error.response.data)
    //         isInModal(false)
    //         isError(true)
    //         setError(error.response.data)
    //     })
    // }



    const handleInputChange = e => {
        const newData = {...data}
        newData[e.target.id] = e.target.value
        setData(newData)
    }

    return(
        <>
        <div className="content">
            <Form>
                <Row>
                    <Col md = "12">
                        <Card>
                            <CardHeader>
                                <div className="form-row">
                                    <CardTitle className="col-md-4" tag="h4">Kiosks List</CardTitle>        
                                </div>
                            </CardHeader>
                            <CardBody>
                                <Button 
                                    color="success"
                                    onClick={() => { setOpenPopup(true); setRecordForEdit(null); }}>Create New Kiosk
                                </Button>
             
                                <Table responsive hover>
                                    <TblHead />
                                    <tbody>
                                    {
                                        kioskList.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                {/* <td>{item.long}</td>
                                                <td>{item.lat}</td> */}
                                                <td>{item.description}</td>
                                                <td>
                                                    <Button size="sm" color="info" 
                                                    //onClick={() => {openInPopup(item)}}
                                                    //onClick={() => {setOpenPopup(true); setRecordForEdit(null);}}
                                                    //onClick={() => handleUpdate(item.id)}
                                                //onClick={handleUpdate(item.id)}
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
                                        }
                                    </tbody> 
                                </Table>
                            </CardBody>
                            <Popup 
                            // title="Create New Category Form"
                            openPopup = {openPopup}
                            setOpenPopup = {setOpenPopup}>
                                <form onSubmit={handleSubmit}>
                                {/* <div className="form-row">
                                        <FormGroup className="col-md-12">
                                            <Label for="long">Long</Label>
                                            <Input 
                                                type="text" 
                                                name="long" 
                                                id="long" 
                                                placeholder="Long" 
                                                // value={categoryList[idOfCategoryToUpdate].description}
                                                value={data.long}
                                                onChange={handleInputChange} 
                                                required
                                            />
                                        </FormGroup>
                                    </div> */}
                                    {/* <div className="form-row">
                                        <FormGroup className="col-md-12">
                                            <Label for="lat">Lat</Label>
                                            <Input 
                                                type="text" 
                                                name="lat" 
                                                id="lat" 
                                                placeholder="Lat" 
                                                // value={categoryList[idOfCategoryToUpdate].description}
                                                value={data.lat}
                                                onChange={handleInputChange} 
                                                required
                                            />
                                        </FormGroup>
                                    </div> */}
                                    
                                    <div className="form-row">
                                        <FormGroup className="col-md-12">
                                            <Label for="description">Description</Label>
                                            <Input 
                                                type="text" 
                                                name="description" 
                                                id="description" 
                                                placeholder="Description" 
                                                // value={categoryList[idOfCategoryToUpdate].description}
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
            </Form>
        </div>
        </>
    );
}

export default Kiosks;