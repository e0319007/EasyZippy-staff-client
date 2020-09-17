import axios from "axios";
import Cookies from "js-cookie";

const api_url = "http://localhost:5000/staff"

const login = (email, password) => {
    return axios.post(api_url + '/login', {
        email: email,
        password: password
    })
}

// check again later
const logout = () => {
    Cookies.remove('staffUser');
}

export default {
    login,
    logout
};