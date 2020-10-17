import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies, { get } from 'js-cookie';
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
    CardHeader, FormGroup, Label, Button, Tooltip, Modal, ModalBody, ModalHeader
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function LockerDetails() {

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()
    console.log(authToken)

    const lockerId = JSON.parse(localStorage.getItem('lockerToView'))

    //maybe add some validation for if the person accesses the page from the link itself

    const [data, setData] = useState([])
    const [kiosks, setKiosks] = useState([])
    const [lockerTypes, setLockerTypes] = useState([])

    useEffect(() => {
        console.log("getting locker type details axios")
        axios.get(`/locker/${lockerId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data)

            axios.get("/kiosks", 
            {
                headers: {
                    AuthToken: authToken
                }
            }).then(response => {
                setKiosks(response.data)
                console.log(response.data)
            }).catch (err => console.error(err))

            axios.get("/lockerTypes", {
                headers: {
                    AuthToken: authToken
                }
            }).then(response => {
                setLockerTypes(response.data)
                console.log(response.data)
            }).catch (err => console.error(err))

        }).catch(function(error) {
            console.log(error.response.data)
        })
    }, [])

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

        let enabled =!data.disabled 

        const handleChange = (event) => {
            setData({
                ...data,
                disabled: !event.target.checked
            })
            axios.put(`/locker/toggleDisable/${lockerId}`, {
                disabled: !event.target.checked
            }, 
            {
                headers: {
                    AuthToken: authToken
                }
            }).then(res => {
                console.log("axios call went through")
            }).catch(function(error) {
                console.log(error.response.data)
            })
        };

    //match kiosk id to kiosk address 
    function getKioskName(id) {
        console.log(id)
        for (var i in kiosks) {
            console.log("id: " + typeof kiosks[i].id)
            //find the address match to the id
            if (kiosks[i].id === id) {
                console.log("address: " + kiosks[i].address)
                return kiosks[i].address
            }
        }
    }
    //match locker type id to locker type name
    function getLockerType(id) {
        for (var i in lockerTypes) {
            if (lockerTypes[i].id === id) {
                return lockerTypes[i].name
            }
        }
    }

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

    return (
        <>
            <ThemeProvider theme={theme}>
                <div className="content">
                    <Row>
                        <Col md = "12">
                            <Card className="card-name">
                                <CardHeader>
                                    <div className="form-row">
                                    <CardTitle className="col-md-10" tag="h5">Locker {data.id} Details</CardTitle>
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
                                            <div className="form-row">
                                                <FormGroup className="col-md-6">
                                                    <Label for="lockerType">Locker Type</Label>
                                                    <Input 
                                                        type="text"
                                                        id="inputLength"
                                                        placeholder="locker type here"
                                                        value={getLockerType(data.lockerTypeId)}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-6">
                                                    <Label for="lockerStatusEnum">Locker Action Status</Label>
                                                    <Input 
                                                        type="text"
                                                        id="lockerStatusEnum"
                                                        placeholder="locker status enum here"
                                                        value={data.lockerStatusEnum}
                                                    />
                                                </FormGroup>
                                            </div>
                                            <FormGroup>
                                                <Label for="inputKiosk">Kiosk Address</Label>
                                                <Input
                                                    type="text"
                                                    id="inputKiosk"
                                                    placeholder="kiosk here"
                                                    value={getKioskName(data.kioskId)}
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
                                        <p></p>
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
                                                        history.push('/admin/lockers')
                                                        localStorage.removeItem('lockerToView')
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
    )

}

export default LockerDetails;