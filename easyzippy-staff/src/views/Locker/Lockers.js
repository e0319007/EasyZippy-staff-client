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

    // DECLARING COLUMNS (created at can put inside details)
    var columns = [
        {title: "Id", field: "id", editable: "never"},
        {title: "Locker Status", field:"lockerStatus"},
        {title: "Locker Type", field:"lockerType"},
        {title: "Kiosk", field:"kiosk"},
        {title: "Disabled", field:"disabled"}
    ]

    const[data, setData] = useState([])

    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    useEffect(() => {
        console.log("retrieving lockers // axios")
        axios.get("/lockers", 
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

    

    return(
        <>
            <div className="content">

            </div>
        </>
    );
}

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

export default Lockers;