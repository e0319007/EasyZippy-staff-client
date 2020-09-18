import axios from "axios";
import Cookies from "js-cookie";

const api_url = "http://localhost:5000/staff"

// check again later
const logout = () => {
    Cookies.remove('staffUser');
}

export default {
    login,
    logout
};