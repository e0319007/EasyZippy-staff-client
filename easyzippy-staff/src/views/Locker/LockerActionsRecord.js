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
    Input,
    Button, Modal, ModalHeader, ModalBody, Tooltip, ModalFooter,
    UncontrolledAlert
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function LockerActionsRecord() {

    const authTokenStaff = JSON.parse(Cookies.get('authTokenStaff'))

    const history = useHistory()

    const[data, setData] = useState([])
    const lockerId = JSON.parse(localStorage.getItem('lockerToView'))



    // DECLARING COLUMNS (created at can put inside details)
    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Locker Action", field: "lockerActionEnum", editable: "never"},
        {title: "Time Stamp", field: "timestamp",
            customFilterAndSearch: (term, rowData) => formatDate(rowData.timestamp).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["timestamp"]) }</span>,
        }
    ]
 
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

    useEffect(() => {
        axios.get(`/lockerActions/${lockerId}`, 
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
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
                                title="Locker Actions Record List"
                                columns={columns}
                                data={data}
                                localization={{
                                    toolbar: {
                                        searchPlaceholder: "Search by ID"
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
                            />
        
                        </Card>
                    </Col>
                </Row>
            </div>   
            
        </ThemeProvider>     
    );
}

export default LockerActionsRecord;