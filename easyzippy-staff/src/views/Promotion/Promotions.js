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
    Alert,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    Label,
    FormGroup,
    UncontrolledAlert,
    ModalFooter,
    Button,
    CustomInput,
    InputGroup,
    InputGroupAddon,
    InputGroupText
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});


function Promotions() {

    const authToken = JSON.parse(Cookies.get('authToken'))

    const history = useHistory()

    // DECLARING COLUMNS
    var mallColumns = [
        {title: "Id", field: 'id'},
        {title: "Promo Code", field: "promoCode"}, 
        {title: "Title", field: "title"},
        {title: "Start Date", field: "startDate", 
            customFilterAndSearch: (term, rowData) => formatDate(rowData.startDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["startDate"]) }</span>},
        {title: "End Date", field: "endDate", 
            customFilterAndSearch: (term, rowData) => formatDate(rowData.endDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["endDate"]) }</span>},
        {title: "Expired", field:"expired", lookup:{false: "Not Expired", true: "Expired"}}          
    ]

    var merchantColumns = [
        {title: "Id", field: 'id'},
        {title: "Merchant", field:"merchantId", 
            customFilterAndSearch: (term, rowData) => getMerchantName(rowData.merchantId).toLowerCase().includes(term.toLowerCase()), 
            render: row => <span>{getMerchantName(row["merchantId"])}</span>},
        {title: "Promo Code", field: "promoCode"}, 
        {title: "Title", field: "title"},
        {title: "Start Date", field: "startDate", 
            customFilterAndSearch: (term, rowData) => formatDate(rowData.startDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["startDate"]) }</span>},
        {title: "End Date", field: "endDate", 
            customFilterAndSearch: (term, rowData) => formatDate(rowData.endDate).toLowerCase().includes(term.toLowerCase()),
            render: row => <span>{ formatDate(row["endDate"]) }</span>},
        {title: "Expired", field:"expired", lookup:{false: "Not Expired", true: "Expired"}}          
    ]

    const [mallData, setMallData] = useState([])
    const [merchantData, setMerchantData] = useState([])
    const [merchants, setMerchants] = useState([])
    
    const [promoCode, setPromoCode] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [termsAndConditions, setTermsAndConditions] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [discount, setDiscount] = useState('')
    const [usageLimit, setUsageLimit] = useState('')
    const [minimumSpend, setMinimumSpend] = useState('')

    const [isPercentage, setIsPercentage] = useState(true)
    const [isFlat, setIsFlat] = useState(false)

    const staffId = parseInt(Cookies.get('staffUser'))

    const [viewMall, setViewMall] = useState(true)
    
    //for error handling
    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [modal, setModal] = useState(false)
    const [inModal, isInModal] = useState(false)

    const toggle = () => setModal(!modal, setError(false), isSuccessful(false));


    useEffect(() => {
        axios.get("/promotion/mall", 
        {
            headers: {
                AuthToken: authToken
            }
        }).then(res => {
            setMallData(res.data)

            axios.get("/promotion/merchant", {
                headers: {
                    AuthToken: authToken
                }
            }).then (res => {
                setMerchantData(res.data)
            }).catch (function (error) {
                console.log(error.response.data)
            })
        }).catch(function (error) {
            console.log(error.response.data)
        })

        axios.get("/merchants", 
        {
            headers: {
                AuthToken:authToken
            }
        }).then(res => {
            setMerchants(res.data)
        })
    },[])

    //match merchant id to merchant name
    function getMerchantName(id) {
        for (var i in merchants) {
            if (merchants[i].id === id) {
                return merchants[i].name
            }
        }
    }

    const addMallPromotion = e => {
        var startd = startDate
        startd = startd.toString().replace('/-/g', '/')
        console.log("start: " + startd)

        var enddate = endDate
        enddate = enddate.toString().replace('/-/g', '/')
    
        isInModal(true)
        isSuccessful(false)

        //add validation
        if (promoCode === undefined || promoCode === "") {
            isError(true)
            setError("Unable to create new mall promotion. Please fill in the promo code field.")
            return;
        }

        if (startd === undefined || startd === "") {
            isError(true)
            setError("Unable to create new mall promotion. Please select a start date.")
            return;  
        }

        if (enddate === undefined || enddate === "") {
            isError(true)
            setError("Unable to create new mall promotion. Please select an end date.")
            return;  
        }

        var nums = /^\d+(,\d{3})*(\.\d{1,2})?$/gm
        if (!discount.match(nums)) { //if not all numbers
            setError("Unable to create new mall promotion. Please enter a valid discount value.")
            isError(true)
            return;
        } 

        if (!usageLimit.match(nums)) { //if not all numbers
            setError("Unable to create new mall promotion. Please enter a valid usage limit.")
            isError(true)
            return;
        }

        if (minimumSpend.indexOf('$') > 0) {
            setError("Please enter the minimum spend without a '$'sign")
            isError(true)
        } else {
            if (!minimumSpend.match(nums)) { //if not all numbers
                setError("Please enter a valid minimum spend value")
                isError(true)
            } 
        } 

        let startArray = startDate.split("-") 
        var pastdate = new Date(startArray[0], startArray[1]-1, startArray[2])
        var today = new Date()
        //if start date is before today, dont allow to create
        if (today > pastdate) {
            //invalid = true
            isError(true)
            setError("Unable to create promotion where Start Date is before today")
            isSuccessful(false)
            return;
        }

        var percentageDiscount = null
        var flatDiscount = null

        if (isPercentage) {
            percentageDiscount = discount
        } else if (isFlat) {
            flatDiscount = discount
        }

        axios.post("/promotion/mall", {
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
            console.log("create promo axios call went through")
            isInModal(true)
            isError(false)
            isSuccessful(true)
            setMsg("Mall Promotion successfully created!")
            document.location.reload()
        }).catch(function (error) {
            isInModal(true)
            isSuccessful(false)
            isError(true)
            setError(error.response.data)
            console.log(error.response.data)
        })
    }

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
        isInModal(true)
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
        isInModal(true)
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
        isInModal(true)
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

    const onChangeRadioPercentage = e => {
        const checked = e.target.checked
        console.log("percentage checked: " + checked)
        setIsPercentage(checked)
        setIsFlat(!checked)
    }

    const onChangeRadioFlat = e => {
        const checked = e.target.checked
        console.log("flat checked: " + checked)
        setIsPercentage(!checked)
        setIsFlat(checked)
    }

    const handleRowDelete = (oldData, resolve) => {
        axios.put("/deletePromotion/"+oldData.id, {
            title: oldData.title
        },
        {
        headers: {
            AuthToken: authToken
        }
    }).then(res => {
            console.log("axios call went through")
            const dataDelete = [...mallData];
            const index = oldData.tableData.id;
            dataDelete.splice(index, 1);
            setMallData([...dataDelete]);
            isInModal(false)
            isError(false)
            isSuccessful(true)
            setMsg("Promotion successfully deleted!")
            resolve()
        })
        .catch(function (error) {

            let errormsg = error.response.data;

            if ((error.response.data).startsWith("<!DOCTYPE html>")) {
                errormsg = "An unexpected error has occurred. The Advertisement cannot be deleted."
            }
            isInModal(false)
            isSuccessful(false)
            isError(true)
            setError(errormsg)
            console.log(error.response.data)
            resolve()
        })
    }

    // to use when viewing 
    function formatDate(d) {
        //console.log(d)
        if (d === undefined){
            d = (new Date()).toISOString()
            console.log(undefined)
        }
        let currDate = new Date(d);
        let year = currDate.getFullYear();
        let month = currDate.getMonth() + 1;
        let dt = currDate.getDate();
        //let time = currDate.toLocaleTimeString('en-SG')

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }

        return dt + "/" + month + "/" + year;
    }
    return (
        <ThemeProvider theme={theme}>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card>
                            {viewMall && <MaterialTable  
                                title="Mall Promotions List"
                                columns={mallColumns}
                                data={mallData}
                                options={{
                                    
                                    filtering: true,
                                    headerStyle: {
                                        backgroundColor: '#98D0E1', 
                                        color: '#FFF',
                                        fontWeight: 1000,
                                    },
                                    actionsColumnIndex: -1
                                }}
                                actions={[
                                    {
                                        icon: 'info',
                                        tooltip: "View Mall Promotion Details",
                                        onClick: (event, rowData) => {
                                            history.push('/admin/mallPromotionDetails')
                                            localStorage.setItem('promotionToView', JSON.stringify(rowData.id))
                                        }
                                    },
                                    {
                                        icon: 'add',
                                        onClick: () => {
                                            toggle()
                                        },
                                        isFreeAction: true,
                                        tooltip: 'Add',
                                    },
                                    {
                                        icon: 'sort',
                                        onClick: () => {
                                            setViewMall(false)
                                        },
                                        isFreeAction: true,
                                        tooltip: 'Click to view merchant promotions'
                                    }
                                ]}
                                editable={{
                                    onRowDelete: (oldData) =>
                                        new Promise((resolve) => {
                                        handleRowDelete(oldData, resolve)
                                    })
                                }}
                            />
                            }
                            {!viewMall && 
                                <MaterialTable
                                title="Merchant Promotions List"
                                columns={merchantColumns}
                                data={merchantData}
                                options={{           
                                    filtering: true,
                                    headerStyle: {
                                        backgroundColor: '#98D0E1', 
                                        color: '#FFF',
                                        fontWeight: 1000,
                                    },
                                    actionsColumnIndex: -1
                                }}
                                actions={[
                                    {
                                        icon: 'info',
                                        tooltip: "View Merchant Promotion Details",
                                        onClick: (event, rowData) => {
                                            history.push('/admin/merchantPromotionDetails')
                                            localStorage.setItem('promotionToView', JSON.stringify(rowData.id))
                                        }
                                    },
                                    {
                                        icon: 'sort',
                                        onClick: () => {
                                            setViewMall(true)
                                        },
                                        isFreeAction: true,
                                        tooltip: 'Click to view merchant promotions'
                                    }
                                ]}
                                // editable={{
                                //     onRowDelete: (oldData) =>
                                //         new Promise((resolve) => {
                                //         handleRowDelete(oldData, resolve)
                                //     })
                                // }}
                                />
                            }
                            { !inModal && err &&<Alert color="danger">{error}</Alert> }
                            { !inModal && successful &&<Alert color="success">{successMsg}</Alert>}       
                        </Card>
                    </Col>
                </Row>
            </div>   
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Add Mall Promotion</ModalHeader>
                <ModalBody>
                    <form>
                        <FormGroup>
                            <Label for="inputPromoCode">Promo Code</Label>
                            <Input 
                                type="text"
                                id="inputPromoCode"
                                placeholder="Promo Code"
                                value={promoCode}
                                onChange={onChangePromoCode}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="inputTitile">Titile</Label>
                            <Input 
                                type="text"
                                id="inputTitile"
                                placeholder="Titile"
                                value={title}
                                onChange={onChangeTitle}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="inputDescription">Description</Label>
                                <Input 
                                    type="textarea" 
                                    id="inputDescription" 
                                    placeholder="Description"
                                    value={description}
                                    onChange={onChangeDescription}
                                />
                        </FormGroup>
                        <FormGroup>
                            <Label for="inputTermsAndConditions">Terms and Conditions</Label>
                                <Input 
                                    type="textarea" 
                                    id="inputTermsAndConditions" 
                                    placeholder="Terms and Conditions"
                                    value={termsAndConditions}
                                    onChange={onChangeTermsAndConditions}
                                />
                        </FormGroup>
                        <div className="form-row">
                            <FormGroup className="col-md-6">
                                <Label for="inputStartDate">Start Date</Label>
                                    <Input 
                                        type="date" 
                                        id="inputStartDate" 
                                        placeholder="Start Date"
                                        value={startDate}
                                        onChange={onChangeStartDate}
                                    />
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label for="inputEndDate">End Date</Label>
                                    <Input 
                                        type="date" 
                                        id="inputEndDate" 
                                        placeholder="End Date"
                                        value={endDate}
                                        onChange={onChangeEndDate}
                                    />
                            </FormGroup>
                        </div>
                        <div className="form-row">
                            <FormGroup className="col-md-6" check>
                                <Label check for="percentageRadio">
                                <Input 
                                    type="radio" 
                                    id="percentageRadio" 
                                    checked={isPercentage}
                                    onChange={onChangeRadioPercentage}
                                    style={{...padding(15,0,0,0)}}
                                    />
                                Percentage Discount (%)</Label>
                            </FormGroup>
                            <FormGroup className="col-md-6" check>
                                <Label check for="flatRadio">
                                <Input 
                                    type="radio" 
                                    id="flatRadio" 
                                    checked={isFlat}
                                    onChange={onChangeRadioFlat}
                                    style={{...padding(15,0,0,0)}}
                                    />
                                Flat Discount ($)</Label>
                            </FormGroup>
                        </div>
                        <div className="form-row">
                            <FormGroup className="col-md-12">
                                <Label for="inputDiscount"></Label>
                                    <Input 
                                        type="text" 
                                        id="inputDiscount" 
                                        placeholder="Discount"
                                        value={discount}
                                        onChange={onChangeDiscount}
                                    />
                            </FormGroup>
                        </div>
                        <div className="form-row">
                            <FormGroup className="col-md-6">
                                <Label for="inputUsageLimit">Usage Limit</Label>
                                    <Input 
                                        type="text" 
                                        id="inputUsageLimit" 
                                        placeholder="Usage Limit"
                                        value={usageLimit}
                                        onChange={onChangeUsageLimit}
                                    />
                            </FormGroup>
                            <FormGroup className="col-md-6">
                                <Label for="inputMinimumSpend">Minimum Spend ($)</Label>
                                    <Input 
                                        type="text" 
                                        id="inputMinimumSpend" 
                                        placeholder="Minimum Spend"
                                        value={minimumSpend}
                                        onChange={onChangeMinimumSpend}
                                    />
                            </FormGroup>
                        </div>
                        { inModal && err &&<Alert color="danger">{error}</Alert> }
                        { inModal && successful &&<Alert color="success">{successMsg}</Alert>} 
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={addMallPromotion}>Create</Button>{' '}
                </ModalFooter>
            </Modal>
        </ThemeProvider>     
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

export default Promotions;