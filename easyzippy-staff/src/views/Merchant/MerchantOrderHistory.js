import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import MaterialTable from "material-table"
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';


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


function MerchantOrderHistory() {

    const authTokenStaff = JSON.parse(Cookies.get('authTokenStaff'))


    // DECLARING COLUMNS

    var columns = [
        {title: "Id", field: 'id'},
        {title: "Customer Name", field: "customerId", 
            customFilterAndSearch: (term, rowData) => getCustomerName(rowData.customerId).toLowerCase().includes(term.toLowerCase()), 
            render: row => <span>{getCustomerName(row["customerId"])}</span>}, 
        {title: "Total Amount ($)", field: "totalAmount"},
        {title: "Order Date", field: "orderDate", 
            customFilterAndSearch: (term, rowData) => formatDate(rowData.orderDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["orderDate"]) }</span>},
        {title: "Collection Method", field: "collectionMethodEnum"},
        {title: "Order Status", field:"orderStatusEnum", 
            customFilterAndSearch: (term, rowData) => (rowData.orderStatusEnum).toLowerCase().includes(term.toLowerCase())}          
    ]

    const [orderData, setOrderData] = useState([])
    const [customers, setCustomers] = useState([])
    
    const merchantId = JSON.parse(localStorage.getItem('merchantToView'))


    useEffect(() => {
        axios.get(`/orders/merchant/${merchantId}`, 
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            setOrderData(res.data)

        }).catch(function (error) {
        })

        axios.get("/customers", 
        {
            headers: {
                AuthToken:authTokenStaff
            }
        }).then(res => {
            setCustomers(res.data)
        })
    },[authTokenStaff, merchantId])

    //match merchant id to merchant name
    function getCustomerName(id) {
        for (var i in customers) {
            if (customers[i].id === id) {
                return customers[i].firstName + " " + customers[i].lastName
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

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }

        return dt + "/" + month + "/" + year;
    }
    return (
        <ThemeProvider theme={theme}>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <MaterialTable  
                                title="Orders List"
                                columns={columns}
                                data={orderData}
                                options={{
                                    
                                    filtering: true,
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
    )
}

export default MerchantOrderHistory;