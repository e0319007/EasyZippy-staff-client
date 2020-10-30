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

    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [maintenanceDate, setMaintenanceDate] = useState(data.maintenanceDate)
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
    },[])

    const onChangeMaintenanceDate = e => {
        const maintenanceDate = e.target.value
        setMaintenanceDate(maintenanceDate)
    }

    const onChangeDescription = e => {
        const description = e.target.value
        setDescription(description)
    }

    const onChangeLockerId = e => {
        const lockerId = e.target.value
        setLockerId(lockerId)
    }

    const updateMaintenanceAction = e => {
        e.preventDefault()

        axios.put(`/maintenanceAction/${maintenanceActionId}`, {
            maintenanceDate: maintenanceDate,
            description: description,
            lockerId: lockerId
        },
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setMaintenanceDate(res.data.maintenanceDate.substr(0,10))
            setDescription(res.data.description)
            setLockerId(res.data.lockerId)
            isError(false)
            isSuccessful(true)
            setMsg("Maintenance action updated successfully")
        }).catch(function (error) {
            let errormsg = error.response.data;
    
            if ((error.response.data).startsWith("<!DOCTYPE html>")) {
                errormsg = "An unexpected error has occurred. The Advertisement cannot be approved."
            }

            isSuccessful(false)
            console.log(error.response.data)
            isError(true)
            setError(errormsg)
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
                                        </fieldset>
                                        <fieldset>
                                            <FormGroup>
                                                <Label for="inputDate">Created On</Label>
                                                <Input
                                                    type="date"
                                                    id="inputDate"
                                                    placeholder="Date here"
                                                    value={maintenanceDate}
                                                    onChange={onChangeMaintenanceDate}
                                                />
                                            </FormGroup>
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
                                            <FormGroup>
                                                <Label for="inputLockerId">Locker Id</Label>
                                                <Input
                                                    type="select"
                                                    id="inputLocker"
                                                    value={lockerId}
                                                    onChange={onChangeLockerId}
                                                >
                                                    <option>[select]</option>
                                                    {
                                                        lockers.map(locker => (
                                                            <option key={locker.id}>{locker.id}</option>
                                                        ))
                                                    }
                                                </Input>
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