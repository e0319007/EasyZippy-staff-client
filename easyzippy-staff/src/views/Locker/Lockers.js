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
    FormGroup, 
    Label,
    Input,
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    UncontrolledAlert
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function Lockers() {

    const authTokenStaff = JSON.parse(Cookies.get('authTokenStaff'))

    const history = useHistory()

    const[data, setData] = useState([])
    const [kiosks, setKiosks] = useState([])
    const [lockerTypes, setLockerTypes] = useState([])



    const [kioskId, setKioskId] = useState()
    const [kiosk, setKiosk] = useState()

    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [modal, setModal] = useState(false)
    const [inModal, isInModal] = useState(false)

    const toggle = () => setModal(!modal, setError(false), isSuccessful(false));

    const [newLockerType, setNewLockerType] = useState('');
    const [newLockerTypeId, setNewLockerTypeId] = useState('');
    const [lockerCode, setLockerCode] = useState('')

    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Locker Code", field: "lockerCode", editable: "never"},
        {title: "Locker Status", field:"lockerStatusEnum", editable: "never", searchable: false, lookup:{Empty: "Empty", InUse: "In Use"}},
        {title: "Locker Type", field:"lockerTypeId", editable: "never", searchable: false,
            customFilterAndSearch: (term, rowData) => getLockerType(rowData.lockerTypeId).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ getLockerType(row["lockerTypeId"]) }</span>},
        {title: "Kiosk", field:"kioskId", editable: "never", searchable: false,
            customFilterAndSearch: (term, rowData) => getKioskName(rowData.kioskId).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ getKioskName(row["kioskId"]) }</span>},
        {title: "Disabled", field:"disabled", editable: "never", lookup:{false: "Enabled", true: "Disabled" }},
    ]

    useEffect(() => {
        axios.get("/lockers", 
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            setData(res.data)

            axios.get("/kiosks", 
            {
                headers: {
                    AuthToken: authTokenStaff
                }
            }).then(response => {
                setKiosks(response.data)
            }).catch ()

            axios.get("/lockerTypes", {
                headers: {
                    AuthToken: authTokenStaff
                }
            }).then(response => {
                setLockerTypes(response.data)
            }).catch ()

        })
 
    },[authTokenStaff])

    const handleRowDelete = (oldData, resolve) => {
        axios.put("/deleteLocker/"+oldData.id, {
            name: oldData.name
        },
        {
        headers: {
            AuthToken: authTokenStaff
        }
    }).then(res => {
            const dataDelete = [...data];
            const index = oldData.tableData.id;
            dataDelete.splice(index, 1);
            setData([...dataDelete]);
            isInModal(false)
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
            isInModal(false)
            isSuccessful(false)
            isError(true)
            setError(errormsg)
            resolve()
        })
    }   

    function getKioskName(id) {
        for (var i in kiosks) {
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

    const addLocker = e => {
        axios.post("/locker", {
            lockerTypeId: newLockerTypeId,
            kioskId: kioskId,
            lockerCode: lockerCode
        },
        {
        headers: {
            AuthToken: authTokenStaff
        }
    }).then((response) => {
        isInModal(true)
        isError(false)
        isSuccessful(true)
        setMsg("locker added successfully!")
        document.location.reload()
    }).catch(function (error) {
        isInModal(true)
        isError(true)
        setError(error.response.data)
        isSuccessful(false)
    })
    }

    const onChangeNewLockerType = e => {
        setNewLockerType(e.target.value)
        const lockerType = getLockerId(e.target.value);
        setNewLockerTypeId(lockerType)
    }

    const onChangeKiosk = e => {
        setKiosk(e.target.value)
        const kioskid = getKioskId(e.target.value)
        setKioskId(kioskid)
    }

    const onChangeLockerCode = e => {
        const lockerCode = e.target.value
        setLockerCode(lockerCode)
    }

    function getKioskId(address) {
        for (var i in kiosks) {
            if ((kiosks[i].address).toLowerCase() === address.trim().toLowerCase()) {
                return kiosks[i].id
            }
        }
    }

    function getLockerId(name) {
        for (var i in lockerTypes) {
            if ((lockerTypes[i].name).toLowerCase() === name.trim().toLowerCase()) {
                return lockerTypes[i].id
            }
        }
    }

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
                                    search: false,
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
                                                history.push('/admin/lockerDetails')
                                                localStorage.setItem('lockerToView', JSON.stringify(rowData.id))
                                                }
                                            },          
                                            {
                                                icon: 'add',
                                                onClick: (event, rowData) => {
                                                    toggle()
                                                },
                                                isFreeAction: true,
                                                tooltip: 'Add',
                                            }                                 
                                    ]}
                                    editable={{
                                        onRowDelete: (oldData) =>
                                            new Promise((resolve) => {
                                            handleRowDelete(oldData, resolve)
                                        })
                                    }}
                            />
                            { !inModal && err &&<Alert color="danger">{error}</Alert> }
                            { !inModal && successful &&<Alert color="success">{successMsg}</Alert>}
                        </Card>
                    </Col>
                </Row>
            </div>   
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Add Locker</ModalHeader>
                <ModalBody>
                    <form>
                        <FormGroup>
                            <Label for="inputKiosk">Kiosk</Label>
                            <Input
                                type="select"
                                id="inputKiosk"
                                value={kiosk}
                                onChange={onChangeKiosk}
                            >
                                <option>[select]</option>
                                {
                                    kiosks.map(k => (
                                        <option key={k.id}>{k.address}</option>
                                    ))
                                }
                            </Input>
                        </FormGroup>
                        <FormGroup>
                        <Label for="inputNewLockerType">Locker Type</Label>
                            <Input
                                type="select"
                                id="inputNewLockerType"
                                value={newLockerType}
                                onChange={onChangeNewLockerType}
                            >
                                <option>[select]</option>
                                {
                                    lockerTypes.map(newLockerType => (
                                        <option key={newLockerType.id}>{newLockerType.name}</option>
                                    ))
                                }
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="inputLockerCode">Locker Code</Label>
                            <Input
                                type="text"
                                id="inputLockerCode"
                                value={lockerCode}
                                onChange={onChangeLockerCode}
                            />
                        </FormGroup>
                        { inModal && err &&<UncontrolledAlert color="danger">{error}</UncontrolledAlert> }
                        { inModal && successful &&<UncontrolledAlert color="success">{successMsg}</UncontrolledAlert>}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                    </form>
                </ModalBody>
                <ModalFooter>
                <Button color="primary" onClick={addLocker}>Create</Button>{' '}
                </ModalFooter>
            </Modal> 
        </ThemeProvider>     
    );
}

export default Lockers;