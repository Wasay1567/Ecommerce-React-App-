import React from 'react';
import { useParams } from 'react-router-dom'; // Import the useParams hook
import ProductPage from '../components/ProductPage';

const Shop = () => {
    const { category } = useParams(); // Get the category parameter from the URL

    return (
        <div>
            <ProductPage category={category} /> {/* Pass the category dynamically */}
        </div>
    );
};

export default Shop;
