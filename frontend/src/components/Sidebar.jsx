import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Sidebar = () => {
  const [openSections, setOpenSections] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({
    itemType: [],
    price: { min: '', max: '' },
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleItemTypeClick = (type) => {
    setSelectedFilters((prev) => {
      const isSelected = prev.itemType.includes(type);
      return {
        ...prev,
        itemType: isSelected
          ? prev.itemType.filter((item) => item !== type)
          : [...prev.itemType, type],
      };
    });
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setSelectedFilters((prev) => ({
      ...prev,
      price: { ...prev.price, [name]: value },
    }));
  };

  const sections = [
    { name: 'Color' },
    { name: 'Item Type', items: ['Crossbody', 'Satchels', 'Shoulder bags', 'Belt Bags','Tote Bags', 'Backpacks'] },
    { name: 'Price' },
    { name: 'Handbag Size', items: ['Small', 'Medium', 'Large']},
    { name: 'Material' , items:['Fiber', 'Nylon', 'Canvas', 'Leather', 'Straw', 'Recycled']},
  ];

  return (
    <div className="sticky top-6 w-64 bg-white p-4 border rounded-xl shadow">
      <h3 className="text-sm mb-4">Filter By</h3>
      {sections.map((section) => (
        <div key={section.name} className="mb-4">
          <div
            className="filter-headings flex justify-between items-center cursor-pointer text-lg font-medium border-b pb-2"
            onClick={() => toggleSection(section.name)}
          >
            <span>{section.name}</span>
            {openSections[section.name] ? <ChevronUp /> : <ChevronDown />}
          </div>
          {openSections[section.name] && (
            <div className="mt-2">
              {section.name === 'Item Type' && (
                <div>
                  {section.items.map((item) => (
                    <button
                      key={item}
                      className={`filter-btns w-full text-left p-2 border mb-2 rounded ${
                        selectedFilters.itemType.includes(item) ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => handleItemTypeClick(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
              {section.name === 'Handbag Size' && (
                <div className='flex flex-row gap-2'>
                  {section.items.map((item) => (
                    <button
                      key={item}
                      className={`filter-btns text-left p-2 border mb-2 rounded ${
                        selectedFilters.itemType.includes(item) ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => handleItemTypeClick(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
              {section.name === 'Material' && (
                <div className='grid grid-cols-2 gap-2 grid-flow-row'>
                  {section.items.map((item) => (
                    <button
                      key={item}
                      className={`filter-btns w-full text-left p-2 border mb-2 rounded ${
                        selectedFilters.itemType.includes(item) ? 'bg-gray-100' : ''
                      }`}
                      onClick={() => handleItemTypeClick(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
              {section.name === 'Price' && (
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="min"
                    value={selectedFilters.price.min}
                    onChange={handlePriceChange}
                    placeholder="Min"
                    className="w-full border p-2 rounded"
                  />
                  <input
                    type="number"
                    name="max"
                    value={selectedFilters.price.max}
                    onChange={handlePriceChange}
                    placeholder="Max"
                    className="w-full border p-2 rounded"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
