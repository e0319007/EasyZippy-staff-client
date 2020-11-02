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


function MerchantPromotionHistory() {

    const authToken = JSON.parse(Cookies.get('authToken'))

    // DECLARING COLUMNS

    var merchantColumns = [
        {title: "Id", field: 'id'},
        {title: "Promo Code", field: "promoCode"}, 
        {title: "Title", field: "title"},
        {title: "Start Date", field: "startDate", 
            customFilterAndSearch: (term, rowData) => formatDate(rowData.startDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["startDate"]) }</span>},
        {title: "End Date", field: "endDate", 
            customFilterAndSearch: (term, rowData) => formatDate(rowData.endDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["endDate"]) }</span>},
        {title: "Expired", field:"expired", lookup:{false: "Not Expired", true: "Expired"}}          
    ]

    const [merchantData, setMerchantData] = useState([])

    const merchantId = JSON.parse(localStorage.getItem('merchantToView'))

    useEffect(() => {
        axios.get(`/promotion/merchant/${merchantId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setMerchantData(res.data)

        }).catch(function (error) {
            console.log(error.response.data)
        })
    },[])


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
                                title="Promotions List"
                                columns={merchantColumns}
                                data={merchantData}
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

export default MerchantPromotionHistory;