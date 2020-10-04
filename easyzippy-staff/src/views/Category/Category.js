import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import MaterialTable from "material-table"
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

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

function Category() {

    const authToken = JSON.parse(Cookies.get('authToken'))

    // DECLARING COLUMNS
    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Name", field:"name"},
        {title: "Description", field:"description"}, 
        
    ]

    const[data, setData] = useState([])

    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    useEffect(() => {
        console.log("retrieving categories // axios")
        axios.get("/categories", 
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
        if(newData.name === undefined || newData.name === ""){
            isError(true)
            setError("Unable to add new category. Please fill in the name field.")
            isSuccessful(false)
            resolve()
            return;
        }
        axios.post("/category", {
            name: newData.name,
            description: newData.description
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
            setMsg("Category successfully added!")
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
        if(newData.name === undefined || newData.name === ""){
            isError(true)
            setError("Unable to update. Please fill in the name field for " + oldData.name + " category entry")
            isSuccessful(false)
            resolve()
            return;
        }
        axios.put("/category/"+oldData.id, {
            name: newData.name,
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
            setMsg("Category successfully updated!")
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
        axios.put("/deleteCategory/"+oldData.id, {
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
                setMsg("Category successfully deleted!")
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
                                title="Category List"
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
    )
}

export default Category;