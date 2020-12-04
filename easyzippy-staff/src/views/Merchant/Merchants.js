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

function Merchants() {

    const history = useHistory()
    const authTokenStaff = JSON.parse(Cookies.get('authTokenStaff'))

    // DECLARING COLUMNS 
    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Name", field:"name"},
        {title: "Mobile Number", field:"mobileNumber"},
        {title: "Email", field:"email"},
        {title: "Credit Balance", field:"creditBalance",
            render: row => <span>{ parseFloat(row["creditBalance"]).toFixed(2) }</span>},

        {title: "Approved", field:"approved", lookup:{false: "Not Approved", true: "Approved"}},
        {title: "Disabled", field:"disabled", lookup:{false: "Enabled", true: "Disabled"}},
    ]

    const[data, setData] = useState([])

    useEffect(() => {
        axios.get("/merchants", 
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
          
            setData(res.data)
        })
        .catch ()
    },[authTokenStaff])

    return(
        <ThemeProvider theme={theme}>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <MaterialTable 
                                title="Merchant List"
                                columns={columns}
                                data={data}
                                options={{   
                                    
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
                                            tooltip: 'View Merchant Details',
                                            onClick:(event, rowData) => {
                                                history.push('/admin/merchantDetails')
                                                localStorage.setItem('merchantToView', JSON.stringify(rowData.id))
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

export default Merchants;