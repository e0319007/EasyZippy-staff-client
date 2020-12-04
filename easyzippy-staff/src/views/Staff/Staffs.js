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


function Staffs() {

    const history = useHistory()
    const authTokenStaff = JSON.parse(Cookies.get('authTokenStaff'))

    // DECLARING COLUMNS
    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "First Name", field:"firstName"},
        {title: "Last Name", field:"lastName"},
        {title: "Mobile Number", field:"mobileNumber"},
        {title: "Email", field:"email"},
        {title: "Staff Role", field:"staffRoleEnum", editable:"never", lookup:{Admin: "Admin", Employee: "Employee"}},
        {title: "Disabled", field:"disabled", editable: "never", lookup:{false: "Enabled", true: "Disabled"}},
        
    ]
    const[data, setData] = useState([])

    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('') 

    useEffect(() => {
        axios.get("/staff",
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            setData(res.data)
        })
        .catch ()
    },[authTokenStaff])

    const handleRowAdd = (newData, resolve) => {
        if(newData.firstName === undefined || newData.firstName === ""){
            isError(true)
            setError("Unable to add new staff. Please fill in the first name field.")
            isSuccessful(false)
            resolve()
            return;
        }
        if(newData.lastName === undefined || newData.lastName === ""){
            isError(true)
            setError("Unable to add new staff. Please fill in the last name field.")
            isSuccessful(false)
            resolve()
            return;
        }
        if(newData.mobileNumber === undefined || newData.mobileNumber === ""){
            isError(true)
            setError("Unable to add new staff. Please fill in the mobile number field.")
            isSuccessful(false)
            resolve()
            return;
        } else {
            var nums = "(?<!\\d)\\d{8}(?!\\d)"
            if (!newData.mobileNumber.match(nums)) {
                setError("Please enter a valid 8-digits Mobile Number")
                isError(true)
                isSuccessful(false)
                resolve()
                return;
            } else {
                isError(false)
            }
        }
        if(newData.email === undefined || newData.email === ""){
            isError(true)
            setError("Unable to add new staff. Please fill in the email field.")
            isSuccessful(false)
            resolve()
            return;
        }

        axios.post("/staff", {
            firstName: newData.firstName,
            lastName: newData.lastName,
            mobileNumber: newData.mobileNumber,
            email: newData.email,
            staffRoleEnum: "Employee"      

        },
        {
            headers: {
                AuthToken: authTokenStaff
            }
        })
        .then(res => {
            let dataToAdd = [...data];
            dataToAdd.push(newData);
            setData(dataToAdd);
            resolve()
            isError(false)
            isSuccessful(true)
            setMsg("Staff successfully added!")
            document.location.reload()
        })
        .catch(function (error) {
            isSuccessful(false)
            isError(true)
            setError(error.response.data)
            resolve()
        })
    }

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
                                            tooltip: 'View Staff Details',
                                            onClick:(event, rowData) => {
                                                history.push('/admin/staffDetails')
                                                localStorage.setItem('staffToView', JSON.stringify(rowData.id))
                                                }
                                            },                                
                                        ]}
                                        editable={{
                                   
                                            onRowAdd: (newData) =>
                                                new Promise((resolve) => {
                                                handleRowAdd(newData, resolve)
                                            }),
                                        }}
                            />
                            { err &&<Alert color="danger">{error}</Alert> }
                            { successful &&<Alert color="success">{successMsg}</Alert>}
                        </Card>
                    </Col>
                </Row>
            </div>   
        </ThemeProvider>     
    )
}

export default Staffs;