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


function Kiosks() {

    const authToken = JSON.parse(Cookies.get('authToken'))

    const history = useHistory()

    // DECLARING COLUMNS
    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Address", field: "address"},
        {title: "Description", field:"description"},
        //{title: "Disabled", field:"disabled", editable: "never"}
    ]

    const[data, setData] = useState([])

    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    useEffect(() => {
        console.log("retrieving kiosks;; axios")
        axios.get("/kiosks", 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            // console.log(res.data)
            setData(res.data)
        })
        .catch (err => console.error(err))
    },[authToken])

    const handleRowAdd = (newData, resolve) => {
        //validation: if name is empty
        if(newData.address === undefined || newData.address === ""){
            isError(true)
            setError("Unable to add new kiosk. Please fill in the address field.")
            isSuccessful(false)
            resolve()
            return;
        }
        axios.post("/kiosk", {
            address: newData.address,
            description: newData.description,
            //disabled: newData.disabled
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
            setMsg("Kiosk successfully added!")
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
        if(newData.address === undefined || newData.address == ""){
            isError(true)
            setError("Unable to update. Please fill in the address field for kiosk entry")
            isSuccessful(false)
            resolve()
            return;
        }
        axios.put("/kiosk/"+oldData.id, {
            address: newData.address,
            description: newData.description,
            //disabled: newData.disabled
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
            setMsg("Kiosk successfully updated!")
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
        axios.delete("/kiosk/"+oldData.id,
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
                setMsg("Kiosk successfully deleted!")
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
                        <Card>
                            <MaterialTable 
                                title="Kiosk List"
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
                                    tooltip: 'View Kiosk Details',
                                    onClick:(event, rowData) => {
                                        console.log("in onclick")
                                        history.push('/admin/kioskDetails')
                                        localStorage.setItem('kioskToView', JSON.stringify(rowData.id))
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

export default Kiosks;