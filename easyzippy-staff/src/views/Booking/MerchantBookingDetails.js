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
    CardHeader, FormGroup, Label, Button
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function MerchantBookingDetails() {

    const history = useHistory()
    const authTokenStaff = (JSON.parse(Cookies.get('authTokenStaff'))).toString()
    console.log(authTokenStaff)

    const bookingId = JSON.parse(localStorage.getItem('bookingToView'))
    const [data, setData] = useState([])
    const [customers, setCustomers] = useState([])
    const [merchants, setMerchants] = useState([])
    const [bookingPackages, setBookingPackages] = useState([])
    const [lockerTypes, setLockerTypes] = useState([])
    const [kiosks, setKiosks] = useState([])
    const [promos, setPromos] = useState([])


    useEffect(() => {
        axios.get(`/booking/${bookingId}`, 
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            setData(res.data)

            axios.get("/customers", {
                headers: {
                    AuthToken: authTokenStaff
                }
            }).then(res => {
                setCustomers(res.data)
            }).catch(err => console.error(err))

            axios.get("/merchants", {
                headers: {
                    AuthToken: authTokenStaff
                }
            }).then(res => {
                setMerchants(res.data)
            }).catch(err => console.error(err))

            axios.get("/bookingPackageModels", 
            {
                headers: {
                    AuthToken: authTokenStaff
                }
            }).then(res => {
                setBookingPackages(res.data)
            }).catch (err => console.error(err))

            axios.get("/lockerTypes", 
            {
                headers: {
                    AuthToken: authTokenStaff
                }
            }).then(res => {
                setLockerTypes(res.data)
            }).catch(err => console.error(err))

            axios.get("/kiosks", 
            {
                headers: {
                    AuthToken: authTokenStaff
                }
            }).then(res => {
                setKiosks(res.data)
            }).catch(err => console.error(err))

        }).catch (function(error) {
            console.log(error.response.data)
        })

        axios.get("/promotions", {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            setPromos(res.data)
        })
    },[])

    //match customer id to customer name 
    function getCustomerName(id) {
        for (var i in customers) {
            if (customers[i].id === id) {
                return customers[i].firstName + " " + customers[i].lastName
            }
        }
    }

    //match merchant id to merchant name 
    function getMerchantName(id) {
        for (var i in merchants) {
            if (merchants[i].id === id) {
                return merchants[i].name
            }
        }
    }

    //match booking package id to booking package name
    function getBookingPackage(id) {
        console.log("booking package id: " + id)
        for (var i in bookingPackages) {
            if (bookingPackages[i].id === id) {
                return bookingPackages[i].name
            }
        }
    }

    //match lockertype id to locker type name
    function getLockerType(id) {
        for (var i in lockerTypes) {
            if (lockerTypes[i].id === id) {
                return lockerTypes[i].name
            }
        }
    }

    //match kiosk id to kiosk address 
    function getKiosk(id) {
        for (var i in kiosks) {
            if (kiosks[i].id === id) {
                return kiosks[i].address
            }
        }
    }
    //match promo id to promo name 
    function getPromoCode(id) {
        for (var i in promos) {
            if (promos[i].id === id) {
                return promos[i].promoCode
            }
        }
    }

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
                                    <CardTitle className="col-md-10" tag="h5">Booking Details: {getMerchantName(data.merchantId)} </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <form>
                                        <fieldset disabled> 
                                        {/* <div className="form-row"> */}
                                            <FormGroup>
                                                <Label for="inputName">Merchant Name</Label>
                                                <Input
                                                    type="text"
                                                    id="inputName"
                                                    placeholder="Name here"
                                                    value={getMerchantName(data.merchantId)}
                                                />
                                            </FormGroup>
                                            {/* <FormGroup className="col-md-6">
                                                <Label for="inputName">Collector Name</Label>
                                                <Input
                                                    type="text"
                                                    id="inputName"
                                                    placeholder="-"
                                                    value={getCustomerName(data.collecterId)}
                                                />
                                            </FormGroup>                                   */}
                                        {/* </div>  */}
                                            {/* <div className="form-row"> */}
                                            <FormGroup>
                                                <Label for="inputId">Booking Id</Label>
                                                <Input
                                                    type="text"
                                                    id="inputId"
                                                    placeholder="id number here"
                                                    value={data.id}
                                                />
                                            </FormGroup>
                                            {/* <FormGroup className="col-md-6">
                                                <Label for="inputId">Order Id (if any)</Label>
                                                <Input
                                                    type="text"
                                                    id="inputId"
                                                    placeholder="-"
                                                    value={data.orderId}
                                                />
                                            </FormGroup> */}
                                            {/* </div> */}
                                            
                                            <div className="form-row">
                                                <FormGroup className="col-md-4">
                                                    <Label for="inputBookingStatus">Booking Status</Label>
                                                    <Input 
                                                        type="text"
                                                        id="inputBookingStatus"
                                                        placeholder="Status"
                                                        value={data.bookingStatusEnum}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-4">
                                                    <Label for="inputBookingSource">Booking Source</Label>
                                                    <Input 
                                                        type="text"
                                                        id="inputBookingSource"
                                                        placeholder="Booking Source"
                                                        value={data.bookingSourceEnum}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-4">
                                                    <Label for="inputBookingPackage">Booking Package (if any)</Label>
                                                    <Input 
                                                        type="text"
                                                        id="inputBookingPackage"
                                                        placeholder="-"
                                                        value={getBookingPackage(data.bookingPackageId)}
                                                    />
                                                </FormGroup>
                                            </div>
                                            <div className="form-row">
                                            <FormGroup className="col-md-6">
                                                <Label for="inputPrice">Price (if any)</Label>
                                                <Input 
                                                    type="text"
                                                    id="inputPrice"
                                                    placeholder="-"
                                                    value={data.bookingPrice}
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-md-6">
                                                    <Label for="inputPromoIdUsed">Promotion Id Used (if any)</Label>
                                                    <Input 
                                                        type="text"
                                                        id="inputPromoIdUsed"
                                                        placeholder="-"
                                                        value={getPromoCode(data.promoIdUsed)}
                                                    />
                                                </FormGroup>
                                            </div>
                                            <div className="form-row">
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputStartDate">Start Date</Label>
                                                    <Input 
                                                        type="text"
                                                        id="inputStartDate"
                                                        placeholder="Start Date"
                                                        value={formatDate(data.startDate)}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputEndDate">End Date</Label>
                                                    <Input 
                                                        type="text"
                                                        id="inputEndDate"
                                                        placeholder="End Date"
                                                        value={formatDate(data.endDate)}
                                                    />
                                                </FormGroup>
                                            </div> 
                                            <div className="form-row">
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputLockerType">Locker Type</Label>
                                                    <Input 
                                                        type="text"
                                                        id="inputLockerType"
                                                        placeholder="Locker Type"
                                                        value={getLockerType(data.lockerTypeId)}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputKiosk">Kiosk</Label>
                                                    <Input 
                                                        type="text"
                                                        id="inputKiosk"
                                                        placeholder="Kiosk"
                                                        value={getKiosk(data.kioskId)}
                                                    />
                                                </FormGroup>
                                            </div>
                                            <FormGroup>
                                                <Label for="inputCreatedAt">Created On</Label>
                                                <Input 
                                                    type="text"
                                                    id="inputCreatedAt"
                                                    placeholder="Created On"
                                                    value={formatDate(data.createdAt)}
                                                />
                                            </FormGroup>                 
                                        </fieldset>
                                        <Row>
                                            <Col md="12">
                                                <div className="form-add">
                                                    <Button onClick={() => {
                                                        history.push('/admin/Bookings')
                                                        localStorage.removeItem('bookingToView')
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

export default MerchantBookingDetails;