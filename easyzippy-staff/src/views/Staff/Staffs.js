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

    const authToken = JSON.parse(Cookies.get('authToken'))

    const history = useHistory()

    // DECLARING COLUMNS
    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "First Name", field:"firstName"},
        {title: "Last Name", field:"lastName"},
        {title: "Mobile Number", field:"mobileNumber"},
        {title: "Email", field:"email"},
        {title: "Password", field: "password"},
        {title: "Staff Role", field:"staffRoleEnum"},
        // {title: "Created At", field:"createdAt"},
        // {title: "Disabled", field:"disabled"},
        
    ]
    const[data, setData] = useState([])

    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('') 

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

    const handleRowAdd = (newData, resolve) => {
        //validation: if name is empty
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
        }
        if(newData.password === undefined || newData.password === ""){
            isError(true)
            setError("Unable to add new staff. Please fill in the password field.")
            isSuccessful(false)
            resolve()
            return;
        }
        if(newData.email === undefined || newData.email === ""){
            isError(true)
            setError("Unable to add new staff. Please fill in the email field.")
            isSuccessful(false)
            resolve()
            return;
        }
        if(newData.staffRoleEnum === undefined || newData.staffRoleEnum === ""){
            isError(true)
            setError("Unable to add new staff. Please fill in the staff role field.")
            isSuccessful(false)
            resolve()
            return;
        }
        axios.post("/staff", {
            firstName: newData.firstName,
            lastName: newData.lastName,
            mobileNumber: newData.mobileNumber,
            email: newData.email,
            password: newData.password,
            staffRoleEnum: newData.staffRoleEnum      
        },
        {
            headers: {
                AuthToken: authToken
            }
        })
        .then(res => {
            console.log("axios call went through")
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
            console.log(error.response.data)
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
                                        editable={{
                                            // onRowUpdate: (newData, oldData) =>
                                            // new Promise((resolve) => {
                                            //     handleRowUpdate(newData, oldData, resolve);
                                            // }),
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