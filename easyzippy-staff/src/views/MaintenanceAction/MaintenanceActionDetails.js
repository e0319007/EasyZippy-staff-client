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
    CardHeader, FormGroup, Label, Button
} from "reactstrap";

const theme = createMuiTheme({
    typography: {
        fontFamily: [
        'Montserrat',
        ].join(','),
    },
});

function MaintenanceActionDetails() {

    const history = useHistory()
    const authToken = (JSON.parse(Cookies.get('authToken'))).toString()
    console.log(authToken)

    const maintenanceActionId = JSON.parse(localStorage.getItem('maintenanceActionToView'))
    const [data, setData] = useState([])


    useEffect(() => {
        axios.get(`/maintenanceAction/${maintenanceActionId}`, 
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

        //return dt + "/" + month + "/" + year + " " + time ;
        return dt + "/" + month + "/" + year;
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
                                    <CardTitle className="col-md-10" tag="h5">Maintenance Action {data.id} Details</CardTitle>
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
                                                <Label for="inputDate">Created On</Label>
                                                <Input
                                                    type="calendar"
                                                    id="inputDate"
                                                    placeholder="Date here"
                                                    value={formatDate(data.maintenanceDate)}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputDescription">Description</Label>
                                                <Input 
                                                    type="text"
                                                    id="inputDescription"
                                                    placeholder="description here"
                                                    value={data.description}
                                                />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="inputLockerId">Locker Id</Label>
                                                <Input 
                                                    type="text" 
                                                    id="inputLockerId" 
                                                    placeholder="Locker Id" 
                                                    value={data.lockerId}                                                    
                                                    />
                                            </FormGroup>                           
                                        </fieldset>
                                        <Row>
                                            <Col md="12">
                                                <div className="form-add">
                                                    <Button onClick={() => {
                                                        history.push('/admin/maintenanceActions')
                                                        localStorage.removeItem('maintenanceActionToView')
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

export default MaintenanceActionDetails;