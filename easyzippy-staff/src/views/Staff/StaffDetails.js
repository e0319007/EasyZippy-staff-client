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

function StaffDetails() {

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()
    console.log(authToken)

    const staffId = JSON.parse(localStorage.getItem('staffToView'))
    const [data, setData] = useState([])

    const staff = JSON.parse(localStorage.getItem('currentStaff'))
    const staffid = parseInt(Cookies.get('staffUser'))

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')


    //const [staffRoleEnum, setStaffRoleEnum] = useState(staff.staffRoleEnum)

    const staff_toupdate = {
        //staffRoleEnum: '',
    }


    const onChangeStaffRoleEnum = e => {
        const staffRoleEnum = e.target.value;
        //setStaffRoleEnum(staffRoleEnum.trim())
        setData(staffRoleEnum.trim())
    }

    const [staffRoles, setStaffRoles] = useState([])

    useEffect(() => {
        console.log("axios getting staffroles")
        axios.get('/staff/staffRoles', 
        {    
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setStaffRoles(res.data)
            console.log("staff roles " + res.data)
        }).catch(err => console.error(err))
    },[])

    const updateStaffDetails = e => {
        e.preventDefault()
        console.log("*** in update staff")
        axios.put(`staff/${staffid}`, {
            //staffRoleEnum: staffRoleEnum,
        }, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then((response) => {
            //setStaffRoleEnum(response.data.staffRoleEnum)
            //staff_toupdate.staffRoleEnum = response.data.staffRoleEnum
            localStorage['currentStaff'] = JSON.stringify(staff_toupdate)

            isSuccessful(true)
            setMsg("Staff updated successfully!")
        }).catch(function (error) {
            isError(true)
            setError(error.response.data)
            isSuccessful(false)
        })
    }

    useEffect(() => {
        axios.get(`/staff/${staffId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data)
        }).catch (function(error) {
            console.log(error.response.data)
        })
    },[])

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

    let enabled = !data.disabled
    console.log("Enabled: " + enabled)

    const handleChange = (event) => {
        console.log("event.target.checked: " + event.target.checked)
        setData({
            ...data,
            disabled: !event.target.checked
        })
        axios.put(`/staff/${staffId}/toggleDisable`, {
            disabled: !event.target.checked
        },
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            console.log("axios call went through")
        }).catch (function(error) {
            console.log(error.response.data)
        })
    };

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
                                                <Label for="staffRoleEnum">Role</Label>
                                                    <Input type="select" name="select" id="staffRoleEnum" value={data.staffRoleEnum} onChange={onChangeStaffRoleEnum}>
                                                        <option>Admin</option>
                                                        <option>Employee</option>
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
                                            <div className="update ml-auto mr-auto" >
                                                <Button color="success" size="sm" type="submit" onClick={updateStaffDetails}>Update</Button>
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