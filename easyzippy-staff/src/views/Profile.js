import { Form } from "components/UseForm";
import React, {useState} from "react";
import axios from 'axios';
import Cookies from 'js-cookie';

import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Row,
    Col,
    FormGroup,
    Label,
    Input,
    Button,
} from "reactstrap";

const API_SERVER = "http://localhost:5000/staff"

function Profile() {

    const staff = JSON.parse(localStorage.getItem('currentStaff'))
    console.log("test " + staff.firstName)

    const staffid = parseInt(Cookies.get('staffUser'))
    console.log(typeof staffid)

    const [firstName, setFirstName] = useState(staff.firstName)
    const [lastName, setLastName] = useState(staff.lastName)
    const [email, setEmail] = useState(staff.email)
    const [mobileNumber, setMobileNumber] = useState(staff.mobileNum)

    const staff_toupdate = {
        firstName: '',
        lastName: '',
        mobileNum: '',
        email: ''
    }

    const onChangeFirstName = e => {
        const firstName = e.target.value;
        setFirstName(firstName.trim())
    }

    const onChangeLastName = e => {
        const lastName = e.target.value;
        setLastName(lastName.trim())
    }

    const onChangeEmail = e => {
        const email = e.target.value;
        setEmail(email.trim())
    }

    const onChangeMobile = e => {
        const mobile = e.target.value;
        setMobileNumber(mobile.trim())
    }

    const updateProfile = e => {
        e.preventDefault()
        console.log("in update profile")

        axios.put(`http://localhost:5000/staff/${staffid}`, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            mobileNumber: mobileNumber
        }).then((response) => {
            console.log("axios call went through")
            // set response data to view
            setFirstName(response.data.firstName)
            setLastName(response.data.lastName)
            setEmail(response.data.email)
            setMobileNumber(response.data.mobileNumber)
            
            // save new values to staff local storage
            staff_toupdate.firstName = response.data.firstName
            staff_toupdate.lastName = response.data.lastName
            staff_toupdate.mobileNum = response.data.mobileNumber
            staff_toupdate.email = response.data.email
            localStorage['currentStaff'] = JSON.stringify(staff_toupdate)

            // change to proper alert later
            alert('profile updated successfully!') 
        }).catch(function (error) {
            console.log(error.response.data)
        })
    }

    return(
        <>
            <div className="content">
                <Row>
                    <Col md = "12">
                        <Card className="card-name">
                            <CardHeader>
                                <div className="form-row">
                                <CardTitle className="col-md-10" tag="h5">Edit Profile</CardTitle>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <form>
                                    <div className="form-row">
                                        <FormGroup className="col-md-6">
                                            <Label for="inputFirstName">First Name</Label>
                                            <Input 
                                                type="text" 
                                                id="inputFirstName" 
                                                // defaultValue={staff.firstName} 
                                                placeholder="First Name"
                                                value={firstName}
                                                onChange={onChangeFirstName}
                                            />
                                        </FormGroup>
                                        <FormGroup className="col-md-6">
                                            <Label for="inputLastName">Last Name</Label>
                                            <Input 
                                                type="text" 
                                                id="inputLastName" 
                                                // defaultValue={staff.lastName} 
                                                placeholder="Last Name"
                                                value={lastName}
                                                onChange={onChangeLastName}
                                                />
                                        </FormGroup>  
                                    </div>
                                    <FormGroup>
                                        <Label for="inputEmail">Email</Label>
                                        <Input 
                                            type="email" 
                                            id="inputEmail" 
                                            // defaultValue={staff.email} 
                                            placeholder="Email" 
                                            value={email}
                                            onChange={onChangeEmail}
                                            />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="inputMobile">Mobile Number</Label>
                                        <Input 
                                            type="text" 
                                            id="inputMobile" 
                                            // defaultValue={staff.mobileNum} 
                                            placeholder="Mobile Number" 
                                            value={mobileNumber}
                                            onChange={onChangeMobile}
                                            />
                                    </FormGroup>
                                    <Row>
                                        <div className="update ml-auto mr-auto" >
                                            <Button color="success" size="sm" type="submit" onClick={updateProfile}>Update Profile</Button>
                                            {' '}
                                            {/* redirects to change password page */}
                                            <Button color="primary" size="sm">Change Password</Button>
                                        </div>
                                    </Row>
                                </form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Profile;