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
    CardHeader, FormGroup, Label, Button, Tooltip, Modal, ModalBody, ModalHeader
} from "reactstrap";
import LockerActionsRecord from "./LockerActionsRecord";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function LockerDetails() {

    const history = useHistory()
    const authTokenStaff = (JSON.parse(Cookies.get('authTokenStaff'))).toString()

    const lockerId = JSON.parse(localStorage.getItem('lockerToView'))


    const [data, setData] = useState([])
    const [kiosks, setKiosks] = useState([])
    const [lockerTypes, setLockerTypes] = useState([])

    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

    const [modalLockerActionRecord, setModalLockerActionRecord] = useState(false)
    const toggleModalLockerActionRecord = () => setModalLockerActionRecord(!modalLockerActionRecord);

    useEffect(() => {
        axios.get(`/locker/${lockerId}`, 
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            setData(res.data)

            axios.get("/kiosks", 
            {
                headers: {
                    AuthToken: authTokenStaff
                }
            }).then(response => {
                setKiosks(response.data)
            }).catch ()

            axios.get("/lockerTypes", {
                headers: {
                    AuthToken: authTokenStaff
                }
            }).then(response => {
                setLockerTypes(response.data)
            }).catch ()

        }).catch(function(error) {
        })
    }, [authTokenStaff,lockerId])

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
                    AuthToken: authTokenStaff
                }
            }).then(res => {
            }).catch(function(error) {
            })
        };

    //match kiosk id to kiosk address 
    function getKioskName(id) {
        for (var i in kiosks) {
            if (kiosks[i].id === id) {
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
        }
        let currDate = new Date(d);
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
                                            <FormGroup>
                                                <Label for="inputLockerCode">Locker Code</Label>
                                                <Input
                                                    type="text"
                                                    id="inputLockerCode"
                                                    placeholder="-"
                                                    value={data.lockerCode}
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
                                                    <Label for="lockerStatusEnum">Locker Status</Label>
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
                                        <Row>
                                            <div className="update ml-auto mr-auto" >
                                                {/* view lockers list modal and tooltip */}
                                                <Button className="btn-round" size="lg" color="primary" id="viewLockerActionRecord" onClick={toggleModalLockerActionRecord}>
                                                    <i className="nc-icon nc-button-play"/>
                                                </Button>&nbsp;
                                                <Tooltip placement="left" isOpen={tooltipOpen} target="viewLockerActionRecord" toggle={toggleTooltip}>
                                                    View Locker Action Records
                                                </Tooltip>
                                            </div>
                                        </Row>
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

                                <Modal isOpen={modalLockerActionRecord} toggle={toggleModalLockerActionRecord}>
                                    <ModalHeader toggle={toggleModalLockerActionRecord}>Locker Action Records</ModalHeader>
                                    <ModalBody>
                                        <LockerActionsRecord/>
                                    </ModalBody>
                                </Modal>

                            </Card>
                        </Col>
                    </Row>
                </div>
            </ThemeProvider>
        </>
    )

}

export default LockerDetails;