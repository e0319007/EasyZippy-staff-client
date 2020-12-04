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
    CardHeader, FormGroup, Label, Button
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function LockerTypeDetails() {

    const history = useHistory()
    const authTokenStaff = (JSON.parse(Cookies.get('authTokenStaff'))).toString()

    const lockerTypeId = JSON.parse(localStorage.getItem('lockerTypeToView'))


    const [data, setData] = useState([])

    useEffect(() => {
        axios.get(`/lockerType/${lockerTypeId}`, 
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            setData(res.data)
        }).catch(function(error) {
        })
    }, [authTokenStaff,lockerTypeId])

    const DisableSwitch = withStyles((theme) => ({
        root: {
            width: 28,
            height: 16,
            padding: 0,
            display: 'flex',
        },
        switchBase: {
            padding: 2,
            color: theme.palette.grey[500],
            '&$checked': {
            transform: 'translateX(12px)',
            color: theme.palette.common.white,
            '& + $track': {
                opacity: 1,
                backgroundColor: theme.palette.success.main,
                borderColor: theme.palette.success.main,
            },
            },
        },
        thumb: {
            width: 12,
            height: 12,
            boxShadow: 'none',
        },
        track: {
            border: `1px solid ${theme.palette.grey[500]}`,
            borderRadius: 16 / 2,
            opacity: 1,
            backgroundColor: theme.palette.common.white,
        },
        checked: {},
        }))(Switch);


        const handleChange = (event) => {
            setData({
                ...data,
                disabled: !event.target.checked
            })
            axios.put(`/lockerType/toggleDisable/${lockerTypeId}`, {
                disabled: !event.target.checked
            }, 
            {
                headers: {
                    AuthToken: authTokenStaff
                }
            }).then(res => {
            }).catch(function(error) {
            })
        };

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

    return (
        <>
        <ThemeProvider theme={theme}>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card className="card-name">
                            <CardHeader>
                                <div className="form-row">
                                <CardTitle className="col-md-10" tag="h5">Locker Type: {data.name}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <form>
                                    <fieldset disabled>  
                                        <FormGroup>
                                            <Label for="inputId">Id</Label>
                                            <Input
                                                type="text"
                                                id="inputId"
                                                placeholder="id number here"
                                                value={data.id}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="inputName">Name</Label>
                                            <Input
                                                type="text"
                                                id="inputName"
                                                placeholder="name here"
                                                value={data.name}
                                            />
                                        </FormGroup>
                                        <div className="form-row">
                                            <FormGroup className="col-md-4">
                                                <Label for="inputWidth">Width</Label>
                                                <Input 
                                                    type="text"
                                                    id="inputWidth"
                                                    placeholder="width here"
                                                    value={data.lockerWidth}
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-md-4">
                                                <Label for="inputLength">Length</Label>
                                                <Input 
                                                    type="text"
                                                    id="inputLength"
                                                    placeholder="width here"
                                                    value={data.lockerLength}
                                                />
                                            </FormGroup>
                                            <FormGroup className="col-md-4">
                                                <Label for="inputHeight">Height</Label>
                                                <Input 
                                                    type="text"
                                                    id="inputHeight"
                                                    placeholder="height here"
                                                    value={data.lockerHeight}
                                                />
                                            </FormGroup>
                                        </div>
                                        <FormGroup>
                                            <Label for="inputPrice">Price</Label>
                                            <Input 
                                                type="text"
                                                id="inputPrice"
                                                placeholder="price here"
                                                value={data.pricePerHalfHour}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="inputCreatedAt">Created On</Label>
                                            <Input 
                                                type="text" 
                                                id="inputCreatedAt" 
                                                placeholder="Created At" 
                                                value={formatDate(data.createdAt)}                                                    
                                                />
                                        </FormGroup>                           
                                    </fieldset>
                                    <p></p>
                                    <Row>
                                        <div className="update ml-auto mr-auto" >
                                            <Typography component="div">
                                                <Grid component="label" container alignItems="center" spacing={1}>
                                                <Grid item>Disabled</Grid>
                                                <Grid item>
                                                    <DisableSwitch checked={!data.disabled} onChange={handleChange} name="checked" />
                                                </Grid>
                                                <Grid item>Enabled</Grid>
                                                </Grid>
                                            </Typography>
                                        </div> 
                                    </Row>
                                    <Row>
                                        <Col md="12">
                                            <div className="form-add">
                                                <Button onClick={() => {
                                                    history.push('/admin/lockerType')
                                                    localStorage.removeItem('lockerTypeToView')
                                                }}> back
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </ThemeProvider>
    </>
    );

}

export default LockerTypeDetails;