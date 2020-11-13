import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';
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
import { data } from "jquery";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function MallPromotionDetails() {

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()
    console.log(authToken)

    const promotionId = JSON.parse(localStorage.getItem('promotionToView'))
    const [data, setData] = useState([])
    const [staff, setStaff] = useState([])
    const [expireMsg, setExpireMsg] = useState()
    


    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [promoCode, setPromoCode] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [termsAndConditions, setTermsAndConditions] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [percentageDiscount, setPercentageDiscount] = useState('')
    const [flatDiscount, setFlatDiscount] = useState('')
    const [discount, setDiscount] = useState('')
    const [usageLimit, setUsageLimit] = useState('')
    const [minimumSpend, setMinimumSpend] = useState('')

   
    const staffId = parseInt(Cookies.get('staffUser'))
    
    

    useEffect(() => {
        axios.get(`/promotion/${promotionId}`, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setData(res.data)

            setPromoCode(res.data.promoCode)
            setTitle(res.data.title)
            setDescription(res.data.description)
            setTermsAndConditions(res.data.termsAndConditions)
            setStartDate((res.data.startDate).substr(0,10))
            setEndDate((res.data.endDate).substr(0,10))
            setPercentageDiscount(res.data.percentageDiscount)
            setFlatDiscount(res.data.flatDiscount)
            setDiscount(res.data.discount)
            setUsageLimit(res.data.usageLimit)
            setMinimumSpend(res.data.minimumSpend)

            if (res.data.expired) {
                setExpireMsg(" : Expired")
            }
            axios.get("/staff", 
            {
                headers: {
                    AuthToken: authToken
                }
            }).then(res => {
                setStaff(res.data)
                console.log("staff: " + res.data)
               
            }).catch(err => console.error(err))
        }).catch (function (error) {
            console.log(error.response.data)
        })
    },[])

    const onChangePromoCode = e => {
        const promoCode = e.target.value
        setPromoCode(promoCode)
    }
    const onChangeTitle = e => {
        const title = e.target.value
        setTitle(title)
    }
    const onChangeDescription = e => {
        const description = e.target.value
        setDescription(description)
    }
    const onChangeTermsAndConditions = e => {
        const termsAndConditions = e.target.value
        setTermsAndConditions(termsAndConditions)
    }
    const onChangeStartDate = e => {
        const startDate = e.target.value
        setStartDate(startDate)
    }
    const onChangeEndDate = e => {
        const endDate = e.target.value
        setEndDate(endDate)
    }
    const onChangeDiscount = e => {
        const discount = e.target.value
        if (discount.trim().length === 0) {
            setError("Discount is a required field")
            isError(true)
        } else if (discount.indexOf('$') > 0 || discount.indexOf('%') > 0) {
            setError("Please enter the discount without a '$' or '%' sign")
            isError(true)
        } else {
            var nums = /^\d+(,\d{3})*(\.\d{1,2})?$/gm
            if (!discount.match(nums)) { //if not all numbers
                setError("Please enter a valid discount value")
                isError(true)
            } else {
                isError(false)
            }
        } 
        setDiscount(discount)
    }
    const onChangeUsageLimit = e => {
        const usageLimit = e.target.value

        var nums = /^[0-9]+$/
        if (!usageLimit.match(nums)) { //if not all numbers
            setError("Please enter a valid usage limit")
            isError(true)
        } else {
            isError(false)
        }
    
        setUsageLimit(usageLimit)
    }
    const onChangeMinimumSpend = e => {
        const minimumSpend = e.target.value
        if (minimumSpend.indexOf('$') > 0) {
            setError("Please enter the minimum spend without a '$'sign")
            isError(true)
        } else {
            var nums = /^\d+(,\d{3})*(\.\d{1,2})?$/gm
            if (!minimumSpend.match(nums)) { //if not all numbers
                setError("Please enter a valid minimum spend value")
                isError(true)
            } else {
                isError(false)
            }
        } 
        setMinimumSpend(minimumSpend)
    }

    const updateMallPromotion = e => {
        e.preventDefault()
        var startd = startDate
        startd = startd.toString().replace('/-/g', '/')
        console.log("start: " + startd)

        var enddate = endDate
        enddate = enddate.toString().replace('/-/g', '/')

        console.log("promo code: " + promoCode)

        axios.put(`/promotion/${promotionId}`, {
            promoCode: promoCode,
            title: title,
            description: description, 
            termsAndConditions: termsAndConditions,
            startDate: startd,
            endDate: enddate,
            percentageDiscount: percentageDiscount,
            flatDiscount: flatDiscount,
            usageLimit: usageLimit,
            minimumSpend: minimumSpend,
            staffId: staffId
        }, 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setPromoCode(res.data[1][0].promoCode)
            setTitle(res.data[1][0].title)
            setDescription(res.data[1][0].description)
            setTermsAndConditions(res.data[1][0].termsAndConditions)
            setStartDate((res.data[1][0].startDate).substr(0,10))
            setEndDate((res.data[1][0].endDate).substr(0,10))
            setPercentageDiscount(res.data[1][0].percentageDiscount)
            setFlatDiscount(res.data[1][0].flatDiscount)
            setUsageLimit(res.data[1][0].usageLimit)
            setMinimumSpend(res.data[1][0].minimumSpend)

            // setPromoCode(res.data.promoCode)
            // setTitle(res.data.title)
            // setDescription(res.data.description)
            // setTermsAndConditions(res.data.termsAndConditions)
            // setStartDate((res.data.startDate).substr(0,10))
            // setEndDate((res.data.endDate).substr(0,10))
            // setPercentageDiscount(res.data.percentageDiscount)
            // setFlatDiscount(res.data.getFullYear)
            // setUsageLimit(res.data.usageLimit)
            // setMinimumSpend(res.data.minimumSpend)

            console.log("update promo axios call went through")
            console.log("promo code: " + res.data[1][0].promoCode)
            

            isError(false)
            isSuccessful(true)
            setMsg("Mall Promotion successfully updated!")
        }).catch(function (error) {
            isSuccessful(false)
            isError(true)
            setError(error)
            console.log(error)
        })
    }

    //match staff id to staff name
    function getStaffName(id) {
        for (var i in staff) {
            if (staff[i].id === id) {
                return staff[i].firstName + " " + staff[i].lastName
            }
        }
    }

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

        return dt + "/" + month + "/" + year + " " + time;
        
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
                                    <CardTitle className="col-md-10" tag="h5">Mall Promotion Details (ID: {data.id}) {expireMsg}</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <form>
                                        <fieldset disabled>    
                                            <FormGroup>
                                                <Label for="inputPromoCode">Promo Code</Label>
                                                <Input
                                                    type="text"
                                                    id="inputPromoCode"
                                                    placeholder="-"
                                                    value={promoCode}
                                                    onChange={onChangePromoCode}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputTitile">Title</Label>
                                                <Input
                                                    type="text"
                                                    id="inputTitile"
                                                    placeholder="-"
                                                    value={title}
                                                    onChange={onChangeTitle}
                                                />
                                            </FormGroup>
                                            </fieldset>
                                            <fieldset>
                                            <FormGroup>
                                                <Label for="inputDescription">Description</Label>
                                                <Input
                                                    type="textarea"
                                                    id="inputDescription"
                                                    placeholder="-"
                                                    value={description}
                                                    onChange={onChangeDescription}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputTermsAndConditions">Terms and Conditions</Label>
                                                <Input
                                                    type="textarea"
                                                    id="inputTermsAndConditions"
                                                    placeholder="-"
                                                    value={termsAndConditions}
                                                    onChange={onChangeTermsAndConditions}
                                                />
                                            </FormGroup>
                                            </fieldset>
                                            <fieldset disabled>
                                            <div className="form-row">
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputStartDate">Start Date</Label>
                                                    <Input
                                                        type="date"
                                                        id="inputStartDate"
                                                        placeholder="-"
                                                        value={startDate}
                                                        onChange={onChangeStartDate}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputEndDate">End Date</Label>
                                                    <Input
                                                        type="date"
                                                        id="inputEndDate"
                                                        placeholder="-"
                                                        value={endDate}
                                                        onChange={onChangeEndDate}
                                                    />
                                                </FormGroup>
                                            </div>
                                            <FormGroup>
                                            <Label for="inputPercentageDiscount">Percentage Discount (%)</Label>
                                                <Input
                                                    type="text"
                                                    id="inputPercentageDiscount"
                                                    placeholder="-"
                                                    value={percentageDiscount}                                               
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                            <Label for="inputFlatDiscount">Flat Discount ($)</Label>
                                                <Input
                                                    type="text"
                                                    id="inputFlatDiscount"
                                                    placeholder="-"
                                                    value={flatDiscount}                                               
                                                />
                                            </FormGroup>                                                                            
                                            <div className="form-row">
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputUsageLimit">Usage Limit</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputUsageLimit"
                                                        placeholder="-"
                                                        value={usageLimit}
                                                        onChange={onChangeUsageLimit}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="col-md-6">
                                                    <Label for="inputMinimumSpend">Minimum Spend ($)</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputMinimumSpend"
                                                        placeholder="-"
                                                        value={parseFloat(minimumSpend).toFixed(2)}
                                                        onChange={onChangeMinimumSpend}
                                                    />
                                                </FormGroup>
                                            </div>
           
                                                <div className="form-row">
                                                    <FormGroup className="col-md-6">
                                                        <Label for="inputCreatedAt">Created On</Label>
                                                        <Input
                                                            type="text"
                                                            id="inputCreatedAt"
                                                            placeholder="-"
                                                            value={formatDate(data.createdAt)}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup className="col-md-6">
                                                        <Label for="inputExpired">Expired</Label>
                                                        <Input
                                                            type="text"
                                                            id="inputExpired"
                                                            placeholder="-"
                                                            value={data.expired}
                                                        />
                                                    </FormGroup>
                                                </div>
                                                <FormGroup>
                                                    <Label for="inputName">Created By</Label>
                                                    <Input
                                                        type="text"
                                                        id="inputName"
                                                        placeholder="-"
                                                        value={getStaffName(data.staffId)}
                                                    />
                                                </FormGroup>   
                                                {err &&<Alert color="danger">{error}</Alert> }
                                                {successful &&<Alert color="success">{successMsg}</Alert>}                               
                                            </fieldset>                                                
                                            <Row>
                                                <div className="update ml-auto mr-auto" >
                                                    <Button color="success" size="sm" type="submit" onClick={updateMallPromotion}>Update Mall Promotion</Button>
                                                </div>
                                            </Row>    
                                            <Row>
                                            <Col md="12">
                                                <div className="form-add">
                                                    <Button onClick={() => {
                                                        history.push('/admin/promotions')
                                                        localStorage.removeItem('promotionToView')
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

export default MallPromotionDetails;