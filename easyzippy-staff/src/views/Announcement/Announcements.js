import React, {useState, useEffect} from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import MaterialTable from "material-table"
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

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

function Announcements() {

    const authTokenStaff = JSON.parse(Cookies.get('authTokenStaff'))
    const staffid = parseInt(Cookies.get('staffUser'))

    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Title", field:"title"},
        {title: "Description", field:"description"}, 
        {title: "Date Created", field:"createdAt", editable: "never", 
            customFilterAndSearch: (term, rowData) => formatDate(rowData.createdAt).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["createdAt"]) }</span>
        }
    ]

    const[data, setData] = useState([])

    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    useEffect(() => {
        axios.get("/announcements", 
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            setData(res.data)
        })
        
    },[authTokenStaff])

    const handleRowAdd = (newData, resolve) => {
        
        if(newData.title === undefined || newData.title === ""){
            isError(true)
            setError("Unable to add new announcement. Please fill in the title field.")
            isSuccessful(false)
            resolve()
            return;
        } 
        axios.post("/announcement", {
            title: newData.title,
            staffId: staffid,
            description: newData.description,
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
            setMsg("Announcement successfully created!")
            document.location.reload()
        })
        .catch(function (error) {
            isSuccessful(false)
            isError(true)
            setError(error.response.data)
            resolve()
        })
    }

    const handleRowUpdate = (newData, oldData, resolve) => {
        if(newData.title === undefined || newData.title === ""){
            isError(true)
            setError("Unable to update. Please fill in the title field for " + oldData.title + " announcement entry")
            isSuccessful(false)
            resolve()
            return;
        }
        axios.put("/announcement/"+oldData.id, {
            title: newData.title,
            description: newData.description
        },
        {
            headers: {
                AuthToken: authTokenStaff
            }
        })
        .then(res => {
            const dataUpdate = [...data];
            const index = oldData.tableData.id;
            dataUpdate[index] = newData;
            setData([...dataUpdate]);
            isError(false)
            isSuccessful(true)
            setMsg("Announcement successfully updated!")
            resolve()
        })
        .catch(function (error) {
            isSuccessful(false)
            isError(true)
            setError(error.response.data)
            resolve()
        })
    }

    const handleRowDelete = (oldData, resolve) => {
        axios.delete("/announcement/"+oldData.id,
        {
        headers: {
            AuthToken: authTokenStaff
        }
    }).then(res => {
            const dataDelete = [...data];
            const index = oldData.tableData.id;
            dataDelete.splice(index, 1);
            setData([...dataDelete]);
            isError(false)
            isSuccessful(true)
            setMsg("Announcement successfully deleted!")
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
            resolve()
        })
    }   

    return(
        <ThemeProvider theme={theme}>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                        <MaterialTable 
                                title="Announcement List"
                                columns={columns}
                                data={data}
                                options={{   
                                    filtering:true,
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

function formatDate(d) {
    if (d === undefined){
        d = (new Date()).toISOString()
    }
    let currDate = new Date(d);
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

export default Announcements;