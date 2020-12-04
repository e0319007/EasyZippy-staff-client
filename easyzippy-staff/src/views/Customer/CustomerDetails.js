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
import CustomerOrderHistory from "./CustomerOrderHistory";
import CustomerBookingHistory from "./CustomerBookingHistory";
import CustomerTransactionHistory from "./CustomerTransactionHistory";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function CustomerDetails() {
    
    const history = useHistory()
    const authTokenStaff = (JSON.parse(Cookies.get('authTokenStaff'))).toString()


    const customerId = JSON.parse(localStorage.getItem('customerToView'))

    const [data, setData] = useState([])
    const [bookingPackage, setBookingPackage] = useState([])
    const [bookingPackageModel, setBookingPackageModel] = useState('')



    //tooltip
    const [tooltipOpenBooking, setTooltipOpenBooking] = useState(false);
    const toggleTooltipBooking = () => setTooltipOpenBooking(!tooltipOpenBooking);

    const [tooltipOpenOrder, setTooltipOpenOrder] = useState(false);
    const toggleTooltipOrder = () => setTooltipOpenOrder(!tooltipOpenOrder);

    const [tooltipOpenTransaction, setTooltipOpenTransaction] = useState(false);
    const toggleTooltipTransaction = () => setTooltipOpenTransaction(!tooltipOpenTransaction);

    // 3 modals
    const [modalBooking, setModalBooking] = useState(false)
    const toggleModalBooking = () => setModalBooking(!modalBooking);
    
    const [modalOrder, setModalOrder] = useState(false)
    const toggleModalOrder = () => setModalOrder(!modalOrder);

    const [modalTransaction, setModalTransaction] = useState(false)
    const toggleModalTransaction = () => setModalTransaction(!modalTransaction);

    useEffect(() => {
       
        axios.get(`/customer/${customerId}`, 
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            setData(res.data)

        }).catch(function(error) {
     
        })

        axios.get(`/customerBookingPackages/${customerId}`, 
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            if (res.data !== undefined || res.data.length !== 0) {
                for (var i in res.data) {
                    if (res.data[i].expired === false) {
                        var bookingPackageModelId = res.data[i].bookingPackageModelId
                        setBookingPackage(res.data[i])
    
                        axios.get(`/bookingPackageModel/${bookingPackageModelId}`, {
                            headers: {
                                AuthToken: authTokenStaff
                            }
                        }).then(res => {
                            setBookingPackageModel(res.data)
                   
                        }).catch(function (error) {
               
                        })
    
                        break;
                    }
                }
            }
        }).catch(function (error) {
       
        })

    }, [authTokenStaff,customerId])


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
            axios.put(`/customer/${customerId}/toggleDisable`, {
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

    // to use when viewing 
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

    
    return(
        <>
            <ThemeProvider theme={theme}>
                <div className="content">
                    <Row>
                        <Col md = "12">
                            <Card className="card-name">
                                <CardHeader>
                                    <div className="form-row">
                                    <CardTitle className="col-md-10" tag="h5">{data.firstName}{' '}{data.lastName}</CardTitle>
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
                                                    <Label for="inputEmail">Email</Label>
                                                    <Input 
                                                        type="text" 
                                                        id="inputEmail" 
                                                        placeholder="Email"
                                                        value={data.email}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputMobileNumber">Mobile Number</Label>
                                                    <Input 
                                                        type="text" 
                                                        id="inputMobileNumber" 
                                                        placeholder="Mobile Number"
                                                        value={data.mobileNumber}
                                                        />
                                                </FormGroup>  
                                            </div>
                                            <FormGroup>
                                                <Label for="inputCreditBalance">Credit Balance</Label>
                                                <Input 
                                                    type="text" 
                                                    id="inputCreditBalance" 
                                                    placeholder="$" 
                                                    value={parseFloat(data.creditBalance).toFixed(2)}
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
                                            <FormGroup>
                                                <Label for="inputBookingPackage">Booking Package (if any)</Label>
                                                <Input 
                                                    type="text" 
                                                    id="inputBookingPackage" 
                                                    placeholder="-" 
                                                    value={bookingPackageModel.name}
                                                    />
                                            </FormGroup>                            
                                        </fieldset>
                                        <Row>
                                            <div className="update ml-auto mr-auto" >
                                                {/* view booking history modal and tooltip */}
                                                <Button className="btn-round" size="lg" color="primary" id="viewBookingHistory" onClick={toggleModalBooking}>
                                                    <i className="fa fa-bookmark"/>
                                                </Button>
                                                <Tooltip placement="left" isOpen={tooltipOpenBooking} target="viewBookingHistory" toggle={toggleTooltipBooking}>
                                                    View Booking History
                                                </Tooltip>
                                                {' '}
                                                {/* view order history modal and tooltip */}
                                                <Button className="btn-round"  size="lg" color="primary" id="viewOrderHistory" onClick={toggleModalOrder}>
                                                    <i className="fa fa-book"/>
                                                </Button>
                                                <Tooltip placement="top" isOpen={tooltipOpenOrder} target="viewOrderHistory" toggle={toggleTooltipOrder}>
                                                    View Order History
                                                </Tooltip>
                                                {' '}
                                                {/* view topup history modal and tooltip */}
                                                <Button className="btn-round"  size="lg" color="primary" id="viewTransactionHistory" onClick={toggleModalTransaction}>
                                                    <i className="fa fa-dollar-sign"/>
                                                </Button>
                                                <Tooltip placement="bottom" isOpen={tooltipOpenTransaction} target="viewTransactionHistory" toggle={toggleTooltipTransaction}>
                                                    View Transaction History
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
                                                <div className="form-row">
                                                    <Button onClick={() => {
                                                        history.push('/admin/customers')
                                                        localStorage.removeItem('customerToView')
                                                    }}>back
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </form>
                                </CardBody>

                                <Modal size="lg" isOpen={modalBooking} toggle={toggleModalBooking}>
                                    <ModalHeader toggle={toggleModalBooking}>Booking History</ModalHeader>
                                    <ModalBody>
                                        <CustomerBookingHistory/>
                                    </ModalBody>
                                </Modal>

                                <Modal size="lg" isOpen={modalOrder} toggle={toggleModalOrder}>
                                    <ModalHeader toggle={toggleModalOrder}>Order History</ModalHeader>
                                    <ModalBody>
                                        <CustomerOrderHistory/>
                                    </ModalBody>
                                </Modal>

                                <Modal size="lg" isOpen={modalTransaction} toggle={toggleModalTransaction}>
                                    <ModalHeader toggle={toggleModalTransaction}>Transaction History</ModalHeader>
                                    <ModalBody>
                                        <CustomerTransactionHistory/>
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

export default CustomerDetails;