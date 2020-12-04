import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { saveAs } from 'file-saver';
import { useHistory } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from "@material-ui/core";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import defaultLogo from '../../assets/img/user.png';
import {
    Card,
    CardBody,
    Row,
    Col,
    Input,
    CardHeader,
    FormGroup,
    Label,
    Button,
    Tooltip,
    Modal,
    ModalBody,
    ModalHeader,
    CardImg
} from "reactstrap";
import MerchantPromotionHistory from "./MerchantPromotionHistory";
import MerchantOrderHistory from "./MerchantOrderHistory";
import MerchantBookingHistory from "./MerchantBookingHistory";
import MerchantTransactionHistory from "./MerchantTransactionHistory";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function MerchantDetails() {

    const history = useHistory()
    const authTokenStaff = (JSON.parse(Cookies.get('authTokenStaff'))).toString()

    const merchantId = JSON.parse(localStorage.getItem('merchantToView'))

    const [bookingPackageModel, setBookingPackageModel] = useState('')
    const [bookingPackage, setBookingPackage] = useState([])

    const [data, setData] = useState([])
    const [approve, setApproved] = useState([])

    const [pdf, setPdf] = useState([])
    const [image, setImage] = useState(null)
    
    const [tooltipOpenApproval, setTooltipApproval] = useState(false);
    const toggleTooltipApproval = () => setTooltipApproval(!tooltipOpenApproval);

    const [tooltipOpenPromo, setTooltipOpenPromo] = useState(false);
    const toggleTooltipPromo = () => setTooltipOpenPromo(!tooltipOpenPromo);

    const [tooltipOpenBooking, setTooltipOpenBooking] = useState(false);
    const toggleTooltipBooking = () => setTooltipOpenBooking(!tooltipOpenBooking);

    const [tooltipOpenOrder, setTooltipOpenOrder] = useState(false);
    const toggleTooltipOrder = () => setTooltipOpenOrder(!tooltipOpenOrder);

    const [tooltipOpenTransaction, setTooltipOpenTransaction] = useState(false);
    const toggleTooltipTransaction = () => setTooltipOpenTransaction(!tooltipOpenTransaction);

    // 4 modals
    const [modalPromo, setModalPromo] = useState(false)
    const toggleModalPromo = () => setModalPromo(!modalPromo);

    const [modalBooking, setModalBooking] = useState(false)
    const toggleModalBooking = () => setModalBooking(!modalBooking);

    const [modalOrder, setModalOrder] = useState(false)
    const toggleModalOrder = () => setModalOrder(!modalOrder);

    const [modalTransaction, setModalTransaction] = useState(false)
    const toggleModalTransaction = () => setModalTransaction(!modalTransaction);

    const [tooltipOpenTenancy, setTooltipOpenTenancy] = useState(false);
    const toggleTooltipTenancy = () => {
        setTooltipOpenTenancy(!tooltipOpenTenancy);
    }

    const downloadPdf = e => {
        let fileName = data.name + " Tenancy Agreement"
        saveAs(pdf, fileName)
        e.preventDefault()
    }

    useEffect(() => {

        axios.get(`/merchant/${merchantId}`,
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            setData(res.data)
            if (res.data.approved === true) {
                setApproved("Approved")
            } else {
                setApproved("Not Approved")
            }
            let date = formatDate(res.data.createdAt)
            setData({
                ...data, 
                name: res.data.name,
                createdAt: date,
                disabled: res.data.disabled
            });


            axios.get(`/merchantBookingPackages/${merchantId}`, 
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

            axios.get(`/assets/${res.data.merchantLogoImage}`, {
                responseType: 'blob'
            },
            {
                headers: {
                    AuthToken: authTokenStaff,
                    'Content-Type': 'application/json'
                }
            }).then (response => {
                var file = new File([response.data], {type:"image/png"})
                let image = URL.createObjectURL(file)
                setImage(image)
            }).catch(function (error) {
            })


            axios.get(`/assets/${res.data.tenancyAgreement}`, 
            {
                responseType: 'arraybuffer'
            },{
                headers: {
                    AuthToken: authTokenStaff,
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                var blob = new Blob([res.data], {type: "application/pdf;charset=utf-8"});
                setPdf(blob)
            }).catch (function (error) {
            })
        })
        .catch (function (error) {
        })
    },[authTokenStaff,merchantId,data])


    const onApprovalChange = e => {

        const status = e.target.value
        let statusBoolean = '';
        if (status === "Approved") {
            statusBoolean = true
        } else {
            statusBoolean = false
        }
        setData({
            ...data,
            approved: statusBoolean
        })

        axios.put(`/merchant/${merchantId}/approve`, {
            approved: statusBoolean
        },
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            setData(res)
            window.location.reload()
        }).catch (function(error) {
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


        const handleChange = (event) => {
            setData({
                ...data,
                disabled: !event.target.checked
            })
            axios.put(`/merchant/${merchantId}/toggleDisable`, {
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
    
    return(
        <>
            <ThemeProvider theme={theme}>
                <div className="content">
                    <Row>
                        <Col md = "12">
                            <Card className="card-name">
                                <CardHeader style={{display:"flex", justifyContent:"center"}}>
                                    <span className="form-row">
                                        {image !== null &&
                                            <CardImg 
                                            style={{width:"8rem"}} 
                                            top src={image} 
                                            alt='...'
                                            className='rounded-circle'/>
                                        }
                                        {image === null &&
                                            <CardImg style={{width:"8rem"}} top src={defaultLogo} alt='...'/>
                                        }     
                                    </span>
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
                                                    <Label for="inputName">Name</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputName"
                                                        placeholder="name here"
                                                        value={data.name}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-6">                                            
                                                    <Label for="inputPointOfContact">Point of Contact</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputPointOfContact"
                                                        placeholder="point of contact here"
                                                        value={data.pointOfContact}
                                                    />
                                                </FormGroup>
                                            </div>
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
                                            <div className="form-row">
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputBlock">Block</Label>
                                                        <Input
                                                            type="text"
                                                            id="inputBlock"
                                                            placeholder="Block"
                                                            value={data.blk}
                                                        />
                                                </FormGroup>
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputStreet">Street</Label>
                                                        <Input
                                                            type="text"
                                                            id="inputStreet"
                                                            placeholder="Street"
                                                            value={data.street}
                                                        />
                                                </FormGroup>
                                            </div>
                                            <div className="form-row">
                                                <FormGroup className="col-md-4">
                                                    <Label for="inputFloor">Floor</Label>
                                                        <Input
                                                            type="text"
                                                            id="inputFloor"
                                                            placeholder="Floor"
                                                            value={data.floor}
                                                        />
                                                </FormGroup>
                                                <FormGroup className="col-md-4">
                                                    <Label for="inputUnitNumber">Unit Number</Label>
                                                        <Input
                                                            type="text"
                                                            id="inputUnitNumber"
                                                            placeholder="unit number"
                                                            value={data.unitNumber}
                                                        />
                                                </FormGroup>    
                                                <FormGroup className="col-md-4">
                                                    <Label for="inputPostalCode">Postal Code</Label>
                                                        <Input
                                                            type="text"
                                                            id="inputPostalCode"
                                                            placeholder="postalCode"
                                                            value={data.postalCode}
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
                                                <Label for="inputCreatedAt">Created On</Label>
                                                <Input
                                                    type="text"
                                                    id="inputCreatedAt"
                                                    placeholder="Created At"
                                                    value={data.createdAt}
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
                                        <fieldset>
                                            <div className="form-row">
                                                <FormGroup className="col-md-2">
                                                    <Label for="approvalStatus">Approval Status</Label>
                                                        <Input type="select" name="select" id="approvalStatus" value={approve} onChange={onApprovalChange}>
                                                            <option>Approved</option>
                                                            <option>Not Approved</option>
                                                        </Input>
                                                    <Tooltip placement="bottom" isOpen={tooltipOpenApproval} target="approvalStatus" toggle={toggleTooltipApproval}>
                                                        A confirmation email will be sent once approved/not approved 
                                                    </Tooltip>  
                                                </FormGroup>
                                                <FormGroup className="col-md-10" inline>
                                                    <p/>
                                                    <a onClick={downloadPdf}>
                                                        <Button id="viewTenancyAgreement" onClick={toggleTooltipTenancy} >
                                                                <i className="fas fa-file-pdf"/>
                                                        </Button>
                                                    </a>
                                                    <Tooltip placement="right" isOpen={tooltipOpenTenancy} target="viewTenancyAgreement" toggle={toggleTooltipTenancy}>
                                                            Click to Download Tenancy Agreement
                                                    </Tooltip>  
                                                </FormGroup>                              
                                            </div>                    
                                        </fieldset>

                                        <Row>
                                            <div className="update ml-auto mr-auto" >
                                                {/* view booking history modal and tooltip */}
                                                <Button className="btn-round" size="lg" color="primary" id="viewPromoHistory" onClick={toggleModalPromo}>
                                                    <i className="fas fa-percent"/>
                                                </Button>&nbsp;
                                                <Tooltip placement="left" isOpen={tooltipOpenPromo} target="viewPromoHistory" toggle={toggleTooltipPromo}>
                                                    View Promotion History
                                                </Tooltip>
                                                
                                                {/* view order history modal and tooltip */}
                                                <Button className="btn-round"  size="lg" color="primary" id="viewOrderHistory" onClick={toggleModalOrder}>
                                                    <i className="fa fa-book"/>
                                                </Button>&nbsp;
                                                <Tooltip placement="bottom" isOpen={tooltipOpenOrder} target="viewOrderHistory" toggle={toggleTooltipOrder}>
                                                    View Order History
                                                </Tooltip>
                                            
                                                <Button className="btn-round" size="lg" color="primary" id="viewBookingHistory" onClick={toggleModalBooking}>
                                                    <i className="fa fa-bookmark"/>
                                                </Button>&nbsp;
                                                <Tooltip placement="top" isOpen={tooltipOpenBooking} target="viewBookingHistory" toggle={toggleTooltipBooking}>
                                                    View Booking History
                                                </Tooltip>
                                                
                                                {/* view topup history modal and tooltip */}
                                                <Button className="btn-round"  size="lg" color="primary" id="viewTransactionHistory" onClick={toggleModalTransaction}>
                                                    <i className="fa fa-dollar-sign"/>
                                                </Button>&nbsp;
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
                                                        history.push('/admin/merchants')
                                                        localStorage.removeItem('merchantToView')
                                                    }}>back</Button>
                                                </div>
                                            </Col>                         
                                        </Row>
                                    </form>
                                </CardBody>

                                <Modal size="lg"isOpen={modalPromo} toggle={toggleModalPromo}>
                                    <ModalHeader toggle={toggleModalPromo}>Promotion History</ModalHeader>
                                    <ModalBody>
                                        <MerchantPromotionHistory/>
                                    </ModalBody>
                                </Modal>

                                <Modal size="lg" isOpen={modalBooking} toggle={toggleModalBooking}>
                                    <ModalHeader toggle={toggleModalBooking}>Booking History</ModalHeader>
                                    <ModalBody>
                                        <MerchantBookingHistory/>
                                    </ModalBody>
                                </Modal>

                                <Modal size="lg" isOpen={modalOrder} toggle={toggleModalOrder}>
                                    <ModalHeader toggle={toggleModalOrder}>Order History</ModalHeader>
                                    <ModalBody>
                                        <MerchantOrderHistory/>
                                    </ModalBody>
                                </Modal>

                                <Modal size="lg" isOpen={modalTransaction} toggle={toggleModalTransaction}>
                                    <ModalHeader toggle={toggleModalTransaction}>Transaction History</ModalHeader>
                                    <ModalBody>
                                        <MerchantTransactionHistory/>
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



export default MerchantDetails;