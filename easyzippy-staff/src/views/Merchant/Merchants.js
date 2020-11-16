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
    //move created at to view merchant details
    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Name", field:"name"},
        {title: "Mobile Number", field:"mobileNumber"},
        {title: "Email", field:"email"},
        {title: "Credit Balance", field:"creditBalance",
            render: row => <span>{ parseFloat(row["creditBalance"]).toFixed(2) }</span>},

        {title: "Approved", field:"approved", lookup:{false: "Not Approved", true: "Approved"}},
        // {title: "Created At", field:"createdAt"},
        {title: "Disabled", field:"disabled", lookup:{false: "Enabled", true: "Disabled"}},
    ]

    const[data, setData] = useState([])

    useEffect(() => {
        console.log("retrieving merchants // axios")
        axios.get("/merchants", 
        {
            headers: {
                AuthToken: authTokenStaff
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
                                            //onClick: (event, rowData) => alert("You viewed " + rowData.firstName)
                                            onClick:(event, rowData) => {
                                                console.log("in onclick")
                                                history.push('/admin/merchantDetails')
                                                localStorage.setItem('merchantToView', JSON.stringify(rowData.id))
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