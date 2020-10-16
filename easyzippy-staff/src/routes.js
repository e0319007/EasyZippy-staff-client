import Dashboard from "views/Dashboard.js";
import Lockers from "views/Locker/Lockers"
import Profile from "views/User/Profile";
import Staffs from "views/Staff/Staffs";
import Customers from "views/Customer/Customers";
import Merchants from "views/Merchant/Merchants";
import Advertisements from "views/Advertisement/Advertisements";
import Promotions from "views/Promotion/Promotions";
import Bookings from "views/Booking/Bookings";
import Kiosks from "views/Kiosk/Kiosks";
import Category from "views/Category/Category";
import Announcements from "views/Announcement/Announcements";
import CustomerDetails from "views/Customer/CustomerDetails";
import KioskDetails from "views/Kiosk/KioskDetails";
import MerchantDetails from "views/Merchant/MerchantDetails";
import StaffDetails from "views/Staff/StaffDetails";
import BookingPackages from "views/BookingPackages/BookingPackages";
import BookingPackageDetails from "views/BookingPackages/BookingPackageDetails";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-layout-11",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/profile",
    name: "Profile",
    icon: "nc-icon nc-badge",
    component: Profile,
    layout: "/admin"
  },
  {
    path: "/staffs",
    name: "Staffs",
    icon: "nc-icon nc-single-02",
    component: Staffs,
    layout: "/admin"
  },
  {
    path: "/staffDetails",
    name: "Staff Details",
    icon: "nc-icon nc-single-02",
    component: StaffDetails,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/customers",
    name: "Customers",
    icon: "nc-icon nc-single-02",
    component: Customers,
    layout: "/admin"
  },
  {
    path: "/customerDetails",
    name: "Customer Details",
    icon: "nc-icon nc-single-02",
    component: CustomerDetails,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/merchants",
    name: "Merchants",
    icon: "nc-icon nc-shop",
    component: Merchants,
    layout: "/admin"
  },
  {
    path: "/merchantDetails",
    name: "Merchant Details",
    icon: "nc-icon nc-shop",
    component: MerchantDetails,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/advertisements",
    name: "Advertisements",
    icon: "nc-icon nc-image",
    component: Advertisements,
    layout: "/admin"
  },
  {
    path: "/promotions",
    name: "Promotions",
    icon: "nc-icon nc-tag-content",
    component: Promotions,
    layout: "/admin"
  },
  {
    path: "/bookings",
    name: "Bookings",
    icon: "nc-icon nc-bookmark-2",
    component: Bookings,
    layout: "/admin"
  },
  {
    path: "/bookingPackages",
    name: "Booking Packages",
    icon: "nc-icon nc-box",
    component: BookingPackages,
    layout: "/admin"
  },
  {
    path: "/bookingPackageDetails",
    name: "Booking Package Details",
    icon: "nc-icon nc-box",
    component: BookingPackageDetails,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/kiosks",
    name: "Kiosks",
    icon: "nc-icon nc-mobile",
    component: Kiosks,
    layout: "/admin"
  },
  {
    path: "/kioskDetails",
    name: "KioskDetails",
    icon: "nc-icon nc-mobile",
    component: KioskDetails,
    layout: "/admin",
    invisible: true
  },
  {
    path: "/lockers",
    name: "Lockers",
    icon: "nc-icon nc-button-pause",
    component: Lockers,
    layout: "/admin"
  },
  {
    path: "/category",
    name: "Category",
    icon: "nc-icon nc-tile-56",
    component: Category,
    layout: "/admin"
  },
  {
    path: "/announcements",
    name: "Announcements",
    icon: "nc-icon nc-chat-33",
    component: Announcements,
    layout: "/admin",
  }
];

export default routes