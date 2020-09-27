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

function Merchants() {

    const history = useHistory()
    const authToken = JSON.parse(Cookies.get('authToken'))

    // DECLARING COLUMNS 
    //move created at to view merchant details
    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Name", field:"name"},
        {title: "Mobile Number", field:"mobileNumber"},
        {title: "Email", field:"email"},
        {title: "Approved", field:"approved"},
        {title: "Created At", field:"createdAt"},
        {title: "Disabled", field:"disabled"},
    ]

    const[data, setData] = useState([])

    useEffect(() => {
        console.log("retrieving merchants // axios")
        axios.get("/merchants", 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            // console.log(res.data)
            setData(res.data)
        })
        .catch (err => console.error(err))
    },[])

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
                                            tooltip: 'View Merchant Details',
                                            //onClick: (event, rowData) => alert("You viewed " + rowData.firstName)
                                            onClick:(event, rowData) => {
                                                console.log("in onclick")
                                                history.push('/admin/merchantDetails')

                                            }
                                        },
                                    ]}
                            />
                            {/* <Modal isOpen={modal} toggle={toggle}>
                                <ModalHeader toggle={toggle}> Customer Details</ModalHeader>                                          
                            </Modal>  */}
                        </Card>
                    </Col>
                </Row>
            </div>   
        </ThemeProvider>     
    );
}

export default Merchants;