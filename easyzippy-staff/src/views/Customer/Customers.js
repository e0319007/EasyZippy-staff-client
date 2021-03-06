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


function Customers() {

    const authTokenStaff = JSON.parse(Cookies.get('authTokenStaff'))

    const history = useHistory()

    // DECLARING COLUMNS
    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "First Name", field:"firstName"},
        {title: "Last Name", field:"lastName"},
        {title: "Mobile Number", field:"mobileNumber"},
        {title: "Email", field:"email"},
        {title: "Credit Balance", field:"creditBalance",
            render: row => <span>{ parseFloat(row["creditBalance"]).toFixed(2) }</span>},
        {title: "Disabled", field:"disabled", lookup:{false: "Enabled", true: "Disabled"}},
        
    ]

    const[data, setData] = useState([])

    useEffect(() => {
        axios.get("/customers", 
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            setData(res.data)
        })
        .catch ()
    },[authTokenStaff])


    return (
        <ThemeProvider theme={theme}>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <MaterialTable 
                                title="Customer List"
                                columns={columns}
                                data={data}
                                options={{   
                                    sorting: true, 
                                    filtering:true,
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
                                            tooltip: 'View Customer Details',
                                            onClick:(event, rowData) => {
                                                history.push('/admin/customerDetails')
                                                localStorage.setItem('customerToView', JSON.stringify(rowData.id))

                                                }
                                            },                                
                                
                                        ]}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>   
        </ThemeProvider>     
    )
}

export default Customers;