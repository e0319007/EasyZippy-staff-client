import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
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

function CustomerDetails() {

    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()
    console.log(authToken)

    const customerId = JSON.parse(localStorage.getItem('customerToView'))

    const [data, setData] = useState([])

    //tooltip
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

    // 4 modals
    const [modalBooking, setModalBooking] = useState(false)
    const toggleModalBooking = () => setModalBooking(!modalBooking);
    
    const [modalOrder, setModalOrder] = useState(false)
    const toggleModalOrder = () => setModalOrder(!modalOrder);

    const [modalTopup, setModalTopup] = useState(false)
    const toggleModalTopup = () => setModalTopup(!modalTopup);

    const [modalCredit, setModalCredit] = useState(false)
    const toggleModalCredit = () => setModalCredit(!modalCredit);

    useEffect(() => {
        console.log("getting customer details axios")
        axios.get(`/customer/${customerId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data)
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

        //for disable switch
        const [state, setState] = useState({
            checked: true,
        });
        const handleChange = (event) => {
            setState({ ...state, [event.target.name]: event.target.checked });
        };
    
    return(
        <>
            <ThemeProvider theme={theme}>
                <div className="content">
                    <Row>
                        <Col md = "12">
                            <Card className="card-name">
                                <CardHeader>
                                    <div className="form-row">
                                    <CardTitle className="col-md-10" tag="h5">Customer Name here</CardTitle>
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
                                                    value={data.creditBalance}
                                                    />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputCreatedAt">Created At</Label>
                                                <Input 
                                                    type="text" 
                                                    id="inputCreatedAt" 
                                                    placeholder="Created At" 
                                                    value={data.createdAt}
                                                    />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputBookingPackage">Booking Package</Label>
                                                <Input 
                                                    type="text" 
                                                    id="inputBookingPackage" 
                                                    placeholder="Booking Package" 
                                                    //value={}
                                                    />
                                            </FormGroup>                            
                                        </fieldset>
                                        <Row>
                                            <div className="update ml-auto mr-auto" >
                                                {/* view booking history modal and tooltip */}
                                                <Button className="btn-round" size="lg" color="primary" id="viewBookingHistory" onClick={toggleModalBooking}>
                                                    <i className="fa fa-bookmark"/>
                                                </Button>
                                                <Tooltip placement="left" isOpen={tooltipOpen} target="viewBookingHistory" toggle={toggleTooltip}>
                                                    View Booking History
                                                </Tooltip>
                                                {' '}
                                                {/* view order history modal and tooltip */}
                                                <Button className="btn-round"  size="lg" color="primary" id="viewOrderHistory" onClick={toggleModalOrder}>
                                                    <i className="fa fa-book"/>
                                                </Button>
                                                <Tooltip placement="top" isOpen={tooltipOpen} target="viewOrderHistory" toggle={toggleTooltip}>
                                                    View Order History
                                                </Tooltip>
                                                {' '}
                                                {/* view topup history modal and tooltip */}
                                                <Button className="btn-round"  size="lg" color="primary" id="viewTopupHistory" onClick={toggleModalTopup}>
                                                    <i className="fa fa-dollar-sign"/>
                                                </Button>
                                                <Tooltip placement="bottom" isOpen={tooltipOpen} target="viewTopupHistory" toggle={toggleTooltip}>
                                                    View Top Up History
                                                </Tooltip>
                                                {' '}
                                                {/* view credit history modal and tooltip */}
                                                <Button className="btn-round"  size="lg" color="primary" id="viewCreditHistory" onClick={toggleModalCredit}>
                                                    <i className="fa fa-coins"/>
                                                </Button>
                                                <Tooltip placement="right" isOpen={tooltipOpen} target="viewCreditHistory" toggle={toggleTooltip}>
                                                    View Credit History
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
                                                        <DisableSwitch checked={state.checked} onChange={handleChange} name="checked" />
                                                    </Grid>
                                                    <Grid item>Enabled</Grid>
                                                    </Grid>
                                                </Typography>
                                            </div> 
                                        </Row>
                                    </form>
                                </CardBody>

                                <Modal isOpen={modalBooking} toggle={toggleModalBooking}>
                                    <ModalHeader toggle={toggleModalBooking}>Booking History</ModalHeader>
                                    <ModalBody>
                                        booking history details here
                                    </ModalBody>
                                </Modal>

                                <Modal isOpen={modalOrder} toggle={toggleModalOrder}>
                                    <ModalHeader toggle={toggleModalOrder}>Order History</ModalHeader>
                                    <ModalBody>
                                        order history details here
                                    </ModalBody>
                                </Modal>

                                <Modal isOpen={modalTopup} toggle={toggleModalTopup}>
                                    <ModalHeader toggle={toggleModalTopup}>Top Up History</ModalHeader>
                                    <ModalBody>
                                        topup history details here
                                    </ModalBody>
                                </Modal>

                                <Modal isOpen={modalCredit} toggle={toggleModalCredit}>
                                    <ModalHeader toggle={toggleModalCredit}>Credit History</ModalHeader>
                                    <ModalBody>
                                        credit history details here
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