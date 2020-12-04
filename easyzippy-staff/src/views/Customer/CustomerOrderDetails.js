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
    CardHeader, FormGroup, Label, Button, Alert, Table, Modal, ModalHeader, ModalFooter
} from "reactstrap";


const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function CustomerOrderDetails() {

    const history = useHistory()
    const authTokenStaff = (JSON.parse(Cookies.get('authTokenStaff'))).toString()
    

    const orderId = JSON.parse(localStorage.getItem('orderToView'))

    const [order, setOrder] = useState([])
    const [items, setItems] = useState([])

    const [customers, setCustomers] = useState([])
    const [promotions, setPromotions] = useState([])


    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    //for delete confirmation
    const [modal, setModal] = useState(false)
    const toggle = () => setModal(!modal)


    useEffect(() => {
        axios.get(`/order/${orderId}`,
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            setOrder(res.data.order)
            setItems(res.data.items)

     
        }).catch()


        axios.get("/customers", 
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            setCustomers(res.data)
        }).catch()

        axios.get("/promotions",
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            setPromotions(res.data)
        }).catch()
    },[authTokenStaff,orderId])

    const cancelOrder = e => {
        e.preventDefault()

        axios.post(`/order/cancel/${orderId}`, 
        {
            id: orderId
        },
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then(res => {
            isSuccessful(true)
            setMsg("Order successfully cancelled!")
        }).catch(function (error) {
        
        })
    }

    //match customer id to customer name
    function getCustomerName(id) {
        for (var i in customers) {
            if (customers[i].id === id) {
                return customers[i].firstName + " " + customers[i].lastName
            }
        }
    }
    //match promoIdUsed to promocode 
    function getPromoCode(id) {
        for (var i in promotions) {
            if (promotions[i].id === id) {
                return promotions[i].promoCode
            }
        }
    }

  

   

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
                                    <CardTitle className="col-md-10" tag="h5">Order Details (ID: {order.id})</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <form>
                                        <fieldset disabled>
                                            <FormGroup>
                                                <Label for="inputName">Customer Name</Label>
                                                <Input
                                                    type="text"
                                                    id="inputName"
                                                    placeholder="-"
                                                    value={getCustomerName(order.customerId)}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputPromoCode">Promotion Code Used (if any)</Label>
                                                <Input
                                                    type="text"
                                                    id="inputPromoCode"
                                                    placeholder="-"
                                                    value={getPromoCode(order.promoIdUsed)}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputTotalAmount">Total Amount ($)</Label>
                                                <Input
                                                    type="text"
                                                    id="inputTotalAmount"
                                                    placeholder="-"
                                                    value={parseFloat(order.totalAmount).toFixed(2)}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputOrderDate">Order Date</Label>
                                                <Input
                                                    type="text"
                                                    id="inputOrderDate"
                                                    placeholder="-"
                                                    value={formatDate(order.orderDate)}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputCollectionMethod">Collection Method</Label>
                                                <Input
                                                    type="text"
                                                    id="inputCollectionMethod"
                                                    placeholder="-"
                                                    value={order.collectionMethodEnum}
                                                />
                                            </FormGroup>
                                        </fieldset>
                                        <Table hover responsive>
                                            <thead>
                                                <th>Product Name</th>
                                                <th>Price ($)</th>
                                                <th>Quantity</th>
                                            </thead>
                                            <tbody>
                                                {items.length > 0 && items.map((item,i) => (
                                                    <tr>      
                                                        <td>{item.product ? item.product.name : item.productVariation.name}</td>
                                                        <td>{item.product ? item.product.unitPrice : item.productVariation.unitPrice}</td>
                                                        <td>{item.quantity}</td>
                                                    </tr>
                                                ))}         
                                            </tbody>
                                        </Table>
                   
                                        <Row>
                                            <div className="update ml-auto mr-auto" >
                                                <Button color="danger" size="sm" onClick={toggle}>Cancel Order</Button>                                              
                                            </div>
                                        </Row>
                                        {successful &&<Alert color="success">{successMsg}</Alert>} 
                                        <Row>
                                            <Col md="12">
                                                <div className="form-add">
                                                    <Button onClick={() => {
                                                        history.push('/admin/customerDetails')
                                                        localStorage.removeItem('orderToView')
                                                    }}>back
                                                    </Button>
                                                </div>
                                            </Col>
                                        </Row> 
                                    </form>
                                </CardBody>
                                <Modal isOpen={modal} toggle={toggle}>
                                    <ModalHeader toggle={toggle}>Are you sure you want to cancel this order?</ModalHeader>
                                    <ModalFooter style={{display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center"}}>
                                            <Button color="danger" onClick={cancelOrder}>Yes</Button>
                                            {'  '}
                                            <Button color="secondary" onClick={toggle}>No</Button>
                                    </ModalFooter>
                                </Modal>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </ThemeProvider>
        </>
    );
}

export default CustomerOrderDetails;