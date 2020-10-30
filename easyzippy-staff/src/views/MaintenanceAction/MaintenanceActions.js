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
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    Label,
    FormGroup,
    UncontrolledAlert,
    ModalFooter,
    Button
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});


function MaintenanceActions() {

    const authToken = JSON.parse(Cookies.get('authToken'))

    const history = useHistory()

    // DECLARING COLUMNS
    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Maintenance Date", field: "maintenanceDate",
            customFilterAndSearch: (term, rowData) => formatDate(rowData.maintenanceDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["maintenanceDate"]) }</span>,
            // editComponent: props => (
            //     <input
            //         type='text'
            //         placeholder={formatDate(props.value)}
            //         onChange={e => props.onChange(e.target.value)}
            //     />
            // )
        },
        {title: "Description", field:"description"},
        {title: "Locker Id", field:"lockerId"}
    ]

    const[data, setData] = useState([])
    const [lockers, setLockers] = useState([])

    const [maintenanceDate, setMaintenanceDate] = useState('')
    const [description, setDescription] = useState('')
    const [lockerId, setLockerId] = useState('')

    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [modal, setModal] = useState(false)
    const [inModal, isInModal] = useState(false)

    const toggle = () => setModal(!modal, setError(false), isSuccessful(false))

    useEffect(() => {
        console.log("retrieving maintenance actions;; axios")
        axios.get("/maintenanceActions", 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            console.log(res.data)
            setData(res.data)

            axios.get("/lockers", 
            {
                headers: {
                    AuthToken: authToken
                }
            }).then(res => {
                setLockers(res.data)
            }).catch(err => console.error(err))
        })
        .catch (err => console.error(err))
    },[authToken])

    const addMaintenanceAction = e => {
        var d = maintenanceDate
        d = d.toString().replace('/-/g', '/')

        if (d === undefined || d === "") {
            isInModal(true)
            isError(true)
            setError("Unable to create new maintenance advertisement. Please fill in the maintenance date field.")
            isSuccessful(false)
            return;
        }

        if(lockerId === undefined || lockerId === "") {
            isInModal(true)
            isError(true)
            setError("Unable to create new maintenance advertisement. Please fill in the locker Id field.")
            isSuccessful(false)
            return;
        }

        axios.post("/maintenanceAction", {
            maintenanceDate: d,
            description: description,
            lockerId: lockerId,
        }, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            isInModal(true)
            isError(false)
            isSuccessful(true)
            setMsg("Maintenance action added successfully")
            document.location.reload()
        }).catch(function (error) {
            let errormsg = error.response.data;
    
            if ((error.response.data).startsWith("<!DOCTYPE html>")) {
                errormsg = "An unexpected error has occurred. The Advertisement cannot be deleted."
            }
            console.log(error.response.data)
            isInModal(true)
            isError(true)
            setError(errormsg)
            isSuccessful(false)
        })
    }


    const onChangeMaintenanceDate = e => {
        const maintenanceDate = e.target.value
        setMaintenanceDate(maintenanceDate)
    }

    const onChangeDescription = e => {
        const description = e.target.value
        setDescription(description)
    }

    const onChangeLockerId = e => {
        const lockerId = e.target.value
        setLockerId(lockerId)
    }

 

    // const handleRowAdd = (newData, resolve) => {
    //     // validation: if name is empty
    //     if(newData.maintenanceDate === undefined || newData.maintenanceDate === ""){
    //         //console.log("main date: " + newData.maintenanceDate)
    //         isError(true)
    //         setError("Unable to add new maintenance action. Please fill in the maintenance date field in YYYY/MM/DD format.")
    //         isSuccessful(false)
    //         resolve()
    //         return;
    //     } else {
    //         //yyyy/mm/dd
    //         var date = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/

    //         if (!newData.maintenanceDate.match(date)) {
    //             setError("Please enter a valid date in YYYY/MM/DD format")
    //             isError(true)
    //             isSuccessful(false)
    //             resolve()
    //             return;
    //         } else {
    //             isError(false)
    //         }
    //     }

    //     if (newData.lockerId === undefined || newData.lockerId === "") {
    //         isError(true)
    //         setError("Unable to add new maintenance action. Please fill in the locker Id field.")
    //         isSuccessful(false)
    //         resolve()
    //         //return;
    //     } else {
    //         var nums = /^[0-9]+$/
    //         if (!newData.lockerId.match(nums)) {
    //             setError("Locker Id must be a number")
    //             isError(true)
    //             isSuccessful(false)
    //             resolve()
    //             return;
    //         } else {
    //             isError(false)
    //     }
    // }

    //     axios.post("/maintenanceAction", {
    //         maintenanceDate: newData.maintenanceDate,
    //         description: newData.description,
    //         lockerId: newData.lockerId   
    //     },
    //     {
    //         headers: {
    //             AuthToken: authToken
    //         }
    //     })
    //     .then(res => {
    //         console.log("axios call went through")
    //         let dataToAdd = [...data];
    //         dataToAdd.push(newData);
    //         setData(dataToAdd);
    //         resolve()
    //         isError(false)
    //         isSuccessful(true)
    //         setMsg("Maintenance action successfully added!")
    //         document.location.reload()
    //     })
    //     .catch(function (error) {
    //         isSuccessful(false)
    //         isError(true)
    //         setError(error.response.data)
    //         console.log(error.response.data)
    //         resolve()
    //     })
    // }

    const handleRowUpdate = (newData, oldData, resolve) => {
        //need to add validation for update date

        // if(newData.maintenanceDate === undefined || newData.maintenanceDate === ""){
        //     isError(true)
        //     setError("Unable to update new maintenance action. Please fill in the maintenance date field in YYYY/MM/DD format.")
        //     isSuccessful(false)
        //     resolve()
        //     return;
        // } else {
        //     //yyyy/mm/dd
        //     var date = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/

        //     if (!newData.maintenanceDate.match(date)) {
        //         setError("Please enter a valid date in YYYY/MM/DD format")
        //         isError(true)
        //         isSuccessful(false)
        //         resolve()
        //         //return;
        //     } else {
        //         isError(false)
        //         resolve()
        //         //return;
        //     }
        // }
        


        // if (newData.lockerId === undefined || newData.lockerId === "") {
        //     isError(true)
        //     setError("Unable to update maintenance action. Please fill in the locker Id field.")
        //     isSuccessful(false)
        //     resolve()
        //     return;
        // } else {
        //     var nums = /^[0-9]+$/
        //     if (!newData.lockerId.match(nums)) {
        //         setError("Locker Id must be a number")
        //         isError(true)
        //         isSuccessful(false)
        //         resolve()
        //         return;
        //     } else {
        //         isError(false)
        //     }
        // }

        axios.put("/maintenanceAction/"+oldData.id, {
            maintenanceDate: newData.maintenanceDate,
            description: newData.description,
            lockerId: newData.lockerId
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
            setMsg("Maintenance action successfully updated!")
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
        axios.put("/deleteMaintenanceAction/"+oldData.id, {
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
                setMsg("Maintenance action successfully deleted!")
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
    // to use when viewing 
    function formatDate(d) {
        if (d === undefined){
            d = (new Date()).toISOString()
            console.log(undefined)
        }
        let currDate = new Date(d);
        let year = currDate.getFullYear();
        let month = currDate.getMonth() + 1;
        let dt = currDate.getDate();

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }
        // console.log("getDate: " + dt)

        // console.log("checking format date: " + dt + "/" + month + "/" + year)
        return dt + "/" + month + "/" + year;
        //return year + "/" + month + "/" + dt;
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <MaterialTable 
                                title="Maintenance Actions List"
                                columns={columns}
                                data={data}
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
                                editable={{
                                //     onRowUpdate: (newData, oldData) =>
                                //     new Promise((resolve) => {
                                //         handleRowUpdate(newData, oldData, resolve);
                                // }),     
                                //     onRowAdd: (newData) =>
                                //         new Promise((resolve) => {
                                //         handleRowAdd(newData, resolve)
                                // }),
                                    onRowDelete: (oldData) =>
                                        new Promise((resolve) => {
                                        handleRowDelete(oldData, resolve)
                                }),

                                }}
                                actions={[
                                    {
                                    icon: 'info',
                                    tooltip: 'View Maintenance Action Details',
                                    onClick:(event, rowData) => {
                                        console.log("in onclick")
                                        history.push('/admin/maintenanceActionDetails')
                                        localStorage.setItem('maintenanceActionToView', JSON.stringify(rowData.id))
                                        }
                                    },
                                    {
                                        icon:'add', 
                                        onClick: (event, rowData) => {
                                            toggle()
                                        }, 
                                        isFreeAction: true,
                                        tooltip: 'Add'
                                    }                                
                                
                                ]}
                            />
                            { !inModal && err &&<Alert color="danger">{error}</Alert> }
                            { !inModal && successful &&<Alert color="success">{successMsg}</Alert>}
                        </Card>
                    </Col>
                </Row>
            </div>   
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Add Maintenance Action</ModalHeader>
                <ModalBody>
                    <form>
                        <FormGroup>
                            <Label for="inputMaintenanceDate">Maintenance Date</Label>
                                <Input
                                    type="date"
                                    id="inputMaintenanceDate"
                                    placeholder="Maintenance Date"
                                    value={maintenanceDate}
                                    onChange={onChangeMaintenanceDate}
                                />
                        </FormGroup>
                        <FormGroup>
                            <Label for="inputDescription">Description</Label>
                                <Input
                                    type="textarea"
                                    id="inputDescription"
                                    placeholder="Description"
                                    value={description}
                                    onChange={onChangeDescription}
                                />
                        </FormGroup>
                        <FormGroup>
                            <Label for="inputLocker">Locker Id</Label>
                                <Input
                                    type="select"
                                    id="inputLocker"
                                    value={lockerId}
                                    onChange={onChangeLockerId}
                                >
                                    <option>[select]</option>
                                    {
                                        lockers.map(locker => (
                                            <option key={locker.id}>{locker.id}</option>
                                        ))
                                    }
                                </Input>
                        </FormGroup>
                        { inModal && err && <UncontrolledAlert color="danger">{error}</UncontrolledAlert> }
                        { inModal && successful && <UncontrolledAlert color="success">{successMsg}</UncontrolledAlert> }
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={addMaintenanceAction}>Create</Button>{' '}
                </ModalFooter>
            </Modal>
        </ThemeProvider>     
    )
}

export default MaintenanceActions;