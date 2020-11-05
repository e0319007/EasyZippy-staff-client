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


function CustomerOrderHistory() {

    const authToken = JSON.parse(Cookies.get('authToken'))

    const history = useHistory()

    // DECLARING COLUMNS

    var columns = [
        {title: "Id", field: 'id'},
        {title: "Merchant Name", field: "merchantId", 
            customFilterAndSearch: (term, rowData) => getMerchantName(rowData.merchantId).toLowerCase().includes(term.toLowerCase()), 
            render: row => <span>{getMerchantName(row["merchantId"])}</span>}, 
        {title: "Total Amount ($)", field: "totalAmount"},
        {title: "Order Date", field: "orderDate", 
            customFilterAndSearch: (term, rowData) => formatDate(rowData.orderDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["orderDate"]) }</span>},
        {title: "Collection Method", field: "collectionMethodEnum"},
        {title: "Order Status", field:"orderStatusEnum", lookup:{Processing: "Processing", ReadyForCollection: "Ready For Collection"}}          
    ]

    const [orderData, setOrderData] = useState([])
    const [merchants, setMerchants] = useState([])
    
    const customerId = parseInt(Cookies.get('customerUser'))


    useEffect(() => {
        axios.get(`/orders/customer/${customerId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setOrderData(res.data)
            console.log(res.data)

        }).catch(function (error) {
            console.log(error.response.data)
        })

        axios.get("/merchants", 
        {
            headers: {
                AuthToken:authToken
            }
        }).then(res => {
            setMerchants(res.data)
        })
    },[])

    //match merchant id to merchant name
    function getMerchantName(id) {
        for (var i in merchants) {
            if (merchants[i].id === id) {
                return merchants[i].name
            }
        }
    }

    // to use when viewing 
    function formatDate(d) {
        //console.log(d)
        if (d === undefined){
            d = (new Date()).toISOString()
            console.log(undefined)
        }
        let currDate = new Date(d);
        let year = currDate.getFullYear();
        let month = currDate.getMonth() + 1;
        let dt = currDate.getDate();
        //let time = currDate.toLocaleTimeString('en-SG')

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

export default CustomerOrderHistory;