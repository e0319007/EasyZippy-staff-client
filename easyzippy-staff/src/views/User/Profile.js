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
    Alert,
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter
} from "reactstrap";

function Profile() {

    const staff = JSON.parse(localStorage.getItem('currentStaff'))
    console.log("test " + staff.firstName)

    const staffid = parseInt(Cookies.get('staffUser'))
    console.log(typeof staffid)

    const authTokenStaff = JSON.parse(Cookies.get('authTokenStaff'))
    console.log(typeof authTokenStaff + " " + authTokenStaff)

    const [firstName, setFirstName] = useState(staff.firstName)
    const [lastName, setLastName] = useState(staff.lastName)
    const [email, setEmail] = useState(staff.email)
    const [mobileNumber, setMobileNumber] = useState(staff.mobileNum)

    const [currentPw, setCurrentPw] = useState('')
    const [newPw, setNewPw] = useState('')
    const [newCfmPw, setNewCfmPw] = useState('')

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const [successful, isSuccessful] = useState(false)
    const [successMsg, setMsg] = useState('')

    const [modal, setModal] = useState(false)
    const [inModal, isInModal] = useState(false)

    const toggle = () => setModal(!modal);

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

    const onChangeCurrPassword = e => {
        const currentPw = e.target.value;
        setCurrentPw(currentPw.trim())
    }

    const onChangeNewPassword = e => {
        const newPw = e.target.value;

        var reg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
        if (reg.test(newPw)) { //if valid
            isError(false)
            isSuccessful(false)
        } else {
            isInModal(true)
            setError("Password is not strong enough (Have at least 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Character)")
            isError(true)
            isSuccessful(false)
        }
        
        setNewPw(newPw.trim())
    }

    const onChangeNewCfmPassword = e => {
        const newCfmPw = e.target.value;
        setNewCfmPw(newCfmPw.trim())
    }

    const updateProfile = e => {
        e.preventDefault()
        console.log("in update profile")

        axios.put(`/staff/${staffid}`, {
            firstName: firstName,
            lastName: lastName,
            email: email,
            mobileNumber: mobileNumber
        },
        {
            headers: {
                AuthToken: authTokenStaff
            }
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
            
            isInModal(false)
            isError(false)
            isSuccessful(true)
            setMsg("profile updated successfully!")
        }).catch(function (error) {
            console.log(error.response.data)
            isInModal(false)
            isError(true)
            setError(error.response.data)
            isSuccessful(false)
        })
    }

    const updatePassword = e => {
        e.preventDefault()
        console.log("inside update password")

        if (newPw !== newCfmPw) {
            isInModal(true)
            setError("New passwords need to match!")
            isError(true)
            return;
        }

        if (newPw === currentPw) {
            isInModal(true)
            setError("Your old and new passwords are the same")
            isError(true)
            return;
        }

        axios.put(`/staff/${staffid}/changePassword`, {
            currentPassword: currentPw,
            newPassword: newPw
        },
        {
            headers: {
                AuthToken: authTokenStaff
            }
        }).then((response) => {
            console.log("axios call went through")
            isInModal(true)
            isError(false)
            isSuccessful(true)
            setMsg("Password successfully updated!")
            setCurrentPw('')
            setNewCfmPw('')
            setNewPw('')
        }).catch(function (error) {
            console.log(error.response.data)
            isInModal(true)
            isError(true)
            setError(error.response.data)
            isSuccessful(false)
        })
    }

    const reset = e => {
        e.preventDefault()
        console.log("inside reset form")
        setCurrentPw('')
        setNewPw('')
        setNewCfmPw('')
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
                                            placeholder="Mobile Number" 
                                            value={mobileNumber}
                                            onChange={onChangeMobile}
                                            />
                                    </FormGroup>
                                    <Row>
                                        <div className="update ml-auto mr-auto" >
                                            <Button color="success" size="sm" type="submit" onClick={updateProfile}>Update Profile</Button>
                                            {' '}
                                            <Button color="primary" size="sm" onClick={toggle}>Change Password</Button>
                                        </div>
                                    </Row>
                                    { !inModal && err &&<Alert color="danger">{error}</Alert> }
                                    { !inModal && successful &&<Alert color="success">{successMsg}</Alert> }
                                </form>
                            </CardBody>
                            <Modal isOpen={modal} toggle={toggle}>
                                <ModalHeader toggle={toggle}>Change Password</ModalHeader>
                                <ModalBody>
                                    <form>
                                        <FormGroup>
                                            <Label for="inputPassword">Current password</Label>
                                            <Input 
                                                type="password" 
                                                id="inputPassword" 
                                                placeholder="Enter current password" 
                                                value={currentPw}
                                                onChange={onChangeCurrPassword}
                                                />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="inputNewPassword">New password</Label>
                                            <Input 
                                                type="password" 
                                                id="inputNewPassword" 
                                                placeholder="Enter new password" 
                                                value={newPw}
                                                onChange={onChangeNewPassword}
                                                />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="inputNewConfirmPassword">Re-enter new password</Label>
                                            <Input 
                                                type="password" 
                                                id="inputNewConfirmPassword" 
                                                placeholder="Re-enter new password" 
                                                value={newCfmPw}
                                                onChange={onChangeNewCfmPassword}
                                                />
                                        </FormGroup>
                                        { inModal && err &&<Alert color="danger">{error}</Alert> }
                                        { inModal && successful &&<Alert color="success">{successMsg}</Alert>}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
                                    </form>
                                </ModalBody>
                                <ModalFooter>
                                <Button color="primary" onClick={updatePassword}>Update</Button>{' '}
                                <Button color="secondary" onClick={reset}>Reset</Button>
                                </ModalFooter>
                            </Modal>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Profile;