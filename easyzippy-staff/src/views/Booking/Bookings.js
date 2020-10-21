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
    Alert
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function Bookings() {
    const authToken = JSON.parse(Cookies.get('authToken'))

    const history = useHistory()

    // DECLARING COLUMNS 
    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Name", field:"customerId", editable: "never", 
            customFilterAndSearch: (term, rowData) => getCustomerName(rowData.customerId).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{getCustomerName(row["customerId"])}</span>},
        {title: "Locker Type", field: "lockerTypeId", editable: "never", 
            customFilterAndSearch: (term, rowData) => getLockerType(rowData.lockerTypeId).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{getLockerType(row["lockerTypeId"])}</span>},    
        {title: "Price", field: "bookingPrice"},
        {title: "Booking Source", field: "bookingSourceEnum", lookup:{Mobile: "Mobile", Kiosk: "Kiosk"}},
        {title: "Status", field: "bookingStatusEnum", lookup:{Unfufilled: "Unfulfilled", Fulfilled: "Fulfilled", Active: "Active"}},
        {title: "Start Date", field: "startDate", 
            customFilterAndSearch: (term, rowData) => formatDate(rowData.startDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["startDate"]) }</span>},
        {title: "End Date", field: "endDate",
            customFilterAndSearch: (term, rowData) => formatDate(rowData.endDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["endDate"]) }</span>},
        {title: "Cancelled", field: "cancelled", editable: "never"}
    ]

    const [data, setData] = useState([])
    const [customers, setCustomers] = useState([])
    const [lockerTypes, setLockerTypes] = useState([])

    useEffect(() => {
        console.log("retrieving customer bookings;; axios")
        axios.get("/customerBookings", 
        {
            headers: {
                AuthToken: authToken
            }
        }).then (res => {
            setData(res.data)

            axios.get("/customers", 
            {
                headers: {
                    AuthToken: authToken
                }
            }).then(res => {
                setCustomers(res.data)
            }).catch (err => console.error(err))

            axios.get("/lockerTypes", 
            {
                headers: {
                    AuthToken: authToken
                }
            }).then(res => {
                setLockerTypes(res.data)
            }).catch(err => console.error(err))
        }).catch (err => console.error(err))
    },[authToken])

    //match customer id to customer name 
    function getCustomerName(id) {
        for (var i in customers) {
            if (customers[i].id === id) {
                return customers[i].firstName + " " + customers[i].lastName
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
        <ThemeProvider theme={theme}>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <MaterialTable
                                title="Booking List"
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
                                        history.push('/admin/bookingDetails')
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

export default Bookings;