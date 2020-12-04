import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from "@material-ui/core";
import { createMuiTheme } from '@material-ui/core/styles';
import MaterialTable from "material-table"
import { ThemeProvider } from '@material-ui/styles';
import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    Input,
    CardHeader, FormGroup, Label, Button, Modal, ModalHeader, ModalBody, Tooltip, Alert, ModalFooter
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function KioskDetails() {

    const history = useHistory()
    const authTokenStaff = (JSON.parse(Cookies.get('authTokenStaff'))).toString()

    const kioskId = JSON.parse(localStorage.getItem('kioskToView'))
    const [data, setData] = useState([])

    //tooltip
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

    const [tooltipOpenAddLocker, setTooltipOpenAddLocker] = useState(false);
    const toggleTooltipAddLocker = () => setTooltipOpenAddLocker(!tooltipOpenAddLocker);

    //modal 
    const [modalLockers, setModalLockers] = useState(false)
    const toggleModalLockers = () => setModalLockers(!modalLockers);

    const [modalAddLocker, setModalAddLocker] = useState(false)
    const toggleModalAddLocker = () => setModalAddLocker(!modalAddLocker);

    const [lockerTypes, setLockerTypes] = useState([]);
    const [lockers, setLockers] = useState([]);

    const [newLockerType, setNewLockerType] = useState('');
    const [newLockerTypeId, setNewLockerTypeId] = useState('');

    const [lockerCode, setLockerCode] = useState('')


    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Locker Code", field: "lockerCode", editable: "never"},
        {title: "Locker Type", field:"lockerTypeId", editable: "never", 
            render: row => <span>{ getLockerType(row["lockerTypeId"]) }</span>},
        {title: "Disabled", field:"disabled", editable: "never"}
    ]

    useEffect(() => {
        axios.get(`/kiosk/${kioskId}`, 
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            setData(res.data)

            axios.get(`/locker/kiosk/${kioskId}`, 
            {
                headers: {
                    AuthToken: authTokenStaff
                }
            }).then(response => {
                setLockers(response.data)
            }).catch ()

            axios.get("/lockerTypes", {
                headers: {
                    AuthToken: authTokenStaff
                }
            }).then(response => {
                setLockerTypes(response.data)
            }).catch ()

        }).catch (function(error) {
        })
    },[authTokenStaff,kioskId])

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
        axios.put(`/kiosk/${kioskId}/toggleDisable`, {
            disabled: !event.target.checked
        },
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
        }).catch (function(error) {
        })
    };

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

    const onChangeNewLockerType = e => {
      
        setNewLockerType(e.target.value)
        const lockerType = getLockerId(e.target.value);
        setNewLockerTypeId(lockerType)
    }

    const onChangeLockerCode = e => {
        const lockerCode = e.target.value
        setLockerCode(lockerCode)
    }

    const addLocker = e => {
        axios.post("/locker", {
            lockerTypeId: newLockerTypeId,
            kioskId: kioskId,
            lockerCode: lockerCode
        },
        {
        headers: {
            AuthToken: authTokenStaff
        }
    }).then((response) => {
        isError(false)
        isSuccessful(true)
        setMsg("locker added successfully!")
    }).catch(function (error) {
        isError(true)
        setError(error.response.data)
        isSuccessful(false)
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
                                    <CardTitle className="col-md-10" tag="h5">Kiosk Details: {data.address}</CardTitle>
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
                                                <Label for="inputAddress">Address</Label>
                                                <Input
                                                    type="text"
                                                    id="inputAddress"
                                                    placeholder="address here"
                                                    value={data.address}
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
                                                <Button className="btn-round" size="lg" color="primary" id="viewLockerList" onClick={toggleModalAddLocker}>
                                                    <i className="nc-icon nc-simple-add"/>
                                                </Button>&nbsp;
                                                <Tooltip placement="left" isOpen={tooltipOpenAddLocker} target="viewLockerList" toggle={toggleTooltipAddLocker}>
                                                    Add Locker To Kiosk
                                                </Tooltip>
                                                
                                                <Button className="btn-round" size="lg" color="primary" id="viewListingList" onClick={toggleModalLockers}>
                                                    <i className="fa fa-pause"/>
                                                </Button>&nbsp;
                                                <Tooltip placement="left" isOpen={tooltipOpen} target="viewListingList" toggle={toggleTooltip}>
                                                    View Locker List
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
                                                        history.push('/admin/kiosks')
                                                        localStorage.removeItem('kioskToView')
                                                    }}> back
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </form>
                                </CardBody>

                                <Modal isOpen={modalAddLocker} toggle={toggleModalAddLocker}>
                                    <ModalHeader toggle={toggleModalAddLocker}>Add Locker To Kiosk</ModalHeader>
                                    <ModalBody>
                                        <form>
                                            <FormGroup>
                                                <Label for="inputNewLockerType">Locker Type</Label>
                                                <Input
                                                    type="select"
                                                    id="inputNewLockerType"
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
                                            <FormGroup>
                                                <Label for="inputLockerCode">Locker Code</Label>
                                                <Input
                                                    type="text"
                                                    id="inputLockerCode"
                                                    value={lockerCode}
                                                    onChange={onChangeLockerCode}
                                                />
                                            </FormGroup>
                                            {err &&<Alert color="danger">{error}</Alert> }
                                            {successful &&<Alert color="success">{successMsg}</Alert>} 
                                        </form>
                                    </ModalBody>
                                    <ModalFooter>
                                    <Button color="primary" onClick={addLocker}>Add Locker</Button>{' '}
                                    </ModalFooter>
                                </Modal>

                                <Modal isOpen={modalLockers} toggle={toggleModalLockers}>
                                    <ModalHeader toggle={toggleModalLockers}>Lockers</ModalHeader>
                                    <ModalBody>
                                    <ThemeProvider theme={theme}>
                                        <div className="content">
                                            <Row>
                                                <Col md = "12">
                                                    <Card>
                                                        <MaterialTable 
                                                            title=""
                                                            columns={columns}
                                                            data={lockers}
                                                            options={{   
                                                                search:false,
                                                                toolbar:false,
                                                                headerStyle: {
                                                                    backgroundColor: '#98D0E1',
                                                                    color: '#FFF',
                                                                    fontWeight: 1000,                                      
                                                                },
                                                                actionsColumnIndex: -1
                                                                }}
                                                        />
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </div>   
                                    </ThemeProvider>
                                    </ModalBody>
                                </Modal>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </ThemeProvider>
        </>
    );
}

export default KioskDetails;