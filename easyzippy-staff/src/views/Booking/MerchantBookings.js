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

function MerchantBookings() {
    const authTokenStaff = JSON.parse(Cookies.get('authTokenStaff'))

    const history = useHistory()

    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Name", field:"customerId", editable: "never", 
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

    const [data, setData] = useState([])
    const [merchants, setMerchants] = useState([])
    const [lockerTypes, setLockerTypes] = useState([])

    useEffect(() => {
        axios.get("/merchantBookings", 
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then (res => {
            setData(res.data)

            axios.get("/merchants", 
            {
                headers: {
                    AuthToken: authTokenStaff
                }
            }).then(res => {
                setMerchants(res.data)
            }).catch ()

            axios.get("/lockerTypes", 
            {
                headers: {
                    AuthToken: authTokenStaff
                }
            }).then(res => {
                setLockerTypes(res.data)
            }).catch()
        }).catch ()
    },[authTokenStaff])

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
        <ThemeProvider theme={theme}>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <MaterialTable
                                title="Merchant Booking List"
                                columns={columns}
                                data={data}
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
                            ]}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </ThemeProvider>
    );
}

export default MerchantBookings;