import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import SidebarMenu from "./SIdeBarMenu";

const Navbar = () => {
  const { setShowSearch, getCartCount } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Dropdown data for Kate Spade (extend for other brands)
  const kateSpadeDropdown = {
    Handbags: [
      "All Handbags",
      "New Handbags",
      "Crossbody Bags",
      "Tote Bags",
      "Satchels",
      "Backpacks Travel Bags",
      "Shoulder Bags",
      "Laptop Bags",
      "Bucket Bags",
      "Belt Bags",
    ],
    Wallets: [
      "All Wallets",
      "New Wallets",
      "Wristlets",
      "Card Holders",
      "Large Wallets",
      "Medium Wallets",
      "Small Wallets",
    ],
    "Collection": [
      "Spade flower Shop",
      "Phoebe Shop",
      "Lena Shop",
      "Madison Shop",
      "Rosie Shop",
      "Kayla Shop",
      "Leila Shop",
      "Chelsea Shop",
    ],
  };
  
  // Dropdown data for Michael Kors
  const michaelKorsDropdown = {
    Handbags: [
      "All Handbags",
      "Backpacks",
      "Crossbody Bags",
      "Clutches",
      "Luggage",
      "Shoulder Bags",
      "Satchels",
      "Totes",
      "Money Pieces"
    ],
    Wallets: []
  };

  // Dropdown data for Coach
  const coachDropdown = {
    Handbags: [
      "All Handbags",
      "Crossbody Bags",
      "Totes & Caryalls",
      "Satchels & Top Handles",
      "Backpacks",
      "Shoulder Bags",
      "Mini Bags",
      "Belt Bags",
    ],
    Wallets: [
      "All Wallets",
      "Large Wallets",
      "Small Wallets",
    ],
    Wristlets: [],
  };

  return (
    
    <div style={{boxShadow: "rgba(0, 0, 0, 0.08) 0px 1px 10px 0px"}} className="flex items-center justify-between py-5 font-medium px-2 sm:px-[5vw] md:px-[2vw] lg:px-[2vw] ">
      <Link to="/">
        <img src={assets.logo} className="w-36" alt="" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700 relative">
        {/* Kate Spade Dropdown */}
        <div className="group relative">
          <NavLink
            to="/collection/kate-spade"
            className="flex flex-col items-center gap-1"
          >
            <p>KATE SPADE</p>
          </NavLink>
          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 hidden group-hover:block shadow-lg bg-white border rounded-md z-20">
            {Object.keys(kateSpadeDropdown).map((category, index) => (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredCategory(category)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <NavLink
                  to={`/collection/kate-spade/${category.toLowerCase()}`}
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-black"
                >
                  {category}
                </NavLink>
                {/* Subcategories Dropdown */}
                {hoveredCategory === category && (
                  <div className="absolute top-0 left-full hidden group-hover:block shadow-lg bg-white border rounded-md z-30 ml-0.5 w-64">
                    {kateSpadeDropdown[category].map((subcategory, subIndex) => (
                      <NavLink
                        key={subIndex}
                        to={`/collection/kate-spade/${category.toLowerCase()}/${subcategory
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-black"
                      >
                        {subcategory}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Michael Kors Dropdown */}
        <div className="group relative">
          <NavLink
            to="/collection/michael-kors"
            className="flex flex-col items-center gap-1"
          >
            <p>MICHAEL KORS</p>
          </NavLink>
          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 hidden group-hover:block shadow-lg bg-white border rounded-md z-20">
            {Object.keys(michaelKorsDropdown).map((category, index) => (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredCategory(category)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <NavLink
                  to={`/collection/michael-kors/${category.toLowerCase()}`}
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-black"
                >
                  {category}
                </NavLink>
                {/* Subcategories Dropdown */}
                {hoveredCategory === category && (
                  <div className="absolute top-0 left-full hidden group-hover:block shadow-lg bg-white border rounded-md z-30 ml-0.5 w-64">
                    {michaelKorsDropdown[category].map((subcategory, subIndex) => (
                      <NavLink
                        key={subIndex}
                        to={`/collection/michael-kors/${category.toLowerCase()}/${subcategory
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-black"
                      >
                        {subcategory}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Coach Dropdown */}
        <div className="group relative">
          <NavLink
            to="/collection/coach"
            className="flex flex-col items-center gap-1"
          >
            <p>COACH</p>
          </NavLink>
          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 hidden group-hover:block shadow-lg bg-white border rounded-md z-20">
            {Object.keys(coachDropdown).map((category, index) => (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredCategory(category)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <NavLink
                  to={`/collection/coach/${category.toLowerCase()}`}
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-black"
                >
                  {category}
                </NavLink>
                {/* Subcategories Dropdown */}
                {hoveredCategory === category && (
                  <div className="absolute top-0 left-full hidden group-hover:block shadow-lg bg-white border rounded-md z-30 ml-0.5 w-64">
                    {coachDropdown[category].map((subcategory, subIndex) => (
                      <NavLink
                        key={subIndex}
                        to={`/collection/coach/${category.toLowerCase()}/${subcategory
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-black"
                      >
                        {subcategory}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </ul>

      <div className="flex items-center gap-6">
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt=""
        />
        {/* <div className="group relative">
          <img src={assets.profile_icon} className="w-5 cursor-pointer" alt="" />
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
              <p className="cursor-pointer hover:text-black">My Profile</p>
              <p className="cursor-pointer hover:text-black">Orders</p>
              <p className="cursor-pointer hover:text-black">Logout</p>
            </div>
          </div>
        </div> */}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>
        <SidebarMenu />
        
      </div>

      {/* Sidebar menu for small screens */}
      
    </div>
  );
};

export default Navbar;
