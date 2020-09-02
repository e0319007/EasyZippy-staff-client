import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import StaffManagement from './pages/StaffManagement';
import CustomerManagement from './pages/CustomerManagement';
import MerchantManagement from './pages/MerchantManagement';
import BookingManagement from './pages/BookingManagement';
import AdvertisementManagement from './pages/AdvertisementManagement';
import LockerManagement from './pages/LockerManagement';
import KioskManagement from './pages/KioskManagement';
import CategoryManagement from './pages/CategoryManagement';
import Announcements from './pages/Announcements';
import PromotionManagement from './pages/PromotionManagement';

function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Switch>
        <Route path='/' exact component={Dashboard} />
        <Route path='/staffManagement' component={StaffManagement} />
        <Route path='/customerManagement' component={CustomerManagement} />
        <Route path='/merchantManagement' component={MerchantManagement} />
        <Route path='/bookingManagement' component={BookingManagement} />
        <Route path='/advertisementManagement' component={AdvertisementManagement} />
        <Route path='/promotionManagement' component={PromotionManagement} />
        <Route path='/lockerManagement' component={LockerManagement} />
        <Route path='/kioskManagement' component={KioskManagement} />
        <Route path='/categoryManagement' component={CategoryManagement} />
        <Route path='/announcements' component={Announcements} />
        
      </Switch>
    </Router>
    </>
  );
}

export default App;
