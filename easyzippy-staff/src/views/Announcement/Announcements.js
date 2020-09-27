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

    const authToken = JSON.parse(Cookies.get('authToken'))
    const staffid = parseInt(Cookies.get('staffUser'))

    // DECLARING COLUMNS,, don't let time be editable
    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Title", field:"title"},
        {title: "Description", field:"description"}, 
        {title: "Date Created", field:"sentTime", editable: "never", 
            // render: row => <span>{ formatDate(row["sentTime"]) }</span>
        }
    ]

    const[data, setData] = useState([])

    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    useEffect(() => {
        console.log("retrieving announcements // axios")
        axios.get("/announcements", 
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

    // announcement creation
    const handleRowAdd = (newData, resolve) => {
        //validation: if title is empty
        if(newData.title === undefined || newData.title === ""){
            isError(true)
            setError("Unable to add new announcement. Please fill in the title field.")
            isSuccessful(false)
            resolve()
            return;
        } 
        let today = new Date().toISOString()
        alert(today)
        // today = "2020-09-25T08:05:04.709Z"
        axios.post("/announcement", {
            title: newData.title,
            staffId: staffid,
            description: newData.description,
            // SEE WHAT HAPPENS WHEN I PASS THE STRING BACK (see if need to do the plus +08:00 styff)
            sentTime: today.toString()
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
            setMsg("Announcement successfully created!")
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
            setMsg("Announcement successfully updated!")
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
        axios.delete("/announcement/"+oldData.id,
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
            setMsg("Announcement successfully deleted!")
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

// to use when viewing 
function formatDate(d) {
    let currDate = new Date(d);
    let year = currDate.getFullYear();
    let month = currDate.getMonth() + 1;
    let dt = currDate.getDate();
    let time = currDate.toISOString().replace(/^[^:]*([0-2]\d:[0-5]\d).*$/, "$1");

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }

    return year + "/" + month + "/" + dt + " " + time + ":00";
}

export default Announcements;