import React, {useState, useEffect} from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import MaterialTable from "material-table"
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';

import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    CardText,
    Alert,
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    FormGroup,
    Button
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function Advertisements() {

    const authToken = JSON.parse(Cookies.get('authToken'))

    const history = useHistory()

    const[data, setData] = useState([])

    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [modal, setModal] = useState(false)
    const [inModal, isInModal] = useState(false)

    const toggle = () => setModal(!modal);

    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Title", field:"title", editable: "never"},
        {title: "Description", field:"description", editable: "never"},
        {title: "Start Date", field:"startDate", editable: "never",
            customFilterAndSearch: (term, rowData) => formatDate(rowData.startDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["createdAt"]) }</span>},
        {title: "End Date", field:"endDate", editable: "never",
            customFilterAndSearch: (term, rowData) => formatDate(rowData.endDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["createdAt"]) }</span>},
        {title: "Expired", field:"expired", editable: "never"} 
    ]

    useEffect(() => {
        console.log("retrieving approved advertisements // axios")
        axios.get("/approvedAdvertisements", {
            headers: {
                AuthToken: authToken
            }
        }).then (res => {
            setData(res.data)
        }).catch (function (error) {
            console.log(error.response.data)
        })
    }, [])

    const handleRowDelete = (oldData, resolve) => {
        axios.put("/deleteAdvertisement/"+oldData.id, {
            title: oldData.title
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
            setMsg("Advertisement successfully deleted!")
            resolve()
        })
        .catch(function (error) {

            let errormsg = error.response.data;

            if ((error.response.data).startsWith("<!DOCTYPE html>")) {
                errormsg = "An unexpected error has occurred. The Advertisement cannot be deleted."
            }

            isSuccessful(false)
            isError(true)
            setError(errormsg)
            console.log(error.response.data)
            resolve()
        })
    }   

    const createStaffAdvertisement = () => {
        //
    }

    // to use when viewing 
    function formatDate(d) {
        if (d === undefined){
            d = (new Date()).toISOString()
            console.log(undefined)
        }
        let currDate = new Date(d);
        console.log("currDate: " + currDate)
        let year = currDate.getFullYear();
        let month = currDate.getMonth() + 1;
        let dt = currDate.getDate();
        let time = currDate.toLocaleTimeString('en-SG')

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }

        return dt + "/" + month + "/" + year + " " + time ;
    }

    return(
        <ThemeProvider theme={theme}>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            <MaterialTable 
                                title="Approved Advertisements"
                                columns={columns}
                                data={data}
                                localization={{
                                    toolbar: {
                                        searchPlaceholder: "Search"
                                    }
                                }}
                                options={{   
                                    //sorting: true, 
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
                                            tooltip: 'View Advertisement Details',
                                            onClick:(event, rowData) => {
                                                console.log("in onclick")
                                                history.push('/admin/advertisementDetails')
                                                localStorage.setItem('advertisementToView', JSON.stringify(rowData.id))
                                                }
                                            },         
                                            {
                                                icon: 'add',
                                                onClick: (event, rowData) => {
                                                    toggle()
                                                },
                                                isFreeAction: true,
                                                tooltip: 'Add Button',
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
                <ModalHeader toggle={toggle}>Add Advertisement</ModalHeader>
                <ModalBody>
                    <form>
                        <FormGroup>

                        </FormGroup>
                        { inModal && err &&<Alert color="danger">{error}</Alert> }
                        { inModal && successful &&<Alert color="success">{successMsg}</Alert>}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                    </form>
                </ModalBody>
                <ModalFooter>
                <Button color="primary" onClick={createStaffAdvertisement}>Create</Button>{' '}
                </ModalFooter>
            </Modal> 
        </ThemeProvider>     
    );
}

export default Advertisements;