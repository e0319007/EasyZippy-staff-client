import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import MaterialTable from "material-table"
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';


import {
    Row,
    Col,
    Card,
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function Bookings() {
    const authTokenStaff = JSON.parse(Cookies.get('authTokenStaff'))

    const history = useHistory()

    var customerColumns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Name", field:"customerId", editable: "never", 
            customFilterAndSearch: (term, rowData) => getCustomerName(rowData.customerId).toLowerCase().includes(term.toLowerCase()), 
            render: row => <span>{getCustomerName(row["customerId"])}</span>},
        {title: "Locker Type", field: "lockerTypeId", editable: "never", 
            customFilterAndSearch: (term, rowData) => getLockerType(rowData.lockerTypeId).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{getLockerType(row["lockerTypeId"])}</span>},    
        {title: "Price", field: "bookingPrice"},
        {title: "Booking Source", field: "bookingSourceEnum", lookup:{Mobile: "Mobile", Kiosk: "Kiosk"}},
        {title: "Status", field: "bookingStatusEnum", lookup:{Unfulfilled: "Unfulfilled", Fulfilled: "Fulfilled", Active: "Active", Cancelled: "Cancelled"}},
        {title: "Start Date", field: "startDate", 
            customFilterAndSearch: (term, rowData) => formatDate(rowData.startDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["startDate"]) }</span>},
        {title: "End Date", field: "endDate",
            customFilterAndSearch: (term, rowData) => formatDate(rowData.endDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["endDate"]) }</span>},
    ]
    var merchantColumns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Name", field:"merchantId", editable: "never", 
            customFilterAndSearch: (term, rowData) => getMerchantName(rowData.merchantId).toLowerCase().includes(term.toLowerCase()), 
            render: row => <span>{getMerchantName(row["merchantId"])}</span>},
        {title: "Locker Type", field: "lockerTypeId", editable: "never", 
            customFilterAndSearch: (term, rowData) => getLockerType(rowData.lockerTypeId).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{getLockerType(row["lockerTypeId"])}</span>},    
        {title: "Price", field: "bookingPrice"},
        {title: "Booking Source", field: "bookingSourceEnum", lookup:{Mobile: "Mobile", Kiosk: "Kiosk"}},
        {title: "Status", field: "bookingStatusEnum", lookup:{Unfulfilled: "Unfulfilled", Fulfilled: "Fulfilled", Active: "Active", Cancelled: "Cancelled"}},
        {title: "Start Date", field: "startDate", 
            customFilterAndSearch: (term, rowData) => formatDate(rowData.startDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["startDate"]) }</span>},
        {title: "End Date", field: "endDate",
            customFilterAndSearch: (term, rowData) => formatDate(rowData.endDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["endDate"]) }</span>},
    ]

    const [viewCustomers, setViewCustomers] = useState(true)

    const [customerData, setCustomerData] = useState([])
    const [merchantData, setMerchantData] = useState([])
    const [customers, setCustomers] = useState([])
    const [merchants, setMerchants] = useState([])
    const [lockerTypes, setLockerTypes] = useState([])

    useEffect(() => {
        axios.get("/customerBookings", 
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then (res => {
            setCustomerData(res.data)

            axios.get("/merchantBookings", 
            {
                headers: {
                    AuthToken: authTokenStaff
                }
            }).then (res => {
                setMerchantData(res.data)
            }).catch(function (error) {
            })

            axios.get("/customers", 
            {
                headers: {
                    AuthToken: authTokenStaff
                }
            }).then(res => {
                setCustomers(res.data)

                axios.get("/merchants", 
                {
                    headers: {
                        AuthToken: authTokenStaff
                    }
                }).then(res => {
                    setMerchants(res.data)
                }).catch(function (error) {
                })
            })

            axios.get("/lockerTypes", 
            {
                headers: {
                    AuthToken: authTokenStaff
                }
            }).then(res => {
                setLockerTypes(res.data)
            })
        })
    },[authTokenStaff])

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

    return(
        <ThemeProvider theme={theme}>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            { viewCustomers &&
                            <MaterialTable
                                title="Customer Booking List"
                                columns={customerColumns}
                                data={customerData}
                                options={{
                                    search: false,
                                    filtering: true,
                                    headerStyle: {
                                        backgroundColor: '#98D0E1', 
                                        color: '#FFF',
                                        fontWeight: 1000,
                                    },
                                    actionsColumnIndex: -1
                                }}
                            actions={[
                                {
                                    icon: 'info',
                                    tooltip: "View Booking Details",
                                    onClick: (event, rowData) => {
                                        history.push('/admin/customerBookingDetails')
                                        localStorage.setItem('bookingToView', JSON.stringify(rowData.id))
                                    }
                                },
                                {
                                    icon: 'sort',
                                    onClick: () => {
                                        setViewCustomers(false)
                                    },
                                    isFreeAction: true,
                                    tooltip: 'Click to view merchant bookings'
                                }
                            ]}
                            />
                            }
                            {!viewCustomers && 
                                <MaterialTable
                                title="Merchant Booking List"
                                columns={merchantColumns}
                                data={merchantData}
                                options={{
                                    search: false,
                                    filtering: true,
                                    headerStyle: {
                                        backgroundColor: '#98D0E1', 
                                        color: '#FFF',
                                        fontWeight: 1000,
                                    },
                                    actionsColumnIndex: -1
                                }}
                            actions={[
                                {
                                    icon: 'info',
                                    tooltip: "View Booking Details",
                                    onClick: (event, rowData) => {
                                        history.push('/admin/merchantBookingDetails')
                                        localStorage.setItem('bookingToView', JSON.stringify(rowData.id))
                                    }
                                },
                                {
                                    icon: 'sort',
                                    onClick: () => {
                                        setViewCustomers(true)
                                    },
                                    isFreeAction: true,
                                    tooltip: 'Click to view customer bookings'
                                }
                            ]}
                            />             
                            }
                        </Card>
                    </Col>
                </Row>
            </div>
        </ThemeProvider>
    );
}

export default Bookings;