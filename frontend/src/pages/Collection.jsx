import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
    const { products , search, showSearch} = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType,setSortType] = useState('relavent');

    // Toggle Category Selection
    const toggleCategory = (e) => {
        const value = e.target.value;
        setCategory((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    // Toggle Subcategory Selection
    const toggleSubCategory = (e) => {
        const value = e.target.value;
        setSubCategory((prev) =>
            prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
        );
    };

    // Apply Filters to Products
    const applyFilter = () => {
        let productsCopy = products.slice();

        if(showSearch && search){
            productsCopy = productsCopy.filter((item)=> item.name.toLowerCase().includes(search.toLowerCase()) || item.brand.toLowerCase().includes(search.toLowerCase()) || item.category_path.toLowerCase().includes(search.toLowerCase()))
        }

        // Filter by Category
        if (category.length > 0) {
            productsCopy = productsCopy.filter((item) =>
                category.some((cat) => item.category_path.toLowerCase().includes(cat.toLowerCase()))
            );
        }

        // Filter by Subcategory
        if (subCategory.length > 0) {
            productsCopy = productsCopy.filter((item) =>
                subCategory.some((sub) => item.category_path.toLowerCase().includes(sub.toLowerCase()))
            );
        }

        setFilterProducts(productsCopy);
    };

    const sortProduct = ()=>{
        let fpCopy = filterProducts.slice();
        switch(sortType){
            case 'low-high':
                setFilterProducts(fpCopy.sort((a,b)=>(a.price - b.price)));
                break;
            case 'high-low':
                setFilterProducts(fpCopy.sort((a,b)=>(b.price - a.price)));
                break;
            default:
                applyFilter();
                break;
        }
    }

    // Reapply Filters on Category/Subcategory Changes
    useEffect(() => {
        applyFilter();
    }, [category, subCategory, search, showSearch]);

    useEffect(()=>{
        sortProduct();
    },[sortType])

    return (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
            {/* Filter Options */}
            <div className="min-w-60">
                <p
                    onClick={() => setShowFilter(!showFilter)}
                    className="my-2 text-xl flex items-center cursor-pointer gap-2"
                >
                    FILTERS
                    <img
                        className={`h-3 cursor-pointer sm:hidden ${
                            showFilter ? 'rotate-90' : ''
                        }`}
                        src={assets.dropdown_icon}
                        alt=""
                    />
                </p>

                {/* Category Filter */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className="mb-3 text-sm font-medium">CATEGORIES</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        {['Handbags', 'Wallets'].map((cat) => (
                            <p className="flex gap-2 cursor-pointer" key={cat}>
                                <input
                                    className="w-3"
                                    type="checkbox"
                                    value={cat}
                                    onChange={toggleCategory}
                                    checked={category.includes(cat)}
                                />
                                {cat}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Subcategory Filter */}
                <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className="mb-3 text-sm font-medium">PREMIUM COLLECTION</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        {['spade-flower', 'phoebe', 'madison', 'rosie', 'chelsea'].map((sub) => (
                            <p className="flex gap-2 cursor-pointer" key={sub}>
                                <input
                                    className="w-3"
                                    type="checkbox"
                                    value={sub}
                                    onChange={toggleSubCategory}
                                    checked={subCategory.includes(sub)}
                                />
                                {sub.charAt(0).toUpperCase() + sub.slice(1)} Shop
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className="flex-1">
                <div className="flex justify-between text-base sm:text-2xl mb-4">
                    <Title text1={'ALL'} text2={'COLLECTIONS'} />
                    {/* Product Sort */}
                    <select onChange={(e)=>setSortType(e.target.value)} className="border-2 border-gray-300 text-sm px-2">
                        <option value="relavent">Sort by: Relavent</option>
                        <option value="low-high">Sort by: Low to High</option>
                        <option value="high-low">Sort by: High to Low</option>
                    </select>
                </div>

                {/* Main Products */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
                    {filterProducts.map((item, index) => (
                        <ProductItem
                            key={index}
                            name={item.name}
                            id={item._id}
                            price={item.price}
                            image={item.image}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Collection;
