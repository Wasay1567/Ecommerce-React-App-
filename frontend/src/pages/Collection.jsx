import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Collection = () => {
    const { brand, cat, sub } = useParams();
    const { products, search, showSearch, cartItems } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState('relavent');
    // const location = useLocation();

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

        if (brand) {
            productsCopy = productsCopy.filter(
                (item) => item.brand.toLowerCase().replaceAll(' ', '-') === brand.toLowerCase()
            );
        }

        if (cat) {
            productsCopy = productsCopy.filter(
                // (item) => item.category_paths.some(path => path.toLowerCase().includes(cat.toLowerCase()))
                (item) => item.category_paths.some(path => path.toLowerCase().includes(cat.toLowerCase()))
            );
        }

        // if (cat && cat.includes('collection')) {
        //     productsCopy = productsCopy.filter(
        //         (item) => item.category_paths.some(path => path.includes('collection'))
        //     );
        // }

        // if (sub && sub.includes('shop')) {
        //     productsCopy = productsCopy.filter(
        //         (item) => sub.toLowerCase().split('-').some(word => item.category_paths.includes(word))
        //     );
        // }

        if (sub && !sub.includes('all')) {
            productsCopy = productsCopy.filter(
                // (item) =>  item.name.toLowerCase().includes(sub.toLowerCase().replaceAll('-',' '))
                (item) => item.category_paths.some(path => path.toLowerCase().includes(sub.includes('shop') ? sub.toLowerCase().replace('-shop', '') : sub.includes('new') ? 'new' : sub.includes('satchels')? 'satchels':sub.toLowerCase()))
            );
        }



        if (showSearch && search) {
            // if(location.pathname.includes(''))
            productsCopy = productsCopy.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.brand.toLowerCase().includes(search.toLowerCase()) || item.category_paths.some(path => path.toLowerCase().includes(search.toLowerCase())))
        }

        // Filter by Category
        if (category.length > 0) {
            productsCopy = productsCopy.filter((item) =>
                category.some((cat) => item.category_paths.some(path => path.toLowerCase().includes(cat.toLowerCase())))
            );
        }

        // Filter by Subcategory
        if (subCategory.length > 0) {
            productsCopy = productsCopy.filter((item) =>
                subCategory.some((sub) => item.category_paths.some(path => path.toLowerCase().includes(sub.toLowerCase())))
            );
        }

        setFilterProducts(productsCopy);
    };

    const sortProduct = () => {
        let fpCopy = filterProducts.slice();
        switch (sortType) {
            case 'low-high':
                setFilterProducts(fpCopy.sort((a, b) => (a.price - b.price)));
                break;
            case 'high-low':
                setFilterProducts(fpCopy.sort((a, b) => (b.price - a.price)));
                break;
            default:
                applyFilter();
                break;
        }
    }

    // Reapply Filters on Category/Subcategory Changes
    useEffect(() => {
        applyFilter();
    }, [category, subCategory, search, showSearch, brand, cat, sub]);

    useEffect(() => {
        sortProduct();
    }, [sortType])

    useEffect(()=>{
        console.log(cartItems);
    }, [cartItems])

    return (
        <div className='px-5 sm:px-[5vw] md:px-[5vw] lg:px-[5vw] pt-5'>
            {/* <Title text1={'ALL'} text2={'COLLECTIONS'} /> */}
            <p className='breadcrumbs mt-3 ml-2 mb-4'>{brand.replaceAll('-', ' ')}{cat ? ` / ${cat.replaceAll('-', ' ')}` : ''}{sub ? ` / ${sub.replaceAll('-', ' ')}` : ''}</p>
            <h1 id='main-title' className='mb-5'>{sub ? `${sub.replaceAll('-', ' ')} For Women` : cat ? `${cat.replaceAll('-', ' ')} For Women` : `${brand.replaceAll('-', ' ')} Collection`}</h1>
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10">

                {/* Filter Options */}
                <div className="min-w-60">
                    <Sidebar />
                </div>

                {/* Right Side */}
                <div className="flex-1">
                    <div className="flex justify-end text-base sm:text-2xl mb-4 sort-container">
                        {/* Product Sort */}
                        <select onChange={(e) => setSortType(e.target.value)} className="border border-gray-300 text-sm px-2 py-1 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50">
                            <option value="relavent">Sort By: Featured</option>
                            <option value="low-high">Sort By: Low to High</option>
                            <option value="high-low">Sort By: High to Low</option>
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
        </div>
    );
};

export default Collection;
