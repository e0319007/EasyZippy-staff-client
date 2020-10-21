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
    Alert,
    Table
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});


function BookingPackages() {

    const authToken = JSON.parse(Cookies.get('authToken'))

    const history = useHistory()

    // DECLARING COLUMNS
    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Name", field: "name"},
        {title: "Description", field:"description"},
        {title: "Quota", field:"quota"},
        {title: "Price", field:"price"},
        {title: "Duration (in days)", field:"duration"},
        {title: "Locker Type", field:"lockerTypeId"},
        {title: "Disabled", field:"disabled", editable: "never"}
    ]

    const[data, setData] = useState([])
    const[lockerTypeData, setLockerTypeData] = useState([])

    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    useEffect(() => {
        console.log("retrieving booking packages;; axios")
        axios.get("/bookingPackageModels", 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data)
            console.log("**booking packages**" + res.data)
        })
        .catch (err => console.error(err))

        console.log("retrieving lockertypes;; axios")
        axios.get("/lockerTypes", 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setLockerTypeData(res.data)
            console.log("**locker types" + res.data)
        }).catch(err => console.error(err))
    },[authToken])

    const handleRowAdd = (newData, resolve) => {
        //validation: if name is empty
        if(newData.name === undefined || newData.address === ""){
            isError(true)
            setError("Unable to add new booking package. Please fill in the name field.")
            isSuccessful(false)
            resolve()
            return;
        }
        if(newData.quota === undefined || newData.quota === ""){
            isError(true)
            setError("Unable to add new booking package. Please fill in the quota field.")
            isSuccessful(false)
            resolve()
            return;
        }
        if(newData.price === undefined || newData.price === ""){
            isError(true)
            setError("Unable to add new booking package. Please fill in the price field.")
            isSuccessful(false)
            resolve()
            return;
        }
        if(newData.duration === undefined || newData.duration === ""){
            isError(true)
            setError("Unable to add new booking package. Please fill in the duration field.")
            isSuccessful(false)
            resolve()
            return;
        }
        if(newData.lockerTypeId === undefined || newData.lockerTypeId === ""){
            isError(true)
            setError("Unable to add new booking package. Please fill in the locker type field.")
            isSuccessful(false)
            resolve()
            return;
        }
        axios.post("/bookingPackageModel", {
            name: newData.name,
            description: newData.description,
            quota: newData.quota,
            price: newData.price,
            duration: newData.duration,
            lockerTypeId: newData.lockerTypeId
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
            setMsg("Booking package successfully added!")
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
        //validation
        if(newData.name === undefined || newData.address === ""){
            isError(true)
            setError("Unable to update. Please fill in the name field.")
            isSuccessful(false)
            resolve()
            return;
        }
        if(newData.quota === undefined || newData.quota === ""){
            isError(true)
            setError("Unable to update. Please fill in the quota field.")
            isSuccessful(false)
            resolve()
            return;
        }
        if(newData.price === undefined || newData.price === ""){
            isError(true)
            setError("Unable to update. Please fill in the price field.")
            isSuccessful(false)
            resolve()
            return;
        }
        if(newData.duration === undefined || newData.duration === ""){
            isError(true)
            setError("Unable to update. Please fill in the duration field.")
            isSuccessful(false)
            resolve()
            return;
        }
        if(newData.lockerTypeId === undefined || newData.lockerTypeId === ""){
            isError(true)
            setError("Unable to update. Please fill in the locker type field.")
            isSuccessful(false)
            resolve()
            return;
        }
        axios.put("/bookingPackageModel/"+oldData.id, {
            name: newData.name,
            description: newData.description,
            quota: newData.quota,
            price: newData.price,
            duration: newData.duration,
            lockerTypeId: newData.lockerTypeId
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
            setMsg("Booking package successfully updated!")
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
        axios.put("/deleteBookingPackageModel/"+oldData.id, {
            id: oldData.id
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
                setMsg("Booking package successfully deleted!")
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

    return (
        <ThemeProvider theme={theme}>
            <div className="content">
                <Row>
                    <Col md = "12">
                            <Table size="sm" responsive hover style={{width:"40%"}}>
                                <thead>
                                    <tr>
                                        <th>Locker Type</th>
                                        <th>Name</th>
                                        <th>Height</th>
                                        <th>Width</th>
                                        <th>Length</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lockerTypeData.map(lockerType => (
                                        <tr>
                                            <td>{lockerType.id}</td>
                                            <td>{lockerType.name}</td>
                                            <td>{lockerType.lockerHeight}</td>
                                            <td>{lockerType.lockerWidth}</td>
                                            <td>{lockerType.lockerLength}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        <Card>
                            <MaterialTable 
                                title="Booking Packages"
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
                                actions={[
                                    {
                                    icon: 'info',
                                    tooltip: 'View Booking Package Details',
                                    onClick:(event, rowData) => {
                                        console.log("in onclick")
                                        history.push('/admin/bookingPackageDetails')
                                        localStorage.setItem('bookingPackageToView', JSON.stringify(rowData.id))
                                        }
                                    },                                
                                
                                ]}
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

export default BookingPackages;