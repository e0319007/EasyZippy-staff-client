import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import MaterialTable from "material-table"
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';

import {
    Card,
    Row,
    Col,
    Alert
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function LockerTypes() {

    const authToken = JSON.parse(Cookies.get('authToken'))
    const history = useHistory()

    // DECLARING COLUMNS
    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Name", field:"name"},
        {title: "Width", field:"lockerWidth"},
        {title: "Length", field:"lockerLength"},
        {title: "Height", field:"lockerHeight"},
        {title: "Price", field:"pricePerHalfHour"},    
        {title: "Disabled", field:"disabled", editable: "never"}, 
    ]

    const[data, setData] = useState([])

    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    useEffect(() => {
        console.log("retrieving locker types // axios")
        axios.get("/lockerTypes", 
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

    // locker type creation
    const handleRowAdd = (newData, resolve) => {
        
        //validation: if title is empty
        if(newData.name === undefined || newData.name === "") {
            isError(true)
            setError("Unable to add new locker type. Please fill in the title name.")
            isSuccessful(false)
            resolve()
            return;
        } else if (newData.lockerWidth === undefined || newData.lockerWidth === "") {
            isError(true)
            setError("Unable to add new locker type. Please fill in the width.")
            isSuccessful(false)
            resolve()
            return;
        } else if (newData.lockerLength === undefined || newData.lockerLength === "") {
            isError(true)
            setError("Unable to add new locker type. Please fill in the length.")
            isSuccessful(false)
            resolve()
            return;
        } else if (newData.lockerHeight === undefined || newData.lockerHeight === "") {
            isError(true)
            setError("Unable to add new locker type. Please fill in the height.")
            isSuccessful(false)
            resolve()
            return;
        } else if (newData.price === undefined || newData.price === "") {
            isError(true)
            setError("Unable to add new locker type. Please fill in the price.")
            isSuccessful(false)
            resolve()
            return;
        }
        axios.post("/lockerType", {
            name: newData.name,
            lockerWidth: newData.lockerWidth,
            lockerLength: newData.lockerLength,
            lockerHeight: newData.lockerHeight,
            price: newData.pricePerHalfHour
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
            setMsg("Locker Type successfully created!")
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

    const handleRowUpdate = (newData, oldData, resolve) => {

        axios.put("/lockerType/"+oldData.id, {
            name: newData.name,
            lockerWidth: newData.lockerWidth,
            lockerLength: newData.lockerLength,
            lockerHeight: newData.lockerHeight,
            price: newData.pricePerHalfHour
        },
        {
            headers: {
                AuthToken: authToken
            }
        })
        .then(res => {
            console.log("axios call went through")
            const dataUpdate = [...data];
            const index = oldData.tableData.id;
            dataUpdate[index] = newData;
            setData([...dataUpdate]);
            isError(false)
            isSuccessful(true)
            setMsg("Locker Type successfully updated!")
            resolve()
        })
        .catch(function (error) {
            isSuccessful(false)
            isError(true)
            setError(error.response.data)
            console.log(error.response.data)
            resolve()
        })
    }

    const handleRowDelete = (oldData, resolve) => {
        axios.put("/deleteLockerType/"+oldData.id, {
            name: oldData.name
        },
        {
        headers: {
            AuthToken: authToken
        }
    }).then(res => {
            console.log("axios call went through")
            const dataDelete = [...data];
            const index = oldData.tableData.id;
            dataDelete.splice(index, 1);
            setData([...dataDelete]);
            isError(false)
            isSuccessful(true)
            setMsg("Locker Type successfully deleted!")
            resolve()
        })
        .catch(function (error) {

            let errormsg = error.response.data;

            if ((error.response.data).startsWith("<!DOCTYPE html>")) {
                errormsg = "An unexpected error has occurred. The Locker Type cannot be deleted."
            }

            isSuccessful(false)
            isError(true)
            setError(errormsg)
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
                                title="Locker Type List"
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
                                        tooltip: 'View Locker Type Details',
                                        //onClick: (event, rowData) => alert("You viewed " + rowData.firstName)
                                        onClick:(event, rowData) => {
                                            console.log("in onclick")
                                            history.push('/admin/lockerTypeDetails')
                                            localStorage.setItem('lockerTypeToView', JSON.stringify(rowData.id))
                                            }
                                        },                                
                            
                                    ]}
                                editable={{
                                    onRowUpdate: (newData, oldData) =>
                                    new Promise((resolve) => {
                                        handleRowUpdate(newData, oldData, resolve);
                                    }),
                                    onRowAdd: (newData) =>
                                        new Promise((resolve) => {
                                        handleRowAdd(newData, resolve)
                                    }),
                                    onRowDelete: (oldData) =>
                                        new Promise((resolve) => {
                                        handleRowDelete(oldData, resolve)
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
    );

}

export default LockerTypes;