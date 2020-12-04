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
    CardHeader, FormGroup, Label, Button, Alert
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function StaffDetails() {

    const history = useHistory()
    const authTokenStaff = (JSON.parse(Cookies.get('authTokenStaff'))).toString()

    const staffId = JSON.parse(localStorage.getItem('staffToView'))


    const [data, setData] = useState([])


    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [staffRoleEnum, setStaffRoleEnum] = useState(data.staffRoleEnum)
    const [staffRolesEnum, setStaffRolesEnum] = useState([])

  

    useEffect(() => {
        axios.get(`/staff/${staffId}`, 
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            setData(res.data)
            setStaffRoleEnum(res.data.staffRoleEnum)
        }).catch (function(error) {
        })

        axios.get('/staff/staffRoles', {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then (res => {
            setStaffRolesEnum(res.data)
        }).catch()
    },[authTokenStaff,staffId])

    const onChangeStaffRoleEnum = e => {
        const staffRoleEnum = e.target.value;
        setStaffRoleEnum(staffRoleEnum)
    }

    const updateStaffDetails = e => {
        e.preventDefault()
        axios.put(`/staff/staffRole/${staffId}`, {
            staffRole: staffRoleEnum
        }, 
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then((response) => {
            setStaffRoleEnum(response.data[1][0].staffRoleEnum)
            setData(response.data[1][0])
            isError(false)
            isSuccessful(true)
            setMsg("Staff Role updated successfully!")
        }).catch(function(error) {
            isError(true)
            setError(error.response.data)
            isSuccessful(false)
        })
    }



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
        axios.put(`/staff/${staffId}/toggleDisable`, {
            disabled: !event.target.checked
        },
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
        }).catch (function(error) {
        })
    };

    // to use when viewing 
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

    return(
        <>
            <ThemeProvider theme={theme}>
                <div className="content">
                    <Row>
                        <Col md = "12">
                            <Card className="card-name">
                                <CardHeader>
                                    <div className="form-row">
                                    <CardTitle className="col-md-10" tag="h5">{data.firstName}{' '}{data.lastName}</CardTitle>
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
                                        </fieldset>
                                        <fieldset>
                                            <FormGroup>
                                                <Label for="inputStaffRoleEnun">Role</Label>
                                                    <Input 
                                                    type="select" 
                                                    name="select" 
                                                    id="inputStaffRoleEnun" 
                                                    value={staffRoleEnum} 
                                                    onChange={onChangeStaffRoleEnum}
                                                    >
                                                        {
                                                            staffRolesEnum.map(staffRoleEnum => (
                                                                <option key={staffRoleEnum.id}>{staffRoleEnum}</option>
                                                            ))
                                                        }
                                                    </Input>
                                            </FormGroup>
                                        </fieldset>
                                        <fieldset disabled>
                                            <div className="form-row">
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputEmail">Email</Label>
                                                    <Input 
                                                        type="text" 
                                                        id="inputEmail" 
                                                        placeholder="Email"
                                                        value={data.email}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputMobileNumber">Mobile Number</Label>
                                                    <Input 
                                                        type="text" 
                                                        id="inputMobileNumber" 
                                                        placeholder="Mobile Number"
                                                        value={data.mobileNumber}
                                                        />
                                                </FormGroup>  
                                            </div>
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
                                                <Button color="success" size="sm" type="submit" onClick={updateStaffDetails}>Update</Button>
                                            </div>
                                        </Row>
                                        {err &&<Alert color="danger">{error}</Alert> }
                                        {successful &&<Alert color="success">{successMsg}</Alert>}  
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
                                                        history.push('/admin/staffs')
                                                        localStorage.removeItem('staffToView')
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

export default StaffDetails;