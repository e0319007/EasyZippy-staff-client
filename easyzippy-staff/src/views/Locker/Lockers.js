import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import MaterialTable, { MTableToolbar } from "material-table"
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';

import {
    Row,
    Col,
    Card, 
    Alert,
    FormGroup, 
    Label,
    Input
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function Lockers() {

    const authToken = JSON.parse(Cookies.get('authToken'))

    const history = useHistory()

    const[data, setData] = useState([])
    const [kiosks, setKiosks] = useState([])
    const [lockerTypes, setLockerTypes] = useState([])

    // const [filterLockerType, setFilterLockerType] = useState()
    // const [filterKiosk, setFilterKiosk] = useState()

    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    // DECLARING COLUMNS (created at can put inside details)
    var columns = [
        {title: "Id", field: "id", editable: "never", filtering: false },
        {title: "Locker Status", field:"lockerStatusEnum", editable: "never"},
        {title: "Locker Type", field:"lockerTypeId", editable: "never", 
            customFilterAndSearch: (term, rowData) => getLockerType(rowData.lockerTypeId).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ getLockerType(row["lockerTypeId"]) }</span>},
        {title: "Kiosk", field:"kioskId", editable: "never", 
            customFilterAndSearch: (term, rowData) => getKioskName(rowData.kioskId).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ getKioskName(row["kioskId"]) }</span>},
        {title: "Disabled", field:"disabled", editable: "never", filtering: false },
    ]

    useEffect(() => {
        console.log("retrieving lockers // axios")
        axios.get("/lockers", 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data)

            axios.get("/kiosks", 
            {
                headers: {
                    AuthToken: authToken
                }
            }).then(response => {
                setKiosks(response.data)
            }).catch (err => console.error(err))

            axios.get("/lockerTypes", {
                headers: {
                    AuthToken: authToken
                }
            }).then(response => {
                setLockerTypes(response.data)
            }).catch (err => console.error(err))

        })
        .catch (err => console.error(err))
    },[])

    const handleRowDelete = (oldData, resolve) => {
        axios.put("/deleteLocker/"+oldData.id, {
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
            setMsg("Locker successfully deleted!")
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

    //match kiosk id to kiosk address 
    function getKioskName(id) {
        for (var i in kiosks) {
            //find the address match to the id
            if (kiosks[i].id === id) {
                return kiosks[i].address
            }
        }
    }
    //match locker type id to locker type name
    function getLockerType(id) {
        for (var i in lockerTypes) {
            if (lockerTypes[i].id === id) {
                return lockerTypes[i].name
            }
        }
    }

    // const onChangeLockerType = e => {
    //     console.log("in onChangeLockerType")
    //     const lockertype = e.target.value;
    //     setFilterLockerType(lockertype)
    //     console.log("filter locker type: " + lockertype)
    // }

    // const onChangeKiosk = e => {
    //     console.log("in onChangeKiosk")
    //     const kiosk = e.target.value;
    //     setFilterKiosk(kiosk)
    //     console.log("filter kiosk: " + kiosk)
    // }

    return(
        <ThemeProvider theme={theme}>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <MaterialTable 
                                title="Locker List"
                                columns={columns}
                                data={data}
                                localization={{
                                    toolbar: {
                                        searchPlaceholder: "Search by ID"
                                    }
                                }}
                                options={{   
                                    //sorting: true, 
                                    filtering: true,
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
                                            tooltip: 'View Locker Details',
                                            onClick:(event, rowData) => {
                                                console.log("in onclick")
                                                history.push('/admin/lockerDetails')
                                                localStorage.setItem('lockerToView', JSON.stringify(rowData.id))
                                                }
                                            },                                
                                    ]}
                                    editable={{
                                        onRowDelete: (oldData) =>
                                            new Promise((resolve) => {
                                            handleRowDelete(oldData, resolve)
                                        }),
                                    }}
                                    //select 
                                    // components={{
                                    //     Toolbar: props => (
                                    //         <div>
                                    //             <MTableToolbar {...props}/>
                                    //                 <div style={{padding: '0px 10px'}} className="form-row">
                                    //                     <FormGroup className="col-md-3">
                                    //                         <Label for="inputLockerTypes">Filter Locker Type</Label>
                                    //                             <Input 
                                    //                             type="select" 
                                    //                             name="select" 
                                    //                             id="inputLockerTypes" 
                                    //                             value={lockerTypes} 
                                    //                             onChange={onChangeLockerType}
                                    //                             >
                                    //                                 {
                                    //                                     lockerTypes.map(lockerTypes => (
                                    //                                         <option key={lockerTypes.id}>{lockerTypes.name}</option>
                                    //                                     ))
                                    //                                 }
                                    //                             </Input>
                                    //                     </FormGroup>
                                    //                     <FormGroup className="col-md-3">
                                    //                         <Label for="inputKiosk">Filter Kiosk</Label>
                                    //                             <Input 
                                    //                             type="select" 
                                    //                             name="select" 
                                    //                             id="inputKiosk" 
                                    //                             value={kiosks} 
                                    //                             onChange={onChangeKiosk}
                                    //                             >
                                    //                                 {
                                    //                                     kiosks.map(kiosks => (
                                    //                                         <option key={kiosks.id}>{kiosks.address}</option>
                                    //                                     ))
                                    //                                 }
                                    //                             </Input>
                                    //                     </FormGroup>
                                    //                 </div>
                                    //         </div>
                                    //     ),
                                    // }}
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

export default Lockers;