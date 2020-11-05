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
    CardHeader, FormGroup, Label, Button, CardImg, Tooltip, Alert
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

    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    //tooltip
    const [tooltipOpenApproval, setTooltipApproval] = useState(false);
    const toggleTooltipApproval = () => setTooltipApproval(!tooltipOpenApproval);

    const [approval, setApproval] = useState(true) //this is for on/off

    const [title, setTitle] = useState()
    const [description, setDescription] = useState()
    const [advertiserUrl, setAdvertiserUrl] = useState()
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [amountPaid, setAmountPaid] = useState()
    const [expired, setExpired] = useState()
    const [advertiserMobile, setAdvertiserMobile] = useState()
    const [advertiserEmail, setAdvertiserEmail] = useState()
    const [approved, setApproved] = useState() //for true/false
    const [staffId, setStaffId] = useState()
    const [merchantId, setMerchantId] = useState()

    const [canApprove, setCanApprove] = useState(true) 
    const [expireMsg, setExpireMsg] = useState()

    useEffect(() => {
        console.log("getting advertisements axios")
        axios.get(`/advertisement/${advertisementId}`, {
            headers: {
                AuthToken: authToken
            }
        }).then (res => {
            setData(res.data)

            setTitle(res.data.title)
            setDescription(res.data.description)
            setAdvertiserUrl(res.data.advertiserUrl)
            setStartDate((res.data.startDate).substr(0,10))
            setEndDate((res.data.endDate).substr(0,10))
            setAmountPaid(res.data.amountPaid)
            setExpired(res.data.expired)

            if (res.data.expired) { //if expired
                setExpireMsg(" : Expired")
            }

            setAdvertiserMobile(res.data.advertiserMobile)
            setAdvertiserEmail(res.data.advertiserEmail)

            //have to check the start date, compare to today's date and if start date is over
            //should not allow them to approve
            let startArray = res.data.startDate.substr(0,10).split("-") 
            var pastdate = new Date(startArray[0], startArray[1]-1, startArray[2])
            console.log(pastdate)
            var today = new Date()

            console.log(today > pastdate)
            
            if (today > pastdate) {
                setCanApprove(false)
            } else {
                setCanApprove(true)
            }

            setApproved(res.data.approved)
            setStaffId(res.data.staffId)
            setMerchantId(res.data.merchantId)

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

    const onChangeTitle = e => {
        const title = e.target.value;

        if (title.trim().length == 0) {
            setError("Title is a required field")
            isError(true)
        } else {
            isError(false)
        }

        setTitle(title)
    }

    const onChangeDescription = e => {
        const description = e.target.value;

        if (description.trim().length == 0) {
            setError("Description is a required field")
            isError(true)
        } else {
            isError(false)
        }

        setDescription(description)
    }
    
    const onChangeStartDate = e => {
        const startDate = e.target.value;
        setStartDate(startDate)
    }

    const onChangeEndDate = e => {
        const endDate = e.target.value;
        setEndDate(endDate)
    }
    
    const onChangeAdvertiserMobile = e => {
        const mobile = e.target.value;

        var nums = /^[0-9]+$/
        if (!mobile.match(nums)) { //if not all numbers
            setError("Please enter a valid mobile number")
            isError(true)
        } else {
            isError(false)
        }

        setAdvertiserMobile(mobile.trim())
    }
    
    const onChangeAdvertiserEmail = e => {
        const email = e.target.value;
        setAdvertiserEmail(email.trim())
    }

    const onChangeAdvertiserUrl = e => {
        const url = e.target.value;
        setAdvertiserUrl(url.trim())
    }

    const onChangeAmountPaid = e => {
        const amountPaid = e.target.value;

        var nums = /^[0-9]+$/
        if (!amountPaid.match(nums)) { //if not all numbers
            setError("Please enter a valid amount")
            isError(true)
        } else {
            isError(false)
        }
        
        setAmountPaid(amountPaid.trim())
    }

    const updateAdvertisement = e => {
        e.preventDefault()
        //add validation

        if (title === undefined || title === "") {
            isError(true)
            isSuccessful(false)
            setError("Title field is required")
            return;
        }

        if (description === undefined || description === "") {
            isError(true)
            isSuccessful(false)
            setError("Description field is required")
            return;
        }

        var startd = startDate
        startd = startd.toString().replace('/-/g', '/')
        console.log(startd)

        var enddate = endDate
        enddate = enddate.toString().replace('/-/g', '/')
        console.log(enddate)

        if (startd === undefined || startd === "") {
            isError(true)
            setError("Unable to update advertisement. Please select a Start Date.")
            isSuccessful(false)
            return;
        }

        if (enddate === undefined || enddate === "") {
            isError(true)
            setError("Unable to update advertisement. Please select an End Date.")
            isSuccessful(false)
            return;
        }

        axios.put(`/advertisement/${advertisementId}`, {
            title: title, 
            description: description,
            advertiserUrl: advertiserUrl,
            startDate: startd,
            endDate: enddate,
            amountPaid: amountPaid,
            advertiserMobile: advertiserMobile,
            advertiserEmail: advertiserEmail
        },
        {
            headers: {
                AuthToken: authToken,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            
            setTitle(res.data[1][0].title)
            setDescription(res.data[1][0].description)
            setAdvertiserUrl(res.data[1][0].advertiserUrl)
            setStartDate((res.data[1][0].startDate).substr(0,10))
            setEndDate((res.data[1][0].endDate).substr(0,10))
            setAmountPaid(res.data[1][0].amountPaid)
            setExpired(res.data[1][0].expired)
            setAdvertiserMobile(res.data[1][0].advertiserMobile)
            setAdvertiserEmail(res.data[1][0].advertiserEmail)
            setStaffId(res.data[1][0].staffId)
            setMerchantId(res.data[1][0].merchantId)

            console.log("update ad axios went through")

            //set to approved if it can be approved
            if (approval === true && canApprove === true) {
                axios.put(`/approveAdvertisement/${advertisementId}`, {
                    headers: {
                        AuthToken: authToken
                    }
                }).then(res => {
                    console.log("approval axios went through")
                    console.log("data: " + res.data.approved)
                    setData(res)
                    setApproval(res.data.approved)
                    setApproved(res.data.approved)
                    // window.location.reload()

                }).catch (function(error) {
                    let errormsg = error.response.data;
    
                    if ((error.response.data).startsWith("<!DOCTYPE html>")) {
                        errormsg = "An unexpected error has occurred. The Advertisement cannot be approved."
                    }

                    isSuccessful(false)
                    console.log(error.response.data)
                    isError(true)
                    setError(errormsg)
                })
            }
            isSuccessful(true)
            isError(false)
            setMsg("Advertisement successfully updated!")
        }).catch (function (error) {
            let errormsg = error.response.data;
    
            if ((error.response.data).startsWith("<!DOCTYPE html>")) {
                errormsg = "An unexpected error has occurred. The Advertisement cannot be updated."
            }

            isSuccessful(false)
            console.log(error.response.data)
            isError(true)
            setError(errormsg)
        })
    }

    const onApprovalChange = e => {
        console.log(e.target.checked)
        setApproval(e.target.checked) //"on" == true i.e. yes approved
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

        let enabled = !data.disabled
        console.log("Enabled: " + enabled)

        const handleChange = (event) => {
            console.log("event.target.checked: " + event.target.checked)
            setData({
                ...data,
                disabled: !event.target.checked
            })
            axios.put(`/advertisement/toggleDisable/${advertisementId}`, {
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
                isError(true)
                isSuccessful(false)
                setError(error.response.data)
            })
        };

    return (
        <>
            <ThemeProvider theme={theme}>
            <div className="content">
                    <Row>
                        <Col md = "12">
                            <Card className="card-name">
                                <CardHeader>
                                    <div className="form-row">
                                    <CardTitle className="col-md-10" tag="h5">Advertisement Details (ID: {data.id}) {expireMsg}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <form>
                                        <div className="text-center">
                                            <CardImg style={{width:"15rem"}} top src={image} alt="..."/>
                                        </div>
                                        <fieldset>  
                                            <FormGroup>
                                                <Label for="inputTitle">Title</Label>
                                                <Input
                                                    type="text"
                                                    id="inputTitle"
                                                    placeholder="title here"
                                                    value={title}
                                                    onChange={onChangeTitle}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputDescription">Description</Label>
                                                <Input
                                                    type="textarea"
                                                    id="inputDescription"
                                                    placeholder="description here"
                                                    value={description}
                                                    onChange={onChangeDescription}
                                                />
                                            </FormGroup>
                                            {advertiserUrl !== null &&
                                                <FormGroup>
                                                    <Label for="inputAdvertiserUrl">Advertiser URL</Label>
                                                    <Input 
                                                        type="text"
                                                        id="inputAdvertiserUrl"
                                                        placeholder="advertiser url here"
                                                        value={advertiserUrl}
                                                        onChange={onChangeAdvertiserUrl}
                                                    />
                                                </FormGroup>
                                            }
                                            {amountPaid !== null && staffId === null && 
                                                <FormGroup>
                                                    <Label for="inputAmountPaid">Amount Paid</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputAmountPaid"
                                                        placeholder="input amount paid here"
                                                        value={amountPaid}
                                                        onChange={onChangeAmountPaid}
                                                    />
                                                </FormGroup>
                                            }
                                            {advertiserMobile !== null && advertiserEmail !== null &&
                                                <div className = "form-row"> 
                                                    <FormGroup className="col-md-6">
                                                        <Label for="inputAdvertiserMobile">Advertiser Mobile</Label>
                                                        <Input
                                                            type="text"
                                                            id="inputAdvertiserMobile"
                                                            placeholder="input advertiser mobile here"
                                                            value={advertiserMobile}
                                                            onChange={onChangeAdvertiserMobile}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup className="col-md-6">
                                                        <Label for="inputAdvertiserEmail">Advertiser Email</Label>
                                                        <Input
                                                            type="text"
                                                            id="inputAdvertiserEmail"
                                                            placeholder="input advertiser email here"
                                                            value={advertiserEmail}
                                                            onChange={onChangeAdvertiserEmail}
                                                        />
                                                    </FormGroup>
                                                </div>                                              
                                            }
                                            </fieldset>
                                            {staffId !== null &&
                                                <fieldset disabled>
                                                    <FormGroup>
                                                        <Label for="inputStaffId">Staff ID</Label>
                                                        <Input 
                                                            type="text" 
                                                            id="inputStaffId" 
                                                            placeholder="staff id" 
                                                            value={staffId}                                                    
                                                            />
                                                    </FormGroup> 
                                                </fieldset>                                                 
                                            }                                       
                                            {merchantId !== null &&
                                                <fieldset disabled>
                                                    <FormGroup>
                                                        <Label for="inputMerchantId">Merchant ID</Label>
                                                        <Input 
                                                            type="text" 
                                                            id="inputMerchantId" 
                                                            placeholder="merchant id" 
                                                            value={merchantId}                                                    
                                                            />
                                                    </FormGroup> 
                                                </fieldset>   
                                            }       
                                            <div className="form-row"> 
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputStartDate">Start Date</Label>
                                                    <Input
                                                        type="date"
                                                        id="inputStartDate"
                                                        placeholder="start date here"
                                                        value={startDate}
                                                        onChange={onChangeStartDate}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputEndDate">End Date</Label>
                                                    <Input
                                                        type="date"
                                                        id="inputEndDate"
                                                        placeholder="end date here"
                                                        value={endDate}
                                                        onChange={onChangeEndDate}
                                                    />
                                                </FormGroup>
                                            </div>
                                            {canApprove && staffId === null && 
                                                <fieldset>
                                                    <div className="form-row">
                                                        <FormGroup className="col-md-6 ml-4 form-row">
                                                            <Label for="approvalStatus" check>
                                                                <Input disabled={approved} defaultChecked={approved} type="checkbox" id="approvalStatus" style={{width:"20px",height:"20px"}} onChange={onApprovalChange}/>{' '}
                                                                <p style={{...padding(7, 0, 0, 10)}}>Approve Advertisement</p>
                                                            </Label>  
                                                            <Tooltip placement="bottom" isOpen={tooltipOpenApproval} target="approvalStatus" toggle={toggleTooltipApproval}>
                                                                Once approved, the advertisement cannot be unapproved.
                                                            </Tooltip>  
                                                        </FormGroup>                            
                                                    </div>                    
                                                </fieldset> 
                                            }
                                        <Row>
                                            <div className="update ml-auto mr-auto" >
                                                <Button color="success" size="sm" type="submit" onClick={updateAdvertisement}>Update Advertisement</Button>
                                            </div>
                                        </Row>
                                        <Row>
                                            <p></p>
                                        </Row>             
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
                                        {err &&<Alert color="danger">{error}</Alert> }
                                        {successful &&<Alert color="success">{successMsg}</Alert>}
                                        <Row>
                                            <Col md="12">
                                                <div className="form-add">
                                                    <Button onClick={() => {
                                                        history.push('/admin/advertisements')
                                                        localStorage.removeItem('advertisementToView')
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
    )
}

function padding(a, b, c, d) {
    return {
        paddingTop: a,
        paddingRight: b ? b : a,
        paddingBottom: c ? c : a,
        paddingLeft: d ? d : (b ? b : a)
    }
}

export default AdvertisementDetails;