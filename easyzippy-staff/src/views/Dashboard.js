import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
// react plugin used to create charts
import { Line } from "react-chartjs-2";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
  Button
} from "reactstrap";
// core components
import {
  dashboard24HoursPerformanceChart,
} from "variables/charts.js";

function Dashboard() {

  const authToken = (JSON.parse(Cookies.get('authToken'))).toString()

  const [merchantLength, setMerchantLength] = useState('')
  const [customerLength, setCustomerLength] = useState('')
  const [customerBookingLength, setCustomerBookingLength] = useState('')
  const [merchantBookingLength, setMerchantBookingLength] = useState('')

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
  }, [])

  function getTotalBookings() {
    return customerBookingLength + merchantBookingLength
  }

  return (
    <>
      <div className="content">
        <Row>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-single-02 text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Customers</p>
                      <CardTitle tag="p">{customerLength}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>

              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-shop text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Merchants</p>
                      <CardTitle tag="p">{merchantLength}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-bookmark-2 text-danger" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Bookings</p>
                      <CardTitle tag="p">{getTotalBookings()}</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-money-coins text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Revenue</p>
                      <CardTitle tag="p">-</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Sales Revenue</CardTitle>
              </CardHeader>
              <CardBody>
                <Line
                  //data={dashboard24HoursPerformanceChart.data}
                  options={dashboard24HoursPerformanceChart.options}
                  width={400}
                  height={100}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Dashboard;
