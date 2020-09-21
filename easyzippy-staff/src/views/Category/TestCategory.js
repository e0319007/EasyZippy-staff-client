import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import MaterialTable from "material-table"

import {
    Row,
    Col,
    Card
} from "reactstrap";

function TestCategory() {

    const authToken = JSON.parse(Cookies.get('authToken'))

    // DECLARING COLUMNS
    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Name", field:"name"},
        {title: "Description", field:"description"}
    ]

    const[data, setData] = useState([])

    //for error handling
    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])

    useEffect(() => {
        console.log("retrieving categories;; axios")
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
    },[])

    const handleRowAdd = (newData, resolve) => {
        //validation
        let errorList = []
        if(newData.name === undefined){
            errorList.push("Please enter first name")
        }
        if(newData.description === undefined){
            errorList.push("Please enter last name")
        }
        if(errorList.length < 1){ //no error
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
                setErrorMessages([])
                setIserror(false)
                document.location.reload()
            })
            .catch(function (error) {
                setErrorMessages([error.data.response])
                setIserror(true)
                resolve()
            })
        }else{
            setErrorMessages(errorList)
            setIserror(true)
            resolve()
        }
    }

    const handleRowUpdate = (newData, oldData, resolve) => {
        //validation
        let errorList = []
        if(errorList.length < 1){
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
                resolve()
                setIserror(false)
                setErrorMessages([])
            })
            .catch(function (error) {
                setErrorMessages([error.data.response])
                setIserror(true)
                resolve()
            })
        } else{
            setErrorMessages(errorList)
            setIserror(true)
            resolve()
        }
    }

    const handleRowDelete = (oldData, resolve) => {
        axios.delete("/category/"+oldData.id,
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
                resolve()
            })
            .catch(function (error) {
            setErrorMessages([error.data.response])
            setIserror(true)
            resolve()
            })
        }

    return (
        <div className="content">
            <Row>
                <Col md = "12">
                    <Card>
                        <MaterialTable
                            title="Category"
                            columns={columns}
                            data={data}
                            options = {{
                                sorting: true
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
                    </Card>
                </Col>
            </Row>
        </div>        
    )
}

export default TestCategory;