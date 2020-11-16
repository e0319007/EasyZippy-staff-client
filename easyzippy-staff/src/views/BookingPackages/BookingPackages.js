import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import MaterialTable from "material-table"
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';


import {
    Row,
    Col,
    Card,
    Alert,
    Table,
    Modal,
    ModalHeader,
    ModalBody,
    FormGroup,
    Label,
    Input,
    ModalFooter,
    Button,
    UncontrolledAlert
} from "reactstrap";


const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});


function BookingPackages() {

    const authTokenStaff = JSON.parse(Cookies.get('authTokenStaff'))

    const history = useHistory()

    // DECLARING COLUMNS
    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Name", field: "name"},
        {title: "Description", field:"description"},
        {title: "Quota", field:"quota"},
        {title: "Price ($)", field:"price"},
        {title: "Duration (in days)", field:"duration"},
        {title: "Locker Type", field:"lockerTypeId",
            customFilterAndSearch: (term, rowData) => getLockerType(rowData.lockerTypeId).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ getLockerType(row["lockerTypeId"]) }</span>},
        {title: "Disabled", field:"disabled", editable: "never", lookup:{false: "Enabled", true: "Disabled"}}
    ]

    const[data, setData] = useState([])
    const [lockerTypes, setLockerTypes] = useState([])

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [quota, setQuota] = useState('')
    const [price, setPrice] = useState('')
    const [duration, setDuration] = useState('')

    const [newLockerType, setNewLockerType] = useState('');
    const [newLockerTypeId, setNewLockerTypeId] = useState('');

    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [modal, setModal] = useState(false)
    const [inModal, isInModal] = useState(false)

    const toggle = () => setModal(!modal, setError(false), isSuccessful(false))

    useEffect(() => {
        console.log("retrieving booking packages;; axios")
        axios.get("/bookingPackageModels", 
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            setData(res.data)
            console.log("**booking packages**" + res.data)
        })
        .catch (err => console.error(err))

        axios.get("/lockerTypes", 
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            setLockerTypes(res.data)
            console.log("**locker types" + res.data)
        }).catch(err => console.error(err))
    },[authTokenStaff])

    const addBookingPackage = e => {
        e.preventDefault()
        if(name === undefined || name === ""){
            isInModal(true)
            isError(true)
            setError("Unable to add new booking package. Please fill in the name field.")
            isSuccessful(false)
            return;
        }
        if(quota === undefined || quota === ""){
            isInModal(true)
            isError(true)
            setError("Unable to add new booking package. Please fill in the quota field.")
            isSuccessful(false)
            return;
        }
        if(price === undefined || price === ""){
            isInModal(true)
            isError(true)
            setError("Unable to add new booking package. Please fill in the price field.")
            isSuccessful(false)
            return;
        }
        if(duration === undefined || duration === ""){
            isInModal(true)
            isError(true)
            setError("Unable to add new booking package. Please fill in the duration field.")
            isSuccessful(false)
            return;
        }
        if(newLockerType === undefined || newLockerType === ""){
            isInModal(true)
            isError(true)
            setError("Unable to add new booking package. Please fill in the locker type field.")
            isSuccessful(false)
            return;
        }

        axios.post("/bookingPackageModel", {
            name: name,
            description: description,
            quota: quota,
            price: price,
            duration: duration,
            lockerTypeId: newLockerTypeId
        }, 
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            isInModal(true)
            isError(false)
            isSuccessful(true)
            setMsg("Booking package added successfully")
            document.location.reload()
        }).catch(function (error) {
            console.log(error.response.data)
            isInModal(true)
            isError(true)
            setError(error.response.data)
            isSuccessful(false)
        })
    }

    const onChangeName = e => {
        const name = e.target.value
        setName(name)
    }
    const onChangeDescription = e => {
        const description = e.target.value
        setDescription(description)
    }
    const onChangeQuota = e => {
        const quota = e.target.value
        setQuota(quota)
    }
    const onChangePrice = e => {
        const price = e.target.value
        setPrice(price)
    }
    const onChangeDuration = e => {
        const duration = e.target.value
        setDuration(duration)
    }
    const onChangeNewLockerType = e => {
        console.log(e.target.value)
        setNewLockerType(e.target.value)
        const lockerType = getLockerId(e.target.value);
        console.log("new lt key: " + lockerType)
        setNewLockerTypeId(lockerType)
    }

    //match locker type id to locker type name
    function getLockerType(id) {
        for (var i in lockerTypes) {
            if (lockerTypes[i].id === id) {
                return lockerTypes[i].name
            }
        }
    }

    function getLockerId(name) {
        for (var i in lockerTypes) {
            if ((lockerTypes[i].name).toLowerCase() === name.trim().toLowerCase()) {
                return lockerTypes[i].id
            }
        }
    }
   
    const handleRowDelete = (oldData, resolve) => {
        axios.put("/deleteBookingPackageModel/"+oldData.id, {
            id: oldData.id
        },
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
                console.log("axios call went through")
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
                isError(false)
                isSuccessful(true)
                setMsg("Booking package successfully deleted!")
                resolve()
            })
            .catch(function (error) {
                isSuccessful(false)
                isError(true)
                setError(error.response.data)
                console.log(error.response.data)
                resolve()
            })
        }

    return (
        <ThemeProvider theme={theme}>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <MaterialTable 
                                title="Booking Packages"
                                columns={columns}
                                data={data}
                                options={{   
                                    //sorting: true, 
                                    filtering: true,
                                    headerStyle: {
                                        backgroundColor: '#98D0E1',
                                        color: '#FFF',
                                        fontWeight: 1000,                                      
                                    },
                                    actionsColumnIndex: -1
                                    }}
                                editable={{
                                    onRowDelete: (oldData) =>
                                        new Promise((resolve) => {
                                        handleRowDelete(oldData, resolve)
                                }),

                                }}
                                actions={[
                                    {
                                    icon: 'info',
                                    tooltip: 'View Booking Package Details',
                                    onClick:(event, rowData) => {
                                        console.log("in onclick")
                                        history.push('/admin/bookingPackageDetails')
                                        localStorage.setItem('bookingPackageToView', JSON.stringify(rowData.id))
                                        }
                                    },    
                                    {
                                        icon:'add', 
                                        onClick: (event, rowData) => {
                                            toggle()
                                        }, 
                                        isFreeAction: true,
                                        tooltip: 'Add'
                                    }                               
                                
                                ]}
                            />
                            { !inModal && err &&<Alert color="danger">{error}</Alert> }
                            { !inModal && successful &&<Alert color="success">{successMsg}</Alert>}
                        </Card>
                    </Col>
                </Row>
            </div>   
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Add Booking Package</ModalHeader>
                    <ModalBody>
                        <form>
                            <FormGroup>
                                <Label for="inputName">Booking Package Name</Label>
                                    <Input
                                        type="text"
                                        id="inputName"
                                        placeholder="Booking Package Name"
                                        value={name}
                                        onChange={onChangeName}
                                    />
                            </FormGroup>
                            <FormGroup>
                                <Label for="inputDescription">Description</Label>
                                    <Input
                                        type="textarea"
                                        id="inputDescription"
                                        placeholder="Description"
                                        value={description}
                                        onChange={onChangeDescription}
                                    />
                            </FormGroup>
                            <div className="form-row">
                                <FormGroup className="col-md-4">
                                    <Label for="inputQuota">Quota</Label>
                                        <Input
                                            type="number"
                                            id="inputQuota"
                                            placeholder="Quota"
                                            value={quota}
                                            onChange={onChangeQuota}
                                        />
                                </FormGroup>
                                <FormGroup className="col-md-4">
                                    <Label for="inputPrice">Price ($)</Label>
                                        <Input
                                            type="number"
                                            id="inputPrice"
                                            placeholder="Price"
                                            value={price}
                                            onChange={onChangePrice}
                                        />
                                </FormGroup>
                                <FormGroup className="col-md-4">
                                    <Label for="inputDuration">Duration (in days)</Label>
                                        <Input
                                            type="number"
                                            id="inputDuration"
                                            placeholder="Duration"
                                            value={duration}
                                            onChange={onChangeDuration}
                                        />
                                </FormGroup>
                            </div>
                            <FormGroup>
                                <Label for="inputLockerType">Locker Type</Label>
                                    <Input
                                        type="select"
                                        id="inputLockerType"
                                        value={newLockerType}
                                        onChange={onChangeNewLockerType}
                                    >
                                        <option>[select]</option>
                                        {
                                            lockerTypes.map(newLockerType => (
                                                <option key={newLockerType.id}>{newLockerType.name}</option>
                                            ))
                                        }
                                    </Input>
                            </FormGroup>
                            { inModal && err &&<UncontrolledAlert color="danger">{error}</UncontrolledAlert> }
                            { inModal && successful &&<UncontrolledAlert color="success">{successMsg}</UncontrolledAlert>}  
                        </form>
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={addBookingPackage}>Create</Button>{' '}
                    </ModalFooter>
            </Modal>
        </ThemeProvider>     
    )
}

export default BookingPackages;