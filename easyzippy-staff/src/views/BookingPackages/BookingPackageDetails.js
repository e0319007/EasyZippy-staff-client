import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from "@material-ui/core";
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

function BookingPackageDetails() {

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()
    console.log(authToken)

    const bookingPackageId = JSON.parse(localStorage.getItem('bookingPackageToView'))
    const [data, setData] = useState([])

    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [name, setName] = useState(data.name)
    const [description, setDescription] = useState(data.description)
    const [quota, setQuota] = useState(data.quota)
    const [price, setPrice] = useState(data.price)
    const [duration, setDuration] = useState(data.duration)

    const [newLockerType, setNewLockerType] = useState(data.lockerTypeId);
    console.log("new locker type: " + data.lockerTypeId)
    const [newLockerTypeId, setNewLockerTypeId] = useState('');

    const [lockerTypes, setLockerTypes] = useState([])

    useEffect(() => {
        axios.get(`/bookingPackageModel/${bookingPackageId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data)
            setName(res.data.name)
            setDescription(res.data.description)
            setQuota(res.data.quota)
            setPrice(res.data.price)
            setDuration(res.data.duration)
            setNewLockerType(res.data.lockerTypeId)

            axios.get("/lockerTypes", 
            {
                headers: {
                    AuthToken: authToken
                }
            }).then(res => {
                setLockerTypes(res.data)
            }).catch(err => console.error(err))
        }).catch (function(error) {
            console.log(error.response.data)
        })
    },[])

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

    const updateBookingPackage = e => {
        e.preventDefault()
        axios.put(`/bookingPackageModel/${bookingPackageId}`, {
            name: name,
            description: description,
            quota: quota,
            price: price,
            duration: duration, 
            lockerTypeId: newLockerTypeId
        },
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setName(res.data.name)
            setDescription(res.data.description)
            setQuota(res.data.quota)
            setPrice(res.data.price)
            setDuration(res.data.duration)
            //setNewLockerType(res.data.newLockerType)
            setNewLockerTypeId(res.data.newLockerTypeId)
            console.log("new locker type in update: " + res.data.newLockerType)
            isError(false)
            isSuccessful(true)
            setMsg("Booking package updated successfully")
        }).catch(function (error) {
            isSuccessful(false)
            console.log(error.response.data)
            isError(true)
            setError(error.response.data)
        })
    }
    const DisableSwitch = withStyles((theme) => ({
    root: {
        width: 28,
        height: 16,
        padding: 0,
        display: 'flex',
    },
    switchBase: {
        padding: 2,
        color: theme.palette.grey[500],
        '&$checked': {
        transform: 'translateX(12px)',
        color: theme.palette.common.white,
        '& + $track': {
            opacity: 1,
            backgroundColor: theme.palette.success.main,
            borderColor: theme.palette.success.main,
        },
        },
    },
    thumb: {
        width: 12,
        height: 12,
        boxShadow: 'none',
    },
    track: {
        border: `1px solid ${theme.palette.grey[500]}`,
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: theme.palette.common.white,
    },
    checked: {},
    }))(Switch);

    let enabled = !data.disabled
    console.log("Enabled: " + enabled)

    const handleChange = (event) => {
        console.log("event.target.checked: " + event.target.checked)
        setData({
            ...data,
            disabled: !event.target.checked
        })
        axios.put(`/bookingPackageModel/toggleDisable/${bookingPackageId}`, {
            disabled: !event.target.checked
        },
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            console.log("axios call went through")
        }).catch (function(error) {
            console.log(error.response.data)
        })
    };

    // to use when viewing 
    function formatDate(d) {
        if (d === undefined){
            d = (new Date()).toISOString()
            console.log(undefined)
        }
        let currDate = new Date(d);
        console.log("currDate: " + currDate)
        let year = currDate.getFullYear();
        let month = currDate.getMonth() + 1;
        let dt = currDate.getDate();
        let time = currDate.toLocaleTimeString('en-SG')

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }

        return dt + "/" + month + "/" + year + " " + time ;
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
                                    <CardTitle className="col-md-10" tag="h5">{data.name} Details</CardTitle>
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
                                                <Label for="inputName">Name</Label>
                                                <Input
                                                    type="text"
                                                    id="inputName"
                                                    placeholder="name here"
                                                    value={name}
                                                    onChange={onChangeName}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputDescription">Description</Label>
                                                <Input 
                                                    type="text"
                                                    id="inputDescription"
                                                    placeholder="description here"
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
                                                <Label for="inputLockerTypeId">Locker Type</Label>
                                                <Input
                                                    type="select"
                                                    id="inputLockerTypeId"
                                                    placeholder="Locker Type"
                                                    value={getLockerType(newLockerType)}
                                                    onChange={onChangeNewLockerType}
                                                >
                                                    {
                                                        lockerTypes.map(newLockerType => (
                                                            <option key={newLockerType.id}>{newLockerType.name}</option>
                                                        ))
                                                    }
                                                </Input>
                                            </FormGroup>
                                            </fieldset>
                                            <fieldset disabled>
                                            <FormGroup>
                                                <Label for="inputCreatedAt">Created On</Label>
                                                <Input 
                                                    type="text" 
                                                    id="inputCreatedAt" 
                                                    placeholder="Created At" 
                                                    value={formatDate(data.createdAt)}                                                    
                                                    />
                                            </FormGroup>   
                                            { err &&<Alert color="danger">{error}</Alert> }
                                            { successful &&<Alert color="success">{successMsg}</Alert>}                         
                                        </fieldset>
                                        <Row>
                                            <div className="update ml-auto mr-auto">
                                                <Button color="success" size="sm" type="submit" onClick={updateBookingPackage}>Update</Button>
                                            </div>
                                        </Row>
                                        <Row>
                                            <div className="update ml-auto mr-auto" >
                                                <Typography component="div">
                                                    <Grid component="label" container alignItems="center" spacing={1}>
                                                    <Grid item>Disabled</Grid>
                                                    <Grid item>
                                                        <DisableSwitch checked={!data.disabled} onChange={handleChange} name="checked" />
                                                    </Grid>
                                                    <Grid item>Enabled</Grid>
                                                    </Grid>
                                                </Typography>
                                            </div> 
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <div className="form-add">
                                                    <Button onClick={() => {
                                                        history.push('/admin/bookingPackages')
                                                        localStorage.removeItem('bookingPackageToView')
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

export default BookingPackageDetails;