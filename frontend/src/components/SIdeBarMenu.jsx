import React, { useState } from "react";
import { assets } from "../assets/assets";
const SidebarMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeBrand, setActiveBrand] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const toggleBrand = (brand) => {
    setActiveBrand(activeBrand === brand ? null : brand);
    setActiveCategory(null); // Reset category when switching brands
  };

  const toggleCategory = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

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
    "Premium Collection": [
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
      "Money Pieces",
    ],
    Wallets: [],
  };

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

  const dropdowns = {
    "Kate Spade": kateSpadeDropdown,
    "Michael Kors": michaelKorsDropdown,
    Coach: coachDropdown,
  };

  return (
    <div className="md:hidden">
      <img
          onClick={() => toggleMenu()}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />

      <div
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg overflow-y-auto transform transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        <div className="p-4">
          {Object.entries(dropdowns).map(([brand, categories]) => (
            <div key={brand} className="mb-4">
              <button
                onMouseEnter={() => toggleBrand(brand)}
                className="w-full text-left font-medium py-2 px-4 bg-gray-200 rounded-md"
              >
                {brand}
              </button>
              {activeBrand === brand && (
                <div className="mt-2 pl-4">
                  {Object.keys(categories).map((category) => (
                    <div key={category} className="mb-2">
                      <button
                        onMouseEnter={() => toggleCategory(category)}
                        className="w-full text-left font-semibold py-2 px-4 bg-gray-100 rounded-md"
                      >
                        {category}
                      </button>
                      {activeCategory === category && (
                        <ul className="ml-4 mt-2 list-disc text-gray-600">
                          {categories[category].map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
        ></div>
      )}
    </div>
  );
};

export default SidebarMenu;
