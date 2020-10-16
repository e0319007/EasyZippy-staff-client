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
    CardHeader, FormGroup, Label, Button, Modal, ModalHeader, ModalBody, Tooltip
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

    useEffect(() => {
        axios.get(`/bookingPackageModel/${bookingPackageId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data)
        }).catch (function(error) {
            console.log(error.response.data)
        })
    },[])

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
        axios.put(`/kiosk/toggleDisable/${bookingPackageId}`, {
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
                                            <FormGroup>
                                                <Label for="inputName">Name</Label>
                                                <Input
                                                    type="text"
                                                    id="inputName"
                                                    placeholder="name here"
                                                    value={data.name}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputDescription">Description</Label>
                                                <Input 
                                                    type="text"
                                                    id="inputDescription"
                                                    placeholder="description here"
                                                    value={data.description}
                                                />
                                            </FormGroup>
                                            <div className="form-row"> 
                                                <FormGroup className="col-md-4">
                                                    <Label for="inputQuota">Quota</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputQuota"
                                                        placeholder="quota here"
                                                        value={data.quota}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-4">
                                                    <Label for="inputPrice">Price</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputPrice"
                                                        placeholder="price here"
                                                        value={data.price}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-4">
                                                    <Label for="inputDuration">Duration</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputDuration"
                                                        placeholder="duration here"
                                                        value={data.duration}
                                                    />
                                                </FormGroup>

                                            </div>
                                            <FormGroup>
                                                <Label for="inputLockerTypeId">Locker Type</Label>
                                                <Input
                                                    type="text"
                                                    id="inputLockerTypeId"
                                                    placeholder="inputLockerTypeId here"
                                                    value={data.lockerTypeId}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputCreatedAt">Created On</Label>
                                                <Input 
                                                    type="text" 
                                                    id="inputCreatedAt" 
                                                    placeholder="Created At" 
                                                    value={formatDate(data.createdAt)}                                                    
                                                    />
                                            </FormGroup>                           
                                        </fieldset>
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