import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    Input,
    CardHeader, FormGroup, Label, Button, Alert
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function MaintenanceActionDetails() {

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()
    console.log(authToken)

    const maintenanceActionId = JSON.parse(localStorage.getItem('maintenanceActionToView'))
    const [data, setData] = useState([])

    const [kiosks, setKiosks] = useState([])
    const [kiosk, setKiosk] = useState('')

    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [maintenanceDate, setMaintenanceDate] = useState(data.maintenanceDate)
    const [lockerCode, setLockerCode] = useState('')
    const [kioskId, setKioskId] = useState('')
    const [description, setDescription] = useState(data.description)
    const [lockerId, setLockerId] = useState(data.lockerId)

    const [lockers, setLockers] = useState([])



    useEffect(() => {
        axios.get(`/maintenanceAction/${maintenanceActionId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data)

            setMaintenanceDate((res.data.maintenanceDate).substr(0,10))
            setDescription(res.data.description)
            setKioskId(res.data.kioskId)
            //setLockerCode(res.data.lockerCode)
            setLockerId(res.data.lockerId)

            axios.get("/lockers", 
                {
                    headers: {
                        AuthToken: authToken
                    }
                }).then(res => {
                    setLockers(res.data)
                }).catch(err => console.error(err))
        }).catch (function(error) {
            console.log(error.response.data)
        })

        axios.get("/kiosks", {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setKiosks(res.data)
        }).catch(function(error) {
            console.log(error)
        })
    },[])

    //match kiosk id to kiosk address 
    function getKioskName(id) {
        for (var i in kiosks) {
            //find the address match to the id
            if (kiosks[i].id === id) {
                return kiosks[i].address
            }
        }
    }

    const onChangeDescription = e => {
        const description = e.target.value
        setDescription(description)
    }

    function getLockerCode(id) {
        for (var i in lockers) {
            //find the address match to the id
            if (lockers[i].id === id) {
                return lockers[i].lockerCode
            }
        }
    }

    const updateMaintenanceAction = e => {

        e.preventDefault()

        var d = maintenanceDate
        d = d.toString().replace('/-/g', '/')

        if (d === undefined || d === "") {
            isError(true)
            setError("Unable to create new maintenance advertisement. Please fill in the maintenance date field.")
            isSuccessful(false)
            return;
        }

        axios.put(`/maintenanceAction/${maintenanceActionId}`, {
            maintenanceDate: maintenanceDate,
            description: description,
            //lockerId: lockerId
            kioskId: kioskId,
            lockerCode: lockerCode
        },
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setMaintenanceDate(res.data.maintenanceDate.substr(0,10))
            setDescription(res.data.description)
            setKioskId(res.data.kioskId)
            setLockerCode(res.data.lockerCode)
            isError(false)
            isSuccessful(true)
            setMsg("Maintenance action updated successfully")
        }).catch(function (error) {
            isSuccessful(false)
            console.log(error)
            isError(true)
            setError(error)
        })
    }

    return(
        <>
            <ThemeProvider theme={theme}>
                <div className="content">
                    <Row>
                        <Col md = "12">
                            <Card className="card-name">
                                <CardHeader>
                                    <div className="form-row">
                                    <CardTitle className="col-md-10" tag="h5">Maintenance Action {data.id} Details</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <form>
                                        <fieldset disabled>  
                                            <FormGroup>
                                                <Label for="inputId">Id</Label>
                                                <Input
                                                    type="text"
                                                    id="inputId"
                                                    placeholder="id number here"
                                                    value={data.id}                 
                                                />
                                            </FormGroup>
                                       
                               
                                            <FormGroup>
                                                <Label for="inputDate">Created On</Label>
                                                <Input
                                                    type="date"
                                                    id="inputDate"
                                                    placeholder="Date here"
                                                    value={maintenanceDate}
                                 
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputKiosk">Kiosk</Label>
                                                <Input
                                                    type="text"
                                                    id="inputKiosk"
                                                    value={getKioskName(kioskId)}
                                           
                                                >
                                                    
                                                </Input>
                                            </FormGroup>
                                            </fieldset>
                                            <fieldset>
                                            <FormGroup>
                                                <Label for="inputDescription">Description</Label>
                                                <Input 
                                                    type="textarea"
                                                    id="inputDescription"
                                                    placeholder="description here"
                                                    value={description}
                                                    onChange={onChangeDescription}
                                                />
                                            </FormGroup>
                                            </fieldset>
                                            <fieldset disabled>
                                            <FormGroup>
                                                <Label for="inputLockerCode">Locker Code</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputLockerCode"
                                                        placeholder="Locker Code"
                                                        value={getLockerCode(lockerId)}
                                              
                                                    />
                                            </FormGroup>                                      
                                           
                                            { err &&<Alert color="danger">{error}</Alert> }
                                            { successful &&<Alert color="success">{successMsg}</Alert>}                       
                                        </fieldset>
                                        <Row>
                                            <div className="update ml-auto mr-auto">
                                                <Button color="success" size="sm" type="submit" onClick={updateMaintenanceAction}>Update</Button>
                                            </div>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <div className="form-add">
                                                    <Button onClick={() => {
                                                        history.push('/admin/maintenanceActions')
                                                        localStorage.removeItem('maintenanceActionToView')
                                                    }}> back
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </ThemeProvider>
        </>
    );
}

export default MaintenanceActionDetails;