import React, {useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Sidebar from "../../components/Sidebar/Sidebar"

import {
    FormGroup,
    Label,
    Input,
    Alert,
    Button,
    Navbar
} from "reactstrap";

function Login() {

    const history = useHistory()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const [error, setError] = useState('')
    const [err, isError] = useState(false)

    const onChangeEmail = e => {
        // console.log("inside on change email")
        const email = e.target.value;
        setEmail(email)
    }

    const onChangePassword = e => {
        const password = e.target.value;
        setPassword(password)
    }

    const staff = {
        firstName: '',
        lastName: '',
        mobileNum: '',
        email: ''
    }

    const forgotPassword = () => {
        history.push('/forgotPassword')
    }

    const postLogin = e =>  {
        console.log("in login function")
        e.preventDefault()
        // history.push('/admin/dashboard')

        if (email.length === 0 || password.length === 0) {
            isError(true)
            setError("Email field is required")
            return;
        }
        axios.post('/staff/login', {
            email: email,
            password: password
        })
        .then(response => {
            console.log("axios call went through")
            isError(false)
            history.push('/admin/dashboard')
            document.location.reload()
            console.log(response.data.token)
            Cookies.set('authToken', JSON.stringify(response.data.token))
            Cookies.set('staffUser', JSON.stringify(response.data.staff.id))

            staff.firstName = response.data.staff.firstName
            staff.lastName = response.data.staff.lastName
            staff.mobileNum = response.data.staff.mobileNumber
            staff.email = response.data.staff.email

            console.log(staff)

            localStorage.setItem('currentStaff', JSON.stringify(staff))

        }).catch(function (error) {
            isError(true)
            setError(error.response.data)
            console.log(error.response.data)
            history.push('/login') 
        })
    };

    return (
        <div style={{backgroundColor:'#f4f3ef', height:'100vh'}}>
            <Navbar expand="lg" color="dark">
                <div className="navbar-brand">
                    &nbsp;&nbsp;
                    <img 
                        src={require("../../easyzippylogo.jpg")}
                        width="30"
                        height="30"
                    />
                    {' '}
                    <span style={{fontWeight:"bold", color: 'white', width:'100%'}}>&nbsp;&nbsp;Easy Zippy</span>
                </div>
            </Navbar>
            <form onSubmit={e => { e.preventDefault(); }} style={{...padding(65, 77, 0, 77)}}>
                <FormGroup>
                    <p className="h3" style={{textAlign: 'center'}}>
                        Welcome to Ez2Keep Staff Portal!
                    </p>
                </FormGroup>
                <FormGroup>
                    <Label for="email">Email address</Label>
                    <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={onChangeEmail}
                    required
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={onChangePassword}
                    required
                    />
                </FormGroup>
                <Button color="primary" type="submit" onClick={postLogin} > 
                    Log In
                </Button>
                <FormGroup> 
                    <Link onClick={forgotPassword}>Forgot Password?</Link>
                </FormGroup>
                { err &&<Alert color="danger">{error}</Alert> }
            </form>
        </div>
    );
}

function padding(a, b, c, d) {
    return {
        paddingTop: a,
        paddingRight: b ? b : a,
        paddingBottom: c ? c : a,
        paddingLeft: d ? d : (b ? b : a)
    }
}

export default Login;