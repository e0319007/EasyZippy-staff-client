import React from 'react';
import * as AiIcons from "react-icons/ai";
import * as RiIcons from "react-icons/ri";
import * as FiIcons from "react-icons/fi";
import * as BiIcons from "react-icons/bi";
import * as CgIcons from "react-icons/cg";
import * as MdIcons from "react-icons/md";

export const SidebarData = [
    {
        title: 'DASHBOARD', 
        path: '/',
        icon: <RiIcons.RiDashboardLine />,
        cName: 'nav-text'
    }, 
    {
        title: 'STAFF MANAGEMENT', 
        path: '/staffManagement',
        icon: <FiIcons.FiUser />,
        cName: 'nav-text'
    }, 
    {
        title: 'CUSTOMER MANAGEMENT', 
        path: '/customerManagement',
        icon: <FiIcons.FiUsers />,
        cName: 'nav-text'
    }, 
    {
        title: 'MERCHANT MANAGEMENT', 
        path: '/merchantManagement',
        icon: <BiIcons.BiStore />,
        cName: 'nav-text'
    }, 
    {
        title: 'Booking Management', 
        path: '/bookingManagement',
        icon: <BiIcons.BiBookmark />,
        cName: 'nav-text'
    }, 
    {
        title: 'Advertisement Management', 
        path: '/advertisementManagement',
        icon: <RiIcons.RiAdvertisementLine />,
        cName: 'nav-text'
    }, 
    {
        title: 'Promotion Management', 
        path: '/promotionManagement',
        icon: <RiIcons.RiPriceTag3Line />,
        cName: 'nav-text'
    }, 
    {
        title: 'Locker Management', 
        path: '/lockerManagement',
        icon: <CgIcons.CgBox />,
        cName: 'nav-text'
    }, 
    {
        title: 'Kiosk Management', 
        path: '/kioskManagement',
        icon: <MdIcons.MdTabletAndroid />,
        cName: 'nav-text'
    }, 
    {
        title: 'Category Management', 
        path: '/categoryManagement',
        icon: <AiIcons.AiOutlineTags />,
        cName: 'nav-text'
    },
    {
        title: 'Announcements', 
        path: '/announcements',
        icon: <AiIcons.AiOutlineNotification />,
        cName: 'nav-text'
    },
]
