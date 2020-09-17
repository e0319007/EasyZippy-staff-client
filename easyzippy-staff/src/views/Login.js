import React, {useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import {
    FormGroup,
    Label,
    Input,
    Alert,
    Button,
    Navbar
} from "reactstrap";

const API_SERVER = "http://localhost:5000/staff"

function Login() {

    const history = useHistory()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [err, isError] = useState(false)
    const [valid, isValid] = useState(true)

    const onChangeEmail = e => {
        // console.log("inside on change email")
        const email = e.target.value;
        let reg = /\S+@\S+\.\S+/;
        if (reg.test(e) === true){
            setEmail(email)
            isError(false)
            isValid(true)
            console.log("valid")
        } else {
            setEmail(email)
            setError("Your email has an invalid syntax")
            isError(true)
            isValid(false)
            console.log("invalid")
        }
    }

    const onChangePassword = e => {
        const password = e.target.value;
        setPassword(password)
    }

    const postLogin = () =>  {
        console.log("in login function")

        history.push('/admin/dashboard')

        if (email.length === 0 || password.length === 0) {
            isError(true)
            setError("Email or password field cannot be empty")
            return;
        }
        axios.post(API_SERVER + '/login', {
            email: email,
            password: password
        })
        .then(response => {
            console.log("axios call went through")
            history.push('/admin/dashboard')
            document.location.reload()
            // store to cookie
            console.log(response.data.token)
            Cookies.set('authToken', JSON.stringify(response.data.token));
            // document.cookie = "token=" + response.data.token;
            // maybe change later 
            Cookies.set('staffUser', JSON.stringify(response.data.staff.id));
        }).catch(function (error) {
            console.log(error.response.data)
            isError(true)
            setError("Your email or password is incorrect!")
            history.push('/login')
            //add customised alerts according to errors
        })
    };


    return (
        <div style={{backgroundColor:'#f4f3ef', height:'100vh'}}>
            <Navbar expand="lg" color="dark">
                <div className="navbar-brand">
                    &nbsp;&nbsp;
                    <img 
                        src={require("../easyzippylogo.jpg")}
                        width="30"
                        height="30"
                    />
                    {' '}
                    <span style={{fontWeight:"bold", color: 'white', width:'100%'}}>&nbsp;&nbsp;Easy Zippy</span>
                </div>
            </Navbar>
            <form style={{...padding(65, 77, 0, 77)}}>
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
                    />
                </FormGroup>
                <Button color="primary" type="submit" onClick={postLogin} > 
                    Log In
                </Button>
                {/* <FormGroup> 
                    <Link to="/apply">Don't have an account? Click here to apply.</Link>
                </FormGroup> */}
                { !valid && err &&<Alert color="danger">{error}</Alert> }
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