import React from "react";
import { createBrowserHistory } from "history";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.2.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import AdminLayout from "./layouts/Admin.js";
import Login from "./views/User/Login.js"
import ForgotPassword from "./views/User/ForgotPassword.js";
import CheckValidToken from "./views/User/CheckValidToken.js";
import ResetPassword from "./views/User/ResetPassword.js";
import CustomerDetails from "views/Customer/CustomerDetails.js";
import KioskDetails from "views/Kiosk/KioskDetails.js";
import MerchantDetails from "views/Merchant/MerchantDetails.js"
import StaffDetails from "views/Staff/StaffDetails.js";
import LockerTypeDetails from "views/Locker/LockerTypeDetails.js"
import LockerDetails from "views/Locker/LockerDetails.js"
import BookingPackageDetails from "views/BookingPackages/BookingPackageDetails.js";
import MaintenanceActionDetails from "views/MaintenanceAction/MaintenanceActionDetails.js";
import CustomerBookingDetails from "views/Booking/CustomerBookingDetails.js";
import MerchantBookingDetails from "views/Booking/MerchantBookingDetails.js";
import AdvertisementDetails from "views/Advertisement/AdvertisementDetails"
import MerchantPromotionDetails from "views/Promotion/MerchantPromotionDetails.js";
import MallPromotionDetails from "views/Promotion/MallPromotionDetails.js";
import CustomerOrderDetails from "views/Customer/CustomerOrderDetails.js";
import ErrorPage from "views/ErrorPage.js";


const hist = createBrowserHistory();

function App(props) {

    return (
        <Router history={hist}>
            <Switch>
                
                <Route exact path="/" component={Login} />

                {/* if user and token do not exist in the cookies */}
                {document.cookie.indexOf('staffUser') === -1 && document.cookie.indexOf('authTokenStaff') === -1 &&
                    <Route path="/login" component={Login} />
                }
                {/* if user and token exists in the cookies */}
                { document.cookie.indexOf('staffUser') > -1 && document.cookie.indexOf('authTokenStaff') > -1 && 
                    <Route path="/admin" render={(props) => <AdminLayout {...props} />} /> 
                }
                <Route exact path="/" component={Login} />
                {/* <Route exact path="/error" component={ErrorPage} /> */}
              
                <Route exact path="/forgotPassword" component={ForgotPassword}/>
                <Route exact path="/checkValidToken" component={CheckValidToken}/>
                <Route exact path="/resetPassword" component={ResetPassword}/>
                <Route exact path="/admin/staffDetails" component={StaffDetails}/>
                <Route exact path="/admin/customerDetails" component={CustomerDetails}/>
                <Route exact path="/admin/kioskDetails" component={KioskDetails}/>
                <Route exact path="/admin/merchantDetails" component={MerchantDetails}/>
                <Route exact path="/admin/lockerTypeDetails" component={LockerTypeDetails}/>
                <Route exact path="/admin/lockerDetails" component={LockerDetails}/>
                <Route exact path="/admin/bookingPackageDetails" component={BookingPackageDetails}/>
                <Route exact path="/admin/maintenanceActionDetails" component={MaintenanceActionDetails}/>
                <Route exact path="/admin/customerBookingDetails" component={CustomerBookingDetails}/>
                <Route exact path="/admin/merchantBookingDetails" component={MerchantBookingDetails}/>
                <Route exact path="/admin/advertisementDetails" component={AdvertisementDetails}/>
                <Route exact path="/admin/merchantPromotionDetails" component={MerchantPromotionDetails}/>
                <Route exact path="/admin/mallPromotionDetails" component={MallPromotionDetails}/>
                <Route exact path="/admin/customerOrderDetails" component={CustomerOrderDetails}/>
                <Route component={ErrorPage}/>
        
                {/* <Redirect to="/error" component={ErrorPage} /> */}



            </Switch>
        </Router>
    )
}

export default App;