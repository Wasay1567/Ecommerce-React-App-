import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const ProductPage = ({ category }) => {
    const { products } = useContext(ShopContext);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const PRODUCTS_PER_PAGE = 60;

    useEffect(() => {
        const categoryProduct = products.filter(
            (item) => item.category_path.toLowerCase().includes(category.toLowerCase())
        );
        setCategoryProducts(categoryProduct);
        setCurrentPage(1); // Reset to first page when category changes
    }, [products, category]);

    // Pagination logic
    const indexOfLastProduct = currentPage * PRODUCTS_PER_PAGE;
    const indexOfFirstProduct = indexOfLastProduct - PRODUCTS_PER_PAGE;
    const currentProducts = categoryProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(categoryProducts.length / PRODUCTS_PER_PAGE);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="my-10">
            <div className="text-left text-3xl py-8">
                <Title text1={category=='view-all'?'VIEW':'ALL'} text2={category=='view-all'?'ALL':category.toUpperCase()} />
            </div>
            <p className="py-5 text-left text-sm cursor-pointer">
                {categoryProducts.length} Products
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                {currentProducts.map((item, index) => (
                    <ProductItem
                        key={index}
                        id={item._id}
                        image={item.image}
                        name={item.name}
                        price={item.price}
                    />
                ))}
            </div>
            <div className="flex justify-center mt-8">
                <nav className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`px-4 py-2 border rounded-lg ${
                                currentPage === index + 1
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-700'
                            } hover:bg-blue-400 hover:text-white transition`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default ProductPage;
