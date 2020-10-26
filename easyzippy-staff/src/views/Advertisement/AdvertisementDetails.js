import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from "@material-ui/core";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import {
    Card,
    CardBody,
    CardTitle,
    Row,
    Col,
    Input,
    CardHeader, FormGroup, Label, Button, Tooltip, Modal, ModalBody, ModalHeader
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function AdvertisementDetails() {

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()
    console.log(authToken)

    const advertisementId = JSON.parse(localStorage.getItem('advertisementToView'))

    const [data, setData] = useState([])
    const [image, setImage] = useState()

    useEffect(() => {
        console.log("getting advertisements axios")
        axios.get(`/advertisement/${advertisementId}`, {
            headers: {
                AuthToken: authToken
            }
        }).then (res => {
            setData(res.data)

            axios.get(`/assets/${res.data.image}`, {
                responseType: 'blob'
            },
            {
                headers: {
                    AuthToken: authToken,
                    'Content-Type': 'application/json'
                }
            }).then (response => {
                console.log('axios images thru')
                var file = new File([response.data], {type:"image/png"})
                let image = URL.createObjectURL(file)
                setImage(image)
            }).catch(function (error) {
                console.log(error.response.data)
            })
        }).catch(function(error) {
            console.log(error.response.data)
        })
    }, [])

    //show certain fields interchangeably depending on who created the ad
        // > if staff_id != null, show that
        // > if merchant_id != null, show that
        // > if advertiser mobile || advertiser email != null, show those

    return (
        <>
        </>
    )
}

export default AdvertisementDetails;