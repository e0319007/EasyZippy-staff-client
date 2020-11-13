import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
// react plugin used to create charts

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
  ListGroup,
  ListGroupItem
} from "reactstrap";
// core components


function Dashboard() {

  const authToken = (JSON.parse(Cookies.get('authToken'))).toString()

  const [merchantLength, setMerchantLength] = useState('')
  const [customerLength, setCustomerLength] = useState('')
  const [staffLength, setStaffLength] = useState('')
  const [advertisementLength, setAdvertisementLength] = useState('')
  const [customerBookingLength, setCustomerBookingLength] = useState('')
  const [merchantBookingLength, setMerchantBookingLength] = useState('')
  const [mallPromoLength, setMallPromoLength] = useState('')
  const [merchantPromoLength, setMerchantPromoLength] = useState('')
  const [notifications, setNotifications] = useState([])
  const [announcements, setAnnouncements] = useState([])

  useEffect(() => {

    axios.get('/customers', {
      headers: {
          AuthToken: authToken
      }
    }).then(res => {
      console.log("successfully retrieve customers")
      setCustomerLength(res.data.length)

    }).catch( function(error) {
      console.log(error.response)
    })

    axios.get('/merchants', {
      headers: {
          AuthToken: authToken
      }
    }).then(res => {
      console.log("successfully retrieve merchants")
      setMerchantLength(res.data.length)
    }).catch( function(error) {
      console.log(error.response)
    })

    axios.get('/staff', {
      headers: {
        AuthToken: authToken
      }
    }).then(res => {
      setStaffLength(res.data.length)
    }).catch( function(error) {
      console.log(error.response)
    })

    axios.get('/customerBookings', {
      headers: {
        AuthToken: authToken
      }
    }).then(res => {
      setCustomerBookingLength(res.data.length)
    }).catch(function (error) {
      console.log(error.response)
    })

    axios.get('/merchantBookings', {
      headers: {
        AuthToken: authToken
      }
    }).then(res => {
      setMerchantBookingLength(res.data.length)
    }).catch(function (error) {
      console.log(error.response)
    })

    axios.get('/promotion/mall', {
      headers: {
        AuthToken: authToken
      }
    }).then(res => {
      setMallPromoLength(res.data.length)
    })
    .catch(function (error) {
      console.log(error.response)
    })

    axios.get('/promotion/merchant', {
      headers: {
        AuthToken: authToken
      }
    }).then(res => {
      setMerchantPromoLength(res.data.length)
    })
    .catch(function (error) {
      console.log(error.response)
    })

    axios.get('/advertisements', {
      headers: {
        AuthToken: authToken
      }
    }).then(res => {
      setAdvertisementLength(res.data.length)
    }).catch(function (error) {
      console.log(error.response)
    })

    axios.get('/notification/staff', {
      headers: {
        AuthToken: authToken
      }
    }).then(res => {
      setNotifications(res.data)
    })

    axios.get('/announcements', {
      headers: {
        AuthToken: authToken
      }
    }).then(res => {
      setAnnouncements(res.data)
    })
  }, [])

  function getTotalBookings() {
    return customerBookingLength + merchantBookingLength
  }

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
    <>
      <div className="content">
        <Row>    
          <Col lg="3" md="6" sm="4">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <br/>
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-single-02 text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <br/>
                    <div className="numbers">
                      <p className="card-category">Customers</p>
                      <CardTitle tag="p">{customerLength}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <br/>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <br/>
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-shop text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <br/>
                    <div className="numbers">
                      <p className="card-category">Merchants</p>
                      <CardTitle tag="p">{merchantLength}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <br/>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <br/>
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-single-02 text-danger" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <br/>
                    <div className="numbers">
                      <p className="card-category">Staff</p>
                      <CardTitle tag="p">{staffLength}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <br/>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <br/>
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-image text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <br/>
                    <div className="numbers">
                      <p className="card-category">Advertisements</p>
                      <CardTitle tag="p">{advertisementLength}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <br/>
              <CardFooter>
              </CardFooter>
            </Card>
          </Col>
          {/* <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <br/><br/>
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-money-coins text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <br/><br/>
                    <div className="numbers">
                      <p className="card-category">Revenue ($)</p>
                      <CardTitle tag="p">-</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <br/><br/>
              <CardFooter>
              </CardFooter>
            </Card>
          </Col> */}
        </Row>
        <Row>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <br/>
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-bookmark-2 text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    
                    <div className="numbers">
                      <p className="card-category">Customer Bookings</p>
                      <CardTitle tag="p">{customerBookingLength}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <br/>
              <CardFooter>
              
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <br/>
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-bookmark-2 text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                   
                    <div className="numbers">
                      <p className="card-category">Merchant Bookings</p>
                      <CardTitle tag="p">{merchantBookingLength}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <br/>
              <CardFooter>
              
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <br/>
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-tag-content text-danger" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <br/>
                    <div className="numbers">
                      <p className="card-category">Mall Promotions</p>
                      <CardTitle tag="p">{mallPromoLength}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <br/>
              <CardFooter>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <br/>
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-tag-content text-info" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                   
                    <div className="numbers">
                      <p className="card-category">Merchant Promotions</p>
                      <CardTitle tag="p">{merchantPromoLength}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
                <br/>
              </CardBody>
              <CardFooter>
              </CardFooter>
            </Card>
          </Col>
        </Row>
   
        <Row>
        <Col md="6">
          <Card className="card-name" style={{height:"28rem"}}>
              <CardHeader>
                  <div className="form-row">
                      <CardTitle className="col-md-10" tag="h5"><small>Notifications</small></CardTitle>
                  </div>
              </CardHeader>
                <ListGroup flush style={{overflow:"scroll"}}>
                {
                  notifications.map(notification => (
                    <ListGroupItem key={notification.id}>
                      <p style={{fontWeight:'bold', color:'grey'}}>{notification.title}</p>
                      <small style={{color:'grey'}}>{formatDate(notification.sentTime)}</small>
                      <p className="text-muted">{notification.description}</p>

                    </ListGroupItem>
                  )).reverse()
                }
              </ListGroup>
              <CardBody></CardBody>
            </Card>
          </Col>
          <Col md="6">
          <Card className="card-name" style={{height:"28rem"}}>
              <CardHeader>
                  <div className="form-row">
                      <CardTitle className="col-md-10" tag="h5"><small>Announcements</small></CardTitle>
                  </div>
              </CardHeader>
              <ListGroup flush style={{overflow:"scroll"}}>
                {
                    announcements.map(announcement => (
                      <ListGroupItem key={announcement.id}>
                        <p style={{fontWeight:'bold', color:'grey'}}>{announcement.title}</p>
                        <small style={{color:'grey'}}>{formatDate(announcement.sentTime)}</small>
                        <p className="text-muted">{announcement.description}</p>

                      </ListGroupItem>
                    )).reverse()
                  }
              </ListGroup>
              <CardBody></CardBody>
            </Card>
          </Col>    
        </Row>
      </div>
    </>
  )
}

export default Dashboard;
