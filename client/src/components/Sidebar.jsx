import React from 'react';
import Logo from '../assets/img/logo.png';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const navlinks = [
        { path: '/', title: 'Dashboard' },
        { path: '/list', title: 'Sales Invoice' },
        { path: '/products', title: 'Products' } ,
        { path: '/stock', title: 'Stocks' }
        // Added new Products link
    ];

    return (
        <div className=" w-[18vw] bg-gradient-to-b from-gray-800 to-gray-900 shadow-md flex flex-col items-center py-10">
            
            {/* Logo */}
            <img 
                src={Logo} 
                alt="Logo" 
                className="w-[8vw] rounded-full shadow-lg transition-transform duration-300 hover:scale-105"
            />

            {/* Navigation Links */}
            <div className="flex flex-col gap-6 w-full text-white font-semibold mt-10">
                {navlinks.map((link, index) => (
                    <NavLink 
                        key={index} 
                        to={link.path} 
                        className="text-lg py-3 text-center transition-all duration-300 
                        hover:bg-white hover:text-gray-700 rounded-lg mx-4 shadow-md"
                    >
                        {link.title}
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;