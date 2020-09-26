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


function Staffs() {

    const authToken = JSON.parse(Cookies.get('authToken'))

    const history = useHistory()

    // DECLARING COLUMNS
    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "First Name", field:"firstName"},
        {title: "Last Name", field:"lastName"},
        {title: "Mobile Number", field:"mobileNumber"},
        {title: "Email", field:"email"},
        {title: "Staff Role", field:"staffRoleEnum"},
        {title: "Created At", field:"createdAt"},
        {title: "Disabled", field:"disabled"},
        
    ]

    const[data, setData] = useState([])    

    useEffect(() => {
        console.log("retrieving staffs;; axios")
        axios.get("/staff", 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data)
        })
        .catch (err => console.error(err))
    },[authToken])

    


    return (
        <ThemeProvider theme={theme}>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <MaterialTable 
                                title="Staff List"
                                columns={columns}
                                data={data}
                                options={{   
                                    //sorting: true, 
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
                                            tooltip: 'View Staff Details',
                                            //onClick: (event, rowData) => alert("You viewed " + rowData.firstName)
                                            onClick:(event, rowData) => {
                                                console.log("in onclick")
                                                history.push('/admin/staffDetails')

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

export default Staffs;